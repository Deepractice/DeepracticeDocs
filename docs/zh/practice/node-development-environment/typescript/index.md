---
layer: Practice
type: Index
title: TypeScript 开发规范
category: typescript
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - TypeScript
  - 类型系统
  - 编译配置
  - 最佳实践

# 目录级 PSO
purpose: 为组织成员提供 TypeScript 项目的统一开发规范，确保类型安全和代码质量
scope:
  includes:
    - TypeScript 编译器的标准化配置
    - 类型定义的统一规范
    - tsconfig.json 配置模板
    - 类型检查的标准流程
    - TypeScript 与工具链集成
    - 团队协作的类型约定
  excludes:
    - JavaScript 语法教学  # 基础知识
    - 具体框架的类型定义  # 属于框架文档
    - 业务逻辑类型设计  # 属于项目自身
outcome:
  - 团队使用一致的 TypeScript 配置
  - 类型安全得到有效保障
  - 开发者能专注于业务逻辑而非配置调试
  - 项目间能共享类型定义和配置
---

# TypeScript 开发规范

## 概述

TypeScript 已成为 Node.js 生态的事实标准，本目录提供完整的 TypeScript 开发规范，从配置到实践的全方位指导。

## 为什么选择 TypeScript？

### 核心优势

- **类型安全**：编译时捕获错误，减少运行时问题
- **更好的 IDE 支持**：智能提示、重构、导航
- **现代 JavaScript 特性**：装饰器、枚举、泛型等
- **渐进式采用**：可以逐步从 JavaScript 迁移
- **生态系统成熟**：大量类型定义和工具支持

### 在 Node.js 中的优势

- 与 npm 生态完美集成
- 支持 CommonJS 和 ESM
- 优秀的性能表现
- 丰富的 Node.js 类型定义

## 技术栈定位

| 方面 | 选择 | 理由 |
|------|------|------|
| **TypeScript 版本** | 5.0+ | 最新特性和性能优化 |
| **模块系统** | ESM 优先 | 现代化、Tree-shaking 支持 |
| **目标环境** | ES2022+ | Node.js 16+ 完全支持 |
| **严格模式** | strict: true | 最大化类型安全 |
| **路径映射** | paths 配置 | 清晰的模块导入 |

## 文档导航

### 📚 核心文档

1. [TypeScript 配置标准](./typescript-configuration.md) `Reference`
   - tsconfig.json 完整配置指南
   - 不同场景的配置模板
   - 编译选项详解

2. [TypeScript 最佳实践](./typescript-best-practices.md) `Reference`
   - 类型系统使用规范
   - 代码组织原则
   - 常见模式和反模式

3. [如何配置 TypeScript 项目](./how-to-setup-typescript.md) `How-to`
   - 从零开始配置 TypeScript
   - 与现有项目集成
   - 常见问题解决

4. [理解 TypeScript 编译原理](./understanding-typescript-compiler.md) `Explanation`（计划中）
   - 编译过程详解
   - 类型检查机制
   - 性能优化策略

## 快速开始

### 最小化配置

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "NodeNext",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 项目结构建议

```
my-project/
├── src/              # TypeScript 源码
│   ├── index.ts     # 入口文件
│   ├── types/       # 类型定义
│   └── utils/       # 工具函数
├── dist/            # 编译输出
├── tests/           # 测试文件
├── tsconfig.json    # TypeScript 配置
└── package.json     # 项目配置
```

## 最佳实践速览

### 类型定义原则

```typescript
// ✅ 好：使用接口定义对象形状
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ 好：使用类型别名定义联合类型
type Status = 'pending' | 'active' | 'inactive';

// ❌ 避免：使用 any
let data: any; // 失去类型安全

// ✅ 好：使用 unknown 代替 any
let data: unknown; // 保持类型安全
```

### 严格模式配置

始终启用严格模式以获得最大的类型安全：

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

## 常见场景

### Node.js 应用

- 服务端 API 开发
- CLI 工具开发
- 后台任务处理
- 微服务架构

### npm 包开发

- 发布 TypeScript 包
- 生成类型声明文件
- 支持 CommonJS 和 ESM
- 向后兼容策略

### Monorepo 项目

- 共享 TypeScript 配置
- 项目引用（Project References）
- 增量编译优化
- 类型共享策略

## 工具链集成

### 构建工具

- **tsc**：官方编译器
- **tsx**：直接运行 TypeScript
- **esbuild**：超快构建
- **Vite**：现代化构建

### 开发工具

- **ts-node**：REPL 和脚本执行
- **nodemon**：自动重启
- **ts-node-dev**：开发时热重载

### 质量工具

- **ESLint**：代码规范检查
- **@typescript-eslint**：TypeScript 专用规则
- **Prettier**：代码格式化

## 迁移策略

### 从 JavaScript 迁移

1. 安装 TypeScript 和类型定义
2. 重命名 .js 为 .ts
3. 添加 tsconfig.json
4. 逐步添加类型注解
5. 修复类型错误
6. 启用严格模式

### 版本升级

1. 查看 TypeScript 发布说明
2. 更新 tsconfig.json
3. 修复破坏性变更
4. 利用新特性优化代码

## 相关资源

### 内部文档

- [Monorepo 中的 TypeScript 配置](../monorepo/monorepo-standard.md#typescript-配置)
- [VSCode TypeScript 配置](../vscode/)（计划中）

### 外部资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [TypeScript Node Starter](https://github.com/microsoft/TypeScript-Node-Starter)

## 常见问题

### Q: 应该使用 CommonJS 还是 ESM？

**A:** 优先使用 ESM，它是 JavaScript 的未来。但如果需要兼容旧项目，可以配置 TypeScript 同时支持两种模块系统。

### Q: 如何处理第三方库没有类型定义的情况？

**A:** 
1. 首先尝试安装 `@types/package-name`
2. 如果没有，创建 `types/package-name.d.ts` 文件
3. 使用 `declare module` 声明基本类型
4. 考虑贡献类型定义到 DefinitelyTyped

### Q: TypeScript 会影响运行时性能吗？

**A:** 不会。TypeScript 只在编译时工作，运行的是编译后的 JavaScript 代码，性能与原生 JavaScript 相同。

### Q: 如何在 Monorepo 中共享 TypeScript 配置？

**A:** 使用配置继承：
1. 在根目录创建 `tsconfig.base.json`
2. 各项目通过 `extends` 继承基础配置
3. 使用 Project References 优化编译

---

*记住：TypeScript 不是约束，而是让 JavaScript 更强大的工具。*