# Deepractice Docs 文档体系

## 目录结构说明

本文档中心基于**四层抽象体系**组织内容，每层使用**Diátaxis框架**规范文档写作。

### 📚 核心目录

```
docs/zh/
├── patterns/    # 模式层 - 定义理念和原则
├── protocols/   # 协议层 - 定义标准和规范
├── standards/   # 规范层 - 定义领域方案
├── products/    # 产品层 - 定义具体实现
├── blog/        # 博客文章（独立体系）
├── about.md     # 关于我们
└── index.md     # 首页
```

### 🎯 四层体系详解

#### 1. Patterns（模式层）
- **定位**：最高抽象层，定义核心理念、设计哲学、思维模式
- **内容**：解释"为什么"（Why）
- **文档类型**：
  - 主要：Explanation（解释理念）
  - 次要：Reference（术语表）
- **示例**：`issue-paradigm.md`（ISSUE协作范式）

#### 2. Protocols（协议层）
- **定位**：定义接口标准、通信协议、数据格式
- **内容**：规定"是什么"（What）
- **文档类型**：
  - 主要：Reference（规范定义）
  - 次要：Explanation（设计原理）
- **示例**：`issue-dpml-protocol.md`（DPML协议规范）

#### 3. Standards（规范层）
- **定位**：特定领域的结构化方案、最佳实践
- **内容**：描述"如何组织"（How to Organize）
- **文档类型**：
  - 主要：Reference（结构定义）
  - 次要：Explanation（应用场景）
- **示例**：`discover-issue-schema.md`（议题发现纲要）

#### 4. Products（产品层）
- **定位**：具体的实例、配置、代码实现
- **内容**：展示"如何做"（How to Do）
- **文档类型**：
  - 主要：How-to（操作步骤）
  - 次要：Tutorial（入门教程）
- **示例**：`sprint-planning-20250113.xml`（Sprint计划实例）

### 📝 文档元数据标准

每个文档都应包含以下元数据：

```yaml
---
layer: Standards                 # 四层定位：Patterns/Protocols/Standards/Products
type: Reference                  # Diátaxis类型：Tutorial/How-to/Explanation/Reference
title: 文档标题
category: domain-name            # 领域分类
status: draft/review/published   # 文档状态
version: 1.0.0                  # 版本号
date: 2025-01-13               # 创建/更新日期
author: 作者名                  # 作者
---
```

### 🔄 内容迁移计划

1. **第一阶段**：建立ISSUE体系完整示例
   - Pattern: issue-paradigm.md
   - Protocol: issue-dpml-protocol.md
   - Standard: discover-issue-schema.md
   - Product: 具体实例文件

2. **第二阶段**：迁移现有内容
   - 分析备份文件夹中的内容
   - 按四层体系重新分类
   - 重写以符合Diátaxis规范

3. **第三阶段**：扩展新内容
   - 补充缺失的层级文档
   - 完善每层的文档类型覆盖

### 📖 相关资源

- [Issue #7: 建立基于四层抽象的文档中心内容体系](https://github.com/Deepractice/DeepracticeDocs/issues/7)
- [Diátaxis Framework](https://diataxis.fr/)
- [DPML协议规范](/protocols/issue-dpml-protocol.md)

---

*最后更新：2025-01-13*