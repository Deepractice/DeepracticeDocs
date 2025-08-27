# Monorepo 基础架构规范

## 规范定位

本规范提供一个**零业务、纯技术**的 Monorepo 项目模板，让你能在 5 分钟内启动一个可工作的多包项目。

**核心理念**：
- 🎯 **最小可工作集** - 只包含必要的基础设施
- 🚀 **开箱即用** - clone 后立即可以开发
- 🔧 **工具预配置** - 所有工具链已调试完毕
- 📦 **包管理就绪** - 创建新包、互相引用零摩擦

## 实际模板

本规范基于真实可运行的模板项目：[MonorepoTemplate](https://github.com/Deepractice/MonorepoTemplate)

```bash
# 克隆并启动
git clone https://github.com/Deepractice/MonorepoTemplate.git my-project
cd my-project
pnpm install
pnpm dev
```

## 你将获得什么

### 立即可用的能力
- ✅ **5 分钟启动** - 安装依赖后即可开始开发
- ✅ **零配置构建** - tsup 预配置，支持 CJS/ESM/DTS
- ✅ **智能任务编排** - Turborepo 并行执行和缓存
- ✅ **类型安全** - TypeScript 全面支持
- ✅ **代码规范** - ESLint + Prettier 预设
- ✅ **Git Hooks** - Lefthook 自动安装配置

### 预配置的工具链
| 工具 | 版本 | 用途 |
|------|------|------|
| **pnpm** | 8.x | Workspace 包管理 |
| **Turborepo** | 最新 | 任务编排和缓存 |
| **TypeScript** | 5.x | 类型系统 |
| **tsup** | 8.x | 零配置构建工具 |
| **Lefthook** | 最新 | Git hooks 管理 |
| **Node.js** | ≥18.19.0 | 运行环境 |

### 标准化的项目结构
```
monorepo-template/
├── apps/              # 应用程序（Web、移动端等）
├── packages/          # 共享包（组件、工具、类型等）
├── services/          # 后端服务（API、Worker 等）
├── tools/             # 工具脚本
│   └── scripts/      # 自动化脚本
├── configs/           # 共享配置
│   ├── eslint/       # ESLint 预设
│   ├── prettier/     # Prettier 配置
│   └── tsconfig/     # TypeScript 基础配置
├── .vscode/          # VSCode 工作区配置
├── turbo.json        # Turborepo 任务定义
├── pnpm-workspace.yaml # pnpm 工作区配置
├── lefthook.yml      # Git hooks 配置
├── package.json      # 根配置
└── README.md         # 项目说明
```

## 核心命令

### 日常开发
```bash
pnpm dev          # 启动所有包的开发模式
pnpm build        # 构建所有包
pnpm test         # 运行测试
pnpm lint         # 代码检查
pnpm type-check   # 类型检查
```

### 包管理
```bash
pnpm add -D typescript -w              # 根目录添加依赖
pnpm add express --filter @myapp/api   # 特定包添加依赖
pnpm create turbo@latest                # 创建新应用（推荐）
```

### 维护命令
```bash
pnpm clean        # 清理构建产物
pnpm fresh        # 完全重装（清理 + 安装）
```

## 使用场景

这个模板适合作为以下项目的起点：

| 场景 | 示例结构 |
|------|----------|
| **全栈应用** | `apps/web` + `apps/admin` + `services/api` + `packages/shared` |
| **组件库** | `packages/ui` + `packages/icons` + `apps/docs` |
| **微服务** | `services/auth` + `services/payment` + `packages/types` |
| **SDK开发** | `packages/core` + `packages/plugins/*` + `apps/playground` |

## 规范章节

### [1. 项目初始化](/zh/standards/monorepo/initialization)
环境准备、工具安装、从零创建 Monorepo 项目。

### [2. 开发环境配置](/zh/standards/monorepo/environment)
模块系统、构建工具、TypeScript、代码规范和测试框架的配置。

### [3. 工作区配置](/zh/standards/monorepo/workspace)
pnpm workspace、Turborepo、TypeScript 项目引用的配置。

### [4. 工程化规范](/zh/standards/monorepo/engineering)
代码规范、编辑器配置、Git hooks 等最佳实践。

## 快速验证

### 1. 创建测试包
```bash
# 在 packages 目录创建一个 utils 包
mkdir -p packages/utils/src
cat > packages/utils/package.json << EOF
{
  "name": "@myproject/utils",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "tsup src/index.ts --watch",
    "build": "tsup src/index.ts --format cjs,esm --dts"
  }
}
EOF

# 创建源文件
echo 'export const hello = (name: string) => `Hello, ${name}!`' > packages/utils/src/index.ts
```

### 2. 安装并构建
```bash
pnpm install
pnpm build
```

### 3. 查看构建产物
```bash
ls packages/utils/dist/
# 输出: index.js  index.mjs  index.d.ts  index.d.mts
```

## 设计原则

1. **零业务代码** - 模板中不包含任何业务逻辑示例
2. **最小依赖** - 只包含必要的开发依赖
3. **配置继承** - 通过基础配置减少重复
4. **约定优于配置** - 提供合理的默认值
5. **渐进式扩展** - 可根据需要逐步添加功能

## 与其他规范的关系

本规范专注于 Monorepo 的**基础架构**，不涉及：
- ❌ 具体的代码架构（如 DDD、三层架构）→ 见[应用架构规范]
- ❌ 业务领域划分（如用户系统、支付系统）→ 见[领域设计规范]
- ❌ 部署和 CI/CD → 见[部署规范]
- ❌ 具体框架选择（React、Vue、Express 等）→ 见[技术栈规范]

## 常见问题

### 为什么选择 pnpm？
- **磁盘效率**：硬链接机制节省存储空间
- **速度快**：并行安装，智能缓存
- **严格模式**：防止幽灵依赖
- **Workspace**：原生支持 Monorepo

### 为什么选择 Turborepo？
- **智能缓存**：自动跳过未改变的构建
- **并行执行**：最大化 CPU 利用率
- **零配置**：开箱即用的任务编排
- **远程缓存**：团队共享构建结果

### 为什么选择 tsup？
- **零配置**：无需复杂的 webpack/rollup 配置
- **快速**：基于 esbuild，构建速度极快
- **多格式**：同时输出 CJS/ESM/DTS
- **Watch 模式**：开发时自动重构建

## 下一步

1. 📖 阅读[项目初始化](/zh/standards/monorepo/initialization)了解详细步骤
2. 🚀 克隆[模板项目](https://github.com/Deepractice/MonorepoTemplate)开始实践
3. 💡 根据实际需求扩展模板功能