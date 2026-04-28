---
title: Ralph Loop
description: Ralph 是一个自主 AI 智能体循环，它会反复运行 AI 编程工具（Amp 或 Claude Code），直到所有产品需求文档（PRD）条目全部完成。每次迭代都是一个全新实例，拥有干净的上下文环境。记忆状态通过 Git 提交历史、progress.txt 文件以及 prd.json 文件进行持久化保存
date: 2026-04-28
tags: [AICoding]
category: 教程
author: Charlie Fei
slug: ralph-cn
published: true
---

[https://github.com/snarktank/ralph](https://github.com/snarktank/ralph)

[https://ghuntley.com/ralph/](https://ghuntley.com/ralph/)

[Read my in-depth article on how I use Ralph](https://x.com/ryancarson/status/2008548371712135632)

# 安装Ralph
## 手动copy到自己的项目
```bash
# From your project root
mkdir -p scripts/ralph
cp /path/to/ralph/ralph.sh scripts/ralph/

# Copy the prompt template for your AI tool of choice:
cp /path/to/ralph/prompt.md scripts/ralph/prompt.md    # For Amp
# OR
cp /path/to/ralph/CLAUDE.md scripts/ralph/CLAUDE.md    # For Claude Code

chmod +x scripts/ralph/ralph.sh
```

## 通过agent skills的方式安装
+ 手动复制

```bash
# amp
cp -r skills/prd ~/.config/amp/skills/
cp -r skills/ralph ~/.config/amp/skills/

# claude code
cp -r skills/prd ~/.claude/skills/
cp -r skills/ralph ~/.claude/skills/
```

+ claude code的官方marketplace

```bash
/plugin marketplace add snarktank/ralph
/plugin install ralph-skills@ralph-marketplace
```

+ 安装之后，两个skill
    - `/prd` - Generate Product Requirements Documents
    - `/ralph` - Convert PRDs to prd.json format

## 配置 amp 自动交接
~/.config/amp/settings.json

```json
{
  "amp.experimental.autoHandoff": { "context": 90 }
}
```

 这实现了**上下文溢出时的自动交接**，使 Ralph 能够处理超出单个上下文窗口容量的大型用户故事。  

# 官方工作流
## 创建一个PRD
 运用 PRD 技能生成一份详细的需求文档：  

```bash
Load the prd skill and create a PRD for [your feature description]
```

 回答澄清问题。该功能会将输出内容保存至 `tasks/prd-[功能名称].md`。  

## 转换PRD到Ralph的格式
使用 Ralph 工具将 Markdown 格式的产品需求文档（PRD）转换为 JSON 格式。

```bash
Load the ralph skill and convert tasks/prd-[feature-name].md to prd.json
```

这会生成一个 **prd.json**文件，其中包含为**自主执行**而结构化编排的用户故事（User Stories）。

## 运行Ralph
```bash
# Using Amp (default)
./scripts/ralph/ralph.sh [max_iterations]

# Using Claude Code
./scripts/ralph/ralph.sh --tool claude [max_iterations]
```

默认迭代次数为 10 次。可使用 `--tool amp` 或 `--tool claude` 参数选择你的 AI 编程工具。

Ralph 将执行以下操作：

+ 基于 PRD 中指定的分支名称创建功能分支
+ 选取优先级最高且未通过（`passes: false`）的用户故事
+ 实现该单个用户故事
+ 运行质量检查（类型检查、测试）
+ 若检查通过则进行提交
+ 更新 prd.json，将该故事标记为已通过（`passes: true`）
+ 将经验总结追加到 progress.txt
+ 重复执行，直至所有故事均通过检查或达到最大迭代次数

# 核心文件
| File | Purpose |
| --- | --- |
| ralph.sh | 启动全新 AI 实例的 Bash 循环（支持 `--tool amp` 或 `--tool claude` 参数）   |
| prompt.md | Amp 的提示词模板   |
| CLAUDE.md | Claude Code 的提示词模板 |
| prd.json | 带完成状态的用户故事（任务清单）   |
| prd.json.example | 供参考的 PRD 示例格式   |
| progress.txt | 仅供后续迭代参考的追加式经验记录   |
| skills/prd/ | 用于生成产品需求文档（PRD）的技能（适配 Amp 与 Claude Code）   |
| skills/ralph/ | 用于将 PRD（产品需求文档）转换为 JSON 格式的技能（兼容 Amp 和 Claude Code）   |
| .claude-plugin/ | 用于 Claude Code 插件市场发现的插件清单   |
| flowchart/ | Ralph 工作流程的交互式可视化演示   |


# 核心概念
## Each Iteration = Fresh Context
每次迭代都会启动一个**全新的、上下文干净的 AI 实例**（Amp 或 Claude Code）。迭代之间唯一保留的记忆 / 状态为：

+ Git 历史记录（来自之前迭代的提交）
+ progress.txt（经验总结与上下文信息）
+ prd.json（标记哪些用户故事已完成）

## Small Tasks
PRD 中的每个需求项都应足够小，确保能在**单次上下文窗口**内完成。如果任务过大，大语言模型会在完成前耗尽上下文，导致生成的代码质量很差。

**大小合适的用户故事：**

+ 添加数据库字段及迁移脚本
+ 在现有页面中新增一个 UI 组件
+ 为服务端操作新增逻辑并更新
+ 为列表添加筛选下拉框

**过大的任务（需要拆分）：**

+ “搭建完整的仪表盘”
+ “添加身份认证功能”
+ “重构整个 API”

## AGENTS.md Updates Are Critical
每次迭代完成后，Ralph 都会将经验总结更新到对应的 **AGENTS.md** 文件中。这一点至关重要，因为 AI 编程工具会自动读取这些文件，后续的迭代（以及未来的开发人员）都能从总结出的开发模式、注意事项和代码规范中受益。

需要写入 AGENTS.md 的内容示例：

+ 发现的开发模式（例如 “该代码库使用 X 实现 Y 功能”）
+ 注意事项（例如 “修改 W 时务必同步更新 Z”）
+ 有用的上下文信息（例如 “设置面板位于组件 X 中”）

## Feedback Loops
Ralph 只有在存在**反馈循环**的情况下才能正常工作：

+ 类型检查捕获类型错误
+ 测试验证功能行为
+ CI 必须保持通过（损坏的代码会在多次迭代中不断累积问题）

## Browser Verification for UI Stories
前端用户故事的验收标准中必须包含 **“使用 dev-browser 工具在浏览器中验证”** 这一项。Ralph 会通过该浏览器开发工具访问对应页面、与界面交互，并确认修改功能正常。  

## Stop Condition
当所有用户故事的 `passes` 均为 `true` 时，Ralph 会输出 `<promise>COMPLETE</promise>` 并退出循环。  

# Debugging
检查当前状态：

```bash
# See which stories are done
cat prd.json | jq '.userStories[] | {id, title, passes}'

# See learnings from previous iterations
cat progress.txt

# Check git history
git log --oneline -10
```

# 归档
当你启动一个新功能（不同分支名称）时，Ralph 会自动归档之前的运行记录。归档文件将保存至 `archive/YYYY-MM-DD-feature-name/` 目录下。  



