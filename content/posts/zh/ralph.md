---
title: Ralph Loop
description: Ralph 是一个自主 AI 智能体循环，它会反复运行 AI 编程工具（Amp 或 Claude Code），直到产品需求文档（PRD）中的所有条目全部完成。每次迭代都是一个全新的实例，拥有干净的上下文环境。记忆状态通过 Git 提交历史、progress.txt 文件以及 prd.json 文件进行持久化保存。
date: 2026-04-28
tags: [AICoding]
category: 教程
author: Charlie Fei
slug: ralph
published: true
---

[GitHub 仓库](https://github.com/snarktank/ralph)

[官方介绍文章](https://ghuntley.com/ralph/)

[Ryan Carson 的使用心得](https://x.com/ryancarson/status/2008548371712135632)

# 安装 Ralph

## 手动复制到项目
```bash
# 在项目根目录执行
mkdir -p scripts/ralph
cp /path/to/ralph/ralph.sh scripts/ralph/

# 复制适合你 AI 工具的提示词模板：
cp /path/to/ralph/prompt.md scripts/ralph/prompt.md    # for Amp
# 或
cp /path/to/ralph/CLAUDE.md scripts/ralph/CLAUDE.md    # for Claude Code

chmod +x scripts/ralph/ralph.sh
```

## 通过 Agent Skills 安装

### 手动复制

```bash
# Amp
cp -r skills/prd ~/.config/amp/skills/
cp -r skills/ralph ~/.config/amp/skills/

# Claude Code
cp -r skills/prd ~/.claude/skills/
cp -r skills/ralph ~/.claude/skills/
```

### 通过 Claude Code 官方插件市场

```bash
/plugin marketplace add snarktank/ralph
/plugin install ralph-skills@ralph-marketplace
```

安装完成后会获得两个 skill：
- `/prd` — 生成产品需求文档（PRD）
- `/ralph` — 将 PRD 转换为 prd.json 格式

## 配置 Amp 自动交接

编辑 `~/.config/amp/settings.json`：

```json
{
  "amp.experimental.autoHandoff": { "context": 90 }
}
```

这实现了**上下文溢出时的自动交接**，使 Ralph 能够处理超出单个上下文窗口容量的大型用户故事。

# 官方工作流

## 创建 PRD

使用 PRD 技能生成一份详细的需求文档：

```bash
Load the prd skill and create a PRD for [your feature description]
```

回答 AI 提出的澄清问题。该命令会将输出保存至 `tasks/prd-[功能名称].md`。

## 将 PRD 转换为 Ralph 格式

使用 Ralph 工具将 Markdown 格式的 PRD 转换为 JSON 格式：

```bash
Load the ralph skill and convert tasks/prd-[feature-name].md to prd.json
```

这会生成一个 **prd.json** 文件，其中包含为**自主执行**而结构化编排的用户故事。

## 运行 Ralph

```bash
# 使用 Amp（默认）
./scripts/ralph/ralph.sh [max_iterations]

# 使用 Claude Code
./scripts/ralph/ralph.sh --tool claude [max_iterations]
```

默认迭代次数为 10 次。可使用 `--tool amp` 或 `--tool claude` 参数选择 AI 编程工具。

Ralph 的执行流程如下：

1. 基于 PRD 中指定的分支名称创建功能分支
2. 选取优先级最高且尚未通过（`passes: false`）的用户故事
3. 实现该用户故事
4. 运行质量检查（类型检查、测试）
5. 检查通过则进行提交
6. 更新 prd.json，将该故事标记为已通过（`passes: true`）
7. 将经验总结追加到 progress.txt
8. 重复执行，直至所有故事均通过检查或达到最大迭代次数

# 核心文件

| 文件 | 用途 |
| --- | --- |
| ralph.sh | 启动全新 AI 实例的 Bash 循环脚本（支持 `--tool amp` 或 `--tool claude` 参数） |
| prompt.md | Amp 的提示词模板 |
| CLAUDE.md | Claude Code 的提示词模板 |
| prd.json | 带完成状态的用户故事（任务清单） |
| prd.json.example | PRD 示例格式，供参考 |
| progress.txt | 追加式经验记录，供后续迭代参考 |
| skills/prd/ | 用于生成 PRD 的技能（适配 Amp 与 Claude Code） |
| skills/ralph/ | 用于将 PRD 转换为 JSON 的技能（兼容 Amp 和 Claude Code） |
| .claude-plugin/ | 用于 Claude Code 插件市场发现的插件清单 |
| flowchart/ | Ralph 工作流程的交互式可视化演示 |

# 核心概念

## 每次迭代 = 全新上下文

每次迭代都会启动一个**全新的、上下文干净的 AI 实例**（Amp 或 Claude Code）。迭代之间唯一保留的状态包括：

- Git 历史记录（来自之前迭代的提交）
- progress.txt（经验总结与上下文信息）
- prd.json（标记哪些用户故事已完成）

## 小任务原则

PRD 中的每个需求项都应足够小，确保能在**单次上下文窗口**内完成。任务过大时，大语言模型会在完成前耗尽上下文，导致生成的代码质量很差。

**大小合适的用户故事：**

- 添加数据库字段及迁移脚本
- 在现有页面中新增一个 UI 组件
- 为服务端操作新增逻辑并更新
- 为列表添加筛选下拉框

**过大的任务（需要拆分）：**

- "搭建完整的仪表盘"
- "添加身份认证功能"
- "重构整个 API"

## AGENTS.md 更新至关重要

每次迭代完成后，Ralph 都会将经验总结更新到对应的 **AGENTS.md** 文件中。这一点至关重要——AI 编程工具会自动读取这些文件，后续的迭代以及未来的开发人员都能从总结出的开发模式、注意事项和代码规范中受益。

建议写入 AGENTS.md 的内容：

- **开发模式**：例如 "该代码库使用 X 实现 Y 功能"
- **注意事项**：例如 "修改 W 时务必同步更新 Z"
- **有用的上下文**：例如 "设置面板位于组件 X 中"

## 反馈循环

Ralph 只有在存在**反馈循环**的情况下才能正常工作：

- 类型检查捕获类型错误
- 测试验证功能行为
- CI 必须保持通过（损坏的代码会在多次迭代中不断累积问题）

## 前端故事的浏览器验证

前端用户故事的验收标准中必须包含 **"使用 dev-browser 工具在浏览器中验证"** 这一项。Ralph 会通过浏览器开发工具访问对应页面、与界面交互，并确认修改功能正常。

## 停止条件

当所有用户故事的 `passes` 均为 `true` 时，Ralph 会输出 `<promise>COMPLETE</promise>` 并退出循环。

# 调试

检查当前运行状态：

```bash
# 查看哪些故事已完成
cat prd.json | jq '.userStories[] | {id, title, passes}'

# 查看之前迭代的经验记录
cat progress.txt

# 查看 Git 提交历史
git log --oneline -10
```

# 归档

启动一个新功能时（使用不同的分支名称），Ralph 会自动归档之前的运行记录。归档文件将保存至 `archive/YYYY-MM-DD-feature-name/` 目录下。
