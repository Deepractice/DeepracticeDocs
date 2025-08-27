# 工具配置

本章介绍 Git 工作流相关工具的配置和使用，包括 Git Hooks、提交验证和辅助工具等。

## Git Hooks 配置

### Lefthook 配置

使用 Lefthook 管理 Git Hooks：

```bash
# 安装 Lefthook
npm install -D lefthook

# 或使用 pnpm
pnpm add -D lefthook
```

`lefthook.yml` 完整配置：

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: npx eslint {staged_files}
    
    format:
      glob: "*.{js,ts,jsx,tsx,json,css,md}"
      run: npx prettier --check {staged_files}
    
    type-check:
      glob: "*.{ts,tsx}"
      run: npx tsc --noEmit
    
    test:
      glob: "*.{test,spec}.{js,ts}"
      run: npx vitest related {staged_files} --run

commit-msg:
  commands:
    validate:
      run: npx commitlint --edit {1}

pre-push:
  parallel: true
  commands:
    test:
      run: npm test
    
    build:
      run: npm run build
    
    audit:
      run: npm audit --audit-level=high

post-checkout:
  commands:
    deps-install:
      run: |
        if [ {1} != {2} ]; then
          if [ -f package.json ]; then
            echo "📦 依赖可能已更改，运行 npm install..."
            npm install
          fi
        fi

post-merge:
  commands:
    deps-install:
      run: |
        if git diff HEAD@{1} --name-only | grep -E "(package-lock\.json|pnpm-lock\.yaml)"; then
          echo "📦 依赖已更改，运行安装..."
          npm install
        fi
```

### Husky 配置（备选）

如果选择使用 Husky：

```bash
# 安装 Husky
npm install -D husky

# 初始化
npx husky init

# 添加 hooks
npx husky add .husky/pre-commit "npm run lint-staged"
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

`.husky/pre-commit`：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint-staged
```

## Commitlint 配置

### 安装和基础配置

```bash
# 安装 commitlint
npm install -D @commitlint/cli @commitlint/config-conventional

# 创建配置文件
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

### 自定义配置

`commitlint.config.js`：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复
        'docs',     // 文档
        'style',    // 格式
        'refactor', // 重构
        'perf',     // 性能
        'test',     // 测试
        'build',    // 构建
        'ci',       // CI
        'chore',    // 杂项
        'revert'    // 回滚
      ]
    ],
    
    // 作用域配置
    'scope-enum': [
      2,
      'always',
      [
        // 前端作用域
        'ui',
        'auth',
        'router',
        'store',
        'api',
        
        // 后端作用域
        'server',
        'db',
        'middleware',
        
        // 通用作用域
        'deps',
        'config',
        'docs'
      ]
    ],
    
    // 其他规则
    'subject-case': [0],  // 不限制 subject 大小写
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    
    // 自定义规则
    'signed-off-by': [0],  // 不要求 Signed-off-by
    'footer-max-line-length': [2, 'always', 100]
  },
  
  // 忽略某些提交
  ignores: [(message) => message.includes('WIP')],
  
  // 帮助信息
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint'
};
```

### 提交提示配置

```json
// package.json
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

## Lint-staged 配置

### 安装和配置

```bash
npm install -D lint-staged
```

`.lintstagedrc.js`：

```javascript
module.exports = {
  // JavaScript/TypeScript 文件
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'vitest related --run'
  ],
  
  // 样式文件
  '*.{css,scss,sass,less}': [
    'stylelint --fix',
    'prettier --write'
  ],
  
  // JSON 文件
  '*.json': [
    'prettier --write'
  ],
  
  // Markdown 文件
  '*.md': [
    'prettier --write',
    'markdownlint --fix'
  ],
  
  // YAML 文件
  '*.{yml,yaml}': [
    'prettier --write'
  ],
  
  // 包管理文件
  'package.json': [
    'prettier --write',
    'sort-package-json'
  ]
};
```

## Git 配置优化

### 全局 Git 配置

```bash
# 基础配置
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 默认分支名
git config --global init.defaultBranch main

# 拉取策略
git config --global pull.rebase true

# 自动修正命令
git config --global help.autocorrect 1

# 颜色输出
git config --global color.ui auto

# 编辑器
git config --global core.editor "code --wait"

# 别名设置
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

### 项目 Git 配置

`.gitconfig`：

```ini
[core]
    # 换行符处理
    autocrlf = input
    
    # 文件权限
    filemode = false
    
    # 忽略大小写（Windows）
    ignorecase = true
    
    # 符号链接
    symlinks = true

[merge]
    # 合并工具
    tool = vscode
    
[mergetool "vscode"]
    cmd = code --wait $MERGED

[diff]
    # Diff 工具
    tool = vscode
    
[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE

[fetch]
    # 自动清理
    prune = true

[push]
    # 推送当前分支
    default = current
    
    # 自动设置上游
    autoSetupRemote = true
```

## 依赖更新工具

### Dependabot 配置

`.github/dependabot.yml`：

```yaml
version: 2
updates:
  # npm 依赖
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        patterns:
          - "*"
        dependency-type: "development"
      production-dependencies:
        patterns:
          - "*"
        dependency-type: "production"
    commit-message:
      prefix: "chore"
      prefix-development: "chore"
      include: "scope"
    labels:
      - "dependencies"
```

### Renovate 配置（备选）

`renovate.json`：

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    "group:allNonMajor"
  ],
  "labels": ["dependencies"],
  "prConcurrentLimit": 5,
  "rangeStrategy": "bump",
  "semanticCommits": "enabled",
  "semanticCommitType": "chore",
  "semanticCommitScope": "deps",
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": false
    },
    {
      "matchDepTypes": ["devDependencies"],
      "automerge": false
    }
  ],
  "schedule": ["after 10pm every weekday", "before 5am every weekday", "every weekend"]
}
```

## VS Code 集成

### 推荐扩展

`.vscode/extensions.json`：

```json
{
  "recommendations": [
    // Git 增强
    "eamodio.gitlens",
    "donjayamanne.githistory",
    "mhutchie.git-graph",
    
    // 提交工具
    "vivaxy.vscode-conventional-commits",
    "joshbolduc.commitlint",
    
    // 代码质量
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "stylelint.vscode-stylelint",
    
    // Markdown
    "DavidAnson.vscode-markdownlint",
    "yzhang.markdown-all-in-one"
  ]
}
```

### VS Code 设置

`.vscode/settings.json`：

```json
{
  // Git 设置
  "git.enableSmartCommit": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.pruneOnFetch": true,
  "git.pullTags": true,
  
  // GitLens 设置
  "gitlens.advanced.messages": {
    "suppressCommitHasNoPreviousCommitWarning": false
  },
  "gitlens.codeLens.enabled": true,
  "gitlens.defaultDateStyle": "relative",
  
  // 提交消息
  "conventionalCommits.autoCommit": false,
  "conventionalCommits.promptScopes": true,
  "conventionalCommits.showEditor": true,
  "conventionalCommits.lineBreak": "\\n",
  
  // 格式化
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true,
    "source.fixAll.markdownlint": true
  }
}
```

## 命令行工具

### 有用的 Git 别名

```bash
# ~/.gitconfig 或 ~/.config/git/config
[alias]
    # 查看
    l = log --oneline --graph --decorate
    ll = log --oneline --graph --decorate --all
    ls = log --oneline --graph --decorate --stat
    
    # 分支
    ba = branch -a
    bd = branch -d
    bD = branch -D
    
    # 提交
    ca = commit --amend
    can = commit --amend --no-edit
    
    # 状态
    s = status -s
    ss = status
    
    # 差异
    d = diff
    dc = diff --cached
    dt = difftool
    
    # 清理
    cleanup = "!git branch --merged | grep -v '\\*\\|master\\|main\\|develop' | xargs -n 1 git branch -d"
    fresh = "!git fetch --all --prune && git reset --hard origin/$(git symbolic-ref --short HEAD)"
    
    # 撤销
    undo = reset --soft HEAD~1
    unstage = reset HEAD --
    
    # 统计
    stats = shortlog -sn --all --no-merges
    today = "!git log --since=00:00:00 --all --no-merges --oneline --author=$(git config user.email)"
    
    # 工作流
    fp = fetch --prune
    save = "!git add -A && git commit -m 'SAVEPOINT'"
    wip = commit -am "WIP"
    
    # 交互
    rb = rebase -i
    cp = cherry-pick
```

## 故障排查

### 常见问题解决

```bash
# Hooks 不执行
chmod +x .git/hooks/*
npx lefthook install --force

# Commitlint 报错
npx commitlint --from HEAD~1 --to HEAD --verbose

# 权限问题
git config core.filemode false

# 换行符问题
git config core.autocrlf input
git rm --cached -r .
git reset --hard

# 大文件问题
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/large/file" \
  --prune-empty --tag-name-filter cat -- --all
```

### 调试工具

```bash
# Git 调试
GIT_TRACE=1 git <command>
GIT_CURL_VERBOSE=1 git <command>
GIT_SSH_COMMAND="ssh -vvv" git <command>

# Hooks 调试
LEFTHOOK_VERBOSE=1 lefthook run pre-commit

# Commitlint 调试
echo "feat: test" | npx commitlint --verbose
```

## 最佳实践

### DO ✅

- 配置并使用 Git Hooks
- 定期更新工具版本
- 使用别名提高效率
- 文档化工具配置
- 使用 git-flow 和 gh 命令提高效率

### DON'T ❌

- 不要跳过 Git Hooks
- 避免手动执行重复任务
- 不要忽略工具警告
- 避免使用过时的工具
- 不要在 hooks 中执行耗时操作

## 相关资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Lefthook](https://github.com/evilmartians/lefthook)
- [git-flow cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [GitHub CLI Manual](https://cli.github.com/manual/)