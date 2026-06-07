---
type: project
title: Intelligent Seal IoT Management Platform
description: A large-scale enterprise-grade intelligent seal, smart device management, and business risk control platform built on a SpringCloud distributed microservice architecture. The platform features core business modules including lifecycle management of intelligent seals, sealing machines, and seal cabinets; pre-and-post usage risk control for seal operations; seal document risk alerts and archive management; electronic seal and e-signing integration; and workflow approval.
technologies:
  - SpringBoot
  - SpringCloud
  - MySQL
  - MyBatis
  - Redis
  - RabbitMQ
  - OpenFeign
  - Netty
  - Dameng
  - TongTech
featured: true
order: 4
---

**Key Contributions**

- **Hardware Abstraction Refactoring**: Resolved coupling issues in the drawer control logic for 5 heterogeneous seal cabinet models. Designed an abstract base class with dynamic routing based on Strategy + Template Method patterns, reducing new drawer module development time from 5 days to 1 day and cutting code volume by 30%.
- **File Processing Priority Scheduling**: For cross-business file processing scenarios such as contract format conversion, document cropping, and OCR, developed a multi-level weighted queue (dynamically configurable), reducing average wait time for high-priority tasks by 62%, while preventing low-priority task starvation through a polling mechanism.
- **Similar Document Comparison Algorithm**: Designed a two-stage SimHash + LCS matching strategy to address the 30% false positive rate caused by highly homogeneous contract templates, improving comparison accuracy from 72% to 96% and reducing false alerts by 80%.
- **Multi-Vendor E-Signing Integration**: Abstracted a generic database schema and SPI interface, combined with Factory + Strategy patterns for dynamic vendor loading, enabling seamless switching and extension of different e-signing vendors. Integration lead time was reduced from 10 days to 3 days, requiring only API field mapping and signature authentication implementation.
