---
title: Claude Agent SDK Deep Dive
description: Using Claude Code as a library to build production-grade AI Agents. A comprehensive guide from core concepts to best practices — a thorough understanding of Anthropic's Agent SDK.
date: 2026-06-05
tags: [Agent, Claude Code, AI, Typescript]
category: Agent
author: Charlie Fei
slug: claude-agent-sdk-blog
published: true
---

# Claude Agent SDK Deep Dive

## 1. What is the Claude Agent SDK?

**Claude Agent SDK** is Anthropic's official Agent framework. It exposes the full engine behind Claude Code as a programmable library, allowing you to build AI Agents that can autonomously read files, execute commands, edit code, and search the web — right in your own applications.

Its core positioning can be summarized in one sentence:

> **Claude Code as a Library**

The SDK supports **TypeScript/JavaScript** (Node.js 18+) and **Python** (3.10+):

```bash
# TypeScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install claude-agent-sdk
```

### History

- **September 2025**: First release, originally named "Claude Code SDK"
- **Late 2025**: Renamed to "Claude Agent SDK" to reflect its expanded scope beyond pure coding
- **As of March 2026**: The npm package has shipped 130+ versions with 600+ dependent projects; the Python repository has ~4,800 GitHub Stars
- **Starting June 15, 2026**: SDK and `claude -p` subscription usage will be deducted from a dedicated Agent SDK quota pool

---

## 2. Why You Should Care

### 2.1 The Core Pain Point It Solves

If you've ever built an Agent using the raw Claude API, you're familiar with this pattern:

```python
# Using the raw API: you need to implement the Tool Loop manually
response = client.messages.create(...)
while response.stop_reason == "tool_use":
    result = your_tool_executor(response.tool_use)
    response = client.messages.create(tool_result=result, ...)
```

Each call to the model → check if it needs to use a tool → execute the tool → feed the result back → loop... It's tedious to write, and the complexity grows exponentially as the number of tools increases.

The Agent SDK handles all of this for you:

```python
# Using the Agent SDK: Claude manages the Tool Loop autonomously
async for message in query(prompt="Fix the bug in auth.py"):
    print(message)  # Claude reads files, finds bugs, edits code on its own
```

### 2.2 Built-in Capabilities

The SDK comes with **12+ built-in tools** — no need to implement them yourself:

| Tool | Purpose |
|------|---------|
| `Read` | Read any file in the working directory |
| `Write` | Create new files |
| `Edit` | Precisely edit existing files (string-based replacement) |
| `Bash` | Execute terminal commands, scripts, Git operations |
| `Glob` | Find files by pattern matching (e.g. `src/**/*.ts`) |
| `Grep` | Search file contents with regex |
| `WebSearch` | Search the internet for up-to-date information |
| `WebFetch` | Fetch and parse web page content |
| `AskUserQuestion` | Present multi-choice questions to the user |
| `TaskCreate` / `TaskUpdate` | Task tracking |
| `Agent` | Dispatch sub-agents |
| `Skill` | Invoke custom skills |
| `ToolSearch` | Dynamically discover and load tools on demand |
| `Monitor` | Monitor background scripts and respond to output |

---

## 3. Core Architecture: How the Agent Loop Works

### 3.1 Agent Loop Overview

The `query()` function returns an **async generator** that streams messages. The flow looks like this:

```
User Input Prompt
      ↓
 Claude Evaluates Current State
      ↓
  ┌── Need a tool? ──→ Call tool → Get result → Back to evaluation
  │
  └── Task complete? ──→ Return final result (ResultMessage)
```

### 3.2 Message Types

In your code, you process various message types by polling the `query()` async iterator:

| Message Type | Meaning | Key Fields |
|-------------|---------|------------|
| `SystemMessage` | Session init, context compression, etc. | `subtype`: `"init"` or `"compact_boundary"` |
| `AssistantMessage` | Claude's response (text or tool call) | `message.content`: TextBlock or ToolUseBlock |
| `UserMessage` | User input or tool execution result | `message.content` |
| `ResultMessage` | Final result of the Agent loop | `subtype`, `result`, `total_cost_usd`, `session_id` |

### 3.3 Context Window Management

Each request carries the following context:

- **System Prompt** (fixed overhead, sent with every request)
- **CLAUDE.md files** (loaded at session start, cached by prompt-cache)
- **Tool Definitions** (built-in tool schemas loaded every time; MCP tools are lazily loaded by default)
- **Conversation History** (grows with each turn: prompt, responses, tool inputs/outputs)
- **Skill Descriptions** (only summaries are resident; full content loaded on invocation)

The SDK supports **automatic Compaction**: when the context approaches the window limit, the model automatically compresses conversation history, keeping key information and discarding redundant details. You can customize the compaction strategy via the `PreCompact` hook.

### 3.4 Controlling Loop Behavior

```typescript
const options = {
  maxTurns: 30,          // Maximum tool-use rounds (prevents runaway loops)
  maxBudgetUsd: 5.0,     // Maximum budget (USD)
  effort: "high",        // Reasoning depth: low/medium/high/xhigh/max
  model: "claude-opus-4-7", // Model selection
};
```

---

## 4. Quick Start: Build Your First Agent from Scratch

### 4.1 Environment Setup

```bash
mkdir my-first-agent && cd my-first-agent
npm init -y
npm install @anthropic-ai/claude-agent-sdk
npm install -D typescript @types/node tsx
```

Set your API Key:

```bash
export ANTHROPIC_API_KEY=your-api-key
```

> The SDK also supports cloud service authentication like Bedrock, Vertex AI, and Azure AI Foundry — switch by setting environment variables (e.g., `CLAUDE_CODE_USE_BEDROCK=1`).

### 4.2 Your First Agent: List Directory Files

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
          console.log(block.text); // Claude's text output
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

Run:

```bash
npx tsx agent.ts
```

### 4.3 Building a Code Review Agent

Let's build a practical Agent that automatically reviews code for bugs, security vulnerabilities, and performance issues:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

async function reviewCode(directory: string) {
  console.log(`\n🔍 Starting review: ${directory}\n`);

  for await (const message of query({
    prompt: `Review the code in ${directory} for:
1. Bugs and potential runtime errors
2. Security vulnerabilities
3. Performance issues
4. Code quality improvement suggestions
Please clearly indicate file names and line numbers.`,
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
          console.log(`\n📁 Using tool: ${block.name}...`);
        }
      }
    }

    if (message.type === "result") {
      if (message.subtype === "success") {
        console.log(`\n✅ Review complete! Cost: $${message.total_cost_usd.toFixed(4)}`);
      } else {
        console.log(`\n❌ Review failed: ${message.subtype}`);
      }
    }
  }
}

reviewCode(process.argv[2] || ".");
```

---

## 5. Core Concepts in Depth

### 5.1 Permission System

The permission system is the security foundation of the Agent SDK. You control what the Agent can do through `permissionMode` and `allowedTools`.

**Six Permission Modes:**

| Mode | Behavior | Use Case |
|------|----------|----------|
| `"default"` | Tools not in the allow list trigger a callback; denied if no callback | Custom approval workflows |
| `"acceptEdits"` | Auto-approve file edits and common filesystem commands | Trusted development workflows |
| `"plan"` | Read-only mode. Agent explores code but never modifies files | Design and analysis |
| `"dontAsk"` | Never prompts. Only tools in the allow list can run | Locked-down headless Agents |
| `"auto"` (TS only) | Model classifier decides whether to approve each tool call | Automated Agents with safety guardrails |
| `"bypassPermissions"` | Run all allowed tools without asking | Sandbox CI, fully trusted environments |

**Custom Permission Handler `canUseTool`** (fine-grained control):

```typescript
options: {
  canUseTool: async (toolName, input) => {
    // Allow all read operations
    if (["Read", "Glob", "Grep"].includes(toolName)) {
      return { behavior: "allow", updatedInput: input };
    }
    // Block writing to .env files
    if (toolName === "Write" && input.file_path?.includes(".env")) {
      return { behavior: "deny", message: "Cannot modify .env files" };
    }
    // Extra validation for Bash commands
    if (toolName === "Bash") {
      const dangerous = ["rm -rf", "sudo", "chmod 777"];
      if (dangerous.some(cmd => input.command?.includes(cmd))) {
        return { behavior: "deny", message: "Dangerous command blocked" };
      }
    }
    return { behavior: "allow", updatedInput: input };
  }
}
```

### 5.2 Session Management

A Session is the complete conversation history from Agent start to finish. The SDK automatically persists conversations to disk, allowing you to restore context at any time.

**Three Session Modes: Continue, Resume, Fork**

```
Continue → Automatically finds the most recent session in the current directory — no need to manually track IDs
Resume   → Restore a specific session by providing its Session ID
Fork     → Fork a new branch from an existing session — the original session remains unchanged
```

**Capturing Session ID and Resuming:**

```typescript
let sessionId: string | undefined;

// First query
for await (const message of query({
  prompt: "Analyze the authentication module's code",
  options: { allowedTools: ["Read", "Glob", "Grep"] },
})) {
  if (message.type === "system" && message.subtype === "init") {
    sessionId = message.session_id; // Capture the ID
  }
}

// Resume the session later — Claude remembers all previously read files and analysis
for await (const message of query({
  prompt: "Now implement the refactoring you suggested",
  options: {
    resume: sessionId, // Restore context
    allowedTools: ["Read", "Edit", "Write", "Glob", "Grep"],
  },
})) {
  // ...
}
```

**Forking a Session** (exploring different approaches):

```typescript
// Fork from sessionId
for await (const message of query({
  prompt: "Rewrite the auth module using OAuth2 instead of JWT",
  options: { resume: sessionId, forkSession: true },
})) {
  // ...
}
// The original sessionId is unaffected — you can continue down the JWT path
```

**Python side** offers a more elegant `ClaudeSDKClient` that manages Sessions automatically:

```python
async with ClaudeSDKClient(options=options) as client:
    await client.query("Analyze the auth module")
    async for msg in client.receive_response():
        print(msg)

    # The second query automatically continues the previous session
    await client.query("Refactor it to use JWT")
    async for msg in client.receive_response():
        print(msg)
```

### 5.3 Hooks System

Hooks let you inject custom logic at key points in the Agent lifecycle — validation, logging, blocking, transformation.

**Available Hook Events:**

| Hook | Trigger | Common Use |
|------|---------|------------|
| `PreToolUse` | Before tool execution | Validate input, block dangerous commands |
| `PostToolUse` | After tool returns result | Audit output, trigger side effects |
| `UserPromptSubmit` | When user submits a prompt | Inject additional context |
| `Stop` | When Agent completes | Validate results, persist session state |
| `SubagentStart` / `SubagentStop` | Sub-agent starts/completes | Track parallel tasks |
| `PreCompact` | Before context compression | Archive full conversation records |

**Real-world Example: Audit Logging + Dangerous Command Blocking**

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
            permissionDecisionReason: "Dangerous command blocked",
          },
        };
      }
    }
  }
  return {};
};

for await (const message of query({
  prompt: "Clean up temporary files",
  options: {
    model: "opus",
    allowedTools: ["Bash", "Glob"],
    maxTurns: 50,
    hooks: {
      PreToolUse: [
        { hooks: [auditLogger] },                    // Log all tools
        { matcher: "Bash", hooks: [blockDangerousCommands] }, // Intercept only Bash
      ],
    },
  },
})) {
  // Handle messages...
}
```

### 5.4 Subagents

For complex tasks, you can break the work down into specialized sub-agents that run in parallel. The main Agent dispatches sub-agents using the `Task` tool.

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Perform a comprehensive codebase review — use security-reviewer to check for security issues, and test-analyzer to analyze test coverage",
  options: {
    model: "opus",
    allowedTools: ["Read", "Glob", "Grep", "Task"], // Task is the sub-agent dispatch tool
    permissionMode: "bypassPermissions",
    maxTurns: 250,
    agents: {
      "security-reviewer": {
        description: "Security vulnerability detection expert",
        prompt: `You are a security expert specializing in:
- SQL injection, XSS, CSRF vulnerabilities
- Exposed credentials and secrets
- Insecure authentication/authorization implementations`,
        tools: ["Read", "Grep", "Glob"],
        model: "sonnet",  // Sub-agents can use different models
      },
      "test-analyzer": {
        description: "Test coverage and quality analysis",
        prompt: `You are a testing expert analyzing test coverage, edge cases, and test quality.`,
        tools: ["Read", "Grep", "Glob"],
        model: "haiku",  // Simple tasks use faster, cheaper models
      },
    },
  },
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);
      } else if ("name" in block && block.name === "Task") {
        console.log(`\n🤖 Delegating to sub-agent: ${(block.input as any).subagent_type}`);
      }
    }
  }
}
```

**Sub-agent Model Selection Strategy:** Use Opus/Sonnet for complex tasks, Haiku for simple analysis — effectively balancing cost and latency.

### 5.5 Custom Tools and MCP (Model Context Protocol)

Built-in tools cover filesystem, shell, web, and other common operations. But in real business scenarios, you'll often need to access your own APIs, databases, or services. The SDK provides a clean, in-process custom tool solution through **MCP (Model Context Protocol)**.

**Defining Custom Tools with `createSdkMcpServer`:**

```typescript
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const customServer = createSdkMcpServer({
  name: "my-tools",
  version: "1.0.0",
  tools: [
    tool(
      "get_weather",
      "Get the current temperature at specified coordinates",
      {
        latitude: z.number().describe("Latitude"),
        longitude: z.number().describe("Longitude"),
      },
      async (args) => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${args.latitude}&longitude=${args.longitude}&current=temperature_2m`
        );
        const data = await response.json();
        return {
          content: [{ type: "text", text: `Temperature: ${data.current.temperature_2m}°C` }],
        };
      }
    ),
  ],
});

// Using custom tools in a query
for await (const message of query({
  prompt: async function* () {
    yield { type: "user", message: { role: "user", content: "What's the weather in Paris right now?" } };
  },
  options: {
    mcpServers: { "my-tools": customServer },
    allowedTools: ["mcp__my-tools__get_weather"],
  },
})) {
  if (message.type === "result") console.log(message.result);
}
```

**Tool Naming Convention:** MCP tools are fully named as `mcp__<server-name>__<tool-name>`. For example, `mcp__my-tools__get_weather`. You can precisely control which custom tools Claude can invoke via `allowedTools`.

### 5.6 Structured Output

If you need the Agent to return results in a specific data structure (for API responses, database storage, etc.), the SDK supports JSON Schema output:

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
  prompt: "Review this codebase",
  options: {
    outputFormat: { type: "json_schema", schema: reviewSchema },
    allowedTools: ["Read", "Glob", "Grep"],
  },
})) {
  if (message.type === "result" && message.subtype === "success") {
    const review = message.structured_output; // Structured object matching the schema
    console.log(`Score: ${review.overallScore}/100`);
    console.log(`Summary: ${review.summary}`);
  }
}
```

### 5.7 File Checkpointing

When `enableFileCheckpointing` is on, the SDK tracks every file modification made by the Agent, supporting **one-click rollback** to any historical state. This is particularly valuable in automated refactoring or code generation scenarios — if something goes wrong, you can instantly revert.

### 5.8 Cost Tracking

Every `ResultMessage` includes detailed cost information:

```typescript
if (message.type === "result" && message.subtype === "success") {
  console.log("Total cost:", message.total_cost_usd);
  console.log("Token usage:", message.usage);
  // Breakdown by model (especially useful when using sub-agents)
  for (const [model, usage] of Object.entries(message.modelUsage)) {
    console.log(`${model}: $${usage.costUSD.toFixed(4)}`);
  }
}
```

---

## 6. Best Practices

### 6.1 Principle of Least Privilege

```typescript
// ❌ Bad practice: unrestricted access to all tools
options: {
  allowedTools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "WebSearch", "WebFetch"],
  permissionMode: "bypassPermissions",
}

// ✅ Good practice: only the necessary tools
options: {
  allowedTools: ["Read", "Glob", "Grep"],  // Read-only review
  permissionMode: "acceptEdits",           // Upgrade permissions when edits are needed
}
```

### 6.2 Controlling Costs and Scope

```typescript
// Always set reasonable guardrails
options: {
  maxTurns: 30,          // Prevent runaway loops
  maxBudgetUsd: 3.0,     // Budget cap (USD)
  effort: "high",        // Use high/xhigh for critical tasks
}
```

For simple tasks (listing files, searching content), use `effort: "low"` to save tokens and reduce latency.

### 6.3 Using Sub-agents Effectively

```typescript
// ✅ Assign specialized, well-scoped tasks to sub-agents
agents: {
  "security-reviewer": {
    description: "Security review expert",
    prompt: "...",
    tools: ["Read", "Grep", "Glob"],  // Limit sub-agent capabilities
    model: "sonnet",                    // Use appropriate models to control cost
  },
}
```

Rule of thumb:
- **Heavy reasoning tasks** (architecture analysis, bug localization) → Use Opus
- **Medium complexity** (code review, refactoring) → Use Sonnet
- **Lightweight tasks** (test analysis, file statistics) → Use Haiku

### 6.4 Session Design Patterns

```
One query() call = one complete task unit (which may contain multiple turns inside)
Don't split one task across multiple query() calls
Use Session to maintain context across query() calls
Use Fork for exploring different approaches
```

```typescript
// ✅ Good practice: complete one whole task in a single query
for await (const message of query({
  prompt: "Analyze and fix all type errors in utils.ts",
  options: { maxTurns: 30, allowedTools: ["Read", "Edit", "Glob"] },
})) { /* ... */ }

// ✅ Good practice: use Session for multi-turn conversations
// First round: analysis
// Second round (resume): make changes based on analysis

// ❌ Bad practice: splitting one task into multiple independent queries
```

### 6.5 Hook-Driven Production Observability

```typescript
// Use hooks to build production-grade auditing and observability
hooks: {
  PreToolUse: [
    { hooks: [auditLogger] },       // Global auditing
    { matcher: "Bash", hooks: [commandValidator] },  // Bash validation
  ],
  PostToolUse: [
    { matcher: "Edit|Write", hooks: [fileChangeNotifier] },  // File change notifications
  ],
  Stop: [
    { hooks: [sessionArchiver] },   // Session archiving
  ],
}
```

### 6.6 MCP Tools > Too Much Custom Logic

When you need more than 2-3 custom tools, consider managing them collectively via an MCP Server. This is more maintainable than scattering `--tools` parameters. MCP also offers the advantages of in-process execution and zero IPC latency.

### 6.7 Sandboxing the Execution Environment

- **Production**: Always run Agents in containers or sandboxes
- **Enable Sandbox**: Use `sandbox: { enabled: true }` option
- **Whitelist Bash Commands Only**: Restrict executable commands via `canUseTool`
- **Configure `allowUnsandboxedCommands` + `canUseTool`** for privilege escalation scenarios

### 6.8 Context Efficiency

```
Use settingSources: ['project'] to control which filesystem configurations are loaded
Use ToolSearch for lazy loading of MCP tool schemas (reduces first-request token consumption)
Use effort: "low" for simple tasks
Use persistSession: false for tasks that don't need full context retention (TS only)
```

---

## 7. Agent SDK vs Other Solutions

### 7.1 Agent SDK vs Client SDK (Raw API)

| Dimension | Agent SDK | Client SDK (Anthropic SDK) |
|-----------|-----------|---------------------------|
| **Tool Loop** | SDK manages automatically | You implement it yourself |
| **Tool Execution** | 12+ built-in tools | You implement each tool yourself |
| **Session Management** | Out of the box | You maintain conversation history |
| **Permission System** | 6 modes + custom callbacks | None — design your own |
| **Context Compression** | Automatic | None — implement your own |
| **Onboarding Effort** | Low | Medium to high |

### 7.2 Agent SDK vs LangGraph / CrewAI / OpenAI Agents SDK

| Dimension | Claude Agent SDK | LangGraph | CrewAI | OpenAI Agents SDK |
|-----------|-----------------|-----------|--------|-------------------|
| **Orchestration Model** | Tool-use chain + sub-agents | Graph state machine | Role-based multi-agent collaboration | Agent-to-Agent Handoff |
| **Model Restriction** | Claude only | Model agnostic | Model agnostic | OpenAI preferred |
| **MCP Integration** | Native in-process support | External plugin layer | External plugin layer | Limited/external |
| **Language Support** | Python + TypeScript | Python + JavaScript | Python | Python |
| **Learning Curve** | Medium | High (graph construction, state schemas) | Medium | Low to medium |
| **Best Fit** | MCP-native development, tool-first Agents | Complex stateful workflows, human-in-the-loop pipelines | Multi-Agent orchestration with defined roles | Agent delegation within the OpenAI ecosystem |

### 7.3 Agent SDK vs Managed Agents

| Dimension | Agent SDK | Managed Agents |
|-----------|-----------|----------------|
| **Runtime** | Your process, your infrastructure | Anthropic-hosted infrastructure |
| **Interface** | Python/TypeScript library | REST API |
| **Agent's Operating Scope** | Files on your infrastructure | One managed sandbox per session |
| **Session State** | JSONL on local filesystem | Anthropic-hosted event logs |
| **Custom Tools** | In-process functions | Claude triggers tool, you execute and return result |
| **Best For** | Local prototyping, Agents that operate directly on filesystem | Production Agents without sandbox/session ops overhead, long-running async sessions |

**Recommended Path:** Start with Agent SDK for local prototyping and development, then migrate to Managed Agents for production deployment.

---

## 8. Use Cases and Selection Guide

### Claude Agent SDK is a good fit if:

- ✅ You're already in the Claude ecosystem (using Claude Code or Claude API)
- ✅ You need Agents to directly operate on the filesystem, execute commands, and edit code
- ✅ You want rapid prototyping without building a Tool Loop from scratch
- ✅ Your architecture relies on the MCP protocol for tool integration
- ✅ Your team uses both TypeScript and Python

### You might consider other solutions if:

- ❌ You need multi-model provider flexibility (the SDK only supports Claude today)
- ❌ You need complex graph-based state machine orchestration (LangGraph is a better fit)
- ❌ You don't need Agents to operate on local files (the Client SDK may be simpler)

---

## 9. Summary

The Claude Agent SDK is the external release of Anthropic's internally battle-tested Agent infrastructure, refined over 6+ months. It packages all of Claude Code's core capabilities — Agent Loop, built-in toolset, permission system, Hooks, sub-agents, MCP integration, session management — into clean Python and TypeScript APIs.

Its core philosophy is **"Batteries Included"**: you don't need to implement tool execution, Tool Loop, context compression, permission validation, error retry, and other foundational capabilities yourself. These are already solved — you only need to focus on defining the Agent's role and behavior.

For teams already in the Claude ecosystem, the Agent SDK is currently the fastest path from idea to production-grade Agent.

---

## References

- [Agent SDK Official Documentation](https://code.claude.com/docs/en/agent-sdk/overview)
- [TypeScript SDK Reference](https://code.claude.com/docs/en/agent-sdk/typescript)
- [Python SDK Reference](https://code.claude.com/docs/en/agent-sdk/python)
- [Agent SDK Demos (GitHub)](https://github.com/anthropics/claude-agent-sdk-demos)
- [TypeScript SDK Source Code](https://github.com/anthropics/claude-agent-sdk-typescript)
- [Python SDK Source Code](https://github.com/anthropics/claude-agent-sdk-python)
- [Anthropic Workshop (YouTube) - Thariq Shihipar](https://www.youtube.com/watch?v=TqC1qOfiVcQ)
- [Building Effective Agents - Anthropic Research Methodology](https://www.anthropic.com/research/building-effective-agents)
- [Nader Dabit Complete Guide](https://gist.github.com/dabit3/93a5afe8171753d0dbfd41c80033171d)

---

*This article is based on the SDK version from June 2026. Please refer to the official documentation for the latest information.*
