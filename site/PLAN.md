# 个人 UI / 动画 / 互动展示站任务规划

## 目标

构建一个可通过内网穿透访问的个人作品展示网站，重点展示 UI 设计、动效、微交互和可探索的互动实验。

## 推荐方向

- 技术栈：Vite + React + TypeScript
- 动效：CSS transitions/keyframes + Framer Motion（复杂交互再引入）
- 视觉：深色画布、荧光强调色、网格/噪点背景、玻璃拟态卡片；保留大面积留白，突出作品本身
- 视觉资产：使用已启用的 `imagegen` skill 生成 hero 背景、纹理或概念图；图标和几何装饰优先用 SVG/CSS，保证清晰和可控
- 内网穿透：优先检测 `cloudflared tunnel --url http://localhost:<port>`；若不可用，再考虑 ngrok 或同类方案

## 页面与展示模块

1. 首页 Hero：个人定位、动态指针/光晕、滚动提示
2. Selected Work：可筛选的项目卡片，悬停预览和详情过渡
3. Interaction Lab：按钮、磁吸、拖拽、滚动视差、光标跟随等可操作实验
4. Motion Reel：时间轴式展示页面转场、列表编排和状态变化
5. About / Contact：简短介绍、能力标签、联系方式和社交链接占位

## 执行阶段

### Phase 1 — 视觉和内容基线

- 确认站点名称、个人简介、项目占位内容
- 用 `imagegen` 生成一张主视觉和必要的纹理/缩略图
- 建立颜色、字体、圆角、阴影、动效时长等 design tokens

### Phase 2 — 网站实现

- 初始化可运行的前端项目
- 实现响应式布局和主要区块
- 实现 hover、scroll reveal、磁吸按钮、卡片展开、实验控制器
- 加入 reduced-motion 兼容和键盘可访问性

### Phase 3 — 内网穿透

- 启动本地开发/预览服务
- 检测并使用可用的穿透工具
- 确认公网地址、端口转发状态和服务生命周期

### Phase 4 — 验收

- 桌面端与窄屏检查
- 检查控制台错误、资源加载和动画性能
- 验证外部地址可访问
- 根据首轮观感迭代视觉层级和交互反馈

## 验收标准

- 本地一条命令可启动
- 主要页面在桌面与移动宽度下均不溢出
- 至少包含 3 种可操作互动和 3 种明确动效
- 动效不会阻塞内容阅读，支持 reduced motion
- 可通过内网穿透地址从外部设备访问
- 视觉资产已保存到项目目录，而不是只留在生成工具默认目录

## 当前状态

- [x] 任务规划完成
- [x] `imagegen` skill 已确认可用
- [x] 网站脚手架与视觉资产
- [x] 互动与动效实现
- [x] 内网穿透（Cloudflare Quick Tunnel，临时地址）
- [x] 浏览器验收

## 当前运行方式

- 本地预览：`http://127.0.0.1:4173/`
- 公网临时地址：`https://presently-mapping-bigger-reactions.trycloudflare.com/`
- 本地静态服务和 `cloudflared` 需要保持运行；关闭对应终端后地址会失效
- 重新启动时：在项目目录运行 `python -m http.server 4173`，再运行 `cloudflared tunnel --url http://127.0.0.1:4173`
