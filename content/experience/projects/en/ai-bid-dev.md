---
type: project
title: Intelligent AI Bidding Platform
description: An intelligent document generation platform built with AgentScope for enterprise bidding scenarios. The system deeply integrates AI large language model capabilities, achieving end-to-end automation from intelligent bid document parsing, automatic outline generation, RAG (Retrieval-Augmented Generation) content writing based on enterprise knowledge bases (qualifications, case studies), to multi-format document (Word/PDF) auto-composition and online editing. The platform aims to solve traditional pain points in bid preparation such as low manual writing efficiency, poor content reusability, and cumbersome format adjustments.
technologies:
  - AgentScope
  - FastAPI
  - AsyncOpenAI
  - DashScope
  - MySQL
  - SSE
  - asyncio
  - rapidfuzz
  - python-docx
featured: true
order: 2
---

**Key Contributions**

- **Asynchronous Concurrent Processing Architecture**: To address the latency issue of LLM calls for large documents, designed a sliding window chunking strategy (15K/1K overlap) with contextual title extraction, using asyncio.Semaphore to control concurrency at 6, achieving parallel chunk extraction with SSE streaming progress push, improving parsing efficiency by 10x+.
- **Intelligent Semantic Deduplication Algorithm**: To resolve duplicate entities from parallel multi-chunk extraction, designed a three-layer progressive strategy (exact name → rapidfuzz fuzzy matching → qwen-turbo semantic judgment), incorporating containment deduplication and scope grouping. Deduplication accuracy improved from 60% to 95%+.
- **Hybrid Retrieval Architecture**: To bridge the semantic gap in historical bid document retrieval, designed a three-stage architecture combining lexical retrieval (LIKE + FTS + bigram), vector retrieval (text-embedding-v3), and LLM re-ranking, with multi-dimensional weighted fusion scoring (content 75% + heading 10% + keyword 5% + metadata 10%), improving Top-5 retrieval hit rate by 30%.
- **Complex DOCX Parsing**: Bid documents contain complex tables, embedded images, and broken references. Designed a multi-stage strategy (anchor table construction → Markdown conversion → text-anchor matching fusion), achieving invalid relationship cleanup and LLM-based dynamic segmentation for deep inference, with table parsing success rate at 98% and image extraction accuracy at 95%+.
- **Robust LLM Invocation**: To address JSON truncation in LLM output, implemented automatic truncation detection with a secondary chunking retry mechanism, introduced json_repair for format error correction, achieving 99%+ invocation stability.
