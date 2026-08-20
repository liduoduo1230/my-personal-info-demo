# Employee Information Review Admin Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a PC review workbench with a request table, filters, a right drawer, whole-request approval/rejection, and automatic progression.

**Architecture:** A separate static admin entrypoint reads and writes the same localStorage domain state as the employee page. A review adapter normalizes module-level and record-level requests into one table model, while the drawer delegates decisions to existing domain transitions.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Node.js `node:test`.

## Global Constraints

- Desktop responsive canvas with a maximum `1400px` business container.
- Right drawer review; whole-request approve or reject only.
- Rejection requires a reason and confirmation; approval requires confirmation.
- After a decision, automatically open the next pending request.
- No backend or external dependencies.

---

### Task 1: Unified review request adapter

- [ ] Write failing tests for normalized module and record requests and decision transitions.
- [ ] Implement `src/review-domain.js`.
- [ ] Run the domain tests.

### Task 2: Desktop table and drawer

- [ ] Write failing contract tests for stats, filters, table, drawer, and actions.
- [ ] Implement `admin.html`, `src/admin.js`, and `src/admin.css`.
- [ ] Run all tests.

### Task 3: Automatic next-request flow and verification

- [ ] Test next request selection and empty-queue behavior.
- [ ] Verify syntax, static resources, responsive layout, and `git diff --check`.
