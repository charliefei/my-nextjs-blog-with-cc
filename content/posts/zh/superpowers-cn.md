---
title: Superpowers
description: Superpowers学习和使用总结，Process over Prompt（流程大于提示词），给 AI 套上软件工程的 “纪律与护栏”，让它像资深工程师一样先思考、再规划、后编码、必验证。
coverImage: /images/posts/superpowers-cover.png
date: 2026-04-27
tags: [AICoding]
category: 教程
author: Charlie Fei
slug: superpowers-cn
published: true
---

[https://github.com/obra/superpowers](https://github.com/obra/superpowers)

# 安装
```shell
# claude官方插件市场
/plugin install superpowers@claude-plugins-official

# superpowers插件市场
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace

# cursor
/add-plugin superpowers

# codex
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.codex/INSTALL.md

# opencode
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md

# gemini
gemini extensions install https://github.com/obra/superpowers
gemini extensions update superpowers
```

# 工作流
+ **需求澄清**  
    - **技能/命令：** Brainstorming（命令 `/brainstorming` 或 `/superpowers:brainstorming`）。  
    - **触发条件：** 用户提出新功能或需求指令（如“帮我添加用户登录功能”）。  
    - **输入/输出：** 输入为用户自然语言需求；输出为澄清问题问答及初步设计讨论。**产物：** 需求规格说明文档（文本格式），列出需求要点。  
    - **注意事项：** Skill 会**以苏格拉底式提问方式澄清边界和需求细节**（例如支持哪些登录方式、异常处理逻辑等）。必须获得用户确认后才继续下一步。若用户回答有歧义或遗漏，应继续问询；如果回答前后不一致，应重新核对需求。
+ **设计/架构**  
    - **技能：**（可视为Brainstorming延续，或隐含在Plans中）**设计审查**。  
    - **触发：**在Brainstorming确认需求后自动进行。  
    - **输入/输出：**输入为经过澄清的需求；输出为系统架构或模块划分建议。**产物：** 系统架构草图或组件列表。  
    - **注意：**设计应符合最佳实践、清晰简洁。如设计方案不足，需要回到Brainstorming阶段补充需求或重新思考。可以利用Brainstorming输出验证设计合理性。
+ **计划拆分**  
    - **技能/命令：** Writing Plans（命令 `/writing-plans` 或 `/superpowers:writing-plans`）。  
    - **触发条件：** 在设计方案被确认后，输入需求规格开始拆分任务。  
    - **输入/输出：** 输入为需求规格或设计文档；输出为细化的实施步骤。**产物：** 实施计划文档，列出多个小任务（每个任务包括目标、文件路径、示例代码、验证步骤）。  
    - **注意：** 每个任务建议控制在2–5分钟内完成。遵循 DRY / YAGNI 原则，仅实现必要功能。若任务粒度过大或过小，应重新调整拆分。执行过程中需持续与用户确认计划。
+ **创建Git工作区**  
    - **技能/命令：** Using Git Worktrees（隐含执行，无显式命令）。  
    - **触发条件：** 在实施计划生成后，准备开始编码时自动创建。  
    - **输入/输出：** 在本地项目中执行 Git 命令。**产物：** 新的开发分支及对应工作目录（如使用 `git worktree add -b <feature> ...`）。  
    - **注意：** 该隔离开发环境可避免影响主分支。出现严重问题时，可直接删除工作区分支而保留主分支干净。完成后需清理（`git worktree remove`）以释放资源。
+ **实现与编码**  
    - **技能/命令：** Execute Plans (`/execute-plan` 或 `/superpowers:executing-plans`)，配合 Test-Driven Development。  
    - **触发条件：** 用户同意执行计划或计划阶段完毕后开始。  
    - **输入/输出：** 输入为任务列表；输出为代码和测试。AI 按计划逐任务实施：对每个任务新开会话或子代理进行实现。
    - **产物：** 功能代码文件、对应测试代码、任务执行日志。  
    - **注意：** 强制TDD流程：每个功能实现前都生成一个失败测试（红灯），再编写最小代码使其通过（绿灯），最后重构。AI不会在没有先失败测试的情况下编写生产代码。若出现较多失败或逻辑混乱，应暂停当前任务进行调试；每次任务完成后及时提交。
+ **测试驱动开发 (TDD)**  
    - **技能/命令：** Test-Driven Development (`/superpowers:test-driven-development`)。  
    - **触发条件：** 在每个编码任务开始时自动触发。  
    - **输入/输出：** 输入为任务描述；输出为测试用例和实现代码。**产物：** 单元测试文件与实现文件。  
    - **注意：** 遵守“红灯-绿灯-重构”循环。如果测试用例编写错误导致无法失败，应重新书写测试。未通过测试前不允许宣称任务完成。AI 会自动回滚错误的先写测试尝试。
+ **系统化调试**  
    - **技能/命令：** Systematic Debugging (`/superpowers:systematic-debugging`)。  
    - **触发条件：** 在编码过程中遇到未通过的测试、运行时错误或功能异常时主动触发。  
    - **输入/输出：** 输入为错误描述和当前代码上下文；输出为调试分析报告。**产物：** 四阶段调试记录（根因分析、模式识别、假设测试、修复建议）。  
    - **注意：** 必须遵循**根因优先**原则：先分析问题本质再动手修复。如果三次尝试后仍无法解决，应考虑需求或设计可能的问题，并可能回到前面阶段重新审查或寻求人类帮助。记录所有调试假设和结论以备查证。
+ **代码审查**  
    - **技能/命令：** Request Code Review (`/request-code-review`)。  
    - **触发条件：** 在一个功能分支的所有任务完成、所有测试通过后触发。  
    - **输入/输出：** 输入为当前分支的代码变更；输出为审查报告。**产物：** 代码审查反馈（优点、缺陷、改进建议）。  
    - **注意：** 自动审查会根据规范（如代码风格、安全性、性能）给出分级问题报告。若发现严重问题（Critical），开发需修复后重新审查；一般问题可在合并后继续跟进。修复时按建议修改代码并重新运行测试与审查。
+ **合并/发布**  
    - **技能/命令：** Finish Branch（合并分支，无显式命令）。  
    - **触发条件：** 所有审查问题处理完毕、功能确认无误后执行。  
    - **输入/输出：** 输入为审查完成的分支；输出为合并操作。**产物：** 合并后的主分支代码。  
    - **注意：** 默认先验证所有测试再合并；提供合并/PR、保留或删除选项。合并后应清理Git工作树（例如 `git worktree remove`）以释放空间。合并是正式完成标志，可在此阶段部署或发布版本。
+ **回顾/总结**  
    - **技能：** 无特定Superpowers技能。  
    - **触发条件：** 合并完成后，可选择性触发。  
    - **产物：** 项目总结文档（项目经验、遗留问题列表）。  
    - **注意：** 此阶段建议团队或AI总结项目成果与问题，作为提升未来流程的参考。

# 案例
```shell
用户: /brainstorming 我要给网站添加用户登录功能
Claude (Brainstorming 技能触发):
  好的，在开始之前我需要澄清几个问题：
  1. 登录方式：邮箱+密码、手机号+验证码，还是第三方登录？
  2. 是否需要“记住我”功能？
  3. 登录失败时如何提示用户？
  ...
用户: 我们只需要邮箱+密码登录，需要简单提示错误。
Claude:
  明白了。这里是需求分析结果：用户登录功能需支持邮箱和密码输入，密码加密存储；登录失败时前端显示错误消息；登录成功后返回用户信息。请确认是否继续下一步（/writing-plans）。
用户: 继续
Claude: /writing-plans
Claude (Writing Plans 技能触发):
  根据需求，已为“用户登录”功能生成实施计划：
  - 任务1：在 `src/models/user.js` 创建用户表模型（字段：email, passwordHash）。**先写一个失败测试** 验证新用户注册后能登录。
  - 任务2：在 `src/auth/login.js` 实现登录逻辑（验证密码并生成JWT）。**先写一个失败测试** 确保给定正确凭证可登录。
  - 任务3：在前端 `src/components/LoginForm.vue` 添加登录表单（email/password）。**先写一个失败测试** 检查表单提交调用Login API。
  请确认计划并开始执行。
用户: 确认
Claude:
  计划已生成，开始执行任务...（执行命令 `/execute-plan`）
Claude:
  创建隔离的 Git 工作区... (`git worktree add -b feature/login .claude/branches/feature/login`)
  开始第1个子代理任务：测试驱动开发循环...
  先写测试 `test/user.test.js`：验证新注册用户能登录【红灯】...
  编写实现：`src/models/user.js` 创建模型，新增字段 passwordHash，登录时对比哈希【绿灯】...
  运行测试...全部通过！
  提交更改（`git add` && `git commit`）。
  开始第2个任务...
  写测试 `test/auth.test.js`：使用已注册用户验证登录逻辑【红灯】...
  实现 `src/auth/login.js`：查找用户并验证密码哈希，生成JWT【绿灯】...
  测试通过！
  开始第3个任务...
  写测试 `test/loginForm.test.js`：模拟登录表单提交并检查调用Login API【红灯】...
  实现 `src/components/LoginForm.vue`：添加表单并连接后端接口【绿灯】...
  测试通过！所有任务完成。
Claude:
  所有测试已通过。现在进行代码审查。(/request-code-review)
Claude (Request Code Review 技能触发):
  正在审查任务...
  * 任务1模块：命名规范符合规范，无问题。
  * 任务2模块：发现一个潜在问题：密码哈希未设置盐值，建议增加。
  * 任务3模块：前端提交缺少错误捕捉，建议完善提示逻辑。
  发现1个重要问题，请修复后重审。
用户: 好的，我来修复
Claude:
  问题已修复，测试全部通过。代码审查通过。
Claude:
  准备合并分支（finish-branch）... 合并成功，功能分支关闭。
```

**说明：** 上例中，用户依次执行 `/brainstorming`、`/writing-plans`、确认并 `/execute-plan` 触发编码。AI创建了隔离Git工作区并通过TDD循环完成3个任务。编写的输出包括需求规格、任务清单、测试结果、代码片段和审查报告。`/request-code-review` 触发自动审查并反馈问题。修复后进行合并。每个输出（粗体部分）对应实际文档或提示。所有命令（如 `/execute-plan`, `/request-code-review`）可在Claude Code环境复制使用。

# 技能表
| 阶段 | Superpowers 技能/命令 | 输入/产物 | 注意事项/失败策略 |
| --- | --- | --- | --- |
| 需求澄清 | Brainstorming (`/brainstorming`) | **产物：** 需求规格说明（文本）。   AI问答对话（澄清需求）。 | 提问用户明确边界和用例。若用户回答模糊或未回答，继续提问。确认后才能继续。 |
| 设计/架构 | （包含在Brainstorming） | **产物：** 系统设计概要。 | 评估设计合理性。若设计不合适，重新Brainstorm或需求阶段。 |
| 计划拆分 | Writing Plans (`/writing-plans`) | **产物：** 实施计划文档（任务清单）。 | 按2-5分钟任务拆分。任务过大时需拆分。保持DRY/YAGNI原则。 |
| 隔离开发 | Using Git Worktrees（自动） | **产物：** 新分支及工作区。 | 自动执行 `git worktree` 创建新分支。若失败，可手动创建或继续在主分支（风险增加）。 |
| 实现/编码 | Execute Plans (`/execute-plan`) | **产物：** 功能代码和测试代码；执行日志。 | 严格TDD流程，先写测试后编码。出现未通过测试则停下进入调试。 |
| TDD | Test-Driven (`/test-driven-development`) | **产物：** 测试用例文件、实现代码文件。 | 无先写测试则拒绝生成代码。测试失败时不允许通过，需重写测试或调整实现。 |
| 调试 | Systematic Debugging (`/superpowers:systematic-debugging`) | **产物：** 四阶段调试报告。 | 按根因分析→模式识别→假设→修复步骤执行。三次失败则考虑设计返工或人工干预。 |
| 代码审查 | Request Code Review (`/request-code-review`) | **产物：** 审查反馈报告。 | 自动检查编码规范、安全等问题。关键问题阻塞合并；开发者需修复。 |
| 合并/发布 | Finish Branch（自动） | **产物：** 合并后的主分支代码。 | 先运行所有测试以验证稳定性。提供合并选项（合并、PR、保留）。完成后清理工作树。 |


