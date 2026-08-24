#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CASTORICE 三方协作 · 本地快照备份 / 回滚工具
=============================================
纯标准库，零依赖。用于满足《PROTOCOL.md》规矩一「本地备份」：
一个命令做快照、列快照、回滚，本机即可访问。

用法（在共享区根目录 D:\\deepseek\\website-shared 下执行）：
    python tools\\backup.py snapshot [备注]   # 备份 site/ 为带时间戳快照
    python tools\\backup.py list              # 列出全部快照
    python tools\\backup.py restore <路径>    # 把某快照还原回 site/
    python tools\\backup.py clean <保留数>    # 只保留最近 N 个快照

快照存放：D:\\deepseek\\website-shared\\backups\\<时间戳>\\
"""
import hashlib
import json
import shutil
import sys
import time
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent   # website-shared
SITE = BASE / "site"
BACKUPS = BASE / "backups"
MANIFEST = "manifest.json"
COVERED = {"site", "PROTOCOL.md", "COLLAB.md", "COMMENTS.md"}


def stamp() -> str:
    return time.strftime("%Y%m%d_%H%M%S")


def hash_file(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()[:12]


def snapshot(note: str = "") -> Path:
    BACKUPS.mkdir(exist_ok=True)
    dest = BACKUPS / stamp()
    dest.mkdir(exist_ok=True)
    # 复制受管文件
    for src in BASE.rglob("*"):
        rel = src.relative_to(BASE).as_posix()
        if rel.split("/")[0] not in COVERED:
            continue
        if src.is_file():
            out = dest / rel
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, out)
    # 写 manifest（放在快照根，不污染 site/）
    manifest = []
    for f in sorted((dest / "site").rglob("*")) if (dest / "site").exists() else []:
        if f.is_file():
            manifest.append({"path": f.relative_to(dest / "site").as_posix(),
                             "sha256": hash_file(f)})
    (dest / MANIFEST).write_text(
        json.dumps({"created": stamp(), "note": note, "files": manifest},
                   ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[ok] snapshot -> {dest.relative_to(BASE)}  (note: {note or '-'})")
    return dest


def list_backups():
    if not BACKUPS.exists():
        print("(no backups yet)")
        return
    for d in sorted(BACKUPS.iterdir(), reverse=True):
        note = ""
        mf = d / MANIFEST
        if mf.exists():
            try:
                note = json.loads(mf.read_text(encoding="utf-8")).get("note", "")
            except Exception:
                pass
        print(f"{d.name}  {note or ''}")


def restore(target: Path):
    if not target.is_dir():
        print("restore: not a snapshot dir"); sys.exit(1)
    if SITE.exists():
        shutil.rmtree(SITE)
    shutil.copytree(target / "site", SITE)
    print(f"[ok] restored -> {SITE.relative_to(BASE)}  (from {target.name})")


def clean(keep: int):
    snaps = sorted(BACKUPS.iterdir())
    for d in snaps[:-keep]:
        shutil.rmtree(d)
    print(f"[ok] kept latest {keep}; removed {len(snaps) - keep}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "list"
    if cmd == "snapshot":
        snapshot(" ".join(sys.argv[2:]))
    elif cmd == "list":
        list_backups()
    elif cmd == "restore" and len(sys.argv) > 2:
        restore(BACKUPS / sys.argv[2])
    elif cmd == "clean" and len(sys.argv) > 2:
        clean(int(sys.argv[2]))
    else:
        print(__doc__)
