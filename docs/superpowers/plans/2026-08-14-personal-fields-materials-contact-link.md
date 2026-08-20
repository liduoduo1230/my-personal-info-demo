# Personal Fields Materials and Contact Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 扩展个人基本信息、材料上传、摘要卡和家庭成员设为紧急联系人的完整 Demo 流程。

**Architecture:** 扩展现有 section 数据模型保存待审核附件；新增家庭成员到紧急联系人的领域函数；UI 层增加脱敏、展开收起、材料槽位和摘要卡渲染。保留现有审核列表与整单决策。

**Tech Stack:** 原生 JavaScript、CSS、HTML、Node.js 内置测试。

## Task 1: 领域数据与校验

- 修改 `src/domain.js` 和 `tests/domain.test.js`。
- 新增基本字段；身份证双面与银行卡图片必传；保存 section 附件；新增 `submitEmergencyFromFamily`。
- 先运行领域测试确认失败，再实现并通过。

## Task 2: 首页展示与摘要卡

- 修改 `src/app.js`、`src/talent-profile-fix.css`、`tests/app-contract.test.js`。
- 实现默认字段、显示更多、证件/手机/卡号脱敏、银行卡和紧急联系人摘要卡。
- 家庭卡增加“设为紧急联系人”入口。

## Task 3: 编辑页材料布局

- 身份证正反面和银行卡上传位放在表单上方。
- 上传按钮使用独立材料槽位，提交时传递完整附件。
- 后台从真实待审核附件读取并预览。

## Task 4: 全量验证

- 运行 `node --check src/app.js; node --check src/domain.js; node --test; git diff --check`。
- 打开员工端和后台审核页的新缓存版本。
