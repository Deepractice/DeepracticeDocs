# 版本发布

本章定义版本管理和发布流程，包括版本号规范、发布流程、回滚策略等。

## 语义化版本

### 版本号格式

遵循语义化版本规范（Semantic Versioning）：

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

- **MAJOR**: 破坏性变更
- **MINOR**: 新功能（向后兼容）
- **PATCH**: 问题修复（向后兼容）
- **PRERELEASE**: 预发布版本
- **BUILD**: 构建元数据

### 版本号示例

```yaml
# 正式版本
1.0.0   # 首个稳定版本
1.1.0   # 添加新功能
1.1.1   # 修复问题
2.0.0   # 破坏性变更

# 预发布版本
1.0.0-alpha      # 内测版本
1.0.0-alpha.1    # 内测迭代
1.0.0-beta       # 公测版本
1.0.0-beta.2     # 公测迭代
1.0.0-rc.1       # 候选版本

# 带构建信息
1.0.0+20240101           # 日期
1.0.0+build.123          # 构建号
1.0.0-beta+exp.sha.5114  # 实验版本
```

### 版本升级规则

基于提交类型自动确定版本升级：

| 提交类型 | 版本升级 | 示例 |
|---------|---------|------|
| fix | Patch | 1.0.0 → 1.0.1 |
| feat | Minor | 1.0.1 → 1.1.0 |
| feat! / BREAKING CHANGE | Major | 1.1.0 → 2.0.0 |
| docs, style, refactor, test, chore | 不升级 | 1.0.0 → 1.0.0 |
| perf | Patch | 1.0.0 → 1.0.1 |

## 发布流程

### GitHub Flow 发布

适用于持续部署的应用：

```mermaid
flowchart LR
    A[main分支] --> B[创建tag]
    B --> C[触发CI/CD]
    C --> D[构建制品]
    D --> E[部署生产]
    E --> F[发布完成]
```

**发布步骤**：
```bash
# 1. 确保 main 分支最新
git checkout main
git pull origin main

# 2. 创建标签
git tag -a v1.2.0 -m "Release version 1.2.0"

# 3. 推送标签
git push origin v1.2.0

# 4. CI/CD 自动部署
```

### Git Flow 发布

适用于需要版本管理的库：

```mermaid
flowchart TB
    A[develop分支] --> B[创建release分支]
    B --> C[版本准备]
    C --> D[合并到main]
    D --> E[创建tag]
    E --> F[合并回develop]
    F --> G[发布完成]
```

**发布步骤**：
```bash
# 1. 创建 release 分支
git checkout -b release/1.2.0 develop

# 2. 版本准备
# - 更新版本号
# - 更新 CHANGELOG
# - 最终测试

# 3. 完成 release
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

# 4. 合并回 develop
git checkout develop
git merge --no-ff release/1.2.0

# 5. 删除 release 分支
git branch -d release/1.2.0

# 6. 推送
git push origin main develop --tags
```

## 发布清单

### 发布前检查

```markdown
## 发布前检查清单
- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 文档已更新
- [ ] CHANGELOG 已更新
- [ ] 版本号已更新
- [ ] 依赖已更新
- [ ] 安全扫描通过
- [ ] 性能测试通过
- [ ] 兼容性测试通过
- [ ] 发布说明已准备
```

### CHANGELOG 维护

`CHANGELOG.md` 格式：

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2024-01-15

### Added
- New OAuth2 authentication support
- User profile management API

### Changed
- Improved error handling in API responses
- Updated dependencies to latest versions

### Fixed
- Fixed memory leak in data processor
- Resolved login timeout issue

### Security
- Patched XSS vulnerability in user input

## [1.1.0] - 2024-01-01

### Added
- Email notification system
- Dark mode support

### Deprecated
- Legacy authentication API (will be removed in 2.0.0)

### Removed
- Support for Node.js 12
```

### 自动生成 CHANGELOG

使用 conventional-changelog：

```bash
# 安装工具
npm install -D conventional-changelog-cli

# 生成 CHANGELOG
npx conventional-changelog -p angular -i CHANGELOG.md -s

# 配置 package.json
{
  "scripts": {
    "version": "conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md"
  }
}
```

## 标签管理

### 标签命名规范

```bash
# 生产版本
v1.0.0
v2.1.3

# 预发布版本
v1.0.0-beta.1
v1.0.0-rc.1

# 不推荐的命名
1.0.0          # 缺少 v 前缀
version-1.0.0  # 格式不标准
release-1.0.0  # 应该用 tag 而不是分支名
```

### 标签创建

```bash
# 创建带注释的标签（推荐）
git tag -a v1.2.0 -m "Release version 1.2.0

Features:
- Add OAuth2 authentication
- Implement user profile API

Fixes:
- Fix memory leak
- Resolve timeout issues"

# 签名标签（需要 GPG 密钥）
git tag -s v1.2.0 -m "Release version 1.2.0"

# 查看标签信息
git show v1.2.0
```

### 标签推送

```bash
# 推送单个标签
git push origin v1.2.0

# 推送所有标签
git push origin --tags

# 删除远程标签（慎用）
git push origin --delete v1.2.0
```

## 版本维护策略

### 长期支持版本（LTS）

根据项目决定维护策略：

```yaml
maintenance_policy:
  current:
    version: 3.x
    support: active
    security: yes
    features: yes
    
  lts:
    version: 2.x
    support: maintenance
    security: yes
    features: no
    
  deprecated:
    version: 1.x
    support: security-only
    security: critical-only
    features: no
    
  eol:
    version: 0.x
    support: none
    security: no
    features: no
```

### 补丁策略

```bash
# 当前版本补丁
git checkout main
git cherry-pick <commit-hash>
git tag v3.1.1

# LTS 版本补丁
git checkout v2-lts
git cherry-pick <commit-hash>
git tag v2.5.8

# 安全补丁
git checkout security/v1.x
git cherry-pick <security-fix>
git tag v1.9.15
```

## 回滚策略

### 快速回滚

生产问题的分级处理：

```bash
# 级别 1：紧急回滚（跳过审查）
# 立即回滚到上一个稳定版本
git revert <problem-commit>
git push origin main

# 级别 2：标准回滚（需要审查）
# 创建回滚 PR
git checkout -b revert/problem-fix
git revert <problem-commit>
git push origin revert/problem-fix
# 创建 PR 并快速审查

# 级别 3：通过部署回滚
# 不改代码，重新部署之前的版本
kubectl rollout undo deployment/app
```

### 回滚决策树

```mermaid
flowchart TD
    A[发现问题] --> B{影响范围}
    B -->|全部用户| C[紧急回滚]
    B -->|部分用户| D{严重程度}
    D -->|崩溃/数据丢失| C
    D -->|功能异常| E[标准回滚]
    D -->|性能问题| F[评估后决定]
    F -->|可接受| G[下版本修复]
    F -->|不可接受| E
```

### 回滚后处理

```markdown
## 回滚后必需步骤
1. **通知**
   - [ ] 通知团队回滚完成
   - [ ] 更新状态页面
   - [ ] 通知受影响用户

2. **分析**
   - [ ] 根因分析（RCA）
   - [ ] 编写事故报告
   - [ ] 制定改进措施

3. **修复**
   - [ ] 创建修复分支
   - [ ] 添加测试用例
   - [ ] 充分测试后重新发布

4. **复盘**
   - [ ] 团队复盘会议
   - [ ] 更新发布流程
   - [ ] 更新监控告警
```

## 自动化发布

### GitHub Release

`.github/workflows/release.yml`：

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        run: |
          npm ci
          npm run build
      
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            Changes in this Release
            - Feature 1
            - Fix 1
          draft: false
          prerelease: false
      
      - name: Upload Assets
        uses: actions/upload-release-asset@v1
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./dist/app.zip
          asset_name: app.zip
          asset_content_type: application/zip
```

### Semantic Release

配置自动化版本管理：

```json
// package.json
{
  "scripts": {
    "semantic-release": "semantic-release"
  },
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/github",
      "@semantic-release/git"
    ]
  }
}
```

`.releaserc.js`：

```javascript
module.exports = {
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        {type: 'feat', release: 'minor'},
        {type: 'fix', release: 'patch'},
        {type: 'perf', release: 'patch'},
        {breaking: true, release: 'major'}
      ]
    }],
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    '@semantic-release/github'
  ]
};
```

## 发布通知

### 发布说明模板

```markdown
# Release v1.2.0

## 🎉 Highlights
- OAuth2 authentication support
- Improved performance by 30%
- New user dashboard

## ✨ New Features
- **Authentication**: OAuth2 login with Google and GitHub
- **Dashboard**: Real-time analytics dashboard
- **API**: New REST endpoints for user management

## 🐛 Bug Fixes
- Fixed memory leak in data processor (#123)
- Resolved login timeout issue (#456)
- Corrected timezone handling (#789)

## 💔 Breaking Changes
- Removed support for Node.js 12
- API endpoint `/users` renamed to `/api/users`
- Changed authentication token format

## 📦 Dependencies
- Updated React to v18.2.0
- Updated Express to v4.18.0
- Security updates for various packages

## 📝 Migration Guide
For upgrading from v1.x to v2.0:
1. Update Node.js to version 16 or higher
2. Update API endpoint calls
3. Regenerate authentication tokens

Full migration guide: [link]

## 🙏 Contributors
Thanks to all contributors who made this release possible!

## 📊 Stats
- 42 commits
- 15 files changed
- 5 contributors
```

## 版本命名传统

### 代号命名（可选）

为主要版本使用代号：

```yaml
versions:
  v1.0.0: "Genesis"
  v2.0.0: "Phoenix"
  v3.0.0: "Quantum"
  v4.0.0: "Nova"
```

## 最佳实践

### DO ✅

- 遵循语义化版本规范
- 维护详细的 CHANGELOG
- 创建带注释的标签
- 测试发布流程
- 准备回滚方案

### DON'T ❌

- 不要跳过版本号
- 避免频繁的破坏性变更
- 不要删除已发布的版本
- 避免手动修改版本号
- 不要忽视预发布测试

## 下一步

掌握版本发布后，请参考：
- [工具配置](./tooling) - 配置自动化发布工具
- [分支管理](./branch-management) - 了解发布分支策略