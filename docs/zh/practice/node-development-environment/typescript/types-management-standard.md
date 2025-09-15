---
layer: Practice
type: Reference  
title: 类型管理规范
category: node-development-environment/typescript
status: published
version: 1.0.0
date: 2025-01-15

purpose: 定义 TypeScript 类型文件的组织和管理标准
scope:
  includes:
    - 类型文件组织
    - 类型定义规范
    - 第三方类型处理
  excludes:
    - 具体业务类型
outcome:
  - 清晰的类型组织
  - 可维护的类型系统
---

# 类型管理规范

## 类型文件组织

```
src/
├── types/
│   ├── index.ts          # 统一导出
│   ├── global.d.ts       # 全局类型
│   ├── env.d.ts          # 环境变量类型
│   ├── api.types.ts     # API 类型
│   ├── models.types.ts  # 数据模型
│   └── utils.types.ts   # 工具类型
```

## 类型定义规范

### 基础类型

```typescript
// types/utils.types.ts
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;
```

### 全局类型

```typescript
// types/global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
    }
  }
}
```

### 模块声明

```typescript
// types/modules.d.ts
declare module '*.json' {
  const value: any;
  export default value;
}
```

## 第三方类型

```bash
# 安装 DefinitelyTyped 类型
pnpm add -D @types/node @types/express

# 缺失类型的处理
echo "declare module 'untyped-module';" >> src/types/modules.d.ts
```

---

*记住：好的类型定义是 TypeScript 项目的基石。*
