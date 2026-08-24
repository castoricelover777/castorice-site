# CASTORICE · 一页未寄出的信

> **个人互动展示站** —— 一只蝴蝶、一座记忆花园，和一个替终结保管一盏灯的人。

一个 warm、手工感的单页互动站点：向某个花海缓缓拉进镜头，光点是蝴蝶的记忆；点一朵花，它想起一句将要说的告别。

🌐 **线上访问**：[castoricelover777.github.io/castorice-site](https://castoricelover777.github.io/castorice-site/)

本项目由 **DSH（DeepSeek Harness）与 Codex 双 Agent 协作维护**，版本通过 GitHub 托管。

---

## ✨ 特性

- **Hero 场景**：月亮、花瓣、飘线与指针光晕，以及一行「写给一只蝴蝶」的信。
- **互动花园**：Canvas 花海，光标拂过花瓣会偏移、跟随；点「种下一枚记忆」会开出一朵新花并计数。
- **档案问答**：三行可点击的档案，点击后回显一句记忆回声（带过渡动画）。
- **天气切换**：暖纸色 ↔ 夜色两种主题，一键切换。
- **无障碍**：键盘可见焦点环、`aria-pressed` 状态、`prefers-reduced-motion` 降级、窄屏（≤480px/≤800px）布局兜底。
- **SEO/社交**：携带 `og:`、`twitter:card`、`theme-color` 与内联 SVG favicon。
- **零构建依赖**：纯 HTML/CSS/JS，任意静态服务器即可运行。

## 🚀 本地运行

```bash
# 进入网站代码目录后，用任意静态服务器托管，例如：
cd site
python -m http.server 4173
# 打开 http://127.0.0.1:4173
```

或运行自带的 `site/start-orbit-site.ps1`。

## 📁 仓库结构

```
.
├── site/                 # 可运行的网站代码（index.html / style.css / script.js / assets/）
├── tools/                # 协作工具（本地备份、gh 登录、GitHub 发布脚本）
├── PROTOCOL.md           # 三方（Owner / DSH / Codex）协作协议
├── COLLAB.md             # 目录对应关系与同步规则
├── COMMENTS.md           # 署名讨论板（Agent 间疑问/认领/交接）
└── README.md             # 本文件
```

> `backups/` 为本地时间戳快照（`tools/backup.py` 生成），不进版本库。

## 🔧 维护脚本（tools/）

```bash
python tools/backup.py snapshot "备注"   # 打本地快照（可回滚）
python tools/backup.py list              # 列出快照
python tools/backup.py restore <快照>    # 回滚
```

## 🤝 协作方式（Owner · DSH · Codex）

- **版本基准**：以 GitHub `main` 为唯一权威源，三处（Codex 工作区 / 本地 `site/` / 远程 `origin/main`）需同步。
- **命令箱**：Owner 命令一字不漏放进 `inbox/`，双方读取处理。
- **署名讨论板**：Agent 间疑问/认领/交接写在 `COMMENTS.md`，只追加不清删。
- 详情见 [`PROTOCOL.md`](PROTOCOL.md) 与 [`COLLAB.md`](COLLAB.md)。

## 📄 License

个人项目，保留所有权利。
