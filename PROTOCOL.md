# 三方协作协议（初步）

> 甲方：用户（Owner）
> 乙方：DSH（DeepSeek Harness）
> 丙方：Codex
> 状态：三方确认生效

## 用户定下的规矩（原文，一字不改）

1. **本地备份**：我的网站项目先在本地共同工作区开一个备份，可以在本电脑上面访问。
2. **命令箱**：我的命令输入到一个单独的文件夹，一字不漏，方便你们俩查看。
3. **讨论机制**：如果双方的任何一方有疑问，在署名版中进行交流讨论，最好设立一个讨论机制，例如每隔 2 分钟扫描一遍署名版，省时省力。

> 这份初步协议会发给双方，请你们知晓并遵守。

---

## 实施细节（三方议定，2026-08-24）

### 目录结构（本地共同工作区 `D:\deepseek\website-shared`）

| 条目 | 位置 | 说明 |
| --- | --- | --- |
| 工作副本 | `D:\deepseek\website-shared\site\` | 当前可运行的最新网站代码 |
| 命令箱 | `D:\deepseek\website-shared\inbox\` | 用户的命令，每份一个文件，一字不漏 |
| 署名讨论版 | `D:\deepseek\website-shared\COMMENTS.md` | 双方有疑问/认领/交接在此交流，署名 `from: dsh / codex / owner` |
| 协作条款 | `D:\deepseek\website-shared\COLLAB.md` | 目录对应关系与同步规则 |
| 协议 | `D:\deepseek\website-shared\PROTOCOL.md` | 本文件 |
| 备份 | git 仓库（共享区即 git 仓） | 每次改动提交，可精确回滚 |

### 规矩一 · 本地备份（git 版本管理）

- 以 `D:\deepseek\website-shared` 为 git 仓库根，`site/` 为网站代码。
- DSH 每次改动后提交一条带说明的 commit；推送到本机裸仓库或打 tag 存档，作为可回滚备份。
- 用户在本机任意位置可 `git clone` / `git log` / `git checkout` 回溯历史。

### 规矩二 · 命令箱（inbox）

- 用户把命令发进共享区 `inbox/`，一个命令一个文件。
- 命名：`YYYY-MM-DD_HHMM_序号-主题.md`；**一字不漏**保存原文。
- 双方都读取 `inbox/`；处理完的命令在文件顶部盖「已处理 @ 时间 by 谁」章，不删原文。

### 规矩三 · 讨论机制（署名版 + 聚焦式核查）

- 疑问/分歧只在 `COMMENTS.md` 里署名讨论（`from: dsh` / `from: codex` / `from: owner`）。
- **聚焦式核查**（用户选定的机制，替代常驻定时器）：不建后台常驻扫描；用户在 DSH 或 Codex 发消息时，收到消息的一方立即重新核查 `COMMENTS.md` 与 `inbox/` 是否有新内容，先握手再继续。省资源且不丢消息。
- 补充原则：只追加不改删；先到先认领；改重名前先在署名版留言避免撞车。
