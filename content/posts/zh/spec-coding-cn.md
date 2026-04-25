---
title: Spec Coding（SDD-规格驱动开发）
description: 对于GitHub上较火的两个SDD工具（spec-kit和openspec）做学习和总结
coverImage: /images/posts/spec-coding-cover.png
date: 2026-04-26
tags: [AICoding]
category: 教程
author: Charlie Fei
slug: spec-coding-cn
published: true
---

## spec-kit
spec-kit官方仓库

[https://github.com/github/spec-kit](https://github.com/github/spec-kit)

sdd，规格驱动开发

[https://github.com/github/spec-kit/blob/main/spec-driven.md](https://github.com/github/spec-kit/blob/main/spec-driven.md)

spec-kit，详细流程

[https://github.com/github/spec-kit#-detailed-process](https://github.com/github/spec-kit#-detailed-process)

### 快速开始
#### 安装spec-kit
```bash
# Install a specific stable release (recommended — replace vX.Y.Z with the latest tag)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z

# Or install latest from main (may include unreleased changes)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 升级spec-kit
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```

#### 初始化一个项目
```bash
# Create new project
specify init <PROJECT_NAME>

# Or initialize in existing project
specify init . --ai claude

# 指定ai编程代理和指定用skills
specify init . --ai claude --ai-skills

# or
specify init --here --ai claude

# Check installed tools
specify check
```

#### 确定项目的principles
在项目目录中启动你的 AI 助手。大多数代理会将 spec-kit 暴露为 `/speckit.*` 斜杠命令;Codex CLI 在技能模式下用的是 `$speckit-*`。

使用 `/speckit.constitution` 命令创建项目的管理原则和开发指南，指导后续开发。

```bash
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
```

#### 创建规格
用 `/speckit.specite` 命令描述你想构建的内容。关注 “什么” 和 “为什么”， 而不是技术栈。

```bash
/speckit.specify Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.
```

#### 制定技术实施计划
用 `/speckit.plan` 命令提供你的技术栈和架构选择。

```bash
/speckit.plan The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.
```

#### 拆解任务
使用 `/speckit.tasks` 根据你的实施计划创建一个可执行的任务列表。

```bash
/speckit.tasks
```

#### 执行任务
使用 `/speckit.implement` 执行所有任务，并按照计划构建你的功能。

```bash
/speckit.implement
```

### slash命令速查
核心命令

| Command | Agent Skill | Description |
| --- | --- | --- |
| /speckit.constitution | speckit-constitution | Create or update project governing principles and development guidelines |
| /speckit.specify | speckit-specify | Define what you want to build (requirements and user stories) |
| /speckit.plan | speckit-plan | Create technical implementation plans with your chosen tech stack |
| /speckit.tasks | speckit-tasks | Generate actionable task lists for implementation |
| /speckit.taskstoissues | speckit-taskstoissues | Convert generated task lists into GitHub issues for tracking and execution |
| /speckit.implement | speckit-implement | Execute all tasks to build the feature according to the plan |


可选命令

| Command | Agent Skill | Description |
| --- | --- | --- |
| /speckit.clarify | speckit-clarify | Clarify underspecified areas (recommended before `/speckit.plan`; formerly `/quizme`) |
| /speckit.analyze | speckit-analyze | Cross-artifact consistency & coverage analysis (run after `/speckit.tasks`, before `/speckit.implement`) |
| /speckit.checklist | speckit-checklist | Generate custom quality checklists that validate requirements completeness, clarity, and consistency (like "unit tests for English") |


### spec-kit命令
```bash
# Basic project initialization
specify init my-project

# Initialize with specific AI assistant
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

# Initialize with an unsupported agent (generic / bring your own agent)
specify init my-project --ai generic --ai-commands-dir .myagent/commands/

# Initialize with PowerShell scripts (Windows/cross-platform)
specify init my-project --ai copilot --script ps

# Initialize in current directory
specify init . --ai copilot
# or use the --here flag
specify init --here --ai copilot

# Force merge into current (non-empty) directory without confirmation
specify init . --force --ai copilot
# or
specify init --here --force --ai copilot

# Skip git initialization
specify init my-project --ai gemini --no-git

# Enable debug output for troubleshooting
specify init my-project --ai claude --debug

# Use GitHub token for API requests (helpful for corporate environments)
specify init my-project --ai claude --github-token ghp_your_token_here

# Claude Code installs skills with the project by default
specify init my-project --ai claude

# Initialize in current directory with agent skills
specify init --here --ai gemini --ai-skills

# Use timestamp-based branch numbering (useful for distributed teams)
specify init my-project --ai claude --branch-numbering timestamp

# Check system requirements
specify check
```

### 拓展和预设
```plain
# 本地项目覆盖（优先级最高），可以让你不需要创建一个完整的预设，从而一次性调整一个本地项目
.specify/templates/overrides/

# 自定义extensions和core
.specify/presets/templates/

# 给spec-kit增强能力
.specify/extensions/templates/

# spec-kit的核心内置模板
.specify/templates/
```

#### extensions
Use extensions when you need functionality that goes beyond Spec Kit's core. Extensions introduce new commands and templates — for example, adding domain-specific workflows that are not covered by the built-in SDD commands, integrating with external tools, or adding entirely new development phases. They expand what Spec Kit can do.

For example, extensions could add Jira integration, post-implementation code review, V-Model test traceability, or project health diagnostics.

[社区拓展](https://github.com/github/spec-kit#-community-extensions)

```bash
# Search available extensions
specify extension search

# Install an extension
specify extension add <extension-name>
```

#### presets
Use presets when you want to **change how Spec Kit works without adding new capabilities**. Presets override the templates and commands that ship with the core and with installed extensions — for example, enforcing a compliance-oriented spec format, using domain-specific terminology, or applying organizational standards to plans and tasks. They customize the artifacts and instructions that Spec Kit and its extensions produce.

For example, presets could restructure spec templates to require regulatory traceability, adapt the workflow to fit the methodology you use (e.g., Agile, Kanban, Waterfall, jobs-to-be-done, or domain-driven design), add mandatory security review gates to plans, enforce test-first task ordering, or localize the entire workflow to a different language. The [pirate-speak demo](https://github.com/mnriem/spec-kit-pirate-speak-preset-demo) shows just how deep the customization can go. Multiple presets can be stacked with priority ordering.

[社区预设](https://github.com/github/spec-kit?tab=readme-ov-file#-community-presets)

[预设说明](https://github.com/github/spec-kit/blob/main/presets/README.md)

```bash
# Search available presets
specify preset search

# Install a preset
specify preset add <preset-name>
```

## open-spec

待更新...
