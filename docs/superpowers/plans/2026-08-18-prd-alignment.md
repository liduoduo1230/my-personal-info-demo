# PRD 对齐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 按《员工自助》V1.2 PRD 补齐员工个人信息字段、材料和生效规则，并加入多条只读合同信息。

**Architecture:** 保留现有原生 ES module、`domain.js` 状态模型、`app.js` 移动端渲染和 `admin.js` 审核列表。通过配置扩展字段和模块，增加只读合同记录；通过领域函数区分直接生效与需审批，避免合同和紧急联系人产生审核请求。

**Tech Stack:** 原生 HTML/CSS/JavaScript ES modules、Node.js built-in test runner、浏览器端 localStorage。

## Global Constraints

- 以 PRD 为最高业务依据；与旧 Demo 约定冲突时以 PRD 为准。
- 合同信息为多条记录，仅查看，不提供任何编辑、新增、删除或审核操作。
- 紧急联系人保存后立即生效，不进入 HR 审核列表。
- 修改、新增、删除需审批的记录继续整单审核，审核中不可重复提交，撤回只在申请详情页。
- 保持 `375px` 移动端画布、`343px` 内容容器和现有视觉样式。

---

### Task 1: Add failing PRD contract and domain tests

**Files:**
- Modify: `tests/domain.test.js`
- Modify: `tests/app-contract.test.js`
- Modify: `tests/review-domain.test.js`

**Interfaces:** Tests consume `createInitialState`, `getVisibleData`, `submitSection`, `submitRecord` and source-file contract assertions.

- [ ] **Step 1: Write failing domain tests** for contract records containing `startDate`, `endDate`, `contractType`, `attachment`; for emergency saves becoming `normal` with visible updated data; for bank fields `city` and `branch`; and for education/work/certificate fields required by PRD.
- [ ] **Step 2: Write failing app contract tests** for the module order, `合同信息`, read-only rendering, absence of `data-action="edit"`/`add`/`delete` in the contract renderer, and PRD labels.
- [ ] **Step 3: Write failing review tests** ensuring emergency and contract do not appear in `listReviewRequests` while bank/education/work/certificate/family do.
- [ ] **Step 4: Run `node --test tests/domain.test.js tests/app-contract.test.js tests/review-domain.test.js` and confirm failures are caused by missing PRD behavior.

### Task 2: Extend domain state and transitions

**Files:**
- Modify: `src/domain.js`
- Test: `tests/domain.test.js`, `tests/review-domain.test.js`

**Interfaces:** Preserve existing exported functions; add a `contract` section with read-only `approvedData` and update `submitSection`/`saveSection` behavior for emergency and expanded fields.

- [ ] **Step 1: Add PRD-complete default data** for bank, education, work, family, certificate and emergency; add two contract records with the four PRD fields and attachment names.
- [ ] **Step 2: Make emergency `saveSection` direct-save** with `status: 'normal'`, `pendingData: null`, and no review request; keep child-family proof validation unchanged.
- [ ] **Step 3: Add local-state migration** that merges missing sections/fields from defaults so older localStorage values remain renderable.
- [ ] **Step 4: Run the focused domain and review tests and confirm green.

### Task 3: Align employee module configuration and rendering

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css` only if required for new field rows
- Test: `tests/app-contract.test.js`

**Interfaces:** Extend `sections`, `recordKeys`, `renderHome`, `renderRecordSection` and `renderInlineSection` while preserving existing event delegation.

- [ ] **Step 1: Update field maps and labels** for PRD bank, education, family, work and certificate fields; retain title `证书信息`.
- [ ] **Step 2: Add `contract` metadata as a read-only record module** and render each record with existing record-card styling but without edit/add click attributes or action buttons.
- [ ] **Step 3: Insert contract in the home module and anchor order after work and before family.
- [ ] **Step 4: Keep basic information as one visible module while mapping individual field clicks to personal, household or identity edit modes.
- [ ] **Step 5: Add PRD bank guidance copy and attachment labels without introducing an account-holder field.
- [ ] **Step 6: Run app contract tests and inspect generated HTML assertions for absence of contract actions.

### Task 4: Align admin labels and review filtering

**Files:**
- Modify: `src/review-domain.js`
- Modify: `src/admin.js`
- Test: `tests/review-domain.test.js`, `tests/admin-contract.test.js`

**Interfaces:** Preserve `listReviewRequests` and admin table/drawer behavior; update section labels and seed data.

- [ ] **Step 1: Keep `emergency` and `contract` excluded from review normalization.
- [ ] **Step 2: Update field labels and seed data to PRD names, including certificate wording.
- [ ] **Step 3: Add bank city/branch and attachment material to the admin seed where relevant.
- [ ] **Step 4: Run admin and review tests and verify existing whole-request approve/return behavior remains unchanged.

### Task 5: Full verification and browser smoke check

**Files:** None beyond prior tasks.

- [ ] **Step 1: Run `node --check src/app.js` and `node --check src/domain.js`.
- [ ] **Step 2: Run `node --test` and confirm zero failures.
- [ ] **Step 3: Run `git diff --check`.
- [ ] **Step 4: Request employee and admin URLs and confirm HTTP 200; verify employee HTML includes the cache-busted app entrypoint.
- [ ] **Step 5: Review the final diff against the PRD checklist and report any intentionally deferred behavior.
