# Git 工作流规范

## 规范定位

本规范定义了 Git 版本控制的使用标准，包括分支管理、提交规范、协作流程等，确保团队协作的高效性和代码历史的可追溯性。

## 核心原则

### 清晰的历史记录
- 原子化提交，每个提交一个逻辑改动
- 规范的提交信息格式
- 线性或可理解的分支结构
- 完整的变更追踪

### 安全的代码管理
- 主分支严格保护
- 代码审查机制
- 自动化质量检查
- 可靠的回滚能力

### 高效的协作流程
- 明确的分支策略
- 标准化的工作流程
- 自动化的重复任务
- 清晰的职责分配

### 灵活的适应性
- 支持不同项目类型
- 渐进式采用方案
- 可配置的规则强度
- 应急处理机制

## 适用范围

本规范适用于所有使用 Git 进行版本控制的项目：
- 前端应用项目
- 后端服务项目
- 库和 SDK 开发
- 文档和配置管理
- 开源和内部项目

## 规范架构

本规范包含以下章节：

1. **[分支管理](./branch-management)** - 分支模型、命名规范、保护策略
2. **[提交规范](./commit-convention)** - Conventional Commits 标准和最佳实践
3. **[协作流程](./collaboration)** - PR 流程、代码审查、冲突解决
4. **[版本发布](./release)** - 版本标签、发布流程、回滚策略
5. **[工具配置](./tooling)** - Git Hooks、CI 集成、自动化工具

## 快速参考

### 分支类型
```bash
feature/JIRA-123-user-auth  # 新功能
fix/JIRA-456-login-bug      # 问题修复
hotfix/JIRA-789-security    # 紧急修复
release/1.2.0               # 发布分支
```

### 提交格式
```bash
# 标准格式
<type>(<scope>): <subject>

# 示例
feat(auth): add OAuth2 login support
fix(ui): resolve button alignment issue
docs(api): update REST API documentation
```

### 常用命令
```bash
# 创建功能分支
git checkout -b feature/JIRA-123-description

# 规范的提交
git commit -m "feat: add user authentication"

# 更新分支
git pull --rebase origin main

# 推送分支
git push origin feature/JIRA-123-description
```

## 工作流选择指南

### GitHub Flow（推荐用于应用）
```
main → feature → PR → review → merge → deploy
```
- 适合：Web 应用、微服务、持续部署项目
- 特点：简单、快速、持续集成

### Git Flow（推荐用于库）
```
main ← release ← develop ← feature
     ↑                    ↑
     └──── hotfix ────────┘
```
- 适合：SDK、组件库、需要版本管理的项目
- 特点：严格、稳定、版本控制

## 与其他规范的关系

- **上游依赖**：无
- **下游影响**：CI/CD 规范、发布规范
- **协同规范**：
  - [TypeScript 编码规范](../typescript/) - 代码提交前的质量检查
  - [Monorepo 规范](../monorepo/) - 多包项目的版本管理
  - [文档撰写规范](../documentation/) - 文档更新要求

## 工具生态

### 必需工具
- **Git**: 2.28+ （支持 init.defaultBranch）
- **Git Hooks Manager**: Lefthook 或 Husky
- **Commitlint**: 提交信息格式验证

### 推荐工具
- **GitLens**: VSCode 扩展，增强 Git 功能
- **Conventional Changelog**: 自动生成 CHANGELOG
- **Semantic Release**: 自动化版本发布

## 执行保障

### 技术保障
- Git Hooks 自动检查
- CI/CD 流水线验证
- 分支保护规则
- 自动化工具集成

### 流程保障
- Pull Request 模板
- Code Review 要求
- 定期规范审计
- 问题追踪机制

### 文化建设
- 新人培训材料
- 最佳实践分享
- 规范更新通知
- 团队交流机制

## 预期效果

通过执行本规范，预期达到：
- 清晰可追溯的提交历史
- 减少代码冲突和合并问题
- 提高代码审查效率
- 加快问题定位和修复
- 支持自动化发布流程

## 演进策略

- **新项目**：完整应用所有规范
- **现有项目**：从提交规范开始，逐步完善
- **试点推广**：选择团队试点，总结经验后推广
- **持续改进**：根据实践反馈优化规范