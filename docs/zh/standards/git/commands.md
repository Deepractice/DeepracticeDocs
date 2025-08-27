# 命令行工具使用

本章介绍 Git 工作流中常用的命令行工具，包括 git-flow 和 GitHub CLI (gh) 的实际使用。

## git-flow 工具

### 安装 git-flow

```bash
# macOS
brew install git-flow

# Ubuntu/Debian
apt-get install git-flow

# Windows (使用 Git for Windows，已包含)
# 或通过 Chocolatey
choco install gitflow-avh
```

### 初始化项目

```bash
# 初始化 git-flow
git flow init

# 交互式配置（推荐接受默认值）
# Branch name for production releases: [main]
# Branch name for "next release" development: [develop]
# Feature branches: [feature/]
# Release branches: [release/]
# Hotfix branches: [hotfix/]
# Support branches: [support/]
# Version tag prefix: [v]
```

### Feature 开发流程

```bash
# 1. 开始新功能（基于 develop）
git flow feature start JIRA-123-user-auth

# 相当于：
# git checkout develop
# git pull origin develop
# git checkout -b feature/JIRA-123-user-auth

# 2. 发布功能分支到远程（便于协作）
git flow feature publish JIRA-123-user-auth
# 相当于：git push origin feature/JIRA-123-user-auth

# 3. 获取远程功能分支
git flow feature pull origin JIRA-123-user-auth

# 4. 完成功能（合并到 develop）
git flow feature finish JIRA-123-user-auth
# 相当于：
# git checkout develop
# git merge --no-ff feature/JIRA-123-user-auth
# git branch -d feature/JIRA-123-user-auth

# 5. 如果需要保留功能分支
git flow feature finish -k JIRA-123-user-auth
```

### Release 发布流程

```bash
# 1. 开始发布（基于 develop）
git flow release start 1.2.0

# 相当于：
# git checkout -b release/1.2.0 develop

# 2. 发布到远程（可选）
git flow release publish 1.2.0

# 3. 完成发布（合并到 main 和 develop）
git flow release finish 1.2.0

# 相当于：
# git checkout main
# git merge --no-ff release/1.2.0
# git tag -a v1.2.0
# git checkout develop
# git merge --no-ff release/1.2.0
# git branch -d release/1.2.0

# 4. 推送标签
git push origin --tags
```

### Hotfix 紧急修复

```bash
# 1. 开始紧急修复（基于 main）
git flow hotfix start 1.2.1

# 相当于：
# git checkout -b hotfix/1.2.1 main

# 2. 完成紧急修复（合并到 main 和 develop）
git flow hotfix finish 1.2.1

# 相当于：
# git checkout main
# git merge --no-ff hotfix/1.2.1
# git tag -a v1.2.1
# git checkout develop
# git merge --no-ff hotfix/1.2.1
# git branch -d hotfix/1.2.1
```

### Support 长期维护分支

```bash
# 创建长期支持分支
git flow support start 2.x v2.0.0

# 基于特定标签创建维护分支
# 用于维护老版本
```

### git-flow 配置

```bash
# 查看当前配置
git flow config

# 设置配置
git config --global gitflow.branch.master main
git config --global gitflow.branch.develop develop
git config --global gitflow.prefix.feature feature/
git config --global gitflow.prefix.release release/
git config --global gitflow.prefix.hotfix hotfix/
git config --global gitflow.prefix.versiontag v

# 设置是否推送到远程
git config --global gitflow.feature.finish.push yes
git config --global gitflow.release.finish.push yes
git config --global gitflow.hotfix.finish.push yes
```

## GitHub CLI (gh)

### 安装 GitHub CLI

```bash
# macOS
brew install gh

# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Windows
choco install gh
# 或
winget install --id GitHub.cli
```

### 认证配置

```bash
# 登录 GitHub
gh auth login

# 选择认证方式
# ? What account do you want to log into? GitHub.com
# ? What is your preferred protocol for Git operations? HTTPS
# ? Authenticate Git with your GitHub credentials? Yes
# ? How would you like to authenticate GitHub CLI? Login with a web browser

# 检查认证状态
gh auth status

# 查看认证 token
gh auth token
```

### Pull Request 操作

```bash
# 创建 PR
gh pr create
# 交互式创建，会提示输入标题、描述等

# 使用参数创建 PR
gh pr create \
  --title "feat(auth): add OAuth2 support" \
  --body "Implements OAuth2 authentication flow" \
  --base main \
  --head feature/oauth \
  --assignee @me \
  --label enhancement,backend \
  --milestone v1.2.0

# 从 Issue 创建 PR
gh pr create --title "Fix login bug" --body "Fixes #123"

# 查看 PR 列表
gh pr list
gh pr list --state all
gh pr list --author @me
gh pr list --assignee @me
gh pr list --label bug

# 查看 PR 详情
gh pr view 123
gh pr view 123 --web  # 在浏览器中打开

# 检出 PR 到本地
gh pr checkout 123

# 审查 PR
gh pr review 123 --approve
gh pr review 123 --request-changes --body "需要修改以下问题..."
gh pr review 123 --comment --body "看起来不错，但是..."

# 合并 PR
gh pr merge 123
gh pr merge 123 --squash
gh pr merge 123 --rebase
gh pr merge 123 --merge

# 关闭 PR
gh pr close 123
gh pr close 123 --comment "不再需要"

# 重新打开 PR
gh pr reopen 123
```

### Issue 操作

```bash
# 创建 Issue
gh issue create
gh issue create --title "Bug: Login timeout" --body "详细描述..."

# 查看 Issue 列表
gh issue list
gh issue list --label bug
gh issue list --assignee @me
gh issue list --state closed

# 查看 Issue 详情
gh issue view 123

# 关闭/重开 Issue
gh issue close 123
gh issue reopen 123

# 编辑 Issue
gh issue edit 123 --title "新标题"
gh issue edit 123 --add-label bug,urgent
gh issue edit 123 --remove-label wontfix

# 评论 Issue
gh issue comment 123 --body "已经在处理中"
```

### Release 操作

```bash
# 创建 Release
gh release create v1.2.0
gh release create v1.2.0 --title "Version 1.2.0" --notes "Release notes..."

# 从文件创建 Release notes
gh release create v1.2.0 -F CHANGELOG.md

# 自动生成 Release notes
gh release create v1.2.0 --generate-notes

# 创建预发布版本
gh release create v1.2.0-beta.1 --prerelease

# 创建草稿
gh release create v1.2.0 --draft

# 上传资源文件
gh release create v1.2.0 ./dist/*.zip

# 查看 Release 列表
gh release list
gh release list --limit 10

# 查看 Release 详情
gh release view v1.2.0

# 下载 Release 资源
gh release download v1.2.0
gh release download v1.2.0 --pattern "*.zip"

# 删除 Release
gh release delete v1.2.0
```

### Repo 操作

```bash
# 克隆仓库
gh repo clone owner/repo

# Fork 仓库
gh repo fork owner/repo
gh repo fork owner/repo --clone

# 创建仓库
gh repo create my-project --public
gh repo create my-project --private --clone
gh repo create org/project --team maintainers

# 查看仓库信息
gh repo view
gh repo view owner/repo
gh repo view --web  # 在浏览器中打开

# 同步 fork
gh repo sync owner/repo
```

### Workflow 查看（不运行）

```bash
# 查看工作流状态
gh workflow list
gh workflow view

# 查看运行历史
gh run list
gh run view 123

# 查看日志
gh run view 123 --log
gh run view 123 --log-failed
```

### 别名配置

```bash
# 设置别名
gh alias set prc 'pr create'
gh alias set prl 'pr list'
gh alias set prv 'pr view'
gh alias set prm 'pr merge'
gh alias set co 'pr checkout'

# 查看所有别名
gh alias list

# 删除别名
gh alias delete prc
```

### gh 配置

```bash
# 设置默认编辑器
gh config set editor vim

# 设置默认浏览器
gh config set browser firefox

# 设置 Git 协议
gh config set git_protocol ssh

# 查看配置
gh config list
```

## Git 命令增强

### 常用 Git 别名

```bash
# 配置实用的 Git 别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 使用别名
git co feature/new
git st
git lg --oneline -10
```

### 交互式操作

```bash
# 交互式添加
git add -i
git add -p  # 分块添加

# 交互式 rebase
git rebase -i HEAD~3

# 交互式清理
git clean -i
```

## 工作流组合示例

### Feature 开发完整流程

```bash
# 1. 使用 git-flow 创建功能分支
git flow feature start JIRA-123-oauth

# 2. 开发并提交
git add .
git commit -m "feat(auth): implement OAuth2 provider"
git commit -m "test(auth): add OAuth2 tests"

# 3. 推送到远程
git flow feature publish JIRA-123-oauth

# 4. 使用 gh 创建 PR
gh pr create \
  --title "feat(auth): add OAuth2 authentication" \
  --body "Implements #123" \
  --label enhancement

# 5. 查看 PR 状态
gh pr checks
gh pr status

# 6. PR 批准后，完成功能
git flow feature finish JIRA-123-oauth
```

### Release 发布完整流程

```bash
# 1. 开始发布
git flow release start 1.2.0

# 2. 更新版本文件和 CHANGELOG
echo "1.2.0" > VERSION
vim CHANGELOG.md
git add VERSION CHANGELOG.md
git commit -m "chore: bump version to 1.2.0"

# 3. 完成发布
git flow release finish 1.2.0 -m "Release v1.2.0"

# 4. 推送
git push origin main develop --tags

# 5. 创建 GitHub Release
gh release create v1.2.0 \
  --title "Version 1.2.0" \
  --generate-notes
```

### Hotfix 紧急修复流程

```bash
# 1. 创建 hotfix
git flow hotfix start 1.2.1

# 2. 修复问题
vim src/auth.js
git commit -am "fix: resolve authentication bypass"

# 3. 完成 hotfix
git flow hotfix finish 1.2.1 -m "Hotfix v1.2.1"

# 4. 推送
git push origin main develop --tags

# 5. 创建紧急 Release
gh release create v1.2.1 \
  --title "Security Hotfix 1.2.1" \
  --notes "Critical security fix for authentication bypass"
```

## 最佳实践

### DO ✅

- 使用 git-flow 管理复杂项目的分支
- 使用 gh CLI 提高 GitHub 操作效率
- 配置常用命令的别名
- 定期更新工具到最新版本
- 熟悉工具的交互式模式

### DON'T ❌

- 不要在生产分支直接使用 git-flow（先在测试项目练习）
- 避免在未认证的情况下使用 gh 命令
- 不要忽略工具的提示和警告
- 避免强制完成未准备好的 feature/release
- 不要删除远程的 release 标签

## 故障排查

### git-flow 常见问题

```bash
# 分支已存在
git flow feature start xxx
# Fatal: Branch 'feature/xxx' already exists
# 解决：删除或使用其他名称
git branch -d feature/xxx

# 无法完成 feature
git flow feature finish xxx
# Error: The current HEAD is not a feature branch
# 解决：确保在正确的分支
git checkout feature/xxx
```

### gh 常见问题

```bash
# 认证失败
gh pr list
# error: not authenticated
# 解决：重新登录
gh auth login

# 权限不足
gh pr merge
# error: insufficient permissions
# 解决：检查仓库权限或联系管理员

# API 限制
# error: API rate limit exceeded
# 解决：等待或使用 token 认证
```

## 相关资源

- [git-flow cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Pro Git Book](https://git-scm.com/book)