---
title: Ralph Loop
description: Ralph is an autonomous AI agent loop that repeatedly runs AI coding tools (Amp or Claude Code) until all items in a Product Requirements Document (PRD) are complete. Each iteration is a fresh instance with a clean context. Memory is persisted through Git commit history, progress.txt, and prd.json.
date: 2026-04-28
tags: [AICoding]
category: Tutorials
author: Charlie Fei
slug: ralph
published: true
---

[GitHub Repository](https://github.com/snarktank/ralph)

[Official Introduction](https://ghuntley.com/ralph/)

[Ryan Carson's Experience](https://x.com/ryancarson/status/2008548371712135632)

# Installing Ralph

## Manual Copy to Project
```bash
# Run from project root
mkdir -p scripts/ralph
cp /path/to/ralph/ralph.sh scripts/ralph/

# Copy the prompt template for your AI tool:
cp /path/to/ralph/prompt.md scripts/ralph/prompt.md    # for Amp
# or
cp /path/to/ralph/CLAUDE.md scripts/ralph/CLAUDE.md    # for Claude Code

chmod +x scripts/ralph/ralph.sh
```

## Installing via Agent Skills

### Manual Copy

```bash
# Amp
cp -r skills/prd ~/.config/amp/skills/
cp -r skills/ralph ~/.config/amp/skills/

# Claude Code
cp -r skills/prd ~/.claude/skills/
cp -r skills/ralph ~/.claude/skills/
```

### Via Claude Code Plugin Marketplace

```bash
/plugin marketplace add snarktank/ralph
/plugin install ralph-skills@ralph-marketplace
```

After installation you'll have two skills:
- `/prd` — Generate a Product Requirements Document (PRD)
- `/ralph` — Convert PRD to prd.json format

## Configuring Amp Auto Handoff

Edit `~/.config/amp/settings.json`:

```json
{
  "amp.experimental.autoHandoff": { "context": 90 }
}
```

This enables **auto-handoff on context overflow**, allowing Ralph to handle large user stories that exceed a single context window capacity.

# Official Workflow

## Creating a PRD

Use the PRD skill to generate a detailed requirements document:

```bash
Load the prd skill and create a PRD for [your feature description]
```

Answer the AI's clarifying questions. This command saves the output to `tasks/prd-[feature-name].md`.

## Converting PRD to Ralph Format

Use the Ralph tool to convert the Markdown PRD into JSON format:

```bash
Load the ralph skill and convert tasks/prd-[feature-name].md to prd.json
```

This generates a **prd.json** file containing user stories structured for **autonomous execution**.

## Running Ralph

```bash
# Using Amp (default)
./scripts/ralph/ralph.sh [max_iterations]

# Using Claude Code
./scripts/ralph/ralph.sh --tool claude [max_iterations]
```

The default iteration count is 10. Use `--tool amp` or `--tool claude` to select the AI coding tool.

Ralph's execution flow:

1. Create a feature branch based on the branch name specified in the PRD
2. Pick the highest priority user story that is not yet completed (`passes: false`)
3. Implement the user story
4. Run quality checks (type checking, tests)
5. Commit if checks pass
6. Update prd.json, marking the story as completed (`passes: true`)
7. Append lessons learned to progress.txt
8. Repeat until all stories pass or maximum iterations are reached

# Core Files

| File | Purpose |
| --- | --- |
| ralph.sh | Bash loop script that launches fresh AI instances (supports `--tool amp` or `--tool claude`) |
| prompt.md | Prompt template for Amp |
| CLAUDE.md | Prompt template for Claude Code |
| prd.json | User stories with completion status (task list) |
| prd.json.example | Example PRD format for reference |
| progress.txt | Append-only experience log for subsequent iterations |
| skills/prd/ | Skill for generating PRDs (compatible with Amp and Claude Code) |
| skills/ralph/ | Skill for converting PRDs to JSON (compatible with Amp and Claude Code) |
| .claude-plugin/ | Plugin manifest for Claude Code plugin marketplace discovery |
| flowchart/ | Interactive visualization of the Ralph workflow |

# Core Concepts

## Each Iteration = Fresh Context

Each iteration launches a **brand new, context-clean AI instance** (Amp or Claude Code). The only persisted state between iterations includes:

- Git history (commits from previous iterations)
- progress.txt (lessons learned and context information)
- prd.json (which user stories are completed)

## Small Task Principle

Every requirement item in the PRD should be small enough to complete within a **single context window**. If tasks are too large, the LLM will exhaust its context before completion, resulting in poor quality code.

**Appropriately sized user stories:**

- Add a database field and migration script
- Add a new UI component to an existing page
- Add new logic and update a server action
- Add a filter dropdown to a list

**Too large (needs splitting):**

- "Build a complete dashboard"
- "Add authentication functionality"
- "Refactor the entire API"

## AGENTS.md Updates Are Crucial

After each iteration, Ralph appends lessons learned to the corresponding **AGENTS.md** file. This is crucial — AI coding tools automatically read these files, and subsequent iterations as well as future developers benefit from the summarized development patterns, gotchas, and code conventions.

What to include in AGENTS.md:

- **Development patterns**: e.g., "This codebase uses X to implement Y"
- **Gotchas**: e.g., "When modifying W, always update Z"
- **Useful context**: e.g., "Settings panel is located in component X"

## Feedback Loop

Ralph only works correctly when a **feedback loop** exists:

- Type checking catches type errors
- Tests verify functional behavior
- CI must remain passing (broken code accumulates problems across iterations)

## Browser Verification for Frontend Stories

Frontend user story acceptance criteria must include **"Verify in the browser using the dev-browser tool"**. Ralph will access the corresponding page via browser dev tools, interact with the UI, and confirm the modifications work correctly.

## Stop Condition

When all user stories have `passes` set to `true`, Ralph outputs `<promise>COMPLETE</promise>` and exits the loop.

# Debugging

Check current run status:

```bash
# See which stories are completed
cat prd.json | jq '.userStories[] | {id, title, passes}'

# View experience logs from previous iterations
cat progress.txt

# View Git commit history
git log --oneline -10
```

# Archiving

When starting a new feature (using a different branch name), Ralph automatically archives previous run records. Archives are saved to `archive/YYYY-MM-DD-feature-name/`.
