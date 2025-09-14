---
layer: Pattern
type: Explanation
title: Deepractice 内容体系 — 4P × Diátaxis × PSO
category: content-system
status: published
version: 4.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - 内容体系
  - 4P模式
  - Diátaxis
  - PSO框架
  - 正交设计
purpose: 解释 Deepractice 三维内容定位体系的设计理念
scope:
  includes:
    - 4P 层级体系（深度维度）
    - Diátaxis 类型框架（形式维度）
    - PSO 目标框架（边界维度）
  excludes:
    - 具体写作技巧
    - 工具使用方法
outcome:
  - 理解三维定位的必要性
  - 掌握内容定位的完整方法
  - 能够准确定位任何文档
---

# Deepractice 内容体系 — 4P × Diátaxis × PSO

有了 4P 内容分层，为什么还需要 Diátaxis？有了这两个维度，为什么还需要 PSO？

这就像问：有了地图的经度和纬度，为什么还需要海拔？答案很简单——平面定位还不够精确。

## 三个不同的问题

组织文档时，你会遇到三个完全不同的问题。

第一个问题关于**深度**：这个文档是讲理念的，还是讲实践的，还是展示成果的？这决定了文档在知识体系中的层次。4P 模式回答的就是这个问题——Pattern、Protocol、Practice、Products，从抽象到具体的四个层次。

第二个问题关于**形式**：这个文档是要教新手入门，还是帮人解决问题，还是让人理解原理，还是供人查询信息？这决定了文档的写作方式。Diátaxis 框架回答的是这个问题——Tutorial、How-to、Explanation、Reference，四种不同的文档类型。

第三个问题关于**边界**：这个文档要解决什么问题，包含哪些内容，不包含哪些内容，读者看完能做什么？这决定了文档的范围和目标。PSO 框架回答的是这个问题——Purpose（目的）、Scope（范围）、Outcome（成果），明确文档的边界。

三个问题，三个维度，缺一不可。

## 三维的精确

数学里有个概念叫"正交"，说的是向量互相垂直，互不影响。4P、Diátaxis 和 PSO 就是这样的关系。

想象一个三维空间，X 轴是 4P 的四个层次，Y 轴是 Diátaxis 的四种类型，Z 轴是 PSO 的边界定义。每篇文档都能在这个空间里找到唯一的位置。比如你正在读的这篇文档：
- **4P 坐标**：Pattern 层（讲设计理念）
- **Diátaxis 坐标**：Explanation 类型（解释概念）
- **PSO 坐标**：解释三维定位体系的设计理念（Purpose），包含三个框架的介绍（Scope），让读者理解并能应用（Outcome）

完整坐标是（Pattern, Explanation, 体系理念）。

这种三维设计解决了一个关键问题：**内容边界模糊**。以前，即使知道文档在 Practice 层的 Reference 类型，你还是不知道该包含多少内容。现在有了 PSO，边界一清二楚。

## 一个真实的例子

让我们看看"Monorepo"这个主题是如何在三维空间中定位的。

**现有的 Monorepo 文档：**

1. **monorepo-standard.md**
   - 4P：Practice 层（执行标准）
   - Diátaxis：Reference（查询参考）
   - PSO：定义 Monorepo 基础架构规范（Purpose），包含核心技术选型和项目结构（Scope），不包含具体业务代码（Excludes）

2. **how-to-initialize-monorepo.md**
   - 4P：Practice 层（执行标准）
   - Diátaxis：How-to（任务导向）
   - PSO：初始化生产级 Monorepo（Purpose），包含所有配置步骤（Scope），读者能完成初始化（Outcome）

3. **understanding-monorepo-architecture.md**
   - 4P：Practice 层（执行标准）
   - Diátaxis：Explanation（理解导向）
   - PSO：理解 Monorepo 设计理念（Purpose），包含架构权衡（Scope），读者能做出技术决策（Outcome）

看到了吗？即使都在 Practice 层，PSO 让每个文档的边界清晰明确，没有内容重复，也没有遗漏。

## 实际使用中的体验

有了这个三维体系，找文档和写文档都变得异常精确。

假设你要写一份 API 文档：
1. **层级**：API 规格属于 Practice 层（执行规范）
2. **类型**：API 文档是供查询的，所以是 Reference
3. **PSO**：
   - Purpose：提供 API 接口规范
   - Scope：包含接口定义、参数说明、返回值；不包含实现细节、业务逻辑
   - Outcome：开发者能正确调用 API

再比如，新同事要了解公司的技术理念：
1. **层级**：Pattern（理念）
2. **类型**：深入理解看 Explanation，快速上手看 Tutorial
3. **PSO**：明确是要理解"为什么"还是学会"怎么用"

这种三维定位不仅帮助读者找到需要的内容，也帮助作者明确边界。知道自己在写什么层级、什么类型、什么范围的文档，就不会跑题，也不会遗漏。

## 为什么这个设计如此重要

传统的文档组织往往是一维的。要么按主题分（产品文档、技术文档、用户文档），要么按类型分（教程、指南、参考），要么按时间分（v1.0、v2.0、v3.0）。

一维组织的问题是，同一个概念的不同方面被分散了。你想了解"微服务"，理念在架构文档里，规范在开发指南里，案例在项目文档里，教程又在培训材料里。知识被人为割裂。

二维（4P × Diátaxis）解决了组织问题，但还有一个问题：边界模糊。同样是 Practice 层的 Reference，一个讲 TypeScript 配置，一个讲 Monorepo 配置，它们的边界在哪里？该包含多少 TypeScript 内容？

三维（4P × Diátaxis × PSO）彻底解决了这个问题：
- **纵向（4P）**：同一主题的不同层次组织在一起，形成完整的知识链条
- **横向（Diátaxis）**：同一层次的不同类型满足不同需求
- **深度（PSO）**：每个文档的边界清晰，不重复不遗漏

知识既完整又灵活，还精确。

## 未来的可能性

这个体系还有很大的扩展空间。

可以加入第四个维度——**受众**。初学者、开发者、架构师，不同受众需要不同的内容深度。4P × Diátaxis × PSO × Audience，四维内容空间。

可以加入**时间维度**——版本。随着产品演进，文档也在演进。但核心的三维结构保持稳定，只是内容在更新。

可以加入**自动化**。根据文档的元数据（layer、type、PSO），自动：
- 生成导航结构
- 推荐相关内容
- 检查完整性
- 发现内容空白
- 识别重复内容

三维定位不仅是组织原则，也是自动化的基础。

但即使不做任何扩展，4P × Diátaxis × PSO 已经足够强大。它简单到能理解，灵活到能适应各种需求，精确到能指导实践。

---

想深入了解其中一个维度？

- [理解 4P 内容分层模式](./deepractice-4p-model.md) - 纵向的深度组织
- [Diátaxis 官方文档](https://diataxis.fr) - 横向的类型分类
- [内容定位规范](/zh/practice/content-system/content-positioning-standard.md) - 如何确定文档坐标

或者直接实践：

- [内容体系术语表](/zh/practice/content-system/glossary.md) - 查看具体定义
- [撰写标准汇总](/zh/practice/content-system/) - 各类型文档的写作规范

记住：4P 管深度，Diátaxis 管形式，PSO 管边界。三个维度，一个体系。