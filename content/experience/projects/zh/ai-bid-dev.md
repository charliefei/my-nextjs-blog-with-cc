---
type: project
title: 智能 AI 招投标平台
description: 基于 AgentScope 构建的面向企业招投标场景的智能文档生成平台。系统深度集成 AI 大模型能力，实现了从招标文件智能解析、标书大纲自动生成、基于企业知识库（资质、案例）的 RAG（检索增强生成）内容撰写，到最终多格式文档（Word/PDF）自动合成与在线编辑的全流程自动化，旨在解决传统投标过程中人工编写效率低、内容复用难、格式调整繁琐等痛点
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

**主要工作**

- **异步并发处理架构**：针对大文档LLM调用耗时问题，设计滑动窗口分块（15K/1K重叠）+上下文标题提取策略，使用asyncio.Semaphore控制并发度6，实现分块并行抽取，配合SSE流式进度推送，解析效率提升10倍+。
- **智能语义去重算法**：多chunk并行抽取后存在重复实体问题，设计三层渐进式策略（严格名称→rapidfuzz模糊匹配→qwen-turbo语义判定），引入包含关系去重和scope分组机制，去重准确率从60%提升至95%+。
- **混合检索架构**：历史标书检索存在语义鸿沟，设计词汇检索（LIKE+FTS+双gram）+向量检索（text-embedding-v3）+LLM精排三阶段架构，多维度加权融合分数(content75%+heading10%+keyword5%+metadata10%)，检索Top-5命中率提升30%。
- **复杂DOCX解析**：招标文档含复杂表格、嵌入图片、损坏引用，设计多阶段策略（锚点表构建→Markdown转换→文字锚点匹配融合），实现无效关系清洗和LLM动态切分深度推断，表格解析成功率98%，图片提取准确率95%+。
- **鲁棒LLM调用**：输出JSON截断问题，实现截断型自动检测+二次切分重试机制，引入json_repair修复格式错误，调用稳定性99%+。