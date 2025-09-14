---
layer: Practice
type: Index
title: VSCode 配置优化
category: vscode
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - VSCode
  - IDE配置
  - 开发环境
  - 编辑器优化

# 目录级 PSO
purpose: 为组织成员提供 VSCode 的统一配置标准，优化 Node.js/TypeScript 开发体验
scope:
  includes:
    - VSCode 设置的标准化配置
    - 必装扩展的统一清单
    - 工作区配置模板
    - 调试配置标准
    - 快捷键和代码片段
    - 团队配置共享方案
  excludes:
    - 其他编辑器配置  # WebStorm、Vim 等
    - 个人偏好设置  # 主题、字体等
    - 特定框架扩展  # 属于产品层
outcome:
  - 团队使用一致的 VSCode 配置
  - 开发效率得到显著提升
  - 新成员快速获得完整开发环境
  - 减少环境差异导致的问题
---

# VSCode 配置优化

## 概述

本目录提供针对 Node.js 和 TypeScript 开发优化的 VSCode 配置标准，确保团队成员拥有一致且高效的开发环境。

## 核心价值

- **开箱即用**：克隆项目即获得完整配置
- **性能优化**：针对大型项目的性能调优
- **智能提示**：最大化 TypeScript 智能感知
- **工具集成**：与工具链无缝协作
- **调试增强**：强大的调试配置

## 目录结构

```
vscode/
├── index.md                           # 本文件
├── vscode-settings-standard.md        # VSCode 设置标准（待创建）
├── extensions-standard.md             # 扩展清单标准（待创建）
├── debugging-configuration.md         # 调试配置标准（待创建）
├── workspace-configuration.md         # 工作区配置标准（待创建）
└── how-to-setup-vscode.md            # 如何配置 VSCode（待创建）
```

## 核心文档

### 配置标准
- VSCode 设置标准 `Reference` - 待创建
- 扩展清单标准 `Reference` - 待创建

### 开发增强
- 调试配置标准 `Reference` - 待创建
- 工作区配置标准 `Reference` - 待创建

### 操作指南
- 如何配置 VSCode `How-to` - 待创建

## 快速配置

### 工作区设置

```json
// .vscode/settings.json
{
  // TypeScript
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  
  // 格式化
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  
  // 文件
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/dist": true
  },
  
  // 搜索
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/*.lock": true
  }
}
```

### 必装扩展

```json
// .vscode/extensions.json
{
  "recommendations": [
    // 语言支持
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    
    // Git
    "eamodio.gitlens",
    "mhutchie.git-graph",
    
    // 开发工具
    "christian-kohler.path-intellisense",
    "streetsidesoftware.code-spell-checker",
    
    // Node.js
    "wix.vscode-import-cost",
    "christian-kohler.npm-intellisense",
    
    // 调试
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 调试配置

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "runtimeExecutable": "tsx",
      "program": "${workspaceFolder}/src/index.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Jest Tests",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["test", "--", "--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}
```

## 扩展分类

### 核心扩展（必装）

| 扩展 | 功能 | 配置要点 |
|------|------|----------|
| **ESLint** | 代码检查 | 自动修复、保存时运行 |
| **Prettier** | 代码格式化 | 设为默认格式化器 |
| **GitLens** | Git 增强 | 代码作者、历史查看 |

### 效率扩展（推荐）

| 扩展 | 功能 | 使用场景 |
|------|------|----------|
| **Path Intellisense** | 路径自动完成 | 导入文件 |
| **npm Intellisense** | npm 包自动完成 | 导入包 |
| **Import Cost** | 显示导入大小 | 优化包体积 |

### 可选扩展

| 扩展 | 功能 | 适合人群 |
|------|------|----------|
| **GitHub Copilot** | AI 代码助手 | 提升编码效率 |
| **Thunder Client** | API 测试 | 后端开发 |
| **Docker** | Docker 支持 | 容器化开发 |

## 性能优化

### 大型项目优化

```json
{
  // 排除大文件夹
  "typescript.tsserver.maxTsServerMemory": 4096,
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/dist/**": true
  },
  
  // 搜索优化
  "search.followSymlinks": false,
  "search.quickOpen.includeHistory": false
}
```

### TypeScript 性能

```json
{
  // 增量编译
  "typescript.tsserver.experimental.enableProjectDiagnostics": false,
  
  // 限制诊断
  "typescript.tsserver.watchOptions": {
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",
    "fallbackPolling": "dynamicPriority"
  }
}
```

## 代码片段

### TypeScript 片段

```json
// .vscode/typescript.code-snippets
{
  "TypeScript Interface": {
    "prefix": "intf",
    "body": [
      "interface ${1:Name} {",
      "  ${2:property}: ${3:type}",
      "}"
    ]
  },
  "Async Function": {
    "prefix": "afn",
    "body": [
      "async function ${1:name}(${2:params}): Promise<${3:void}> {",
      "  ${4}",
      "}"
    ]
  }
}
```

## 团队协作

### 配置共享

1. **项目级配置**：`.vscode/` 目录入版本控制
2. **用户级配置**：通过文档共享推荐设置
3. **扩展包**：创建扩展包集合

### 配置同步

```bash
# 导出配置
code --list-extensions > extensions.txt

# 导入配置
cat extensions.txt | xargs -L 1 code --install-extension
```

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| **TypeScript 版本不对** | 使用全局版本 | 选择工作区版本 |
| **ESLint 不工作** | 未安装依赖 | 运行 pnpm install |
| **格式化冲突** | 多个格式化器 | 设置默认格式化器 |
| **调试断点不生效** | 源码映射问题 | 检查 sourceMap 配置 |

## 最佳实践

### DO ✅

- 使用工作区 TypeScript 版本
- 配置文件入版本控制
- 定期更新扩展
- 使用代码片段提高效率
- 共享团队配置

### DON'T ❌

- 不要使用全局 TypeScript
- 不要忽略扩展推荐
- 不要禁用自动保存
- 不要关闭格式化
- 不要各自定制核心配置

## 相关资源

### 上层规范
- [Node.js 开发环境规范](../index.md) - 整体开发环境标准

### 相关配置
- [TypeScript 配置](../typescript/) - TypeScript 相关设置
- [工具链集成](../toolchain/) - ESLint、Prettier 集成

### 外部资源
- [VSCode Documentation](https://code.visualstudio.com/docs)
- [VSCode TypeScript](https://code.visualstudio.com/docs/languages/typescript)
- [VSCode Node.js](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)

---

*记住：好的编辑器配置是高效开发的第一步。*