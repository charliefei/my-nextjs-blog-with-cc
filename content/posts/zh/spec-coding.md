---
title: Spec Coding（SDD——规格驱动开发）
description: 对 GitHub 上两个热门的 SDD 工具（spec-kit 和 openspec）进行学习和总结。
coverImage: /images/posts/spec-coding-cover.png
date: 2026-04-26
tags: [AICoding]
category: 教程
author: Charlie Fei
slug: spec-coding
published: true
---

## spec-kit

- [spec-kit 官方仓库](https://github.com/github/spec-kit)
- [SDD——规格驱动开发](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [spec-kit 详细流程](https://github.com/github/spec-kit#-detailed-process)

### 快速开始

#### 安装 spec-kit

```bash
# 安装指定的稳定版本（推荐——将 vX.Y.Z 替换为最新标签）
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z

# 或安装 main 分支的最新版本（可能包含未发布的变更）
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 升级 spec-kit
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```

#### 初始化项目

```bash
# 创建新项目
specify init <PROJECT_NAME>

# 或在现有项目中初始化
specify init . --ai claude

# 指定 AI 编程代理并使用 skills
specify init . --ai claude --ai-skills

# 或
specify init --here --ai claude

# 检查已安装的工具
specify check
```

#### 确定项目原则

在项目目录中启动 AI 助手。大多数代理会将 spec-kit 暴露为 `/speckit.*` 斜杠命令；Codex CLI 在技能模式下使用 `$speckit-*`。

使用 `/speckit.constitution` 命令创建项目的管理原则和开发指南，指导后续开发：

```bash
/speckit.constitution Create principles focused on code quality, testing standards, user experience consistency, and performance requirements
```

#### 创建规格说明

用 `/speckit.specify` 命令描述你想要构建的内容。关注**「做什么」和「为什么做」**，而不是技术栈。

```bash
/speckit.specify Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.
```

#### 制定技术实施计划

用 `/speckit.plan` 命令提供技术栈和架构选择：

```bash
/speckit.plan The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.
```

#### 拆解任务

使用 `/speckit.tasks` 根据实施计划生成可执行的任务列表：

```bash
/speckit.tasks
```

#### 执行任务

使用 `/speckit.implement` 执行所有任务，按照计划构建你的功能：

```bash
/speckit.implement
```

### 斜杠命令速查

**核心命令**

| 命令 | Agent Skill | 说明 |
| --- | --- | --- |
| `/speckit.constitution` | speckit-constitution | 创建或更新项目管理原则与开发指南 |
| `/speckit.specify` | speckit-specify | 定义构建目标（需求与用户故事） |
| `/speckit.plan` | speckit-plan | 根据选定的技术栈制定实施计划 |
| `/speckit.tasks` | speckit-tasks | 生成可执行的任务列表 |
| `/speckit.taskstoissues` | speckit-taskstoissues | 将任务列表转换为 GitHub Issues 进行追踪与执行 |
| `/speckit.implement` | speckit-implement | 按计划执行所有任务以构建功能 |

**可选命令**

| 命令 | Agent Skill | 说明 |
| --- | --- | --- |
| `/speckit.clarify` | speckit-clarify | 澄清未明确的需求领域（建议在 `/speckit.plan` 之前使用，原名 `/quizme`） |
| `/speckit.analyze` | speckit-analyze | 跨制品的完整性与覆盖度分析（在 `/speckit.tasks` 之后、`/speckit.implement` 之前运行） |
| `/speckit.checklist` | speckit-checklist | 生成自定义质量检查清单，验证需求的完整性、清晰度与一致性 |

### spec-kit 命令参考

```bash
# 基础项目初始化
specify init my-project

# 指定 AI 助手
specify init my-project --ai claude

# 初始化并支持 Cursor
specify init my-project --ai cursor-agent

# 初始化并支持 Qoder
specify init my-project --ai qodercli

# 初始化并支持 Windsurf
specify init my-project --ai windsurf

# 初始化并支持 Kiro CLI
specify init my-project --ai kiro-cli

# 初始化并支持 Amp
specify init my-project --ai amp

# 初始化并支持 SHAI
specify init my-project --ai shai

# 初始化并支持 Mistral Vibe
specify init my-project --ai vibe

# 初始化并支持 IBM Bob
specify init my-project --ai bob

# 初始化并支持 Pi Coding Agent
specify init my-project --ai pi

# 初始化并支持 Codex CLI
specify init my-project --ai codex --ai-skills

# 初始化并支持 Antigravity
specify init my-project --ai agy --ai-skills

# 初始化并支持 Forge
specify init my-project --ai forge

# 初始化并为不支持的代理提供通用支持
specify init my-project --ai generic --ai-commands-dir .myagent/commands/

# 初始化并支持 PowerShell 脚本（Windows/跨平台）
specify init my-project --ai copilot --script ps

# 在当前目录初始化
specify init . --ai copilot
# 或使用 --here 标志
specify init --here --ai copilot

# 强制合并到当前（非空）目录，无需确认
specify init . --force --ai copilot
# 或
specify init --here --force --ai copilot

# 跳过 Git 初始化
specify init my-project --ai gemini --no-git

# 启用调试输出
specify init my-project --ai claude --debug

# 使用 GitHub Token 进行 API 请求（适用于企业环境）
specify init my-project --ai claude --github-token ghp_your_token_here

# 默认情况下，Claude Code 会在项目中安装 skills
specify init my-project --ai claude

# 在当前目录初始化并使用 agent skills
specify init --here --ai gemini --ai-skills

# 使用时间戳分支编号（适用于分布式团队）
specify init my-project --ai claude --branch-numbering timestamp

# 检查系统需求
specify check
```

### 扩展与预设

```plain
.specify/templates/overrides/         # 本地项目覆盖（优先级最高），无需创建完整预设即可一次性调整当前项目
.specify/presets/templates/           # 自定义扩展和核心模板
.specify/extensions/templates/        # 增强 spec-kit 的能力
.specify/templates/                   # spec-kit 的核心内置模板
```

#### Extensions（扩展）

当需要超越 spec-kit 核心的功能时，使用扩展。扩展会引入新的命令和模板——例如，添加内置 SDD 命令未覆盖的领域特定工作流、集成外部工具，或添加全新的开发阶段。它们扩展了 spec-kit 的能力边界。

例如，扩展可以添加 Jira 集成、实现后的代码审查、V-Model 测试追溯，或项目健康度诊断。

[社区扩展](https://github.com/github/spec-kit#-community-extensions)

```bash
specify extension search

# 安装扩展
specify extension add <extension-name>
```

#### Presets（预设）

当需要**改变 spec-kit 的工作方式但不添加新功能**时，使用预设。预设会覆盖核心及已安装扩展自带的模板和命令——例如，强制使用合规导向的规格格式、采用领域特定术语，或将组织标准应用于计划和任务。它们定制了 spec-kit 及其扩展生成的制品与指令。

举例来说，预设可以重构规格模板以要求监管追溯、调整工作流以适配采用的方法论（如敏捷、看板、瀑布、Job-to-be-Done 或领域驱动设计）、在计划中增加安全审查关卡、强制测试优先的任务排序，或将整个工作流本地化为不同语言。[pirate-speak 演示](https://github.com/mnriem/spec-kit-pirate-speak-preset-demo)展示了自定义的深度。多个预设可以按优先级顺序叠加使用。

- [社区预设](https://github.com/github/spec-kit?tab=readme-ov-file#-community-presets)
- [预设说明](https://github.com/github/spec-kit/blob/main/presets/README.md)

```bash
specify preset search

# 安装预设
specify preset add <preset-name>
```

## open-spec

待更新……
