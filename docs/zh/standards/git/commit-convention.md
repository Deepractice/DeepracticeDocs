# 提交规范

本章定义 Git 提交信息的格式规范，基于 Conventional Commits 标准，确保提交历史的可读性和自动化处理能力。

## Conventional Commits 规范

### 基本格式

```
<type>(<scope>): <subject>

[body]

[footer]
```

### 格式说明

- **type**: 提交类型（必需）
- **scope**: 影响范围（可选，推荐）
- **subject**: 简短描述（必需）
- **body**: 详细描述（可选）
- **footer**: 页脚信息（可选）

### 提交示例

```bash
# 简单提交
feat: add user authentication

# 带作用域
feat(auth): implement JWT authentication

# 带正文
fix(api): correct response status codes

Fixed incorrect HTTP status codes in error responses.
Now returns 404 for not found and 400 for bad request.

# 带页脚（关联 issue）
feat(payment): integrate Stripe payment

Implements Stripe payment gateway for subscription plans.

Closes #123
See-also: #456, #789

# 破坏性变更
feat!: drop support for Node 12

BREAKING CHANGE: Node 12 is no longer supported.
Minimum required version is now Node 16.
```

## 提交类型

### 标准类型定义

| 类型 | 说明 | 版本影响 | 示例 |
|------|------|----------|------|
| feat | 新功能 | Minor | feat: add dark mode support |
| fix | 错误修复 | Patch | fix: resolve login timeout issue |
| docs | 文档更新 | None | docs: update API documentation |
| style | 代码格式 | None | style: format code with prettier |
| refactor | 重构 | None | refactor: simplify auth logic |
| perf | 性能优化 | Patch | perf: optimize image loading |
| test | 测试相关 | None | test: add unit tests for auth |
| build | 构建系统 | None | build: update webpack config |
| ci | CI/CD | None | ci: add GitHub Actions workflow |
| chore | 杂项任务 | None | chore: update dependencies |
| revert | 回滚提交 | Varies | revert: revert commit abc123 |

### 类型使用指南

```yaml
# feat - 新增功能
feat: add user profile page
feat(api): add REST endpoint for user data
feat(ui): implement drag and drop

# fix - 修复问题
fix: resolve memory leak in data processor
fix(auth): correct token expiration logic
fix(ui): fix button alignment on mobile

# docs - 文档变更
docs: add contributing guidelines
docs(api): update endpoint descriptions
docs: fix typos in README

# refactor - 代码重构（不影响功能）
refactor: extract validation logic to utils
refactor(auth): simplify permission checks
refactor: use composition over inheritance

# perf - 性能优化
perf: lazy load heavy components
perf(db): add database indexes
perf: implement request caching

# test - 测试相关
test: add integration tests for auth
test(api): increase test coverage to 80%
test: fix flaky test in CI
```

## 作用域规范

### 作用域定义

作用域应该是项目中的模块或功能区域：

```yaml
# 前端项目常用作用域
- ui          # 用户界面
- auth        # 认证授权
- router      # 路由
- store       # 状态管理
- api         # API 调用
- utils       # 工具函数
- components  # 组件
- styles      # 样式

# 后端项目常用作用域
- api         # API 接口
- db          # 数据库
- auth        # 认证授权
- middleware  # 中间件
- service     # 服务层
- model       # 数据模型
- config      # 配置
- cache       # 缓存

# 通用作用域
- deps        # 依赖
- build       # 构建
- ci          # CI/CD
- docker      # Docker
- k8s         # Kubernetes
```

### 作用域使用规则

```bash
# ✅ 好的作用域使用
feat(auth): add OAuth2 support
fix(api): handle null response correctly
docs(install): update installation guide

# ⚠️ 考虑是否需要作用域
chore: update dependencies  # 全局影响，可不加
style: apply prettier formatting  # 全局格式化，可不加

# ❌ 避免的作用域
feat(code): add feature  # 太泛
fix(bug): fix issue  # 冗余
docs(doc): update docs  # 冗余
```

## 提交描述规范

### Subject 规范

简短描述应该：
- 不超过 50 个字符
- 使用祈使语气（动词原形）
- 不要句号结尾
- 首字母小写（英文）

```bash
# ✅ 正确示例
feat: add email notification
fix: prevent race condition in data sync
docs: clarify installation steps

# ❌ 错误示例
feat: Added email notification.  # 过去式 + 句号
fix: Fixes race condition  # 第三人称
docs: Updated docs  # 过去式
```

### Body 规范

详细描述（可选）：
- 解释 what 和 why，而不是 how
- 与 subject 空一行
- 每行不超过 72 字符
- 可以使用 Markdown 格式

```bash
fix(auth): prevent session hijacking vulnerability

This commit addresses a security issue where session tokens
could be reused after logout. The fix includes:

- Clear session from Redis on logout
- Add token blacklist mechanism
- Implement session timeout

Security audit: SA-2024-001
```

### Footer 规范

页脚信息用于：
- 关联 Issue
- 声明破坏性变更
- 引用相关资源

```bash
# 关联 Issue
Closes #123
Fixes #456
Resolves #789

# 破坏性变更
BREAKING CHANGE: API endpoint /users renamed to /api/users

# 相关引用
See-also: #123, #456
Refs: abc123
Co-authored-by: John Doe <john@example.com>
```

## 破坏性变更

### 标记方式

两种方式标记破坏性变更：

```bash
# 方式一：类型后加 !
feat!: remove deprecated API endpoints

# 方式二：Footer 中说明
feat: update authentication flow

BREAKING CHANGE: The auth token format has changed.
Old tokens will no longer be valid.

# 方式三：同时使用（推荐）
feat!: change API response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case.
Migration guide: https://docs.example.com/migration
```

### 破坏性变更说明

必须清楚说明：
1. 什么被改变了
2. 为什么要改变
3. 如何迁移

## 语言规范

### 项目语言策略

```yaml
# 开源项目
type: 英文
scope: 英文
subject: 英文
body: 英文

# 内部项目
type: 英文  # 保持工具兼容
scope: 英文  # 保持简洁
subject: 中文  # 便于理解
body: 中文  # 详细说明
```

### 中英文混合示例

```bash
# 内部项目示例
feat(auth): 添加微信登录支持

实现了微信 OAuth2 登录流程，支持：
- 微信网页授权
- 获取用户基本信息
- 自动创建本地账号

测试环境需要配置 WECHAT_APP_ID 和 WECHAT_APP_SECRET

Closes #234
```

## 原子化提交

### 提交粒度原则

每个提交应该：
- 包含一个逻辑上完整的改动
- 可以独立编译和测试
- 不会破坏构建
- 便于 review 和 cherry-pick

```bash
# ✅ 好的原子提交序列
git commit -m "feat(auth): add user model"
git commit -m "feat(auth): implement registration API"
git commit -m "test(auth): add registration tests"
git commit -m "docs(auth): document auth endpoints"

# ❌ 避免的提交
git commit -m "WIP"  # 工作未完成
git commit -m "fix"  # 描述不清
git commit -m "大量修改"  # 改动过多
git commit -m "临时提交"  # 无意义
```

### 拆分大改动

```bash
# 交互式暂存
git add -p

# 分次提交不同类型的改动
git add src/auth/*
git commit -m "feat(auth): add authentication module"

git add tests/auth/*
git commit -m "test(auth): add auth tests"

git add docs/*
git commit -m "docs: update auth documentation"
```

## 提交信息模板

### 配置模板

创建 `.gitmessage` 文件：

```
# <type>(<scope>): <subject>
# 
# <body>
# 
# <footer>
# 
# Type: feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert
# Scope: optional, e.g., auth|api|ui|db
# Subject: imperative, lowercase, no period
# Body: explain what and why, not how
# Footer: closes issues, breaking changes
```

配置 Git 使用模板：

```bash
git config --global commit.template ~/.gitmessage
```

### 项目模板

在项目中配置 `.gitmessage.txt`：

```
# Format: <type>(<scope>): <subject>
#
# Example: feat(auth): add login functionality
#
# Types:
# - feat:     New feature
# - fix:      Bug fix
# - docs:     Documentation
# - style:    Code style (formatting, semicolons, etc)
# - refactor: Code refactoring
# - perf:     Performance improvement
# - test:     Testing
# - build:    Build system changes
# - ci:       CI/CD changes
# - chore:    Maintenance tasks
# - revert:   Revert a commit
#
# Scope: module affected (optional but recommended)
#
# BREAKING CHANGE: description (in footer if needed)
# Closes: #issue-number (in footer if applicable)
```

## 提交历史整理

### Rebase 整理

```bash
# 交互式 rebase 最近 3 个提交
git rebase -i HEAD~3

# 常用操作
# pick = 使用提交
# reword = 修改提交信息
# edit = 修改提交内容
# squash = 合并到前一个提交
# fixup = 合并但丢弃提交信息
# drop = 删除提交
```

### 修正最近提交

```bash
# 修改最近的提交信息
git commit --amend -m "feat(auth): correct message"

# 添加遗漏的文件到最近提交
git add forgotten-file.js
git commit --amend --no-edit
```

### Squash 合并

```bash
# PR 合并时压缩（推荐小功能）
# GitHub/GitLab 界面选择 "Squash and merge"

# 本地压缩
git rebase -i main
# 将相关提交标记为 squash
```

## 自动化工具

### Commitlint 配置

`.commitlintrc.js`：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'build', 'ci', 'chore', 'revert'
    ]],
    'scope-enum': [2, 'always', [
      'auth', 'api', 'ui', 'db', 'config', 'deps'
    ]],
    'subject-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72],
  }
};
```

### Commitizen 配置

```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```

## 常见问题

### 提交信息写错了？

```bash
# 修改最近一次提交
git commit --amend

# 修改历史提交
git rebase -i <commit-hash>^
# 将需要修改的提交标记为 edit
```

### 提交到错误分支？

```bash
# 撤销提交但保留修改
git reset --soft HEAD~1

# 切换到正确分支
git checkout correct-branch

# 重新提交
git commit -m "feat: correct commit"
```

### 忘记关联 Issue？

```bash
# 修改提交信息添加关联
git commit --amend
# 在页脚添加：Closes #123
```

## 最佳实践

### DO ✅

- 每个提交都应该能通过测试
- 使用有意义的提交信息
- 遵循原子提交原则
- 定期推送到远程仓库
- 在提交前 review 自己的改动

### DON'T ❌

- 不要提交调试代码（console.log 等）
- 避免提交大文件（使用 Git LFS）
- 不要提交敏感信息（密码、密钥）
- 避免无意义的提交信息（WIP、fix、update）
- 不要在公共分支上修改历史

## 下一步

掌握提交规范后，请参考：
- [协作流程](./collaboration) - 学习 PR 和代码审查流程
- [工具配置](./tooling) - 配置自动化检查工具