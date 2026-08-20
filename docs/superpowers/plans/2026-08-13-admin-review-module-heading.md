# Admin Review Module Heading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 把审核抽屉中的泛化“申请内容”改为具体信息模块名称，并让新增、修改、删除标签紧跟模块名称且不换行。

**Architecture:** 保持现有静态后台结构与数据模型不变，仅调整 `drawer()` 输出的标题层级。通过契约测试约束操作标签只出现在模块标题行，并复用现有不换行样式。

**Tech Stack:** 原生 HTML/CSS/JavaScript、Node.js 内置测试运行器。

## Global Constraints

- 桌面端右侧审核抽屉保持不变。
- 审核只允许整单通过或整单退回。
- 模块标题使用当前申请的 `r.module` 中文名称。
- 操作标签与模块标题保持同一行。

---

### Task 1: 调整审核抽屉模块标题

**Files:**
- Modify: `tests/admin-contract.test.js`
- Modify: `src/admin.js`
- Modify: `src/admin-enhancements.css`

**Interfaces:**
- Consumes: 审核请求对象的 `module`、`operation`、`operationName`。
- Produces: `.application-section-title` 标题行，内容为具体模块名和操作标签。

- [ ] **Step 1: Write the failing test**

新增契约断言，要求抽屉输出 `${r.module}` 与操作标签位于 `.application-section-title` 内，并且不再输出 `<h3>申请内容</h3>`。

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/admin-contract.test.js`
Expected: 新契约断言失败，因为当前操作标签仍位于抽屉总标题旁。

- [ ] **Step 3: Write minimal implementation**

修改 `drawer()`：总标题仅保留“审核详情”；内容区标题改为 `<div class="application-section-title"><h3>${r.module}</h3><span ...>${r.operationName}</span></div>`。为标题行补充 flex 与不换行样式。

- [ ] **Step 4: Run full verification**

Run: `node --check src/admin.js; node --test; git diff --check`
Expected: JavaScript 语法检查通过，全部测试通过，diff 无空白错误。

