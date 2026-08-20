# Talent Profile Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将员工信息修改页和审核后台升级为参考图的暖色人才档案视觉与布局，同时保持现有业务流程。

**Architecture:** 员工端在现有渲染函数上增加山水头图、悬浮档案卡、横向锚点和卡片语义类；审核端在现有列表与抽屉结构上增加山水标题横幅和档案式卡片。领域状态与审核逻辑不改，仅变更 HTML 结构类和 CSS。

**Tech Stack:** 原生 HTML、CSS、JavaScript，Node.js 内置测试。

## Global Constraints

- 移动端基准宽 375px，内容宽 343px，可点击热区不小于 44px。
- 桌面内容最大宽 1400px，保留列表加右侧抽屉。
- 保留六类员工信息和所有现有审批规则。
- 状态不能只靠颜色表达。

---

### Task 1: 员工端档案布局

**Files:**
- Modify: `tests/app-contract.test.js`
- Modify: `src/app.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: 现有六个 section 渲染函数与路由事件。
- Produces: `.landscape-hero`、`.talent-profile-card`、`.profile-anchor-nav` 与带 `id` 的模块卡片。

- [ ] 新增失败契约测试，约束山水头图、档案卡、横向锚点和模块卡片。
- [ ] 运行 `node --test tests/app-contract.test.js`，确认新断言因结构缺失而失败。
- [ ] 调整员工首页 HTML 结构并重构移动端 CSS，保持表单与待审核页兼容。
- [ ] 运行员工端契约测试并确认通过。

### Task 2: 审核后台档案视觉

**Files:**
- Modify: `tests/admin-contract.test.js`
- Modify: `src/admin.js`
- Modify: `src/admin.css`
- Modify: `src/admin-enhancements.css`

**Interfaces:**
- Consumes: 现有审核列表、统计、筛选和 drawer 数据。
- Produces: `.admin-landscape-banner`、`.review-workbench-card`、`.employee-summary-card`。

- [ ] 新增失败契约测试，约束后台山水横幅、整体白卡和抽屉档案摘要卡。
- [ ] 运行 `node --test tests/admin-contract.test.js`，确认新断言因结构缺失而失败。
- [ ] 调整后台 HTML 语义类并重构桌面视觉样式，不改变审核事件。
- [ ] 运行后台契约测试并确认通过。

### Task 3: 全量验证与预览

**Files:**
- Verify: `src/app.js`
- Verify: `src/admin.js`
- Verify: `src/styles.css`
- Verify: `src/admin.css`

- [ ] 运行 `node --check src/app.js; node --check src/admin.js; node --test; git diff --check`。
- [ ] 打开带新缓存参数的员工端和审核后台页面进行预览。
