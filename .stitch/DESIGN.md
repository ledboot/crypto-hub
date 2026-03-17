# Design System: CryptoHubs
**Project ID:** 1177597800619792348
**Source Screen:** Landing Page - CryptoHubs (`1ba560792ee44a29a3958f579b707981`)

## 1. Visual Theme & Atmosphere
这是一个偏专业工具型的 Web3 产品视觉体系，整体气质是「深色主导、数据导向、动效克制、品牌高亮明确」。
界面不追求装饰感，而是通过高对比文字、清晰分区与稳定网格，营造“高效操作台”体验。
亮色模式用于可读性和内容浏览，深色模式用于仪表盘和长时使用场景。

## 2. Color Palette & Roles
- **Core Action Blue** (`#0d59f2`): 主品牌色，用于主按钮、关键数据高亮、进度条、链接 hover 与强调文本。
- **Light Canvas Gray** (`#f5f6f8`): 亮色模式主背景，用于页面大面积底色。
- **Deep Ops Navy** (`#101622`): 深色模式主背景，用于应用主工作区背景。
- **Surface White** (`#ffffff`): 亮色卡片/内容容器背景。
- **Slate Text Dark** (`#0f172a`): 亮色模式正文主文本。
- **Slate Text Muted** (`#64748b`): 次级文本与说明信息。
- **Light Border Slate** (`#e2e8f0`): 亮色模式边框、分割线。
- **Dark Surface Slate** (`#1e293b`): 深色模式卡片底色。
- **Dark Border Slate** (`#334155`): 深色模式边框与分隔。

## 3. Typography Rules
- **Primary Typeface:** Inter（400/500/600/700/800/900）。
- **Headline Usage:** 标题常用 `700-900`，Hero 可使用 `900` 与更紧凑字距（tracking-tight）强化力量感。
- **Body Usage:** 正文常用 `400-500`，通过 `text-slate-500/600` 建立信息层级。
- **Numerical Emphasis:** 核心指标数值使用更高字重（`800-900`）和更大字号，提升扫读效率。

## 4. Component Stylings
- **Buttons:**  
  主按钮使用品牌蓝底白字；次按钮使用中性灰底或半透明描边。悬停以亮度提升（`hover:brightness-110`）和轻量阴影增强反馈。
- **Cards/Containers:**  
  卡片采用中等圆角（常见 `rounded-xl`/`rounded-2xl`），亮色下白底+浅边框，深色下深灰底+低对比边框。
- **Inputs/Forms:**  
  以清晰边界优先，强调对比而非重阴影。优先使用浅描边与局部聚焦高亮。
- **Elevation & Effects:**  
  阴影是“克制型” (`shadow-lg` / `shadow-xl` / 局部 `shadow-primary/20`)；使用少量背景光晕与 `backdrop-blur` 强化科技感。

## 5. Layout Principles
- **Container Strategy:** 使用 `max-w-7xl` 的中心容器控制阅读宽度，保证桌面端可读性与信息密度平衡。
- **Spacing Rhythm:** 以 4/6/8/12 的间距节奏组织块级内容，区块常用 `py-12` / `py-24`。
- **Hierarchy Pattern:** 结构通常为「醒目标题 + 简洁说明 + 主操作 + 辅助内容」；关键 CTA 始终保持品牌蓝。
- **Density Control:** 通过边框、背景层级和字重建立秩序，避免过度装饰，保持工具型产品的快速决策体验。
