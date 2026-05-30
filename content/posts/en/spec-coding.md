---
title: Spec Coding (SDD — Spec-Driven Development)
description: "A study and summary of two popular SDD tools on GitHub: spec-kit and openspec."
coverImage: /images/posts/spec-coding-cover.png
date: 2026-04-26
tags: [AICoding]
category: Tutorials
author: Charlie Fei
slug: spec-coding
published: true
---

## spec-kit

- [spec-kit Official Repository](https://github.com/github/spec-kit)
- [SDD — Spec-Driven Development](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [spec-kit Detailed Process](https://github.com/github/spec-kit#-detailed-process)

### Quick Start

#### Installing spec-kit

```bash
# Install a specific stable version (recommended — replace vX.Y.Z with the latest tag)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z

# Or install the latest from the main branch (may include unreleased changes)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Upgrade spec-kit
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```

#### Initializing a Project

```bash
# Create a new project
specify init <PROJECT_NAME>

# Or initialize in an existing project
specify init . --ai claude

# Specify AI coding agent and use skills
specify init . --ai claude --ai-skills

# Or
specify init --here --ai claude

# Check installed tools
specify check
```

#### Setting Project Constitution

Launch the AI assistant in your project directory. Most agents expose spec-kit as `/speckit.*` slash commands; Codex CLI uses `$speckit-*` in skill mode.

Use the `/speckit.constitution` command to create project governance principles and development guidelines:

```bash
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
```

#### Creating Specifications

Use the `/speckit.specify` command to describe what you want to build. Focus on **the "what" and "why"**, not the tech stack.

```bash
/speckit.specify Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.
```

#### Creating a Technical Implementation Plan

Use the `/speckit.plan` command to provide tech stack and architectural choices:

```bash
/speckit.plan The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.
```

#### Breaking Down Tasks

Use `/speckit.tasks` to generate an actionable task list based on the implementation plan:

```bash
/speckit.tasks
```

#### Executing Tasks

Use `/speckit.implement` to execute all tasks and build your feature according to the plan:

```bash
/speckit.implement
```

### Slash Command Reference

**Core Commands**

| Command | Agent Skill | Description |
| --- | --- | --- |
| `/speckit.constitution` | speckit-constitution | Create or update project governance principles and development guidelines |
| `/speckit.specify` | speckit-specify | Define build goals (requirements and user stories) |
| `/speckit.plan` | speckit-plan | Create implementation plan based on selected tech stack |
| `/speckit.tasks` | speckit-tasks | Generate an actionable task list |
| `/speckit.taskstoissues` | speckit-taskstoissues | Convert task list to GitHub Issues for tracking and execution |
| `/speckit.implement` | speckit-implement | Execute all tasks per the plan to build the feature |

**Optional Commands**

| Command | Agent Skill | Description |
| --- | --- | --- |
| `/speckit.clarify` | speckit-clarify | Clarify ambiguous requirements (recommended before `/speckit.plan`, formerly `/quizme`) |
| `/speckit.analyze` | speckit-analyze | Cross-artifact completeness and coverage analysis (run after `/speckit.tasks`, before `/speckit.implement`) |
| `/speckit.checklist` | speckit-checklist | Generate custom quality checklists to verify requirements completeness, clarity, and consistency |

### spec-kit Command Reference

```bash
# Basic project initialization
specify init my-project

# Specify AI assistant
specify init my-project --ai claude

# Initialize with Cursor support
specify init my-project --ai cursor-agent

# Initialize with Qoder support
specify init my-project --ai qodercli

# Initialize with Windsurf support
specify init my-project --ai windsurf

# Initialize with Kiro CLI support
specify init my-project --ai kiro-cli

# Initialize with Amp support
specify init my-project --ai amp

# Initialize with SHAI support
specify init my-project --ai shai

# Initialize with Mistral Vibe support
specify init my-project --ai vibe

# Initialize with IBM Bob support
specify init my-project --ai bob

# Initialize with Pi Coding Agent support
specify init my-project --ai pi

# Initialize with Codex CLI support
specify init my-project --ai codex --ai-skills

# Initialize with Antigravity support
specify init my-project --ai agy --ai-skills

# Initialize with Forge support
specify init my-project --ai forge

# Initialize with generic support for unsupported agents
specify init my-project --ai generic --ai-commands-dir .myagent/commands/

# Initialize with PowerShell script support (Windows/cross-platform)
specify init my-project --ai copilot --script ps

# Initialize in current directory
specify init . --ai copilot
# Or use the --here flag
specify init --here --ai copilot

# Force merge into current (non-empty) directory without confirmation
specify init . --force --ai copilot
# Or
specify init --here --force --ai copilot

# Skip Git initialization
specify init my-project --ai gemini --no-git

# Enable debug output
specify init my-project --ai claude --debug

# Use GitHub Token for API requests (suitable for enterprise environments)
specify init my-project --ai claude --github-token ghp_your_token_here

# By default, Claude Code installs skills in the project
specify init my-project --ai claude

# Initialize in current directory and use agent skills
specify init --here --ai gemini --ai-skills

# Use timestamp branch numbering (suitable for distributed teams)
specify init my-project --ai claude --branch-numbering timestamp

# Check system requirements
specify check
```

### Extensions & Presets

```plain
.specify/templates/overrides/         # Local project overrides (highest priority), for one-time adjustments without creating a full preset
.specify/presets/templates/           # Custom extensions and core templates
.specify/extensions/templates/        # Enhance spec-kit capabilities
.specify/templates/                   # spec-kit's core built-in templates
```

#### Extensions

Use extensions when you need functionality beyond spec-kit's core. Extensions introduce new commands and templates — for example, adding domain-specific workflows not covered by built-in SDD commands, integrating external tools, or adding entirely new development phases. They extend spec-kit's capabilities.

For example, extensions can add Jira integration, post-implementation code review, V-Model test traceability, or project health diagnostics.

[Community Extensions](https://github.com/github/spec-kit#-community-extensions)

```bash
specify extension search

# Install an extension
specify extension add <extension-name>
```

#### Presets

Use presets when you need to **change how spec-kit works without adding new features**. Presets override templates and commands from the core and installed extensions — for example, enforcing compliance-oriented spec formats, adopting domain-specific terminology, or applying organizational standards to plans and tasks. They customize the artifacts and instructions generated by spec-kit and its extensions.

For instance, presets can restructure spec templates to require regulatory traceability, adapt workflows to fit adopted methodologies (such as Agile, Kanban, Waterfall, Jobs-to-be-Done, or Domain-Driven Design), add security review gates to plans, enforce test-first task ordering, or localize the entire workflow into different languages. The [pirate-speak demo](https://github.com/mnriem/spec-kit-pirate-speak-preset-demo) demonstrates the depth of customization. Multiple presets can be stacked in priority order.

- [Community Presets](https://github.com/github/spec-kit?tab=readme-ov-file#-community-presets)
- [Preset Documentation](https://github.com/github/spec-kit/blob/main/presets/README.md)

```bash
specify preset search

# Install a preset
specify preset add <preset-name>
```

## open-spec

Coming soon…
