---
layer: Practice
type: Reference
title: 内容定位规范
category: content-system
status: published
version: 2.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - 文档规范
  - 内容定位
  - 元数据
---

# 内容定位规范

## 概述

每篇文档必须有清晰的定位，通过双重坐标系统精确定义其在内容体系中的位置和作用。

## 三维定位系统

内容定位需要从三个维度明确定义：层级（Where）、类型（How）、目标（What & Why）。

### 维度一：层级定位（四层体系）

| 层级 | 英文 | 内容类型 | 关键问题 |
|------|------|---------|---------|
| **模式层** | Pattern | 理念、哲学、思想 | 为什么这样想？ |
| **协议层** | Protocol | 交互规则、通信约定 | 如何沟通协作？ |
| **实践层** | Practice | 执行标准、最佳实践 | 如何具体执行？ |
| **产品层** | Products | 实例、案例、实现 | 实际怎么用？ |

### 维度二：类型定位（Diátaxis框架 + Index）

| 类型 | 目的 | 读者状态 | 关键特征 |
|------|------|----------|----------|
| **Index** | 目录导航 | 进入目录寻找内容 | 索引页专用、导航优先、结构化展示 |
| **Tutorial** | 学习技能 | 新手学习 | 引导练习、建立信心 |
| **How-to** | 解决问题 | 有任务要完成 | 步骤明确、直达目标 |
| **Explanation** | 理解原理 | 想要理解 | 概念解释、背景说明 |
| **Reference** | 查询信息 | 需要查找 | 结构化、易检索 |

**注意**：`Index` 是 Deepractice 额外定义的类型，专门用于目录的 index.md 文件，在 VitePress 导航中具有最高排序优先级。

### 维度三：目标定位（PSO框架）

每个文档需要明确定义其目标、范围和预期成果：

| 要素 | 英文 | 关键问题 | 定义内容 |
|------|------|----------|----------|
| **目的** | Purpose | 为什么需要这个文档？ | 解决什么问题、满足什么需求 |
| **范围** | Scope | 包含什么，不包含什么？ | 内容边界、依赖关系 |
| **成果** | Outcome | 读者能获得什么？ | 具体能力、可验证结果 |

#### PSO 示例

```yaml
# Monorepo 文档的 PSO
purpose: 帮助团队搭建和维护高效的 Monorepo 项目结构
scope:
  includes:
    - pnpm workspace 配置
    - Turborepo 任务编排
    - 包依赖管理
  excludes:
    - TypeScript 语言特性（→ TypeScript 规范）
    - CI/CD 完整配置（→ DevOps 规范）
outcome:
  - 能初始化 Monorepo 项目
  - 能配置包之间的依赖关系
  - 能执行并行构建任务
```

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
| `type` | 文档类型 | Index, Tutorial, How-to, Explanation, Reference |
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
| `purpose` | 文档目的 | 明确文档解决的问题 |
| `scope` | 内容范围 | 定义包含和排除的内容 |
| `outcome` | 预期成果 | 描述读者能获得的能力 |

### 完整示例

```yaml
---
layer: Practice
type: Reference
title: 内容定位规范
category: content-system
status: published
version: 1.2.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - 文档规范
  - 内容定位
  - 元数据
purpose: 定义文档在内容体系中的精确定位方法
scope:
  includes:
    - 层级定位（4P体系）
    - 类型定位（Diátaxis）
    - 目标定位（PSO）
  excludes:
    - 具体写作规范
    - 文档模板
outcome:
  - 能准确定位文档层级和类型
  - 能定义文档目标和边界
  - 能编写规范的元数据
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

### 第三步：明确 PSO

1. **Purpose**：这个文档解决什么问题？
2. **Scope**：
   - Includes：必须包含哪些内容？
   - Excludes：明确不包含什么？
3. **Outcome**：读者看完能做什么？

### 第四步：验证合理性

检查是否符合层级与类型的优先组合矩阵。如不符合，需要重新考虑：
- 是否选错了层级？
- 是否选错了类型？
- 是否需要拆分成多篇文档？

### Products层特殊判断

在确定是否属于Products层时，使用以下决策树：

```mermaid
flowchart TD
    A[内容涉及具体实现] --> B{开发主体是谁?}
    B -->|Deepractice| C[Products层]
    B -->|第三方| D{我们的角色?}
    D -->|使用者| E[Practice层]
    D -->|贡献者/维护者| F[Products层]
    
    E --> G[制定使用规范]
    C --> H[说明产品功能]
    F --> I[说明贡献内容]
```

**典型场景**：
- ✅ Products层：PromptX使用手册、DeepracticeDocs部署指南
- ✅ Practice层：Git工作流规范、Docker使用标准、Nginx配置规范
- ⚠️ 边界情况：我们fork并深度定制的开源工具 → 视定制程度决定

## PSO 定义规范

### 统一原则

所有 PSO 定义都在文档的 frontmatter 中，包括：
- **文档级 PSO**：定义单个文档的边界
- **目录级 PSO**：在目录的 index.md 中定义整个目录的边界

### 必需规则

1. **每个目录必须有 index.md 文件**
2. **index.md 的 PSO 定义该目录的范围**
3. **PSO 三要素格式保持一致**

### PSO 标准格式

```yaml
# 三个核心字段（必需）
purpose: 一句话说明目的（单一聚焦的问题）
scope:
  # 方式1：平行范围（适用于独立的参考文档）
  includes: 
    - 包含内容列表
  excludes:  # 可选，仅在需要明确边界时使用
    - 排除的概念或领域
  
  # 方式2：递进路径（适用于学习路径和配置指南）
  progression:  # 递进式步骤，每步基于前一步
    1. 第一步：基础内容
    2. 第二步：基于1的扩展
    3. 第三步：基于2的深化
    
outcome:
  - 预期成果列表（scope 完成后的可验证结果）
```

### Scope 定义方式选择

#### 核心判断原则：状态性（Stateful vs Stateless）

**技术原理**：
- **无状态（Stateless）** → 使用 **平行范围（includes/excludes）**
  - 各部分相互独立，不改变系统状态
  - 可以任意顺序阅读和应用
  - 类似纯函数，无副作用

- **有状态（Stateful）** → 使用 **递进路径（progression）**
  - 每步改变系统状态，为下一步创建条件
  - 必须按顺序执行，不能跳过
  - 类似管道操作，有累积效应

**判断方法**：
问自己："完成这部分后，系统状态改变了吗？"
- 状态未变 → 无状态 → 平行式
- 状态改变 → 有状态 → 递进式

#### 平行范围（includes/excludes）

适用场景：

- Reference 类型文档（查询参考）
- 独立的标准规范
- 概念解释文档
- **无状态的知识内容**

示例：

```yaml
# 文件命名规范（无状态：阅读后系统状态未变）
scope:
  includes:
    - 文件名格式规则
    - 目录结构规范
    - 特殊文件命名
  excludes:
    - 文档内容规范
    - 代码命名规范
```

#### 递进路径（progression）

适用场景：

- Tutorial 类型文档（循序渐进）
- How-to 指南（步骤明确）
- 配置类文档（逐步完善）
- **有状态的构建过程**

示例：

```yaml
# TypeScript 配置指南（有状态：每步改变项目配置）
scope:
  progression:
    1. 基础配置：最小可运行的 tsconfig    # 创建状态：TypeScript 可用
    2. 严格模式：基于1启用类型检查        # 改变状态：类型检查启用
    3. 模块系统：基于2配置模块规范        # 改变状态：模块系统配置
    4. 路径映射：基于3添加路径解析        # 改变状态：路径别名可用
    5. 构建优化：基于4提升编译性能        # 改变状态：性能优化完成
```

#### 边界案例处理

同样的主题可能有两种视角：

```yaml
# 知识学习视角（无状态）→ 平行式
scope:
  includes:
    - Node.js 版本管理知识
    - TypeScript 配置知识
    - ESLint 规则知识

# 实操配置视角（有状态）→ 递进式
scope:
  progression:
    1. 配置 Node.js 版本（系统获得 node 命令）
    2. 基于1配置 TypeScript（项目获得类型支持）
    3. 基于2配置 ESLint（代码质量保证启用）
```

关键原则：

- **Purpose 必须单一聚焦**：一个文档解决一个问题
- **Scope 避免内容重复**：递进式确保每步只讲新增内容
- **Outcome 必须可验证**：完成后能明确检验是否达成
- **状态性决定组织方式**：有状态用递进，无状态用平行

#### excludes 的本质和用法

**核心理念**：excludes 定义的是**概念边界**，不是**内容导航**。

1. **excludes 是什么**：
   - 明确说明「这个文档/目录不负责什么」
   - 定义内容的边界和范围
   - 帮助读者理解文档的聚焦点

2. **excludes 不是什么**：
   - 不是导航索引
   - 不是相关链接集合
   - 不是「另见」列表

3. **正确用法**：

   ```yaml
   excludes:
     - JavaScript 基础语法     # 简洁的概念说明
     - 生产环境部署           # 用注释补充说明即可
     - 第三方框架集成         # 不需要链接到具体位置
   ```

4. **使用时机**：
   - 当需要明确边界避免误解时
   - 当相似概念容易混淆时
   - excludes 是**可选的**，大多数文档不需要

### 文档级 PSO 示例

```yaml
---
layer: Practice
type: Reference
title: 文档标题
# ... 其他元数据 ...

# 文档级 PSO
purpose: 定义文档在内容体系中的精确定位方法
scope:
  includes:
    - 层级定位（4P体系）
    - 类型定位（Diátaxis）
    - 目标定位（PSO）
  excludes:
    - 具体写作规范  # 不在本文档范围
    - 文档模板      # 属于工具而非概念
outcome:
  - 能准确定位文档层级和类型
  - 能定义文档目标和边界
---
```

### 目录级 PSO 示例

```yaml
# 目录的 index.md
---
layer: Practice
type: Reference  # 索引页通常是 Reference
title: 内容体系实践标准
# ... 其他元数据 ...

# 目录级 PSO（定义整个目录的边界）
purpose: 定义文档体系的撰写、组织和管理标准
scope:
  includes:
    - 文档定位方法
    - 各类型撰写规范
    - 文档校验标准
  excludes:
    - 具体业务文档  # 属于产品层
    - 技术实现细节  # 属于其他实践领域
outcome:
  - 能准确定位和组织文档
  - 能撰写符合规范的各类文档
  - 能有效管理文档体系
---

# 内容体系实践标准

[目录介绍内容...]
```

### 层级示例

```text
/practice/
├── index.md                    # Practice 层总体 PSO
├── content-system/
│   ├── index.md               # 内容体系目录 PSO
│   └── content-positioning-standard.md  # 具体文档 PSO
└── development-environment/
    ├── index.md               # 开发环境目录 PSO
    └── monorepo/
        ├── index.md           # Monorepo 子目录 PSO
        ├── monorepo-standard.md
        └── monorepo-configuration.md
```

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

### 定位示例对比

| 内容描述 | 错误定位 | 正确定位 | 理由 |
|---------|---------|---------|------|
| Git工作流规范 | Products层 | Practice层 | Git是第三方工具，我们制定使用规范 |
| PromptX用户手册 | Practice层 | Products层 | PromptX是我们的产品 |
| VSCode配置标准 | Products层 | Practice层 | VSCode是第三方工具 |
| DeepracticeDocs主题开发 | Practice层 | Products层 | 我们自主开发的主题 |
| Kubernetes部署规范 | Products层 | Practice层 | K8s是第三方，我们制定部署标准 |
| 自研CLI工具手册 | Practice层 | Products层 | 我们自主开发的工具 |

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