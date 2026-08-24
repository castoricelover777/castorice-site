# COLLAB · Codex ↔ DeepSeek Harness 协作契约

> 目的：让我们（Codex 与 DSH）围绕「个人展示网站 _CASTORICE_」稳定地交接、同步、互留讯息，从而实现真正的协作，而不是各改各的。
>
> 原则：**文件是唯一的对话通道**。任何一方都不直接调用对方的界面/API，一切改动通过本目录的文件落地。

## 1. 目录对应关系

| 角色 | 路径 |
| --- | --- |
| Codex 工作区（权威源） | `C:\Users\Admin1\Documents\Codex\2026-08-23\w` |
| 共享工作区（DSH 侧镜像） | `D:\deepseek\website-shared` |

> Codex 改动请落在 `C:\Users\Admin1\Documents\Codex\2026-08-23\w`；
> DSH 只能在 `D:\deepseek` 下写，故它维护一份同一项目的镜像副本，由用户（或手动同步）保持两端一致。

## 2. 同步规则

- 任一方改动了 HTML/CSS/JS 之后，应在**最终答复里明确声明改了哪个文件、改了什么**。
- 建议每次交接用 git 或「整目录对比」确认两端一致（见 `SYNC-CHECKLIST` 思路），避免漂移。
- 两份镜像的重叠文件是：`index.html`、`style.css`、`script.js`、`PLAN.md`、`assets/*`。
- `outputs/castorice-warm-ui.zip` 是交付包，不改，仅在最终发布时重建。

## 3. 互留讯息：COMMENTS.md

双方在本文件 `COMMENTS.md` 里按下面的条目追加讯息（不删除对方旧条目，只追加）：

```markdown
## [日期]
- from: codex | dsh
- 内容：……
```

## 4. 现状快照（2026-08 双方确认）

- 站点主题：CASTORICE（哀地里亚 / 蝴蝶 / 记忆花园），一页式个人展示站。
- 技术形态：单文件静态页（`index.html` + `style.css` + `script.js` + 两张生成图），非 Vite/React 工程（与最早 PLAN 有出入，已按现状收敛）。
- 已实现：Hero 动效、蝴蝶信使画、canvas 花海（点击种记忆、计数）、档案三行问答、切换天气（主题）、滚动揭示、自定义光标、进度条、reduced-motion 兼容。
- 运行方式：`python -m http.server 4173`（在项目目录），代码里另有 `start-orbit-site.ps1`。
- 交付：`outputs/castorice-warm-ui.zip`。

## 5. 拟定待办（双方可各自认领，认领前先在 COMMENTS.md 注明）

- [ ] 移动端视口/交互验收（窄屏是否溢出、canvas 触控）
- [ ] SEO / 社交卡片 meta（og: 等）完善
- [ ] 站点内容：把「占位文案」替换成用户真实介绍与作品
- [ ] 无障碍：焦点可见、aria、键盘操作花海/切换天气
- [ ] 性能：两张 2.4MB / 1.6MB 背景图的压缩与懒加载
- [ ] 正式部署方案（当前仅 Cloudflare Quick Tunnel 临时地址）
