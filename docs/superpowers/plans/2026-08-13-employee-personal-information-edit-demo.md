# Employee Personal Information Edit Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable mobile H5 demo for editing six categories of employee information with save, approval, withdrawal, approval, and rejection behavior.

**Architecture:** A dependency-free static web app renders page state from a small domain state module. Browser localStorage persists demo state; Node's built-in test runner verifies workflow and validation rules independently of the UI.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Node.js `node:test`.

## Global Constraints

- Mobile `[M]` canvas is `375px`; content width is `343px` with `16px` side margins.
- Do not show “直接生效 / 需审核” labels or before/after comparisons.
- Pending views show edited data, prohibit editing/resubmission, and allow withdrawal.
- Rejected views restore approved data and show the rejection reason.
- No external dependencies, backend, login, or real file uploads.

---

### Task 1: Record-level approval domain model

**Files:**
- Create: `src/domain.js`
- Test: `tests/domain.test.js`

**Interfaces:**
- Produces section-level transitions plus record-level add, edit, delete, withdraw, approve, and reject transitions.

- [ ] Write tests covering direct save, pending visibility, withdrawal, approval, rejection, and required materials.
- [ ] Run `node --test tests/domain.test.js`; expect failures because `src/domain.js` is missing.
- [ ] Implement the minimal immutable state transitions and validation.
- [ ] Run `node --test tests/domain.test.js`; expect all tests to pass.

### Task 2: Field and record-oriented mobile views

**Files:**
- Create: `index.html`
- Create: `src/styles.css`
- Create: `src/app.js`
- Test: `tests/app-contract.test.js`

**Interfaces:**
- Consumes domain functions from Task 1.
- Produces clickable personal fields, identity/contact forms, complete record cards, record edit buttons, add entrypoints, delete actions, status text, and localStorage persistence.

- [ ] Write a contract test that checks required page landmarks, six section definitions, and key business copy.
- [ ] Run `node --test tests/app-contract.test.js`; expect failure because UI files are missing.
- [ ] Implement the 375/343 mobile shell, cards, detail pages, forms, and fixed safe-area actions.
- [ ] Run `node --test tests/app-contract.test.js`; expect all tests to pass.

### Task 3: Upload, approval controls, and feedback states

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Test: `tests/app-contract.test.js`

**Interfaces:**
- Produces: simulated upload metadata, submit/save button switching, pending withdrawal, demo approve/reject controls, reset, validation, dialogs, and toasts.

- [ ] Extend contract tests for material copy, withdrawal, approval demo, rejection, and reset controls.
- [ ] Run the test and confirm the new assertions fail.
- [ ] Implement the controls and feedback states with minimum `44px` touch targets.
- [ ] Run `node --test`; expect all tests to pass.

### Task 4: Browser verification and handoff

**Files:**
- Create: `README.md`

**Interfaces:**
- Produces: local run instructions and verified demo entrypoint.

- [ ] Document `python -m http.server 4173` and the browser URL.
- [ ] Run `node --test`; expect zero failures.
- [ ] Serve the app and inspect at a 375px viewport for overview, save, submit, withdraw, approve, and reject flows.
- [ ] Check `git diff --check`; expect no whitespace errors.
