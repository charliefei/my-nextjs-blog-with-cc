---
title: Claude Agent SDK 深度解析
description: 将 Claude Code 作为库来构建生产级 AI Agent。一份从核心概念到最佳实践的完整指南，彻底理解 Anthropic 的 Agent SDK。
date: 2026-06-05
tags: [Agent, Claude Code, AI, Typescript]
category: Agent
author: Charlie Fei
slug: claude-agent-sdk-blog
published: true
---

# Claude Agent SDK 深度解析

## 一、什么是 Claude Agent SDK？

**Claude Agent SDK** 是 Anthropic 官方出品的 Agent 框架，它把 Claude Code 背后的完整引擎暴露为一个可编程的库，让你在自己的应用中构建能自主读取文件、执行命令、编辑代码、搜索网页的 AI Agent。

它的核心定位可以用一句话概括：

> **Claude Code as a Library —— 将 Claude Code 当做一个库来使用。**

SDK 支持 **TypeScript/JavaScript**（Node.js 18+）和 **Python**（3.10+）两种语言：

```bash
# TypeScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install claude-agent-sdk
```

### 历史沿革

- **2025 年 9 月**：首次发布，当时名为 "Claude Code SDK"
- **2025 年底**：更名为 "Claude Agent SDK"，以反映其已超越纯编码场景的定位
- **截至 2026 年 3 月**：npm 包已发布 130+ 版本，拥有 600+ 依赖项目；Python 仓库约 4,800 GitHub Stars
- **2026 年 6 月 15 日起**：SDK 和 `claude -p` 的订阅计划用量将从独立的 Agent SDK 额度池中扣除

---

## 二、为什么你需要关注它

### 2.1 它解决的核心痛点

如果你曾用原始 Claude API 构建过 Agent，你一定熟悉这个模式：

```python
# 使用原始 API：你需要手动实现 Tool Loop
response = client.messages.create(...)
while response.stop_reason == "tool_use":
    result = your_tool_executor(response.tool_use)
    response = client.messages.create(tool_result=result, ...)
```

每次调用模型 → 检查是否要调用工具 → 执行工具 → 把结果喂回去 → 循环……这个循环写起来繁琐，且随着工具数量增加，复杂性指数级上升。

Agent SDK 直接替你处理了这一切：

```python
# 使用 Agent SDK：Claude 自主管理 Tool Loop
async for message in query(prompt="修复 auth.py 中的 bug"):
    print(message)  # Claude 自己读文件、找 bug、编辑代码
```

### 2.2 开箱即用的能力

SDK 内置了 **12+ 种工具**，你不需要自己实现：

| 工具 | 用途 |
|------|------|
| `Read` | 读取工作目录中的任意文件 |
| `Write` | 创建新文件 |
| `Edit` | 精确编辑已有文件（基于字符串替换） |
| `Bash` | 执行终端命令、脚本、Git 操作 |
| `Glob` | 按模式匹配查找文件（如 `src/**/*.ts`） |
| `Grep` | 用正则搜索文件内容 |
| `WebSearch` | 搜索互联网获取最新信息 |
| `WebFetch` | 抓取并解析网页内容 |
| `AskUserQuestion` | 向用户展示多选问题 |
| `TaskCreate` / `TaskUpdate` | 任务追踪 |
| `Agent` | 派发子代理 |
| `Skill` | 调用自定义技能 |
| `ToolSearch` | 动态发现和按需加载工具 |
| `Monitor` | 监控后台脚本并响应输出 |

---

## 三、核心架构：Agent Loop 是如何工作的

### 3.1 Agent Loop 总览

`query()` 函数返回一个 **异步生成器（async generator）**，以流式方式产出消息。整个流程是这样的：

```
用户输入 Prompt
      ↓
 Claude 评估当前状况
      ↓
  ┌── 需要工具？ ──→ 调用工具 → 获取结果 → 回到评估
  │
  └── 任务完成？ ──→ 返回最终结果（ResultMessage）
```

### 3.2 消息类型

在你的代码中，你通过轮询 `query()` 的异步迭代器来处理各类消息：

| 消息类型 | 含义 | 关键字段 |
|----------|------|----------|
| `SystemMessage` | 会话初始化、上下文压缩等系统事件 | `subtype`: `"init"` 或 `"compact_boundary"` |
| `AssistantMessage` | Claude 的回复内容（文本或工具调用） | `message.content`: TextBlock 或 ToolUseBlock |
| `UserMessage` | 用户输入或工具执行结果 | `message.content` |
| `ResultMessage` | Agent 循环的最终结果 | `subtype`, `result`, `total_cost_usd`, `session_id` |

### 3.3 上下文窗口管理

每次请求会携带的上下文包括：

- **System Prompt**（固定开销，每次请求都带）
- **CLAUDE.md 文件**（会话开始时载入，会被 prompt-cache 缓存）
- **工具定义**（内置工具 schema 每次加载；MCP 工具默认延迟加载）
- **对话历史**（随 turn 数增长：prompt、回复、工具输入/输出）
- **技能描述**（仅摘要常驻；完整内容在调用时加载）

SDK 支持 **自动压缩（Compaction）**：当上下文接近窗口上限时，模型会自动压缩对话历史，保留关键信息并丢弃冗余细节。你可以通过 `PreCompact` hook 自定义压缩策略。

### 3.4 控制循环行为

```typescript
const options = {
  maxTurns: 30,          // 最大 tool-use 轮次（防止失控）
  maxBudgetUsd: 5.0,     // 最大预算（美元）
  effort: "high",        // 推理深度：low/medium/high/xhigh/max
  model: "claude-opus-4-7", // 模型选择
};
```

---

## 四、快速上手：从零构建你的第一个 Agent

### 4.1 环境准备

```bash
mkdir my-first-agent && cd my-first-agent
npm init -y
npm install @anthropic-ai/claude-agent-sdk
npm install -D typescript @types/node tsx
```

设置 API Key：

```bash
export ANTHROPIC_API_KEY=your-api-key
```

> SDK 也支持 Bedrock、Vertex AI、Azure AI Foundry 等云服务认证，通过设置环境变量（如 `CLAUDE_CODE_USE_BEDROCK=1`）来切换。

### 4.2 第一个 Agent：列出目录文件

```typescript
// agent.ts
import { query } from "@anthropic-ai/claude-agent-sdk";

async function main() {
  for await (const message of query({
    prompt: "What files are in this directory?",
    options: {
      model: "opus",
      allowedTools: ["Glob", "Read"],
      maxTurns: 250,
    },
  })) {
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(block.text); // Claude 的文字输出
        }
      }
    }
    if (message.type === "result") {
      console.log("\nDone:", message.subtype);
    }
  }
}

main();
```

运行：

```bash
npx tsx agent.ts
```

### 4.3 构建一个代码审查 Agent

让我们构建一个实用的 Agent，自动审查代码库中的 Bug、安全漏洞和性能问题：

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

async function reviewCode(directory: string) {
  console.log(`\n🔍 开始审查: ${directory}\n`);

  for await (const message of query({
    prompt: `审查 ${directory} 中的代码，检查：
1. Bug 和潜在的运行时错误
2. 安全漏洞
3. 性能问题
4. 代码质量改进建议
请明确指出文件名和行号。`,
    options: {
      model: "opus",
      allowedTools: ["Read", "Glob", "Grep"],
      permissionMode: "bypassPermissions",
      maxTurns: 250,
    },
  })) {
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if ("text" in block) {
          console.log(block.text);
        } else if ("name" in block) {
          console.log(`\n📁 使用工具: ${block.name}...`);
        }
      }
    }

    if (message.type === "result") {
      if (message.subtype === "success") {
        console.log(`\n✅ 审查完成！花费: $${message.total_cost_usd.toFixed(4)}`);
      } else {
        console.log(`\n❌ 审查失败: ${message.subtype}`);
      }
    }
  }
}

reviewCode(process.argv[2] || ".");
```

---

## 五、深入核心概念

### 5.1 权限系统（Permission System）

权限系统是 Agent SDK 的安全基石。你通过 `permissionMode` 和 `allowedTools` 来控制 Agent 能做什么。

**六种权限模式：**

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| `"default"` | 不在允许列表中的工具会触发回调；无回调则拒绝 | 需要自定义审批流的场景 |
| `"acceptEdits"` | 自动批准文件编辑和常用文件系统命令 | 受信任的开发工作流 |
| `"plan"` | 只读模式。Agent 探索代码但不会修改任何文件 | 方案设计和分析 |
| `"dontAsk"` | 从不提示。仅在允许规则中的工具可运行 | 锁定的无头 Agent |
| `"auto"`（仅 TS） | 由模型分类器决定是否批准每个工具调用 | 带安全护栏的自动 Agent |
| `"bypassPermissions"` | 运行所有允许的工具而不询问 | 沙盒 CI、完全信任环境 |

**自定义权限处理器 `canUseTool`**（细粒度控制）：

```typescript
options: {
  canUseTool: async (toolName, input) => {
    // 允许所有读操作
    if (["Read", "Glob", "Grep"].includes(toolName)) {
      return { behavior: "allow", updatedInput: input };
    }
    // 阻止写入 .env 文件
    if (toolName === "Write" && input.file_path?.includes(".env")) {
      return { behavior: "deny", message: "不能修改 .env 文件" };
    }
    // 对 Bash 命令做额外校验
    if (toolName === "Bash") {
      const dangerous = ["rm -rf", "sudo", "chmod 777"];
      if (dangerous.some(cmd => input.command?.includes(cmd))) {
        return { behavior: "deny", message: "危险命令被阻止" };
      }
    }
    return { behavior: "allow", updatedInput: input };
  }
}
```

### 5.2 会话管理（Session Management）

Session 是 Agent 从启动到结束的完整对话历史。SDK 自动将对话写入磁盘，让你可以随时恢复上下文。

**三种回话方式：Continue、Resume、Fork**

```
Continue → 自动找到当前目录最近的一次会话，无需手动追踪 ID
Resume   → 通过指定 Session ID 恢复特定会话
Fork     → 从某个 Session 分叉出一条新分支，原 Session 保持不变
```

**捕获 Session ID 并恢复：**

```typescript
let sessionId: string | undefined;

// 第一次查询
for await (const message of query({
  prompt: "分析认证模块的代码",
  options: { allowedTools: ["Read", "Glob", "Grep"] },
})) {
  if (message.type === "system" && message.subtype === "init") {
    sessionId = message.session_id; // 捕获 ID
  }
}

// 后续恢复会话——Claude 记得之前读过的所有文件和做出的分析
for await (const message of query({
  prompt: "现在把你建议的重构方案实现出来",
  options: {
    resume: sessionId, // 恢复上下文
    allowedTools: ["Read", "Edit", "Write", "Glob", "Grep"],
  },
})) {
  // ...
}
```

**Fork 会话（分支探索不同方案）：**

```typescript
// 从 sessionId 分叉
for await (const message of query({
  prompt: "不用 JWT，改用 OAuth2 方案重写认证模块",
  options: { resume: sessionId, forkSession: true },
})) {
  // ...
}
// 原 sessionId 不受影响，可以继续走 JWT 路线
```

**Python 侧**有更优雅的 `ClaudeSDKClient`，自动管理 Session：

```python
async with ClaudeSDKClient(options=options) as client:
    await client.query("分析认证模块")
    async for msg in client.receive_response():
        print(msg)

    # 第二个 query 自动接着上一个会话
    await client.query("重构它使用 JWT")
    async for msg in client.receive_response():
        print(msg)
```

### 5.3 Hooks 钩子系统

Hooks 让你在 Agent 生命周期的关键节点注入自定义逻辑——验证、日志、阻止、转换。

**可用的 Hook 事件：**

| Hook | 触发时机 | 常见用途 |
|------|----------|----------|
| `PreToolUse` | 工具执行前 | 校验输入、阻止危险命令 |
| `PostToolUse` | 工具返回结果后 | 审计输出、触发副作用 |
| `UserPromptSubmit` | 用户发送 prompt 时 | 注入额外上下文 |
| `Stop` | Agent 完成时 | 验证结果、持久化会话状态 |
| `SubagentStart` / `SubagentStop` | 子代理启动/完成 | 追踪并行任务 |
| `PreCompact` | 上下文压缩前 | 存档完整对话记录 |

**实际案例：审计日志 + 危险命令拦截**

```typescript
import { query, HookCallback, PreToolUseHookInput } from "@anthropic-ai/claude-agent-sdk";

const auditLogger: HookCallback = async (input, toolUseId, { signal }) => {
  if (input.hook_event_name === "PreToolUse") {
    const preInput = input as PreToolUseHookInput;
    console.log(`[AUDIT] ${new Date().toISOString()} - ${preInput.tool_name}`);
  }
  return {};
};

const blockDangerousCommands: HookCallback = async (input, toolUseId, { signal }) => {
  if (input.hook_event_name === "PreToolUse") {
    const preInput = input as PreToolUseHookInput;
    if (preInput.tool_name === "Bash") {
      const command = (preInput.tool_input as any).command || "";
      if (command.includes("rm -rf") || command.includes("sudo")) {
        return {
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason: "危险命令被阻止",
          },
        };
      }
    }
  }
  return {};
};

for await (const message of query({
  prompt: "清理临时文件",
  options: {
    model: "opus",
    allowedTools: ["Bash", "Glob"],
    maxTurns: 50,
    hooks: {
      PreToolUse: [
        { hooks: [auditLogger] },                    // 所有工具都打日志
        { matcher: "Bash", hooks: [blockDangerousCommands] }, // 仅 Bash 拦截
      ],
    },
  },
})) {
  // 处理消息...
}
```

### 5.4 子代理（Subagents）

对于复杂任务，可以把工作拆解给专业化的子代理并行处理。主 Agent 通过 `Task` 工具调度子代理。

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "对代码库进行全面审查，使用 security-reviewer 检查安全问题，用 test-analyzer 分析测试覆盖",
  options: {
    model: "opus",
    allowedTools: ["Read", "Glob", "Grep", "Task"], // Task 是调度子代理的工具
    permissionMode: "bypassPermissions",
    maxTurns: 250,
    agents: {
      "security-reviewer": {
        description: "安全漏洞检测专家",
        prompt: `你是安全专家，专注于：
- SQL 注入、XSS、CSRF 漏洞
- 暴露的凭证和密钥
- 不安全的认证/授权实现`,
        tools: ["Read", "Grep", "Glob"],
        model: "sonnet",  // 子代理可以用不同的模型
      },
      "test-analyzer": {
        description: "测试覆盖率和质量分析",
        prompt: `你是测试专家，分析测试覆盖、边界情况和测试质量。`,
        tools: ["Read", "Grep", "Glob"],
        model: "haiku",  // 简单任务用更快便宜的模型
      },
    },
  },
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);
      } else if ("name" in block && block.name === "Task") {
        console.log(`\n🤖 委托给子代理: ${(block.input as any).subagent_type}`);
      }
    }
  }
}
```

**子代理模型选择策略**：复杂任务用 Opus/Sonnet，简单分析用 Haiku——有效控制成本和延迟。

### 5.5 自定义工具与 MCP（Model Context Protocol）

内置工具覆盖了文件系统、Shell、Web 等常见操作。但真实业务中，你总需要访问自己的 API、数据库或服务。SDK 通过 **MCP（Model Context Protocol）** 提供了简洁的进程内自定义工具方案。

**使用 `createSdkMcpServer` 定义自定义工具：**

```typescript
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const customServer = createSdkMcpServer({
  name: "my-tools",
  version: "1.0.0",
  tools: [
    tool(
      "get_weather",
      "获取指定坐标的当前温度",
      {
        latitude: z.number().describe("纬度"),
        longitude: z.number().describe("经度"),
      },
      async (args) => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current=temperature_2m`
        );
        const data = await response.json();
        return {
          content: [{ type: "text", text: `温度: ${data.current.temperature_2m}°C` }],
        };
      }
    ),
  ],
});

// 在查询中使用自定义工具
for await (const message of query({
  prompt: async function* () {
    yield { type: "user", message: { role: "user", content: "巴黎现在的天气怎么样？" } };
  },
  options: {
    mcpServers: { "my-tools": customServer },
    allowedTools: ["mcp__my-tools__get_weather"],
  },
})) {
  if (message.type === "result") console.log(message.result);
}
```

**Tool 命名规则**：MCP 工具的完整名称是 `mcp__<server-name>__<tool-name>`。如 `mcp__my-tools__get_weather`。你可以通过 `allowedTools` 精确控制 Claude 能调用哪些自定义工具。

### 5.6 结构化输出（Structured Output）

如果你需要 Agent 以特定数据结构返回结果（用于 API 返回、入库等），SDK 支持 JSON Schema 输出：

```typescript
const reviewSchema = {
  type: "object",
  properties: {
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
          category: { type: "string", enum: ["bug", "security", "performance", "style"] },
          file: { type: "string" },
          line: { type: "number" },
          description: { type: "string" },
          suggestion: { type: "string" },
        },
        required: ["severity", "category", "file", "description"],
      },
    },
    summary: { type: "string" },
    overallScore: { type: "number" },
  },
  required: ["issues", "summary", "overallScore"],
};

for await (const message of query({
  prompt: "审查这个代码库",
  options: {
    outputFormat: { type: "json_schema", schema: reviewSchema },
    allowedTools: ["Read", "Glob", "Grep"],
  },
})) {
  if (message.type === "result" && message.subtype === "success") {
    const review = message.structured_output; // 符合 schema 的结构化对象
    console.log(`评分: ${review.overallScore}/100`);
    console.log(`摘要: ${review.summary}`);
  }
}
```

### 5.7 文件检查点（File Checkpointing）

启用 `enableFileCheckpointing` 后，SDK 会追踪 Agent 所做的所有文件修改，支持**一键回滚**到任意历史状态。这在自动化重构或代码生成场景中尤其有用——出了问题可以立刻回退。

### 5.8 成本追踪（Cost Tracking）

每个 `ResultMessage` 都包含详细的成本信息：

```typescript
if (message.type === "result" && message.subtype === "success") {
  console.log("总花费:", message.total_cost_usd);
  console.log("Token 用量:", message.usage);
  // 按模型细分（使用子代理时尤其有用）
  for (const [model, usage] of Object.entries(message.modelUsage)) {
    console.log(`${model}: $${usage.costUSD.toFixed(4)}`);
  }
}
```

---

## 六、最佳实践

### 6.1 权限最小化原则

```typescript
// ❌ 坏实践：不加限制地放开所有工具
options: {
  allowedTools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "WebSearch", "WebFetch"],
  permissionMode: "bypassPermissions",
}

// ✅ 好实践：只给必要的工具
options: {
  allowedTools: ["Read", "Glob", "Grep"],  // 只读审查
  permissionMode: "acceptEdits",           // 需要编辑时再升级
}
```

### 6.2 控制成本和运行范围

```typescript
// 始终设置合理的安全网
options: {
  maxTurns: 30,          // 防止失控循环
  maxBudgetUsd: 3.0,     // 预算上限（美元）
  effort: "high",        // 关键任务用 high/xhigh
}
```

对于简单任务（列出文件、查找内容），用 `effort: "low"` 节省 Token 和延迟。

### 6.3 子代理的合理使用

```typescript
// ✅ 给子代理分配专业的、边界清晰的任务
agents: {
  "security-reviewer": {
    description: "安全审查专家",
    prompt: "...",
    tools: ["Read", "Grep", "Glob"],  // 限制子代理的能力范围
    model: "sonnet",                    // 用合适的模型控制成本
  },
}
```

经验法则：
- **重度推理任务**（架构分析、Bug 定位）→ 用 Opus
- **中等复杂度**（代码审查、重构）→ 用 Sonnet
- **轻量任务**（测试分析、文件统计）→ 用 Haiku

### 6.4 会话设计模式

```
一个 query() 调用 = 一个完整的任务单元（内部可有多个 turn）
不要把一个 task 拆成多个 query() 调用
用 Session 管理跨 query() 的上下文
用 Fork 做方案探索
```

```typescript
// ✅ 好实践：一次 query 完成一个完整任务
for await (const message of query({
  prompt: "分析并修复 utils.ts 中的所有类型错误",
  options: { maxTurns: 30, allowedTools: ["Read", "Edit", "Glob"] },
})) { /* ... */ }

// ✅ 好实践：用 Session 做跨轮对话
// 第一轮：分析
// 第二轮（resume）：根据分析结果做修改

// ❌ 坏实践：把一次任务拆成多个独立 query
```

### 6.5 Hook 驱动的生产可观测性

```typescript
// 利用 hooks 构建生产级的审计和可观测性
hooks: {
  PreToolUse: [
    { hooks: [auditLogger] },       // 全局审计
    { matcher: "Bash", hooks: [commandValidator] },  // Bash 校验
  ],
  PostToolUse: [
    { matcher: "Edit|Write", hooks: [fileChangeNotifier] },  // 文件变更通知
  ],
  Stop: [
    { hooks: [sessionArchiver] },   // 会话归档
  ],
}
```

### 6.6 MCP 工具 > 过多自定义逻辑

当你需要超过 2-3 个自定义工具时，考虑用 MCP Server 统一管理它们，比零散的 `--tools` 参数更易维护。MCP 还提供了进程内执行和零 IPC 延迟的优势。

### 6.7 执行环境的沙盒化

- **生产环境**：始终在容器或沙盒中运行 Agent
- **启用 Sandbox**：使用 `sandbox: { enabled: true }` 选项
- **仅白名单 Bash 命令**：通过 `canUseTool` 限制可执行的命令
- **配置 `allowUnsandboxedCommands` + `canUseTool`** 处理需要提权的情况

### 6.8 上下文效率

```
用 settingSources: ['project'] 控制加载的文件系统配置
用 ToolSearch 延迟加载 MCP 工具 schema（减少首请求 Token 消耗）
用 effort: "low" 处理简单任务
对不需要保留完整上下文的任务，用 persistSession: false（仅 TS）
```

---

## 七、Agent SDK vs 其他方案

### 7.1 Agent SDK vs Client SDK（原始 API）

| 维度 | Agent SDK | Client SDK（anthropic SDK） |
|------|-----------|---------------------------|
| **Tool Loop** | SDK 自动管理 | 你需要自己实现 |
| **工具执行** | 内置 12+ 种工具 | 你需要自己实现每一个工具 |
| **Session 管理** | 开箱即用 | 自己维护对话历史 |
| **权限系统** | 6 种模式 + 自定义回调 | 无，需要自己设计 |
| **上下文压缩** | 自动 | 无，需要自己实现 |
| **上手门槛** | 低 | 中高 |

### 7.2 Agent SDK vs LangGraph / CrewAI / OpenAI Agents SDK

| 维度 | Claude Agent SDK | LangGraph | CrewAI | OpenAI Agents SDK |
|------|-----------------|-----------|--------|-------------------|
| **编排模型** | Tool-use 链 + 子代理 | 图状态机 | 角色化多智能体协作 | Agent 间 Handoff |
| **模型限制** | Claude only | 模型无关 | 模型无关 | OpenAI 优先 |
| **MCP 集成** | 原生进程内支持 | 外部插件层 | 外部插件层 | 有限/外部 |
| **语言支持** | Python + TypeScript | Python + JavaScript | Python | Python |
| **学习曲线** | 中等 | 高（图构建、状态 schema） | 中等 | 低到中 |
| **最佳场景** | MCP 原生开发、工具优先 Agent | 复杂有状态工作流、人机协作流水线 | 明确角色的多 Agent 编排 | OpenAI 生态内的 Agent 代理 |

### 7.3 Agent SDK vs Managed Agents

| 维度 | Agent SDK | Managed Agents |
|------|-----------|----------------|
| **运行位置** | 你的进程、你的基础设施 | Anthropic 托管基础设施 |
| **接口** | Python/TypeScript 库 | REST API |
| **Agent 操作对象** | 你基础设施上的文件 | 每次会话一个托管沙盒 |
| **会话状态** | 本地文件系统的 JSONL | Anthropic 托管的事件日志 |
| **自定义工具** | 进程内函数 | Claude 触发工具，你执行并返回结果 |
| **最佳用途** | 本地原型、直接操作文件系统的 Agent | 无需运维沙盒/会话的生产 Agent，长时间异步会话 |

**推荐路径**：先用 Agent SDK 本地原型开发，然后迁移至 Managed Agents 上线生产。

---

## 八、适用场景与选型建议

### 你适合用 Claude Agent SDK，如果：

- ✅ 你已经在 Claude 生态中（用 Claude Code 或 Claude API）
- ✅ 你需要 Agent 直接操作文件系统、执行命令、编辑代码
- ✅ 你想快速原型开发，不想从零搭建 Tool Loop
- ✅ 你的架构依赖 MCP 协议做工具集成
- ✅ 你的团队同时使用 TypeScript 和 Python

### 你可能需要考虑其他方案，如果：

- ❌ 你需要多模型供应商的灵活性（今天 SDK 只支持 Claude）
- ❌ 你需要复杂的图状态工作流编排（LangGraph 更合适）
- ❌ 你不需要 Agent 操作本地文件（直接用 Client SDK 可能更简单）

---

## 九、总结

Claude Agent SDK 是 Anthropic 内部打磨了 6 个月以上的 Agent 基础设施的对外版本。它打包了 Claude Code 的所有核心能力——Agent Loop、内置工具集、权限系统、Hooks、子代理、MCP 集成、会话管理——暴露为简洁的 Python 和 TypeScript API。

它的核心理念是 **"Batteries Included"**：你不需要自己去实现工具执行、Tool Loop、上下文压缩、权限校验、错误重试等基础能力。这些已经被解决好了，你只需要专注于定义 Agent 的角色和行为。

对于已经在 Claude 生态中的团队来说，Agent SDK 是目前最快的从想法到生产级 Agent 的路径。

---

## 参考资源

- [Agent SDK 官方文档](https://code.claude.com/docs/en/agent-sdk/overview)
- [TypeScript SDK 参考](https://code.claude.com/docs/en/agent-sdk/typescript)
- [Python SDK 参考](https://code.claude.com/docs/en/agent-sdk/python)
- [Agent SDK Demos (GitHub)](https://github.com/anthropics/claude-agent-sdk-demos)
- [TypeScript SDK 源码](https://github.com/anthropics/claude-agent-sdk-typescript)
- [Python SDK 源码](https://github.com/anthropics/claude-agent-sdk-python)
- [Anthropic Workshop (YouTube) - Thariq Shihipar](https://www.youtube.com/watch?v=TqC1qOfiVcQ)
- [Building Effective Agents - Anthropic 研究方法论](https://www.anthropic.com/research/building-effective-agents)
- [Nader Dabit 完整指南](https://gist.github.com/dabit3/93a5afe8171753d0dbfd41c80033171d)

---

*本文基于 2026 年 6 月的 SDK 版本撰写。请以官方文档为准获取最新信息。*
