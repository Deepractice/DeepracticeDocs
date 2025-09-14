---
layer: Practice
type: Index
title: 实践标准
description: Deepractice的最佳实践和执行标准集合
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
purpose: 提供Deepractice各领域的最佳实践指导
scope:
  includes:
    - 内容体系实践标准
    - 开发环境实践标准
    - 各领域执行规范
  excludes:
    - 产品功能文档  # 属于产品层
    - 通用原则      # 属于模式层
    - 通用模式      # 属于模式层
outcome:
  - 能找到所需的实践标准
  - 能理解实践体系结构
  - 能快速定位具体规范
---

# 实践（Practice）

> 实践层定义特定领域的执行标准和最佳实践，来自真实经验的总结和提炼。

## 层级定位

Practice层专注于**特定领域的最佳实践**，这些实践：
- 来自实际项目经验的总结
- 经过验证的执行标准
- 特定于Deepractice的工作方式
- 可直接应用于日常工作

## 📚 内容体系实践

构建和管理Deepractice文档体系的完整实践标准。

### 核心定义

- [内容体系术语表](./content-system/glossary.md) - 核心概念和术语定义

### 基础规范

- [内容定位规范](./content-system/content-positioning-standard.md) - 如何确定文档的层级和类型
- [文件命名规范](./content-system/file-naming-convention.md) - 文档文件命名标准
- [目录索引规范](./content-system/directory-index-standard.md) - 如何编写标准的index.md
- [文档校验规范](./content-system/document-validation-standard.md) - 文档质量评估标准

### 写作规范

按照Diátaxis框架的四种文档类型：

- [Tutorial 撰写标准](./content-system/writing-tutorial-standard.md) - 如何写出引导学习的文档
- [How-to 撰写标准](./content-system/writing-howto-standard.md) - 如何写出解决问题的文档
- [Reference 撰写标准](./content-system/writing-reference-standard.md) - 如何写出易于查询的文档
- [Explanation 撰写标准](./content-system/writing-explanation-standard.md) - 如何写出帮助理解的文档

### 专项规范

- [术语表撰写规范](./content-system/glossary-writing-standard.md) - 如何编写标准化的术语表
- [内容演进规范](./content-system/content-evolution-standard.md) - 文档持续改进的PDCA方法

## 💻 Node.js 开发环境实践

Node.js 生态的开发环境配置和管理最佳实践。

### Monorepo实践

- [Monorepo架构理解](./node-development-environment/monorepo/understanding-monorepo-architecture.md) - 理解Monorepo的核心概念
- [Monorepo初始化指南](./node-development-environment/monorepo/how-to-initialize-monorepo.md) - 如何从零开始创建Monorepo
- [Monorepo配置参考](./node-development-environment/monorepo/monorepo-configuration.md) - 详细的配置项说明
- [Monorepo管理规范](./node-development-environment/monorepo/monorepo-standard.md) - 日常管理和维护标准

## 实践原则

### 价值导向
- **实用性优先**：实践必须可直接应用
- **经验驱动**：基于真实项目的验证
- **持续演进**：随项目发展不断优化

### 质量标准
- **可操作性**：提供具体的执行步骤
- **可验证性**：有明确的成功标准
- **可复现性**：在类似场景下可重复使用

## 导航地图

```
Practice/
├── content-system/                  # 内容体系实践
│   ├── 基础规范/
│   ├── 写作规范/
│   └── 专项规范/
├── node-development-environment/    # Node.js 开发环境实践
│   ├── monorepo/                   # Monorepo专项
│   └── typescript/                 # TypeScript专项
└── [更多领域]/                     # 持续扩展中
```

## 使用指南

1. **查找实践**：通过目录导航找到所需领域
2. **理解定位**：确认实践的适用场景
3. **应用实践**：按照规范执行具体操作
4. **反馈改进**：基于使用经验提出优化建议

## 更多实践标准

以下领域的实践标准正在规划中：
- 代码规范实践
- 测试策略实践
- 部署流程实践
- 团队协作实践

---

*Practice层是Deepractice知识体系的执行层，将原则和模式转化为可操作的标准。*