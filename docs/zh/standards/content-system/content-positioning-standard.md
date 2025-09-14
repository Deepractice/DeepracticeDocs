---
layer: Practice
type: Reference
title: 内容定位规范
category: content-system
status: published
version: 1.0.0
date: 2025-01-13
author: Sean Jiang & Claude
tags:
  - 文档规范
  - 内容定位
  - 元数据
---

# 内容定位规范

## 概述

每篇文档必须有清晰的定位，通过双重坐标系统精确定义其在内容体系中的位置和作用。

## 双重定位系统

### 纵向定位：四层体系

| 层级 | 英文 | 内容类型 | 关键问题 |
|------|------|---------|---------|
| **模式层** | Pattern | 理念、哲学、思想 | 为什么这样想？ |
| **协议层** | Protocol | 交互规则、通信约定 | 如何沟通协作？ |
| **实践层** | Practice | 执行标准、最佳实践 | 如何具体执行？ |
| **产品层** | Products | 实例、案例、实现 | 实际怎么用？ |

### 横向定位：Diátaxis类型

| 类型 | 目的 | 读者状态 | 关键特征 |
|------|------|----------|----------|
| **Tutorial** | 学习技能 | 新手学习 | 引导练习、建立信心 |
| **How-to** | 解决问题 | 有任务要完成 | 步骤明确、直达目标 |
| **Explanation** | 理解原理 | 想要理解 | 概念解释、背景说明 |
| **Reference** | 查询信息 | 需要查找 | 结构化、易检索 |

## 定位矩阵

### 层级与类型的优先组合

| 层级 | 主要类型 | 次要类型 | 说明 |
|------|----------|----------|------|
| **Pattern** | Explanation | Reference | 解释理念为主，术语定义为辅 |
| **Protocol** | Reference | Explanation | 规范定义为主，设计原理为辅 |
| **Practice** | Reference | Explanation | 执行标准为主，应用场景为辅 |
| **Products** | How-to | Tutorial | 操作指南为主，入门教程为辅 |

### 定位示例

```yaml
# Pattern层 + Explanation
layer: Pattern
type: Explanation
title: 理解Deepractice内容体系

# Practice层 + Reference  
layer: Practice
type: Reference
title: 文件命名规范

# Products层 + How-to
layer: Products
type: How-to
title: 如何部署文档网站
```

## 元数据规范

### 必需字段

| 字段 | 说明 | 取值范围 |
|------|------|----------|
| `layer` | 所属层级 | Pattern, Protocol, Practice, Products |
| `type` | 文档类型 | Tutorial, How-to, Explanation, Reference |
| `title` | 文档标题 | 简洁明确的标题 |
| `category` | 分类标签 | 所属的内容分类 |
| `status` | 发布状态 | draft, published, deprecated |
| `version` | 版本号 | 语义化版本号 |
| `date` | 更新日期 | YYYY-MM-DD格式 |

### 可选字段

| 字段 | 说明 | 使用场景 |
|------|------|----------|
| `author` | 作者信息 | 标注内容创作者 |
| `tags` | 标签列表 | 便于检索和分类 |
| `dependencies` | 依赖文档 | 标注前置阅读要求 |
| `related` | 相关文档 | 提供延伸阅读 |

### 完整示例

```yaml
---
layer: Practice
type: Reference
title: 内容定位规范
category: content-system
status: published
version: 1.0.0
date: 2025-01-13
author: Sean Jiang & Claude
tags:
  - 文档规范
  - 内容定位
  - 元数据
dependencies:
  - /zh/patterns/content-system/understanding-content-system
related:
  - ./file-naming-convention.md
  - ./writing-explanation-standard.md
---
```

## 定位决策树

### 第一步：确定层级

1. 内容是关于**思想理念**？→ Pattern
2. 内容是关于**协作规则**？→ Protocol  
3. 内容是关于**执行标准**？→ Practice
4. 内容是关于**具体实现**？→ Products

### 第二步：确定类型

1. 要**教新手入门**？→ Tutorial
2. 要**解决具体问题**？→ How-to
3. 要**解释概念原理**？→ Explanation
4. 要**提供查询参考**？→ Reference

### 第三步：验证合理性

检查是否符合层级与类型的优先组合矩阵。如不符合，需要重新考虑：
- 是否选错了层级？
- 是否选错了类型？
- 是否需要拆分成多篇文档？

## 特殊情况处理

### 跨层级内容

某些内容可能涉及多个层级：
- **优先原则**：按内容的主要关注点定位
- **拆分原则**：必要时拆分为多篇文档
- **链接原则**：通过交叉引用连接相关内容

### 混合类型内容

某些内容可能包含多种类型特征：
- **主类型原则**：选择最主要的类型
- **章节划分**：不同章节可以有不同侧重
- **明确标注**：在文档中说明各部分的作用

### 术语表定位

| 术语类型 | 所属层级 | 说明 |
|----------|----------|------|
| 理念术语 | Pattern | 核心思想概念 |
| 协议术语 | Protocol | 交互通信术语 |
| 实践术语 | Practice | 执行标准术语 |
| 产品术语 | Products | 产品功能术语 |

## 定位审查清单

### 层级审查

- [ ] 内容主题符合所选层级的定义？
- [ ] 抽象程度与层级位置匹配？
- [ ] 与同层其他文档风格一致？

### 类型审查

- [ ] 文档结构符合类型特征？
- [ ] 语言风格符合类型要求？
- [ ] 读者预期与类型匹配？

### 元数据审查

- [ ] 所有必需字段都已填写？
- [ ] 字段取值在规定范围内？
- [ ] 版本和日期信息准确？

### 关联审查

- [ ] 依赖关系标注正确？
- [ ] 相关链接有效且合理？
- [ ] 交叉引用双向一致？

## 维护要求

### 定期检查

- 每季度审查文档定位的准确性
- 内容重构时重新评估定位
- 新增内容严格遵循定位规范

### 定位迁移

当文档需要调整定位时：
1. 更新元数据中的layer和type
2. 移动文件到正确目录（如从standards/移到practice/）
3. 更新所有相关链接
4. 更新导航配置
5. 记录迁移原因

## 常见错误

| 错误 | 问题 | 解决方案 |
|------|------|----------|
| Pattern层写How-to | 理念层不应有操作步骤 | 移到Products层或改为Explanation |
| Practice层缺少Reference | 实践层需要查询文档 | 补充Reference类型文档 |
| 元数据不完整 | 影响内容管理和检索 | 补充所有必需字段 |
| 层级定位模糊 | 不知道放哪一层 | 使用决策树明确定位 |
| 类型选择困难 | 多种类型都沾边 | 选择主要目的对应的类型 |

---

## 参考资源

- [理解Deepractice内容体系](/zh/patterns/content-system/understanding-content-system) - 内容体系设计理念
- [文件命名规范](./file-naming-convention.md) - 文档文件命名标准
- [Diátaxis](https://diataxis.fr/) - 文档类型框架

---

*记住：清晰的定位是优质文档的第一步。*