---
layer: Practice
type: Index
title: 内容体系规范
category: content-system
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - 内容体系
  - 文档规范
  - 标准化

# 目录级 PSO
purpose: 定义文档体系的撰写、组织和管理标准
scope:
  includes:
    - 文档定位方法和三维体系
    - 各类型文档撰写规范
    - 文档质量校验标准
    - 内容演进和管理方法
  excludes:
    - 具体业务文档: → /zh/products/
    - 技术实现规范: → /zh/practice/development-environment/
outcome:
  - 能准确定位和组织文档
  - 能撰写符合规范的各类文档
  - 能有效管理和演进文档体系
---

# 内容体系规范

## 概述

本目录包含 Deepractice 文档体系的所有规范和标准，帮助团队创建、组织和维护高质量的技术文档。

## 核心理念

我们的内容体系基于三个维度：
- **4P 分层**：Pattern、Protocol、Practice、Products 的纵向组织
- **Diátaxis 类型**：Tutorial、How-to、Explanation、Reference 的横向分类
- **PSO 框架**：Purpose、Scope、Outcome 的边界定义

## 目录结构

```
content-system/
├── 基础概念/
│   ├── glossary.md                      # 术语表
│   └── content-positioning-standard.md   # 定位规范
├── 组织管理/
│   ├── directory-index-standard.md       # 目录索引规范
│   ├── file-naming-convention.md         # 文件命名规范
│   └── document-validation-standard.md   # 文档校验规范
├── 撰写规范/
│   ├── writing-explanation-standard.md   # Explanation 撰写
│   ├── writing-howto-standard.md        # How-to 撰写
│   ├── writing-reference-standard.md    # Reference 撰写
│   ├── writing-tutorial-standard.md     # Tutorial 撰写
│   └── glossary-writing-standard.md     # 术语表撰写
└── 持续改进/
    └── content-evolution-standard.md    # 内容演进规范
```

## 核心文档

### 📍 定位与组织

- [内容定位规范](./content-positioning-standard.md) `Reference` - 三维定位体系和 PSO 框架
- [目录索引规范](./directory-index-standard.md) `Reference` - index.md 的要求和结构
- [文件命名规范](./file-naming-convention.md) `Reference` - 文档文件命名标准

### ✍️ 撰写标准

- [Reference 撰写标准](./writing-reference-standard.md) `Reference` - 查询导向文档规范
- [Explanation 撰写标准](./writing-explanation-standard.md) `Reference` - 理解导向文档规范
- [How-to 撰写标准](./writing-howto-standard.md) `Reference` - 任务导向文档规范
- [Tutorial 撰写标准](./writing-tutorial-standard.md) `Reference` - 学习导向文档规范

### 📊 质量管理

- [文档校验规范](./document-validation-standard.md) `Reference` - 3×3 质量校验矩阵
- [内容演进规范](./content-evolution-standard.md) `Reference` - PDCA 持续改进流程

### 📚 知识管理

- [内容体系术语表](./glossary.md) `Reference` - 核心概念定义
- [术语表撰写规范](./glossary-writing-standard.md) `Reference` - 术语表编写标准

## 使用指南

### 新手入门

1. 先阅读[内容体系术语表](./glossary.md)了解核心概念
2. 学习[内容定位规范](./content-positioning-standard.md)理解三维体系
3. 根据文档类型选择对应的撰写标准

### 常见任务

| 任务 | 参考文档 |
|------|----------|
| 创建新文档 | 查看对应类型的撰写标准 |
| 组织目录结构 | 参考[目录索引规范](./directory-index-standard.md) |
| 文档质量检查 | 使用[文档校验规范](./document-validation-standard.md) |
| 持续改进 | 遵循[内容演进规范](./content-evolution-standard.md) |

## 相关资源

### 上层理念
- [理解 Deepractice 4P 内容分层模式](/zh/patterns/content-system/deepractice-4p-model) - Pattern 层的设计理念
- [Deepractice 内容体系](/zh/patterns/content-system/understanding-content-system) - 三维体系的完整说明

### 外部参考
- [Diátaxis](https://diataxis.fr/) - 文档类型框架
- [Google 开发者文档风格指南](https://developers.google.com/style) - 业界最佳实践

---

*记住：好的文档体系让知识有序、可查、可用。*