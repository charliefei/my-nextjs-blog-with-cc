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
image: /images/projects/blog.png
featured: true
order: 1
---

**主要工作**

- 基于 JSON-RPC 2.0 规范深度解析 MCP 协议，自主实现了初始化 ( initialize )、工具发现 ( tools/list )、工具调用 ( tools/call ) 等核心消息类型的序列化与反序列化处理，遵循MCP传输层规范，构建了基于HTTP POST+SSE流式响应的异步双向通信通道
- 采用策略模式结合Java枚举分发，封装了可扩展的 MCP 消息处理器，实现了MCP协议不同消息指令的解耦处理。通过数据库动态维护网关与工具的映射关系，支持在不重启网关服务的情况下实时挂载或卸载 AI 工具
- 设计了动态参数映射引擎 ，通过解析数据库中的多层嵌套 HTTP 接口配置，自动生成符合 MCP 标准的 JSONSchema 工具描述，实现了从MCP工具到后端接口的无缝对接，支持 Path/Query/Body/Header 等多位置参数的智能注入与正则替换，无需编写额外代码即可将任意 RESTful 接口转化为 AI 可调用的 Tool 能力
- 设计并实现了基于 Retrofit 的通用 HTTP 网关适配器。通过动态代理和配置化映射，将标准的 MCP 工具调用自动映射为对后端异构服务的 HTTP 调用，实现零代码接入新工具的能力
- 采用责任链模式构建会话管理和消息处理两条链路，在会话管理链路中的建立阶段植入apiKey强校验，在消息处理链路中的工具调用请求时，基于apiKey + gatewayId的维度，集成 Guava RateLimiter 令牌桶进行限流，支持按小时/按次的流量控制，有效防止突发流量对网关和下游http业务接口的冲击