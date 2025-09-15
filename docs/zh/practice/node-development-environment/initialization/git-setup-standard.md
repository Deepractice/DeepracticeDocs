---
layer: Practice
type: Reference
title: Git 初始化配置标准
category: node-development-environment/initialization
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude

purpose: 定义项目 Git 仓库的初始化和配置标准
scope:
  includes:
    - Git 初始化流程
    - 分支命名规范
    - 提交消息规范
    - Git 配置最佳实践
    - Git hooks 配置
  excludes:
    - Git 工作流规范  # 属于协作规范
    - CI/CD 集成  # 属于 DevOps 规范
    - 高级 Git 技巧  # 属于技能培训
outcome:
  - 规范的 Git 仓库配置
  - 统一的分支和提交规范
  - 自动化的代码质量检查
---

# Git 初始化配置标准

## 初始化流程

### 基础初始化

```bash
# 1. 初始化仓库
git init

# 2. 设置默认分支名
git branch -M main

# 3. 配置用户信息（如未全局配置）
git config user.name "Your Name"
git config user.email "your.email@deepractice.ai"

# 4. 首次提交
git add .
git commit -m "chore: initial commit"

# 5. 添加远程仓库
git remote add origin https://github.com/deepractice/project.git

# 6. 推送到远程
git push -u origin main
```

### 配置优化

```bash
# 设置默认编辑器
git config core.editor "code --wait"

# 配置换行符处理
git config core.autocrlf input  # macOS/Linux
git config core.autocrlf true   # Windows

# 启用颜色输出
git config color.ui auto

# 设置默认推送策略
git config push.default current

# 配置 pull 策略
git config pull.rebase true

# 忽略文件权限变化
git config core.filemode false
```

## 分支命名规范

### 分支类型

| 类型 | 格式 | 用途 | 示例 |
|------|------|------|------|
| 主分支 | `main` | 生产代码 | `main` |
| 开发分支 | `develop` | 开发集成 | `develop` |
| 功能分支 | `feature/*` | 新功能开发 | `feature/user-auth` |
| 修复分支 | `fix/*` | Bug 修复 | `fix/login-error` |
| 热修复 | `hotfix/*` | 紧急修复 | `hotfix/security-patch` |
| 发布分支 | `release/*` | 版本发布 | `release/1.2.0` |
| 实验分支 | `experiment/*` | 实验性功能 | `experiment/new-algo` |

### 命名规则

- 使用小写字母
- 单词间用连字符（-）分隔
- 简洁且描述性
- 包含 issue 编号（如适用）

```bash
# 好的例子
feature/add-payment-gateway
fix/issue-123-cart-calculation
release/v2.1.0

# 避免
Feature/AddPayment  # 大写
fix_cart_bug        # 下划线
feature/f1          # 无意义
```

## 提交消息规范

### Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型（type）

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add user authentication` |
| `fix` | Bug 修复 | `fix: resolve login timeout issue` |
| `docs` | 文档更新 | `docs: update API documentation` |
| `style` | 代码格式 | `style: format code with prettier` |
| `refactor` | 重构 | `refactor: simplify auth logic` |
| `perf` | 性能优化 | `perf: optimize database queries` |
| `test` | 测试 | `test: add unit tests for auth` |
| `build` | 构建系统 | `build: update webpack config` |
| `ci` | CI 配置 | `ci: add GitHub Actions workflow` |
| `chore` | 其他修改 | `chore: update dependencies` |
| `revert` | 回滚 | `revert: revert commit abc123` |

### 范围（scope）

可选，指明修改的模块：

```bash
feat(auth): add OAuth2 support
fix(api): handle null response
docs(readme): update installation guide
```

### 提交示例

```bash
# 简单提交
git commit -m "feat: add dark mode toggle"

# 带范围
git commit -m "fix(cart): calculate tax correctly"

# 带详细说明
git commit -m "refactor(auth): simplify token validation

- Extract validation logic to separate module
- Add comprehensive error handling
- Improve performance by 30%

Closes #123"

# Breaking Change
git commit -m "feat!: change API response format

BREAKING CHANGE: API now returns data in 'result' field instead of 'data'"
```

## Git Hooks 配置

### 使用 Lefthook

```bash
# 安装 Lefthook
pnpm add -D lefthook

# 初始化 Lefthook
pnpm exec lefthook install
```

### lefthook.yml 配置

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,jsx,ts,tsx}"
      run: pnpm eslint {staged_files} --fix
    format:
      glob: "*.{js,jsx,ts,tsx,json,md,yml,yaml}"
      run: pnpm prettier {staged_files} --write
    typecheck:
      glob: "*.{ts,tsx}"
      run: pnpm tsc --noEmit

commit-msg:
  commands:
    commitlint:
      run: pnpm exec commitlint --edit {1}

pre-push:
  commands:
    test:
      run: pnpm test
    build:
      run: pnpm build
```

### 简化配置（推荐）

```yaml
# lefthook.yml
pre-commit:
  commands:
    lint-staged:
      run: pnpm lint-staged

commit-msg:
  commands:
    commitlint:
      run: pnpm exec commitlint --edit {1}
```

### lint-staged 配置（配合 Lefthook）

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### commitlint 配置

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72]
  }
};
```

## .gitignore 模板

见 [配置文件模板](./config-templates.md#gitignore) 中的详细配置。

## .gitattributes 配置

```gitattributes
# Auto detect text files and perform LF normalization
* text=auto eol=lf

# Force LF for these files
*.js text eol=lf
*.jsx text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
*.sh text eol=lf

# Force CRLF for Windows files
*.bat text eol=crlf
*.cmd text eol=crlf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
*.woff binary
*.woff2 binary

# Diff settings
*.min.js -diff
*.min.css -diff
package-lock.json -diff
pnpm-lock.yaml -diff
yarn.lock -diff

# Language statistics
*.css linguist-vendored
*.scss linguist-vendored
*.less linguist-vendored
docs/* linguist-documentation
```

## Git 别名配置

```bash
# 常用别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'

# 美化日志
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 显示分支图
git config --global alias.graph "log --graph --oneline --all"

# 快速修正上次提交
git config --global alias.amend "commit --amend --no-edit"

# 交互式添加
git config --global alias.ai "add -i"
```

## 标签规范

### 版本标签

```bash
# 语义化版本
git tag v1.0.0 -m "Release version 1.0.0"
git tag v1.0.1 -m "Patch release 1.0.1"
git tag v1.1.0 -m "Minor release 1.1.0"
git tag v2.0.0 -m "Major release 2.0.0"

# 预发布版本
git tag v1.0.0-alpha.1
git tag v1.0.0-beta.1
git tag v1.0.0-rc.1

# 推送标签
git push origin v1.0.0
git push origin --tags  # 推送所有标签
```

## 最佳实践

### 提交原则

1. **原子性提交** - 每个提交只做一件事
2. **频繁提交** - 小步快跑，便于追踪
3. **有意义的消息** - 清晰描述改动内容
4. **测试后提交** - 确保代码可运行

### 分支管理

1. **保持 main 稳定** - 只合并经过测试的代码
2. **及时删除分支** - 合并后删除功能分支
3. **定期同步** - 从 main 拉取最新代码
4. **小分支** - 避免长期存在的大分支

### 协作规范

1. **Pull Request** - 通过 PR 进行代码审查
2. **保护分支** - 设置 main 分支保护规则
3. **签名提交** - 使用 GPG 签名验证身份
4. **清晰的历史** - 使用 rebase 保持线性历史

## 故障排除

### 常见问题

```bash
# 撤销上次提交（保留修改）
git reset --soft HEAD~1

# 撤销上次提交（丢弃修改）
git reset --hard HEAD~1

# 修改提交消息
git commit --amend -m "new message"

# 清理未跟踪文件
git clean -fd

# 恢复误删文件
git checkout HEAD -- path/to/file

# 解决合并冲突
git status  # 查看冲突文件
# 手动编辑解决冲突
git add .
git commit
```

---

*提示：将 Git 配置保存为脚本，便于新项目快速配置。*