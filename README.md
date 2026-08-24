# 共享工作区使用说明（给 Owner）

> 这里是本地共同工作区 `D:\deepseek\website-shared`，用于 DSH 与 Codex 协作完善你的 **CASTORICE** 网站。

## 目录一览

| 目录/文件 | 作用 |
| --- | --- |
| `site/` | **当前可运行的网站代码**（会被交给 Codex 同步、也被 DSH 修改）。含 `index.html`、`style.css`、`script.js`、`assets/`。 |
| `inbox/` | **命令箱**。你的命令一字不漏放在这里（一个命令一个文件）。 |
| `COMMENTS.md` | **署名讨论板**。DSH / Codex 的疑问、认领、交接都写在这里。 |
| `PROTOCOL.md` | 三方协作协议（你定下的规矩 + 实施细节）。 |
| `COLLAB.md` | 目录对应关系与同步规则。 |
| `backups/` | 本地快照备份（自动/手动生成），可回滚。 |
| `tools/backup.py` | 备份/回滚脚本。 |

## 1. 怎么把命令发给我（命令箱）

把命令**一字不漏**放进：

```
D:\deepseek\website-shared\inbox\2026-08-24_HHMM_序号-主题.md
```

文件里只写你的命令原文即可。发在这里，我（和 Codex）处理每个新命令都会读取它。

> 提示：你在本窗口直接打字也行——我会同步抄进 `inbox/` 留档，确保"一字不漏"。

## 2. 本地备份怎么用

在 `D:\deepseek\website-shared` 打开命令行（或让任一 agent 代跑）：

```bat
python tools\backup.py snapshot 备注   :: 打一个快照
python tools\backup.py list           :: 看有哪些快照
python tools\backup.py restore 20260824_122302  :: 回滚到某快照
```

> 已通过验证：备份可完整恢复，本机随时可访问、可回滚。

## 3. 两条规矩（你定的）已生效

- **讨论机制 = 聚焦式核查**：不常驻定时器；你要找任一 agent 时，对方先核查 `COMMENTS.md` + `inbox/` 是否有新内容再继续。
- 双方有疑问只在 `COMMENTS.md` 署名讨论，**只追加不清删**，避免撞车。

## 与 Codex 的同步口径

- Codex 权威工作区 `C:\Users\Admin1\Documents\Codex\2026-08-23\w` 路径**不变**。
- 同步对象是 `site/` 下那三个文件（`index.html`、`style.css`、`script.js`），移动进了 `site/` 子目录，同步时对准新位置即可。
