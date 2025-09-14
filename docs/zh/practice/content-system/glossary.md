---
layer: Practice
type: Reference
title: 内容体系术语表
category: content-system
status: published
version: 1.0.0
date: 2025-01-13
author: Sean Jiang & Claude
tags:
  - 术语表
  - 内容体系
  - Reference
purpose: 定义内容体系的核心概念和术语
scope:
  includes:
    - 4P模式相关术语
    - Diátaxis框架术语
    - 文档定位术语
  excludes:
    - 技术实现术语: → /practice/technical-glossary.md
    - 业务领域术语: → 各领域术语表
outcome:
  - 能准确理解体系核心概念
  - 能消除概念歧义
  - 能正确使用专业术语
---

# 内容体系术语表

## 概述

Deepractice内容体系的核心概念定义，帮助理解和使用我们的文档架构。

## 核心架构术语

### Deepractice 4P 内容分层模式
**定义**：Deepractice内容组织的纵向结构，从抽象到具体的四层递进体系
**包含**：Pattern、Protocol、Practice、Products四个层级
**作用**：建立从理念到实现的完整递进关系，对应人类理解事物的自然过程
**参见**：[理解 4P 内容分层模式](/zh/patterns/content-system/deepractice-4p-model)

### Pattern（模式）
**定义**：4P模式的第一层，定义核心理念和设计哲学
**关注**：为什么这样想？
**内容**：思想、理念、哲学、思维模式
**示例**：ISSUE协作范式、矛盾驱动设计

### Protocol（协议）
**定义**：4P模式的第二层，定义交互规则和通信约定
**关注**：如何沟通协作？
**内容**：接口定义、交互协议、通信规则
**示例**：DPML协议、MCP协议

### Practice（实践）
**定义**：4P模式的第三层，定义执行标准和最佳实践
**关注**：如何具体执行？
**内容**：实践标准、执行指南、最佳实践
**示例**：文档撰写标准、命名规范
**特点**：来自真实经验，更有温度，而非冷冰冰的规定

### Products（产品）
**定义**：4P模式的第四层，Deepractice自主开发的具体实现和产品实例
**关注**：我们的产品实际怎么用？
**内容**：自主开发的产品、工具、平台及其使用案例
**示例**：PromptX、DeepracticeDocs
**边界**：仅限Deepractice自主创造的产品，不包括第三方工具的使用规范

### Diátaxis
**定义**：文档类型分类框架，将文档分为四种类型
**包含**：Tutorial、How-to、Explanation、Reference
**作用**：定义文档的写作目的和阅读方式
**来源**：[Diátaxis.fr](https://diataxis.fr)

### 正交维度
**定义**：两个相互独立、互不影响的分类维度
**应用**：4P模式（纵向）与Diátaxis类型（横向）形成正交关系
**作用**：实现内容的双重定位，提高组织灵活性

## 文档类型术语

### Tutorial
**定义**：学习导向的文档，通过引导练习帮助新手入门
**目的**：建立初始技能和信心
**特征**：零基础、循序渐进、即时反馈
**示例**：快速入门、Hello World教程

### How-to
**定义**：任务导向的文档，指导完成特定任务
**目的**：解决具体问题
**特征**：步骤明确、直达目标、前置条件清晰
**示例**：如何部署、如何配置、故障排除

### Explanation
**定义**：理解导向的文档，解释概念、原理和背景
**目的**：建立认知和理解
**特征**：概念解释、背景说明、通俗易懂
**示例**：理解内容体系、设计理念说明

### Reference
**定义**：查询导向的文档，提供精确的技术信息
**目的**：快速查找具体信息
**特征**：结构化、可检索、技术精确
**示例**：API文档、配置参数、术语表

## 定位术语

### 双重定位
**定义**：通过层级和类型两个维度确定文档位置
**组成**：纵向定位（4P模式）+ 横向定位（Diátaxis）
**作用**：精确定义每篇文档的归属和性质
**示例**：Practice层的Reference文档

### 内容定位
**定义**：确定文档在体系中位置的过程
**方法**：使用决策树判断层级和类型
**依据**：[内容定位规范](./content-positioning-standard.md)

### 定位矩阵
**定义**：层级与类型的优先组合关系表
**内容**：每层的主要类型和次要类型
**作用**：指导文档类型选择

### 元数据
**定义**：文档头部的结构化信息
**格式**：YAML frontmatter
**必需**：layer、type、title、status等
**作用**：支持自动化处理和管理

## 规范术语

### 撰写标准
**定义**：定义如何撰写特定类型文档的规范
**范围**：四种Diátaxis类型各有撰写标准
**位置**：Practice层
**示例**：Tutorial撰写标准、Reference撰写标准

### 元规范
**定义**：定义如何撰写规范的规范
**示例**：Reference撰写标准（定义如何写Reference）
**特征**：自指性、递归定义

### 文件命名规范
**定义**：文档文件命名的标准规则
**原则**：类型可识别、语义清晰、风格一致
**参见**：[文件命名规范](./file-naming-convention.md)

## 关系术语

### 主要类型/次要类型
**定义**：每个层级倾向使用的文档类型
**示例**：Pattern层主要用Explanation，次要用Reference
**作用**：指导文档类型选择
**参见**：[定位矩阵](#定位矩阵)

### 层级关系
**定义**：四层之间的递进和依赖关系
**方向**：从抽象到具体，从理念到实现
**特征**：上层指导下层，下层实现上层

### 就近原则
**定义**：资源放置在最相关位置的原则
**应用**：术语表放在对应主题目录下
**示例**：内容体系术语表放在content-system目录

## 易混淆术语组

### 协议、规范、标准

**协议（Protocol）**：定义交互规则和通信约定
**规范（Standards/Specification）**：定义执行方式和实施细则
**标准（Standards）**：协议和规范的统称，都是某种标准  
**实践（Practice）**：在Deepractice 4P体系中，Practice层更强调来自真实经验的最佳实践

### 模式、Pattern、设计模式

**模式（中文）**：Pattern的中文翻译
**Pattern（层级）**：4P模式的第一层
**设计模式**：软件工程中的Design Pattern，不同概念

### Standards、Specification、Practice

**Standards**：更强调"标准化"
**Specification**：更强调"规格说明"
**Practice**：更强调"实践经验"，来自真实场景的最佳实践
**关系**：在Deepractice体系中，Practice层包含Standards和Specification，但更有温度

### 我们的产品 vs 外部工具

**我们的产品（Products层）**：
- Deepractice自主开发的软件、平台、工具
- 如：PromptX、DeepracticeDocs、自研CLI工具
- 文档类型：使用指南、功能说明、API文档

**外部工具使用规范（Practice层）**：
- 第三方工具在我们环境中的使用标准
- 如：Git工作流规范、Docker使用规范、CI/CD配置标准
- 文档类型：使用规范、配置标准、最佳实践

**判断标准**：
- 开发者是谁？Deepractice开发 → Products层；第三方开发 → Practice层
- 控制权在哪？我们控制产品逻辑 → Products层；我们只控制使用方式 → Practice层

---

## 参考资源

- [理解内容体系](/zh/patterns/content-system/understanding-content-system) - 深入理解体系设计
- [内容定位规范](./content-positioning-standard.md) - 如何定位文档
- [术语表撰写规范](./glossary-writing-standard.md) - 如何编写术语表

---

*本术语表会随着体系发展持续更新。*