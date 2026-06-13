---
type: project
title: AI MCP Gateway Service Component
description: This project is an API gateway middleware built on the MCP protocol standard, designed to bridge the connection between AI Agents and enterprise internal business interfaces (HTTP/RPC). The API gateway serves as a core middleware, leveraging standardized SSE long connections and JSON-RPC 2.0 message protocol to achieve decoupling and interoperability between AI clients and backend services. It supports multi-gateway instance routing, API key authentication, and session management, enabling existing business system interfaces to be converted to MCP-compliant MCP Server tool calls without code changes. This reduces redundant development efforts, and the unified gateway authentication significantly enhances the security of MCP capability invocation.
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

**Key Contributions**

- **MCP Protocol Gateway Design**: Implemented the JSON-RPC message processing pipeline for MCP Server operations including initialize, tools/list, and tools/call. Supports both SSE and Streamable HTTP transport protocols, handling client connection establishment, session maintenance, message distribution, and result pushback.
- **Dynamic Tool Registration & Protocol Parsing**: Designed core database tables for gateways, tools, HTTP protocols, and field mappings. Supports parsing requestBody, query/path parameters from OpenAPI/Swagger specifications, automatically generating MCP Tool inputSchema to reduce integration costs.
- **Tool Invocation Adapter Layer**: Built a generic HTTP invocation gateway based on Retrofit + OkHttp, dynamically constructing request headers, GET parameters, POST Body, and path parameters according to configuration, forwarding LLM tool calls to real business interfaces.
- **Authentication & Rate Limiting**: Implemented gateway-level API Key authentication, validity period validation, and Guava RateLimiter-based invocation frequency control, supporting permission management and rate limiting cache at the gatewayId + apiKey dimension.
- **DDD Layering & Admin Console**: Organized business logic following the Trigger → Case → Domain → Infrastructure layered architecture. Provides management APIs for gateway configuration, tool configuration, protocol import, authentication configuration, paginated queries, and LLM call testing. Includes an Nginx-hosted static admin page and Docker deployment scripts.
