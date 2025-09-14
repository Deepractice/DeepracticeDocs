---
layer: Practice
type: Reference
title: Node.js 配置标准
category: nodejs-environment
status: published
version: 1.0.0
date: 2025-01-14
author: Sean Jiang & Claude
tags:
  - Node.js
  - 环境变量
  - 运行时配置
  - 性能优化

purpose: 定义 Node.js 运行时配置和环境变量的组织标准
scope:
  includes:
    - 环境变量命名和管理
    - Node.js 运行参数配置
    - 内存和性能优化设置
    - 调试和日志配置
    - 多环境配置策略
  excludes:
    - 应用级业务配置  # 属于具体项目
    - 第三方库配置  # 属于具体使用
outcome:
  - 统一的环境变量管理方式
  - 优化的 Node.js 运行性能
  - 规范的配置文件组织
---

# Node.js 配置标准

## 环境变量规范

### 命名约定

| 类型 | 格式 | 示例 | 说明 |
|------|------|------|------|
| **Node.js 内置** | NODE_* | NODE_ENV | Node.js 识别的变量 |
| **应用配置** | APP_* | APP_PORT | 应用级配置 |
| **服务配置** | SERVICE_* | SERVICE_DB_HOST | 外部服务配置 |
| **特性开关** | FEATURE_* | FEATURE_NEW_API | 功能开关 |
| **调试配置** | DEBUG_* | DEBUG_LEVEL | 调试相关 |

### 基础环境变量

```bash
# 必需变量
NODE_ENV=development|test|production  # 运行环境
APP_NAME=project-name                 # 应用名称
APP_VERSION=1.0.0                    # 应用版本

# 推荐变量
APP_PORT=3000                        # 服务端口
APP_HOST=0.0.0.0                     # 监听地址
LOG_LEVEL=info                       # 日志级别
TZ=Asia/Shanghai                     # 时区设置
```

### NODE_ENV 标准值

| 值 | 用途 | 特点 |
|----|------|------|
| **development** | 本地开发 | 详细日志、热重载、源码映射 |
| **test** | 测试环境 | 测试数据、模拟服务、覆盖率 |
| **production** | 生产环境 | 性能优化、错误处理、安全加固 |
| **staging** | 预发布 | 类生产配置、真实数据测试 |

## Node.js 运行参数

### NODE_OPTIONS 配置

```bash
# 开发环境
NODE_OPTIONS="--max-old-space-size=2048 --enable-source-maps"

# 生产环境
NODE_OPTIONS="--max-old-space-size=4096 --no-warnings"

# 调试环境
NODE_OPTIONS="--inspect=0.0.0.0:9229 --trace-warnings"
```

### 关键参数说明

| 参数 | 默认值 | 推荐值 | 说明 |
|------|--------|--------|------|
| **--max-old-space-size** | ~1.5GB | 4096 | 最大堆内存(MB) |
| **--max-semi-space-size** | 16MB | 32 | 新生代半空间大小 |
| **--enable-source-maps** | false | true(dev) | 启用源码映射 |
| **--no-warnings** | false | true(prod) | 禁用警告 |
| **--trace-warnings** | false | true(dev) | 追踪警告来源 |

### 性能优化参数

```bash
# CPU 密集型应用
NODE_OPTIONS="--max-old-space-size=8192 --use-largepages=silent"

# I/O 密集型应用  
NODE_OPTIONS="--max-http-header-size=16384 --pending-deprecation"

# 高并发应用
UV_THREADPOOL_SIZE=128  # libuv 线程池大小
```

## 配置文件组织

### 目录结构

```
project/
├── .env                    # 默认配置（不提交）
├── .env.example           # 配置模板（提交）
├── .env.development       # 开发配置（不提交）
├── .env.test             # 测试配置（不提交）
├── .env.production       # 生产配置（不提交）
├── config/
│   ├── default.js        # 默认配置
│   ├── development.js    # 开发配置
│   ├── test.js          # 测试配置
│   └── production.js     # 生产配置
```

### .env 文件规范

```bash
# .env.example（模板文件，包含所有配置项）
# 应用基础配置
NODE_ENV=development
APP_NAME=my-app
APP_VERSION=1.0.0
APP_PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=
DB_PASSWORD=

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# 日志配置
LOG_LEVEL=info
LOG_FORMAT=json

# Node.js 配置
NODE_OPTIONS=--max-old-space-size=2048
```

### 配置加载优先级

```javascript
// 配置加载顺序（后面覆盖前面）
1. 默认配置 (config/default.js)
2. 环境配置 (config/${NODE_ENV}.js)
3. 环境变量文件 (.env.${NODE_ENV})
4. 系统环境变量
5. 命令行参数
```

## 配置管理工具

### dotenv 使用规范

```javascript
// 加载配置（尽早执行）
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

// TypeScript 项目
import * as dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
```

### 配置验证

```javascript
// 使用 joi 验证环境变量
const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  APP_PORT: Joi.number()
    .port()
    .default(3000),
  DB_HOST: Joi.string()
    .required(),
  DB_PORT: Joi.number()
    .port()
    .default(5432),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
```

## 调试配置

### Inspector 配置

```bash
# 开发环境调试
NODE_OPTIONS="--inspect=0.0.0.0:9229"

# 生产环境调试（谨慎使用）
NODE_OPTIONS="--inspect=127.0.0.1:9229"

# 断点调试
NODE_OPTIONS="--inspect-brk=0.0.0.0:9229"
```

### 日志配置

```javascript
// 统一日志级别定义
const LOG_LEVELS = {
  error: 0,   // 错误
  warn: 1,    // 警告
  info: 2,    // 信息
  http: 3,    // HTTP 日志
  verbose: 4, // 详细
  debug: 5,   // 调试
  silly: 6    // 所有
};

// 环境对应日志级别
const ENV_LOG_LEVEL = {
  production: 'warn',
  staging: 'info',
  test: 'info',
  development: 'debug'
};
```

## 安全配置

### 敏感信息管理

```bash
# 永远不要提交的文件
.env
.env.*
!.env.example

# 敏感变量命名（便于识别）
SECRET_*
*_PASSWORD
*_TOKEN
*_KEY
*_PRIVATE
```

### 配置加密

```javascript
// 敏感配置加密存储
const crypto = require('crypto');

function encryptConfig(text, password) {
  const algorithm = 'aes-256-gcm';
  const salt = crypto.randomBytes(32);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  // ... 加密逻辑
}

// 使用环境变量存储解密密钥
const CONFIG_ENCRYPTION_KEY = process.env.CONFIG_ENCRYPTION_KEY;
```

## 多环境策略

### 环境隔离

| 环境 | 数据库 | 缓存 | 日志 | 监控 |
|------|--------|------|------|------|
| **development** | 本地/Docker | 本地/Docker | 控制台 | 无 |
| **test** | 内存/测试库 | Mock | 文件 | 无 |
| **staging** | 独立实例 | 独立实例 | 集中式 | 基础 |
| **production** | 生产集群 | 生产集群 | 集中式 | 完整 |

### 配置示例

```javascript
// config/development.js
module.exports = {
  db: {
    host: 'localhost',
    port: 5432,
    ssl: false,
    pool: { min: 1, max: 5 }
  },
  cache: {
    ttl: 60,
    checkPeriod: 120
  },
  features: {
    debugMode: true,
    verboseLogging: true
  }
};

// config/production.js
module.exports = {
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: true,
    pool: { min: 10, max: 50 }
  },
  cache: {
    ttl: 3600,
    checkPeriod: 600
  },
  features: {
    debugMode: false,
    verboseLogging: false
  }
};
```

## 容器化配置

### Docker 环境变量

```dockerfile
# Dockerfile
FROM node:20-alpine

# 设置默认环境变量
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=2048" \
    TZ=Asia/Shanghai

# 运行时可覆盖
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION:-1.0.0}
```

### docker-compose 配置

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - APP_PORT=3000
      - DB_HOST=db
    env_file:
      - .env.production
    volumes:
      - ./config:/app/config:ro
```

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| **环境变量未生效** | 加载顺序错误 | 检查 dotenv 加载时机 |
| **内存溢出** | 堆内存不足 | 增加 max-old-space-size |
| **配置未找到** | 路径错误 | 使用绝对路径或 __dirname |
| **敏感信息泄露** | 提交了 .env | 添加到 .gitignore |

### 诊断命令

```bash
# 查看所有环境变量
node -e "console.log(process.env)"

# 查看 Node.js 配置
node -e "console.log(process.config)"

# 查看内存使用
node -e "console.log(process.memoryUsage())"

# 验证 NODE_OPTIONS
node -e "console.log(process.execArgv)"
```

## 最佳实践

### DO ✅

- 使用 .env.example 作为配置文档
- 按环境分离配置文件
- 验证必需的环境变量
- 为配置项提供合理默认值
- 记录配置变更

### DON'T ❌

- 不要硬编码配置值
- 不要提交包含敏感信息的文件
- 不要在代码中直接访问 process.env
- 不要使用全局变量存储配置
- 不要忽略配置验证

---

## 参考资源

- [Node.js CLI Options](https://nodejs.org/api/cli.html)
- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [The Twelve-Factor App](https://12factor.net/config)

---

*记住：好的配置管理让应用更易维护和部署。*