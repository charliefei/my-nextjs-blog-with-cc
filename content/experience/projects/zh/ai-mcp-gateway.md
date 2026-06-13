---
type: project
title: AI MCP网关服务组件
description: 本项目是一个基于 MCP 协议标准实现的API网关中间件，旨在便捷AI Agent和企业内部业务接口（HTTP/RPC）之间的连接。该API网关作为核心中间件，通过标准化的 SSE 长连接和 JSON-RPC 2.0 消息协议，实现了 AI 客户端与后端服务的解耦与互通，支持多网关实例路由、apikey鉴权及会话管理，可以使现有业务系统的接口无代码转换到符合MCP协议的MCP Server工具调用，减少了重复造轮子，统一的网关鉴权，也大大提升了MCP能力调用的安全性
technologies:
  - Spring AI
  - SpringBoot
  - MyBatis
  - MySQL
  - Redis
  - MCP Java SDK
  - Spring Webflux
  - JSONRPC
github: https://github.com/charliefei/ai-mcp-gateway
featured: true
order: 3
---

**主要工作**

- **MCP 协议网关设计**：实现 MCP Server 的 initialize、tools/list、tools/call 等 JSON-RPC 消息处理链路，支持 SSE 与 Streamable HTTP 两种传输方式，完成客户端建连、会话保持、消息分发与结果回推
- **动态工具注册与协议解析**：设计网关、工具、HTTP 协议、字段映射等核心表结构，支持从 OpenAPI/Swagger 中解析 requestBody、query/path 参数，自动生成 MCP Tool 的 inputSchema，降低接口接入成本
- **工具调用适配层**：基于 Retrofit + OkHttp 封装通用 HTTP 调用网关，按配置动态构造请求头、GET 参数、POST Body 和路径参数，将大模型工具调用转发到真实业务接口
- **鉴权与限流能力建设**：实现网关级 API Key 认证、有效期校验和基于 Guava RateLimiter 的调用频控，支持按 gatewayId + apiKey 维度进行权限控制和限流缓存
- **DDD 分层与管理后台**：按照 Trigger → Case → Domain → Infrastructure 分层组织业务逻辑，提供网关配置、工具配置、协议导入、认证配置、分页查询和 LLM 调用测试等管理接口，并配套 Nginx 静态管理页面与 Docker 部署脚本