---
layer: Practice
type: How-to
title: 环境变量配置指南
category: node-development-environment/nodejs
status: published
version: 1.0.0
date: 2025-01-15
author: Sean Jiang & Claude
tags:
  - 环境变量
  - dotenv
  - 配置管理

purpose: 配置和管理 Node.js 项目的环境变量
scope:
  progression:
    1. 安装配置工具
    2. 创建环境文件
    3. 配置加载机制
    4. 实现类型安全
    5. 处理敏感信息
outcome:
  - 完整的环境变量管理方案
  - 类型安全的环境配置
  - 安全的敏感信息处理
---

# 环境变量配置指南

## 步骤 1：安装必要工具

```bash
# 基础工具
pnpm add -D dotenv

# 类型安全（TypeScript 项目）
pnpm add -D @types/node

# 环境变量验证
pnpm add zod
```

## 步骤 2：创建环境文件结构

### 文件组织

```
project/
├── .env                  # 默认配置（不提交）
├── .env.example          # 示例配置（提交）
├── .env.development      # 开发环境
├── .env.test            # 测试环境
├── .env.production      # 生产环境（不提交）
└── .env.local           # 本地覆盖（不提交）
```

### 创建 .env.example

```bash
# Application
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
DATABASE_POOL_SIZE=10

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# API Keys (never commit real keys)
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...

# Feature Flags
ENABLE_DEBUG=true
ENABLE_ANALYTICS=false

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### 创建 .env.development

```bash
# Development specific
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DATABASE_URL=postgresql://dev:dev@localhost:5432/myapp_dev

# Debug
DEBUG=app:*
ENABLE_DEBUG=true

# Logging
LOG_LEVEL=debug
LOG_FORMAT=pretty
```

### 创建 .env.test

```bash
# Test specific
NODE_ENV=test
PORT=0  # Random port

# Test Database
DATABASE_URL=postgresql://test:test@localhost:5432/myapp_test

# Disable external services
ENABLE_ANALYTICS=false
ENABLE_EMAIL=false

# Logging
LOG_LEVEL=error
```

## 步骤 3：配置加载机制

### 基础加载（src/config/env.js）

```javascript
import dotenv from 'dotenv';
import { resolve } from 'path';

// 加载顺序（后面的覆盖前面的）
const envFiles = [
  '.env',
  `.env.${process.env.NODE_ENV}`,
  '.env.local'
];

envFiles.forEach(file => {
  dotenv.config({
    path: resolve(process.cwd(), file)
  });
});

export const config = {
  // App
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  
  // Database
  database: {
    url: process.env.DATABASE_URL,
    poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10', 10)
  },
  
  // Redis
  redis: {
    url: process.env.REDIS_URL
  },
  
  // Auth
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // Features
  features: {
    debug: process.env.ENABLE_DEBUG === 'true',
    analytics: process.env.ENABLE_ANALYTICS === 'true'
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  }
};
```

## 步骤 4：实现类型安全

### TypeScript 配置（src/config/env.ts）

```typescript
import { z } from 'zod';
import dotenv from 'dotenv';
import { resolve } from 'path';

// 环境变量 Schema
const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default('localhost'),
  
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().positive().default(10),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // API Keys
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  
  // Features
  ENABLE_DEBUG: z.coerce.boolean().default(false),
  ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  
  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json')
});

// 类型定义
type EnvConfig = z.infer<typeof envSchema>;

// 加载环境变量
function loadEnv(): EnvConfig {
  // 加载文件
  const envFiles = [
    '.env',
    `.env.${process.env.NODE_ENV}`,
    '.env.local'
  ];
  
  envFiles.forEach(file => {
    dotenv.config({
      path: resolve(process.cwd(), file)
    });
  });
  
  // 验证并解析
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.format());
    process.exit(1);
  }
  
  return parsed.data;
}

// 导出配置
export const env = loadEnv();

// 导出类型
export type Env = typeof env;

// 工具函数
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
```

### 类型声明（src/types/env.d.ts）

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'test' | 'production';
      PORT: string;
      HOST: string;
      DATABASE_URL: string;
      DATABASE_POOL_SIZE?: string;
      REDIS_URL?: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN?: string;
      OPENAI_API_KEY?: string;
      STRIPE_SECRET_KEY?: string;
      ENABLE_DEBUG?: string;
      ENABLE_ANALYTICS?: string;
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
      LOG_FORMAT?: 'json' | 'pretty';
    }
  }
}

export {};
```

## 步骤 5：处理敏感信息

### 使用密钥管理服务

```typescript
// src/config/secrets.ts
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManager({ region: 'us-east-1' });

export async function getSecret(secretName: string): Promise<string> {
  try {
    const response = await client.getSecretValue({
      SecretId: secretName
    });
    return response.SecretString || '';
  } catch (error) {
    console.error(`Failed to get secret ${secretName}:`, error);
    throw error;
  }
}

// 使用示例
async function loadSecrets() {
  if (isProduction) {
    const jwtSecret = await getSecret('prod/jwt-secret');
    process.env.JWT_SECRET = jwtSecret;
  }
}
```

### Git 忽略配置

```bash
# .gitignore
# 环境文件
.env
.env.local
.env.production
.env.*.local

# 保留示例文件
!.env.example
!.env.development
!.env.test
```

## 步骤 6：使用环境变量

### 在应用中使用

```typescript
// src/server.ts
import { env } from './config/env';

const app = express();

// 使用配置
app.listen(env.PORT, env.HOST, () => {
  console.log(`Server running at http://${env.HOST}:${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  
  if (env.ENABLE_DEBUG) {
    console.log('Debug mode enabled');
  }
});
```

### 条件配置

```typescript
// src/database/index.ts
import { env, isProduction } from '../config/env';

const dbConfig = {
  connectionString: env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: env.DATABASE_POOL_SIZE,
  idleTimeoutMillis: isProduction ? 30000 : 5000
};
```

## 验证和测试

### 添加验证脚本

```json
{
  "scripts": {
    "env:check": "node -r dotenv/config scripts/check-env.js",
    "env:validate": "tsx src/config/env.ts"
  }
}
```

### 检查脚本（scripts/check-env.js）

```javascript
const required = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET'
];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(key => console.error(`  - ${key}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set');
```

## 最佳实践

### 环境变量命名

```bash
# ✅ 好的命名
DATABASE_URL=...
REDIS_HOST=...
API_KEY_OPENAI=...
FEATURE_FLAG_NEW_UI=...

# ❌ 避免的命名
db=...
key=...
flag1=...
```

### 默认值处理

```typescript
// ✅ 提供合理默认值
const port = process.env.PORT || 3000;
const logLevel = process.env.LOG_LEVEL || 'info';

// ✅ 必需值强制检查
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is required');
}
```

### 环境特定行为

```typescript
// 根据环境调整行为
if (isDevelopment) {
  // 开发环境：详细日志
  app.use(morgan('dev'));
} else if (isProduction) {
  // 生产环境：性能优化
  app.use(compression());
  app.use(helmet());
}
```

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 环境变量未加载 | 文件路径错误 | 检查文件位置和名称 |
| 类型错误 | 值格式不对 | 使用 zod 验证和转换 |
| 生产环境泄露 | 提交了 .env | 添加到 .gitignore |
| 覆盖不生效 | 加载顺序错误 | 调整文件加载顺序 |

## 下一步

环境变量配置完成！现在你可以：

1. [配置 TypeScript](../../typescript/how-to-setup-typescript.md) - 添加类型支持
2. [配置日志系统](../../logging/how-to-setup-logging.md) - 使用环境变量控制日志
3. [配置数据库连接](../../database/how-to-setup-database.md) - 使用 DATABASE_URL

---

*提示：永远不要将真实的密钥提交到版本控制，使用 .env.example 作为模板。*