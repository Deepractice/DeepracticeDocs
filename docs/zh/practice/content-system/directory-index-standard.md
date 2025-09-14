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
purpose: 定义目录索引文件（index.md）的结构和要求
scope:
  includes:
    - index.md 的必需元素
    - 目录级 PSO 定义
    - 内容组织说明
    - 导航结构设计
  excludes:
    - 具体文档撰写: → 各类型撰写标准
    - 文件命名规则: → ./file-naming-convention.md
outcome:
  - 能创建规范的目录索引
  - 能有效组织目录内容
  - 能提供清晰的导航结构
---

# 目录索引规范

## 定义

目录索引（index.md）是每个内容目录的**必需文件**，承担三个核心职责：

1. **定义目录边界** - 通过目录级 PSO 明确范围
2. **提供内容导航** - 组织和展示目录内的文档
3. **说明组织逻辑** - 解释为什么这些内容在一起

## 核心原则

| 原则 | 说明 | 要求 |
|------|------|------|
| **必需性** | 每个目录必须有 index.md | 无例外 |
| **一致性** | 所有 index.md 结构一致 | 遵循本规范 |
| **导航性** | 提供清晰的内容导航 | 完整列出所有内容 |
| **说明性** | 解释目录的价值和用途 | 让读者知道为什么需要这个目录 |

## 必需元素

### 1. 完整的元数据

```yaml
---
layer: [所属层级]
type: Reference  # 索引页通常是 Reference
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
    - 不包含的内容: → /应该去的位置/
outcome:
  - 使用这个目录后能获得什么
  - 能解决什么问题
---
```

### 2. 目录介绍

开篇部分应该包含：
- **是什么** - 这个目录的主题
- **为什么** - 为什么需要这个目录
- **给谁用** - 目标读者是谁
- **怎么用** - 如何使用这个目录

### 3. 内容组织说明

#### 子目录结构（如有）

```markdown
## 目录结构

```
/content-system/
├── 定位规范/          # 如何定位文档
├── 撰写标准/          # 各类型文档写作规范
├── 质量管理/          # 文档校验和演进
└── 工具支持/          # 辅助工具和模板
```
```

#### 文档清单

```markdown
## 核心文档

### 定位与组织
- [内容定位规范](./content-positioning-standard.md) - Reference - 三维定位体系
- [文件命名规范](./file-naming-convention.md) - Reference - 命名规则和约定

### 撰写标准
- [Reference 撰写标准](./writing-reference-standard.md) - Reference - 查询文档规范
- [Explanation 撰写标准](./writing-explanation-standard.md) - Reference - 解释文档规范
- [How-to 撰写标准](./writing-howto-standard.md) - Reference - 操作指南规范
- [Tutorial 撰写标准](./writing-tutorial-standard.md) - Reference - 教程文档规范
```

### 4. 使用指南

```markdown
## 使用指南

### 新手入门
1. 先阅读[内容定位规范](./content-positioning-standard.md)理解体系
2. 根据文档类型选择对应的撰写标准
3. 参考[文档校验规范](./document-validation-standard.md)检查质量

### 常见任务
- 创建新文档 → 查看对应类型的撰写标准
- 组织内容 → 参考内容定位规范
- 质量检查 → 使用文档校验规范
```

## 可选元素

### 相关资源

```markdown
## 相关资源

### 上层概念
- [理解内容体系](/zh/patterns/content-system/understanding-content-system) - 设计理念

### 工具支持
- [文档模板](./templates/) - 各类型文档模板
- [检查工具](./tools/) - 自动化检查脚本
```

### 更新历史

```markdown
## 更新历史

- 2025-01-14: v2.0 - 统一 PSO 定义到 frontmatter
- 2025-01-13: v1.0 - 初始版本发布
```

## 质量标准

### 必须满足

- [ ] 有完整的元数据和目录级 PSO
- [ ] 清楚说明目录的价值和用途
- [ ] 列出所有子目录和主要文档
- [ ] 提供使用指南或阅读顺序
- [ ] type 设置为 Reference

### 建议包含

- [ ] 目录结构的可视化展示
- [ ] 文档的类型标注（Tutorial/How-to等）
- [ ] 相关资源链接
- [ ] 更新历史记录

### 必须避免

- [ ] 缺少目录级 PSO
- [ ] 内容列表不完整
- [ ] 没有解释目录存在的理由
- [ ] 缺少导航功能

## 模板

### 基础模板

```markdown
---
layer: [Layer]
type: Reference
title: [目录名称]
category: [分类]
status: published
version: 1.0.0
date: YYYY-MM-DD
author: [作者]
tags:
  - [标签]

# 目录级 PSO
purpose: [一句话说明目录价值]
scope:
  includes:
    - [包含内容1]
    - [包含内容2]
  excludes:
    - [排除内容]: → /[建议位置]/
outcome:
  - [成果1]
  - [成果2]
---

# [目录名称]

## 概述

[目录介绍：是什么、为什么、给谁用]

## 目录结构

[可视化展示子目录组织]

## 核心文档

[分类列出所有文档，标注类型]

## 使用指南

[如何使用这个目录]

## 相关资源

[链接到相关内容]
```

## 特殊情况

### 顶层目录的 index.md

如 `/practice/index.md`，需要额外说明：
- 该层级的设计理念
- 与其他层级的关系
- 该层级的整体组织原则

### 空目录的 index.md

新建目录但还没有内容时：
- 仍需创建 index.md
- 说明计划添加的内容
- 标注 status: draft

### 大型目录的 index.md

内容特别多的目录：
- 可以按主题分组展示
- 提供多种导航方式（按类型、按主题、按重要性）
- 考虑创建子目录来组织

## 维护要求

1. **同步更新** - 添加/删除文档时同步更新 index.md
2. **定期审查** - 确保内容列表的完整性和准确性
3. **版本管理** - 重大调整时更新版本号

---

## 参考资源

- [内容定位规范](./content-positioning-standard.md) - PSO 定义规范
- [文件命名规范](./file-naming-convention.md) - 特殊文件命名
- [文档校验规范](./document-validation-standard.md) - 质量检查标准

---

*记住：index.md 是读者进入目录的第一站，要让他们快速理解这个目录的价值。*