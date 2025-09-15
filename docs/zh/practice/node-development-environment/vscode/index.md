---
layer: Practice
type: Index
title: VSCode 配置优化规范
category: node-development-environment/vscode
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - VSCode
  - IDE配置
  - 开发体验
  - 编辑器
  - 工作区

# 目录级 PSO
purpose: 定义 VSCode 编辑器的统一配置标准，作为父级 PSO 中"开发体验"的核心实现
scope:
  includes:
    - 工作区设置（settings.json）
    - 推荐扩展（extensions.json）
    - 代码片段（snippets）
    - 调试配置（launch.json）
    - 任务配置（tasks.json）
    - 快捷键优化（keybindings.json）
  excludes:
    - 个人偏好设置（主题、字体）
    - 特定框架扩展
    - 付费扩展推荐
    - 操作系统特定配置
outcome:
  - 统一的编辑器配置
  - 开箱即用的开发环境
  - 高效的编码体验
  - 团队配置一致性
---

# VSCode 配置优化规范

## 概述

VSCode 是 Node.js 开发的首选编辑器。优化的 VSCode 配置能够：
- 提供一致的开发体验
- 自动化常见操作
- 增强代码提示和补全
- 集成所有开发工具

## 工作区配置

### .vscode/settings.json

```json
{
  // 编辑器基础设置
  "editor.fontSize": 14,
  "editor.fontFamily": "'Cascadia Code', 'Fira Code', Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.renderWhitespace": "boundary",
  "editor.rulers": [80, 100],
  "editor.wordWrap": "bounded",
  "editor.wordWrapColumn": 120,
  "editor.minimap.enabled": true,
  "editor.minimap.maxColumn": 80,
  
  // 格式化设置
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": false,
  "editor.formatOnType": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit",
    "source.sortMembers": "never"
  },
  
  // 文件设置
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "files.trimFinalNewlines": true,
  "files.encoding": "utf8",
  "files.autoSave": "onFocusChange",
  
  // 文件关联
  "files.associations": {
    "*.env.*": "dotenv",
    ".prettierrc": "json",
    ".eslintrc": "json",
    "*.config.js": "javascript",
    "*.config.ts": "typescript"
  },
  
  // 文件排除
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.turbo": true,
    "**/*.tsbuildinfo": true
  },
  
  // 搜索排除
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/coverage": true,
    "**/.turbo": true,
    "**/pnpm-lock.yaml": true,
    "**/package-lock.json": true
  },
  
  // TypeScript 设置
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.importModuleSpecifier": "shortest",
  "typescript.preferences.importModuleSpecifierEnding": "minimal",
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.preferences.quoteStyle": "single",
  "typescript.suggest.autoImports": true,
  "typescript.suggest.completeFunctionCalls": true,
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.parameterTypes.enabled": true,
  "typescript.inlayHints.variableTypes.enabled": true,
  "typescript.inlayHints.propertyDeclarationTypes.enabled": true,
  "typescript.inlayHints.functionLikeReturnTypes.enabled": true,
  
  // JavaScript 设置
  "javascript.updateImportsOnFileMove.enabled": "always",
  "javascript.preferences.importModuleSpecifier": "shortest",
  "javascript.preferences.quoteStyle": "single",
  "javascript.suggest.autoImports": true,
  "javascript.suggest.completeFunctionCalls": true,
  
  // ESLint 设置
  "eslint.enable": true,
  "eslint.packageManager": "pnpm",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.run": "onType",
  "eslint.codeActionsOnSave.mode": "problems",
  
  // Prettier 设置
  "prettier.enable": true,
  "prettier.requireConfig": true,
  "prettier.useEditorConfig": true,
  
  // Git 设置
  "git.enableSmartCommit": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.rebaseWhenSync": true,
  
  // 终端设置
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.defaultProfile.windows": "powershell",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.fontFamily": "Cascadia Code, monospace",
  "terminal.integrated.env.osx": {
    "FIG_NEW_SESSION": "1"
  },
  
  // npm 设置
  "npm.packageManager": "pnpm",
  "npm.scriptExplorerAction": "run",
  
  // 其他扩展设置
  "cSpell.words": [
    "monorepo",
    "pnpm",
    "vitest",
    "commitlint",
    "lefthook",
    "turborepo",
    "deepractice"
  ],
  "errorLens.enabled": true,
  "errorLens.delay": 100,
  "errorLens.enabledDiagnosticLevels": ["error", "warning"],
  
  // Copilot 设置（如果使用）
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true,
    "markdown": true
  }
}
```

## 推荐扩展

### .vscode/extensions.json

```json
{
  "recommendations": [
    // 核心扩展（必装）
    "dbaeumer.vscode-eslint",              // ESLint
    "esbenp.prettier-vscode",              // Prettier
    "streetsidesoftware.code-spell-checker", // 拼写检查
    "usernamehw.errorlens",                // 错误提示增强
    "editorconfig.editorconfig",           // EditorConfig
    
    // TypeScript/JavaScript
    "ms-vscode.vscode-typescript-next",    // TS 最新特性
    "christian-kohler.path-intellisense",  // 路径补全
    "christian-kohler.npm-intellisense",   // npm 包补全
    "formulahendry.auto-rename-tag",       // 自动重命名标签
    "wix.vscode-import-cost",             // 导入成本提示
    
    // Git
    "eamodio.gitlens",                    // Git 增强
    "mhutchie.git-graph",                  // Git 图形化
    "donjayamanne.githistory",             // Git 历史
    
    // 开发辅助
    "wayou.vscode-todo-highlight",        // TODO 高亮
    "gruntfuggly.todo-tree",              // TODO 树
    "aaron-bond.better-comments",         // 注释增强
    "naumovs.color-highlight",            // 颜色高亮
    "oderwat.indent-rainbow",              // 缩进彩虹
    "2gua.rainbow-brackets",              // 彩虹括号
    
    // Markdown
    "yzhang.markdown-all-in-one",         // Markdown 增强
    "davidanson.vscode-markdownlint",     // Markdown 检查
    "bierner.markdown-preview-github-styles", // GitHub 风格预览
    
    // 其他工具
    "humao.rest-client",                  // REST 客户端
    "rangav.vscode-thunder-client",       // API 测试
    "mikestead.dotenv",                   // .env 支持
    "redhat.vscode-yaml",                 // YAML 支持
    "tamasfe.even-better-toml",          // TOML 支持
    
    // AI 辅助（可选）
    "github.copilot",                     // GitHub Copilot
    "tabnine.tabnine-vscode"             // Tabnine
  ],
  "unwantedRecommendations": [
    "ms-vscode.vscode-typescript-tslint-plugin", // 已废弃
    "hookyqr.beautify"                           // 使用 Prettier
  ]
}
```

## 代码片段

### .vscode/typescript.code-snippets

```json
{
  "Import Statement": {
    "prefix": "imp",
    "body": [
      "import { $2 } from '$1'"
    ],
    "description": "Import statement"
  },
  
  "Export Function": {
    "prefix": "expf",
    "body": [
      "export function ${1:functionName}(${2:params}): ${3:ReturnType} {",
      "  $0",
      "}"
    ],
    "description": "Export function"
  },
  
  "Async Function": {
    "prefix": "afn",
    "body": [
      "async function ${1:functionName}(${2:params}): Promise<${3:ReturnType}> {",
      "  $0",
      "}"
    ],
    "description": "Async function"
  },
  
  "Try Catch": {
    "prefix": "tc",
    "body": [
      "try {",
      "  $1",
      "} catch (error) {",
      "  console.error('Error:', error)",
      "  $0",
      "}"
    ],
    "description": "Try catch block"
  },
  
  "Interface": {
    "prefix": "intf",
    "body": [
      "interface ${1:InterfaceName} {",
      "  $0",
      "}"
    ],
    "description": "TypeScript interface"
  },
  
  "Type": {
    "prefix": "typ",
    "body": [
      "type ${1:TypeName} = {",
      "  $0",
      "}"
    ],
    "description": "TypeScript type"
  },
  
  "Test Suite": {
    "prefix": "desc",
    "body": [
      "describe('${1:Suite Name}', () => {",
      "  it('${2:should do something}', () => {",
      "    $0",
      "  })",
      "})"
    ],
    "description": "Test suite"
  },
  
  "Test Case": {
    "prefix": "it",
    "body": [
      "it('${1:should do something}', () => {",
      "  $0",
      "})"
    ],
    "description": "Test case"
  }
}
```

## 调试配置

### .vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Current File",
      "program": "${file}",
      "skipFiles": ["<node_internals>/**"],
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["tsx"],
      "args": ["${file}"],
      "cwd": "${workspaceFolder}",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229,
      "restart": true,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug npm Script",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["run", "${input:scriptName}"],
      "console": "integratedTerminal"
    }
  ],
  "inputs": [
    {
      "id": "scriptName",
      "type": "promptString",
      "description": "Enter the npm script name"
    }
  ]
}
```

## 任务配置

### .vscode/tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build",
      "type": "npm",
      "script": "build",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": "$tsc",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Test",
      "type": "npm",
      "script": "test",
      "group": {
        "kind": "test",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Dev",
      "type": "npm",
      "script": "dev",
      "isBackground": true,
      "problemMatcher": {
        "owner": "typescript",
        "fileLocation": "relative",
        "pattern": {
          "regexp": "^([^\\s].*)(\\d+|\\d+,\\d+|\\d+,\\d+,\\d+,\\d+):\\s+(error|warning|info)\\s+(TS\\d+)\\s*:\\s*(.*)$",
          "file": 1,
          "location": 2,
          "severity": 3,
          "code": 4,
          "message": 5
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "^.*Starting compilation.*$",
          "endsPattern": "^.*Compilation complete.*$"
        }
      }
    },
    {
      "label": "Lint Fix",
      "type": "shell",
      "command": "pnpm lint:fix",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Format",
      "type": "shell",
      "command": "pnpm format",
      "presentation": {
        "reveal": "silent",
        "panel": "shared"
      }
    }
  ]
}
```

## 快捷键优化

### .vscode/keybindings.json

```json
[
  // 运行任务
  {
    "key": "cmd+shift+b",
    "command": "workbench.action.tasks.build"
  },
  {
    "key": "cmd+shift+t",
    "command": "workbench.action.tasks.test"
  },
  
  // 格式化
  {
    "key": "shift+alt+f",
    "command": "editor.action.formatDocument"
  },
  {
    "key": "cmd+k cmd+f",
    "command": "editor.action.formatSelection"
  },
  
  // 导航
  {
    "key": "cmd+p",
    "command": "workbench.action.quickOpen"
  },
  {
    "key": "cmd+shift+p",
    "command": "workbench.action.showCommands"
  },
  
  // 重构
  {
    "key": "f2",
    "command": "editor.action.rename"
  },
  {
    "key": "cmd+.",
    "command": "editor.action.quickFix"
  },
  
  // 终端
  {
    "key": "ctrl+`",
    "command": "workbench.action.terminal.toggleTerminal"
  },
  {
    "key": "cmd+shift+c",
    "command": "workbench.action.terminal.new"
  }
]
```

## 工作区推荐

### 多项目工作区

```json
// monorepo.code-workspace
{
  "folders": [
    {
      "name": "Root",
      "path": "."
    },
    {
      "name": "Web App",
      "path": "apps/web"
    },
    {
      "name": "API Service",
      "path": "services/api"
    },
    {
      "name": "UI Package",
      "path": "packages/ui"
    }
  ],
  "settings": {
    "files.exclude": {
      "**/node_modules": true,
      "**/dist": true
    }
  },
  "extensions": {
    "recommendations": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode"
    ]
  }
}
```

## 性能优化

### 大型项目优化

```json
{
  // 排除大文件夹
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.turbo/**": true,
    "**/coverage/**": true
  },
  
  // 限制文件监听
  "files.maxMemoryForLargeFilesMB": 4096,
  
  // TypeScript 性能
  "typescript.tsserver.maxTsServerMemory": 4096,
  "typescript.tsserver.experimental.enableProjectDiagnostics": false,
  
  // 搜索优化
  "search.followSymlinks": false,
  "search.smartCase": true,
  
  // 编辑器性能
  "editor.largeFileOptimizations": true,
  "editor.maxTokenizationLineLength": 5000
}
```

## 团队协作

### 统一配置策略

1. **必须提交的文件**
   - `.vscode/settings.json` - 工作区设置
   - `.vscode/extensions.json` - 推荐扩展
   - `.vscode/launch.json` - 调试配置
   - `.vscode/tasks.json` - 任务配置

2. **不应提交的文件**
   - `.vscode/settings.json` 中的个人偏好
   - 个人快捷键配置
   - 本地历史记录

### EditorConfig

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.{json,yml,yaml}]
indent_size = 2

[Makefile]
indent_style = tab
```

## 最佳实践

### ✅ 应该做的

1. **提交配置文件** - .vscode 目录进入版本控制
2. **使用工作区** - Monorepo 项目使用工作区
3. **安装推荐扩展** - 团队统一使用推荐扩展
4. **保持更新** - 定期更新 VSCode 和扩展

### ❌ 不应该做的

1. **强制个人偏好** - 不要强制主题、字体等
2. **过多扩展** - 不要推荐过多扩展
3. **忽略性能** - 大项目要注意性能配置
4. **硬编码路径** - 使用相对路径和变量

## 故障排查

### 常见问题

**Q: TypeScript 服务响应慢**
```json
{
  "typescript.tsserver.maxTsServerMemory": 8192,
  "typescript.tsserver.experimental.enableProjectDiagnostics": false
}
```

**Q: ESLint 不工作**
```bash
# 检查 ESLint 输出
View > Output > ESLint

# 重启 ESLint
Cmd+Shift+P > ESLint: Restart ESLint Server
```

**Q: 格式化冲突**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 相关资源

### 内部文档
- [Node.js 开发环境规范](../index.md) - 父级规范
- [代码检查标准](../linting/index.md) - ESLint 配置
- [TypeScript 配置](../typescript/index.md) - TS 配置

### 外部资源
- [VSCode 文档](https://code.visualstudio.com/docs) - 官方文档
- [VSCode 扩展市场](https://marketplace.visualstudio.com) - 扩展市场
- [VSCode 快捷键](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf) - 快捷键表

---

*记住：好的编辑器配置是高效开发的基础。统一配置，提升效率，专注创造。*