---
title: Superpowers
description: A study and summary of Superpowers. Process over Prompt — wrapping AI with software engineering discipline and guardrails, so it thinks first, plans next, then codes, and always verifies — just like a senior engineer.
date: 2026-04-27
tags: [AICoding]
category: Tutorials
author: Charlie Fei
slug: superpowers
published: true
---

[GitHub Repository](https://github.com/obra/superpowers)

# Installation
```shell
# Claude Official Plugin Marketplace
/plugin install superpowers@claude-plugins-official

# Superpowers Plugin Marketplace
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace

# Cursor
/add-plugin superpowers

# Codex
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md

# OpenCode
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md

# Gemini
gemini extensions install https://github.com/obra/superpowers
gemini extensions update superpowers
```

# Workflow

Superpowers defines a complete software engineering workflow, breaking down the AI coding process into multiple stages, each with clear skills/commands, triggers, and deliverables.

## Requirements Clarification

- **Skill/Command:** Brainstorming (`/brainstorming` or `/superpowers:brainstorming`)
- **Trigger:** User proposes a new feature or requirement (e.g., "Add user login functionality")
- **Input/Output:** Input is user's natural language requirements; output is clarifying Q&A and preliminary design discussion. **Deliverable:** Requirements specification document (text format) listing key requirements.
- **Notes:** The skill uses **Socratic questioning to clarify boundaries and requirement details** (e.g., supported login methods, error handling logic). Must obtain user confirmation before proceeding. If user answers are ambiguous or incomplete, continue asking. If answers are inconsistent, re-verify requirements.

## Design & Architecture

- **Skill:** Can be seen as a continuation of Brainstorming, or implicit in Plans; includes **design review**.
- **Trigger:** Automatically proceeds after Brainstorming requirements are confirmed.
- **Input/Output:** Input is the clarified requirements; output is system architecture or module division suggestions. **Deliverable:** System architecture sketch or component list.
- **Notes:** Design should follow best practices, be clear and concise. If the design is insufficient, return to the Brainstorming phase to supplement requirements or rethink. Use Brainstorming output to verify design soundness.

## Plan Breakdown

- **Skill/Command:** Writing Plans (`/writing-plans` or `/superpowers:writing-plans`)
- **Trigger:** After design plan is confirmed, input requirements to begin task breakdown.
- **Input/Output:** Input is requirements specification or design document; output is detailed implementation steps. **Deliverable:** Implementation plan document listing multiple small tasks (each including goal, file paths, example code, verification steps).
- **Notes:** Each task should be completable within 2–5 minutes. Follow DRY/YAGNI principles, implement only what's necessary. If task granularity is too large or too small, adjust accordingly. Continuously confirm the plan with the user during execution.

## Creating a Git Worktree

- **Skill/Command:** Using Git Worktrees (implicit, no explicit command)
- **Trigger:** Automatically created when ready to start coding after implementation plan is generated.
- **Input/Output:** Executes Git commands in the local project. **Deliverable:** New development branch and corresponding working directory (e.g., `git worktree add -b <feature> ...`).
- **Notes:** Isolated development environment prevents affecting the main branch. If serious issues arise, the worktree branch can be deleted while keeping the main branch clean. Clean up (`git worktree remove`) after completion to free resources.

## Implementation & Coding

- **Skill/Command:** Execute Plans (`/execute-plan` or `/superpowers:executing-plans`), paired with Test-Driven Development.
- **Trigger:** Starts when the user agrees to the execution plan or after the planning phase is complete.
- **Input/Output:** Input is the task list; output is code and tests. AI implements tasks sequentially per plan, opening new sessions or sub-agents for each task.
- **Deliverable:** Feature code files, corresponding test code, task execution logs.
- **Notes:** Enforces TDD flow: before implementing each feature, first write a failing test (red), then write minimal code to pass it (green), and finally refactor. AI does not write production code without first writing a failing test. If many failures or logic confusion occurs, pause the current task for debugging; commit promptly after each task completes.

## Test-Driven Development (TDD)

- **Skill/Command:** Test-Driven Development (`/superpowers:test-driven-development`)
- **Trigger:** Automatically triggered at the start of each coding task.
- **Input/Output:** Input is task description; output is test cases and implementation code. **Deliverable:** Unit test files and implementation files.
- **Notes:** Follows the "red-green-refactor" cycle. If test cases are written incorrectly and fail to fail, they should be rewritten. Tasks must not be marked complete before tests pass. AI automatically rolls back incorrect test-first attempts.

## Systematic Debugging

- **Skill/Command:** Systematic Debugging (`/superpowers:systematic-debugging`)
- **Trigger:** Actively triggered when encountering failing tests, runtime errors, or functional anomalies during coding.
- **Input/Output:** Input is error description and current code context; output is debugging analysis report. **Deliverable:** Four-stage debugging record (root cause analysis, pattern recognition, hypothesis testing, fix recommendations).
- **Notes:** Must follow the **root cause first** principle: analyze the problem's essence before applying fixes. If still unresolved after three attempts, consider whether the issue lies in requirements or design, and if necessary, return to previous stages for review or seek human help. Record all debugging hypotheses and conclusions for future reference.

## Code Review

- **Skill/Command:** Request Code Review (`/request-code-review`)
- **Trigger:** Triggered after all tasks on a feature branch are complete and all tests pass.
- **Input/Output:** Input is the current branch's code changes; output is a review report. **Deliverable:** Code review feedback (strengths, defects, improvement suggestions).
- **Notes:** Automated review checks against code style, security, performance, and other standards, producing a graded issue report. If critical issues are found, they must be fixed and the review re-run; general issues can be followed up after merge. When fixing, modify code as suggested and re-run tests and review.

## Merge & Release

- **Skill/Command:** Finish Branch (merge, no explicit command)
- **Trigger:** Executed when all review issues are resolved and functionality is confirmed correct.
- **Input/Output:** Input is the reviewed branch; output is the merge operation. **Deliverable:** Merged main branch code.
- **Notes:** Default behavior: verify all tests pass before merging. Provides merge/PR, keep, or delete options. Clean up Git worktrees (`git worktree remove`) after merge to free space. Merge marks official completion; deployment or release can happen at this stage.

## Retrospective & Summary

- **Skill:** No specific Superpowers skill.
- **Trigger:** Optional, after merge is complete.
- **Deliverable:** Project summary document (project experience, list of open issues).
- **Notes:** Recommended for teams or AI to summarize project outcomes and issues as reference for future process improvement.

# Case Study
```shell
User: /brainstorming I want to add user login functionality to my website
Claude (Brainstorming skill triggered):
  Let me clarify a few questions before we begin:
  1. Login method: email+password, phone+verification code, or third-party login?
  2. Do you need a "Remember Me" feature?
  3. How should login failures be communicated to the user?
  ...
User: We just need email+password login, simple error messages will do.
Claude:
  Understood. Requirements analysis results: User login feature needs email and password input, encrypted password storage; display error messages on the frontend on login failure; return user info on successful login. Please confirm to proceed (/writing-plans).
User: Continue
Claude: /writing-plans
Claude (Writing Plans skill triggered):
  Based on the requirements, I've generated an implementation plan for the "User Login" feature:
  - Task 1: Create a user table model in `src/models/user.js` (fields: email, passwordHash). **First write a failing test** verifying a newly registered user can log in.
  - Task 2: Implement login logic in `src/auth/login.js` (verify password and generate JWT). **First write a failing test** ensuring correct credentials allow login.
  - Task 3: Add a login form in the frontend `src/components/LoginForm.vue` (email/password). **First write a failing test** checking form submission calls the Login API.
  Please confirm the plan and start execution.
User: Confirmed
Claude:
  Plan generated, starting task execution... (running `/execute-plan`)
Claude:
  Creating isolated Git worktree... (`git worktree add -b feature/login .claude/branches/feature/login`)
  Starting sub-agent task 1: TDD cycle...
  First write test `test/user.test.js`: verify new user can login [Red]...
  Write implementation: `src/models/user.js` create model, add passwordHash field, compare hash on login [Green]...
  Running tests...All pass!
  Commit changes (`git add && git commit`).
  Starting task 2...
  Write test `test/auth.test.js`: verify login logic with registered user [Red]...
  Implement `src/auth/login.js`: find user and verify password hash, generate JWT [Green]...
  Tests pass!
  Starting task 3...
  Write test `test/loginForm.test.js`: simulate form submission and check Login API call [Red]...
  Implement `src/components/LoginForm.vue`: add form and connect to backend [Green]...
  Tests pass! All tasks complete.
Claude:
  All tests passed. Now running code review. (/request-code-review)
Claude (Request Code Review skill triggered):
  Reviewing tasks...
  * Task 1 module: Naming conventions are compliant, no issues.
  * Task 2 module: Found a potential issue — password hash is missing salt, recommend adding it.
  * Task 3 module: Frontend submission is missing error handling, recommend improving error messaging.
  Found 1 significant issue, please fix and re-review.
User: OK, I'll fix it
Claude:
  Issues fixed, all tests pass. Code review approved.
Claude:
  Preparing to merge branch (finish-branch)... Merge successful, feature branch closed.
```

**Note:** In the case above, the user sequentially executes `/brainstorming`, `/writing-plans`, confirms and runs `/execute-plan` to trigger coding. AI creates an isolated Git worktree and completes three tasks through TDD cycles. Output includes requirements specification, task list, test results, code snippets, and review report. `/request-code-review` triggers automatic review and reports issues, which are fixed before merging. All commands (e.g., `/execute-plan`, `/request-code-review`) can be used directly in the Claude Code environment.

# Skills Overview

| Stage | Superpowers Skill/Command | Input/Deliverable | Notes & Failure Strategy |
| --- | --- | --- | --- |
| Requirements Clarification | Brainstorming (`/brainstorming`) | **Deliverable:** Requirements specification (text). AI Q&A dialogue to clarify requirements. | Ask user questions to define boundaries and use cases. If answers are vague, continue probing. Proceed only after confirmation. |
| Design/Architecture | Implicit in Brainstorming | **Deliverable:** System design overview. | Evaluate design reasonableness. If unsuitable, return to Brainstorming or requirements stage. |
| Plan Breakdown | Writing Plans (`/writing-plans`) | **Deliverable:** Implementation plan document (task list). | Break down into 2–5 minute tasks. Split if tasks are too large. Follow DRY/YAGNI principles. |
| Isolated Development | Using Git Worktrees (automatic) | **Deliverable:** New branch and worktree. | Automatically runs `git worktree` to create branch. On failure, can create manually or continue on main branch (higher risk). |
| Implementation/Coding | Execute Plans (`/execute-plan`) | **Deliverable:** Feature code and test code; execution logs. | Strict TDD flow: write tests first, then code. If tests don't pass, pause and enter debugging. |
| TDD | Test-Driven Development (`/superpowers:test-driven-development`) | **Deliverable:** Test case files, implementation code files. | Refuses to generate code without writing tests first. Must not pass when tests fail — rewrite tests or adjust implementation. |
| Debugging | Systematic Debugging (`/superpowers:systematic-debugging`) | **Deliverable:** Four-stage debugging report. | Follow root cause analysis → pattern recognition → hypothesis → fix steps. After three failures, consider design rework or human intervention. |
| Code Review | Request Code Review (`/request-code-review`) | **Deliverable:** Review feedback report. | Auto-checks coding standards, security, etc. Critical issues block merge, require fixes. |
| Merge/Release | Finish Branch (automatic) | **Deliverable:** Merged main branch code. | Run all tests first for stability validation. Provides merge options (merge, PR, keep). Clean up worktrees after completion. |
