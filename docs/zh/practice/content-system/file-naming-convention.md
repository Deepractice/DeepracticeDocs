---
layer: Practice
type: Reference
title: 文档文件命名规范
category: content-system
status: published
version: 1.0.0
date: 2025-01-13
author: Sean Jiang & Claude
tags:
  - 文档规范
  - 命名规范
  - 文件管理
purpose: 定义文档文件的标准命名规则
scope:
  includes:
    - 各类型文档命名模式
    - 通用命名规则
    - 特殊情况处理
  excludes:
    - 代码文件命名: → /practice/development-environment/
    - 资源文件命名: → /practice/asset-management/
outcome:
  - 能准确识别文档类型
  - 能保持命名一致性
  - 能避免命名冲突
---

# 文档文件命名规范

## 定义

本规范定义 Deepractice 文档体系中各类文档的文件命名规则，确保文件名准确反映文档类型和内容。

## 通用规则

| 规则 | 说明 | 示例 |
|------|------|------|
| **小写字母** | 所有文件名使用小写字母 | ✅ `api-standard.md`<br>❌ `API-Standard.md` |
| **连字符分隔** | 单词间使用连字符（-）分隔 | ✅ `user-authentication.md`<br>❌ `user_authentication.md` |
| **扩展名** | 统一使用 `.md` 扩展名 | ✅ `readme.md`<br>❌ `readme.markdown` |
| **语义明确** | 文件名应清晰表达内容 | ✅ `database-design.md`<br>❌ `doc1.md` |
| **避免缩写** | 除非是公认缩写，否则使用完整单词 | ✅ `application-programming-interface.md`<br>✅ `api.md`（公认缩写）|

## 按文档类型命名

### Reference（规范/参考）

| 模式 | 用途 | 示例 |
|------|------|------|
| `xxx-standard.md` | 标准规范 | `coding-standard.md` |
| `xxx-specification.md` | 技术规格 | `api-specification.md` |
| `xxx-spec.md` | 技术规格（简写） | `protocol-spec.md` |
| `xxx-convention.md` | 约定规范 | `naming-convention.md` |
| `xxx-rules.md` | 规则定义 | `commit-rules.md` |
| `xxx-reference.md` | 参考手册 | `cli-reference.md` |
| `xxx-glossary.md` | 术语表 | `technical-glossary.md` |

⚠️ **避免**：`xxx-guide.md`（容易与 How-to 混淆）

### Explanation（解释/理解）

| 模式 | 用途 | 示例 |
|------|------|------|
| `understanding-xxx.md` | 理解某概念 | `understanding-content-system.md` |
| `xxx-explained.md` | 解释某概念 | `microservices-explained.md` |
| `why-xxx.md` | 解释原因 | `why-four-layers.md` |
| `xxx-concepts.md` | 概念介绍 | `docker-concepts.md` |
| `xxx-architecture.md` | 架构说明 | `system-architecture.md` |
| `xxx-design.md` | 设计理念 | `api-design.md` |

### How-to（操作指南）

| 模式 | 用途 | 示例 |
|------|------|------|
| `how-to-xxx.md` | 明确的操作指南 | `how-to-deploy.md` |
| `xxx-guide.md` | 操作指南（需谨慎使用） | `deployment-guide.md` |
| `xxx-steps.md` | 步骤说明 | `setup-steps.md` |
| `xxx-instructions.md` | 操作说明 | `installation-instructions.md` |
| `troubleshooting-xxx.md` | 故障排除 | `troubleshooting-login.md` |
| `configuring-xxx.md` | 配置指南 | `configuring-database.md` |

### Tutorial（教程）

| 模式 | 用途 | 示例 |
|------|------|------|
| `tutorial-xxx.md` | 通用教程 | `tutorial-react-basics.md` |
| `getting-started-xxx.md` | 入门教程 | `getting-started-docker.md` |
| `learn-xxx.md` | 学习教程 | `learn-typescript.md` |
| `xxx-tutorial.md` | 教程（后缀形式） | `vue-tutorial.md` |
| `xxx-quickstart.md` | 快速入门 | `nodejs-quickstart.md` |
| `xxx-walkthrough.md` | 演练教程 | `api-walkthrough.md` |

## 特殊文件命名

| 文件名 | 用途 | 说明 |
|--------|------|------|
| `index.md` | 目录页 | 每个目录的索引页 |
| `readme.md` | 说明文件 | 项目或目录说明 |
| `changelog.md` | 变更日志 | 记录版本变更 |
| `contributing.md` | 贡献指南 | 如何贡献文档 |
| `license.md` | 许可证 | 版权和许可信息 |

## 层级特定命名建议

### Pattern 层（理念）
- 偏向使用 `xxx-philosophy.md`、`xxx-principles.md`
- 例：`design-philosophy.md`、`collaboration-principles.md`

### Protocol 层（协议）
- 偏向使用 `xxx-protocol.md`、`xxx-standard.md`
- 例：`communication-protocol.md`、`data-standard.md`

### Practice 层（实践）
- 偏向使用 `xxx-specification.md`、`xxx-convention.md`
- 例：`api-specification.md`、`coding-convention.md`

### Products 层（产品）
- 偏向使用产品名称直接命名
- 例：`promptx-manual.md`、`deepractice-cli.md`

## 版本化命名

当需要保留多个版本时：

| 模式 | 示例 | 说明 |
|------|------|------|
| `xxx-v1.md` | `api-spec-v1.md` | 主版本号 |
| `xxx-v1.2.md` | `protocol-v1.2.md` | 详细版本号 |
| `xxx-2024.md` | `standard-2024.md` | 年份版本 |
| `xxx-draft.md` | `spec-draft.md` | 草稿版本 |
| `xxx-deprecated.md` | `api-deprecated.md` | 废弃版本 |

## 多语言命名

| 模式 | 示例 | 说明 |
|------|------|------|
| 目录分离 | `/zh/xxx.md`<br>`/en/xxx.md` | 推荐：通过目录区分语言 |
| 文件名后缀 | `xxx.zh.md`<br>`xxx.en.md` | 备选：同目录下多语言 |

## 命名检查清单

创建文件前，确认：

- [ ] 文件名全部小写
- [ ] 使用连字符而非下划线或空格
- [ ] 文件名清晰表达内容类型
- [ ] 选择了正确的命名模式
- [ ] 避免了有歧义的词汇（如 guide）
- [ ] 考虑了文件的查找便利性

## 迁移建议

对于已存在的文件：

1. **逐步迁移** - 新文件严格遵守，旧文件逐步改名
2. **保留重定向** - 改名后设置重定向，避免链接失效
3. **批量更新** - 同类文件一起改名，保持一致性
4. **更新引用** - 改名后更新所有引用链接

## 常见错误

| 错误示例 | 问题 | 正确示例 |
|----------|------|----------|
| `Writing-Guide.md` | 大写字母 | `writing-standard.md` |
| `api_documentation.md` | 下划线 | `api-documentation.md` |
| `guide.md` | 名称太泛 | `contribution-guide.md` |
| `doc20240113.md` | 无意义名称 | `meeting-notes-2024-01-13.md` |
| `HowToUseAPI.md` | 驼峰命名 | `how-to-use-api.md` |

---

## 参考资源

- [Google 开发者文档风格指南](https://developers.google.com/style/filenames) - 文件命名最佳实践
- [MDN 文档命名约定](https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines/General#file_naming) - Web 文档命名规范