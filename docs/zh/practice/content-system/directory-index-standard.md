---
layer: Practice
type: Reference
title: 目录索引规范
category: content-system
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - 文档规范
  - 目录管理
  - 索引页
purpose: 定义目录索引文件（index.md）的最小必要规范
scope:
  includes:
    - 目录级 PSO 定义
    - 文档清单列表
    - 简要概述说明
  excludes:
    - 使用指南  # 增加管理负担
    - 更新历史  # 难以维护一致性
    - 复杂导航  # 过度设计
outcome:
  - 清晰的目录边界定义
  - 完整的文档清单
  - 最小的维护成本
---

# 目录索引规范

## 核心原则

**极简主义**：index.md 只做两件事：
1. **定义边界** - 通过 PSO 说明目录范围
2. **列出内容** - 提供目录下所有文档的清单

## 为什么要极简

1. **维护成本** - 内容越多，更新越困难
2. **一致性风险** - 复杂的结构容易导致不一致
3. **重复问题** - 过多的说明会与具体文档重复
4. **实际价值** - 读者只需要知道「有什么」和「在哪里」

## 必需结构（仅此而已）

### 1. 元数据（带 PSO）

```yaml
---
layer: [所属层级]
type: Index  # 目录索引页专用类型
title: [目录标题]
category: [分类]
status: published
version: 1.0.0
date: YYYY-MM-DD
author: [作者]
tags:
  - [相关标签]

# 目录级 PSO（定义整个目录的边界）
purpose: 目录的核心价值（一句话）
scope:
  includes:
    - 这个目录包含的内容
    - 负责的领域范围
  excludes:
    - 不包含的内容  # 可选，仅在需要明确边界时使用
outcome:
  - 使用这个目录后能获得什么
  - 能解决什么问题
---
```

### 2. 一段话概述

```markdown
## 概述

本目录包含 [主题] 相关的规范和指南。
```

就这么简单，一句话说清楚即可。

### 3. 文档清单

```markdown
## 文档列表

- [内容定位规范](./content-positioning-standard.md) - 三维定位体系
- [文件命名规范](./file-naming-convention.md) - 命名规则
- [Reference 撰写标准](./writing-reference-standard.md) - 查询文档规范
- [Explanation 撰写标准](./writing-explanation-standard.md) - 解释文档规范
```

格式：`[标题](路径) - 一句话说明`


## 就是这样

不需要：
- ❌ 使用指南（读者会自己判断）
- ❌ 更新历史（用 Git 管理）
- ❌ 相关资源（在具体文档中提供）
- ❌ 复杂分类（增加维护成本）
- ❌ 详细说明（与具体文档重复）

## 检查清单

必需：
- [ ] 元数据中包含目录级 PSO
- [ ] 一段话概述
- [ ] 完整的文档清单
- [ ] type 设置为 Index

仅此而已。

## 标准模板

```markdown
---
layer: [Layer]
type: Index
title: [目录名称]
category: [分类]
status: published
version: 1.0.0
date: YYYY-MM-DD

# 目录级 PSO
purpose: [一句话说明目录的核心价值]
scope:
  includes:
    - [主要内容范围]
  excludes:
    - [明确不包含的内容]  # 可选
outcome:
  - [使用后的成果]
---

# [目录名称]

## 概述

本目录包含 [主题] 相关的内容。

## 文档列表

- [文档1](./doc1.md) - 简要说明
- [文档2](./doc2.md) - 简要说明
- [文档3](./doc3.md) - 简要说明
```

## 实际例子

```markdown
---
layer: Practice
type: Index
title: TypeScript 配置规范
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15

purpose: 实现 TypeScript 配置的标准化
scope:
  progression:  # 如果是递进式的
    1. 基础配置：最小可运行的 tsconfig
    2. 严格模式：启用所有类型检查
    3. 模块系统：配置 ESModule
    4. 路径映射：设置路径别名
    5. 构建优化：提升编译性能
outcome:
  - 类型安全的开发体验
  - 统一的配置标准
---

# TypeScript 配置规范

## 概述

本目录包含 TypeScript 配置相关的标准和最佳实践。

## 文档列表

- [TypeScript 基础配置](./tsconfig-basic-standard.md) - 最小可运行配置
- [严格模式标准](./strict-mode-standard.md) - 零妥协的类型检查
- [ESModule 配置标准](./esmodule-standard.md) - 模块系统配置
- [类型管理规范](./types-management-standard.md) - 类型文件组织
```

## 维护原则

唯一要求：**保持文档清单的完整性**。

添加新文档时，加一行；删除文档时，删一行。就这么简单。

---

*记住：Less is more. 简单才能持续。*