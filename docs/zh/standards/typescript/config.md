# 配置规范

本章定义 TypeScript 项目的配置标准，确保项目配置的一致性和可维护性。

## 基础配置

### 1.1 TypeScript 版本策略

#### 1.1.1 版本选择原则
```json
{
  "devDependencies": {
    "typescript": "^5.3.0"  // 始终使用最新稳定版
  }
}
```

**版本策略**：
- 新项目：直接采用最新稳定版
- 现有项目：每季度评估升级
- 库项目：确保与主流框架兼容

#### 1.1.2 版本升级流程
1. 查看 TypeScript 发布说明
2. 运行升级影响分析：`npx typescript@latest --showConfig`
3. 更新 tsconfig.json 中的新选项
4. 运行完整的类型检查：`tsc --noEmit`
5. 修复所有类型错误后合并

### 1.2 配置文件组织

#### 1.2.1 基础 + 扩展模式
```
项目根目录/
├── tsconfig.base.json    # 基础配置（共享）
├── tsconfig.json          # 开发配置（继承 base）
├── tsconfig.build.json    # 构建配置（继承 base）
├── tsconfig.test.json     # 测试配置（继承 base）
└── packages/
    └── pkg-a/
        └── tsconfig.json  # 包配置（继承根目录 base）
```

#### 1.2.2 基础配置示例
`tsconfig.base.json`:
```json
{
  "compilerOptions": {
    // 类型检查
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    
    // 模块
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    
    // 输出
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    
    // 项目选项
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": true,
    
    // 路径
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@tests/*": ["./tests/*"]
    }
  }
}
```

#### 1.2.3 场景扩展配置
`tsconfig.json` (开发配置):
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,  // 开发时不输出文件
    "allowJs": true,
    "checkJs": true
  },
  "include": [
    "src/**/*",
    "tests/**/*",
    "*.config.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage"
  ]
}
```

`tsconfig.build.json` (构建配置):
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "removeComments": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/__tests__/**",
    "**/__mocks__/**"
  ]
}
```

### 1.3 严格模式设置

#### 1.3.1 必须启用的严格选项
```json
{
  "compilerOptions": {
    "strict": true,  // 启用所有严格类型检查选项
    // strict 包含以下选项：
    // - noImplicitAny
    // - noImplicitThis
    // - alwaysStrict
    // - strictBindCallApply
    // - strictNullChecks
    // - strictFunctionTypes
    // - strictPropertyInitialization
  }
}
```

#### 1.3.2 额外的严格选项
```json
{
  "compilerOptions": {
    // 未使用检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    
    // 控制流检查
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    // 索引访问检查
    "noUncheckedIndexedAccess": true,
    
    // 精确的可选属性
    "exactOptionalPropertyTypes": true,
    
    // 不允许隐式覆盖
    "noImplicitOverride": true
  }
}
```

#### 1.3.3 迁移策略
对于现有项目逐步启用严格模式：
```json
{
  "compilerOptions": {
    // 第一阶段：基础严格
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    
    // 第二阶段：完整严格
    "strict": true,
    
    // 第三阶段：额外严格
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## 编译选项

### 2.1 模块解析策略

#### 2.1.1 Bundler 模式配置
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",  // TypeScript 5.0+ 推荐
    "module": "ESNext",
    "allowImportingTsExtensions": true,  // 允许 .ts 扩展名导入
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

#### 2.1.2 兼容性配置
当需要兼容旧环境时：
```json
{
  "compilerOptions": {
    // Node.js 项目
    "moduleResolution": "node16",  // 或 "nodenext"
    "module": "node16",
    
    // 旧版打包工具
    "moduleResolution": "node",
    "module": "commonjs"
  }
}
```

### 2.2 路径别名配置

#### 2.2.1 标准别名设置
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"],
      "@config/*": ["./src/config/*"],
      "@assets/*": ["./src/assets/*"],
      "@tests/*": ["./tests/*"]
    }
  }
}
```

#### 2.2.2 Monorepo 别名配置
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@company/*": ["./packages/*/src"],
      "@apps/*": ["./apps/*/src"],
      "@shared/*": ["./packages/shared/src/*"],
      "@config/*": ["./configs/*"]
    }
  }
}
```

#### 2.2.3 打包工具同步配置
确保打包工具识别 TypeScript 的路径别名：

**Vite 配置**：
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()]
})
```

**Webpack 配置**：
```javascript
// webpack.config.js
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  resolve: {
    plugins: [new TsconfigPathsPlugin()]
  }
}
```

### 2.3 输出配置

#### 2.3.1 目标版本设置
```json
{
  "compilerOptions": {
    // 推荐：让打包工具处理兼容性
    "target": "ESNext",
    
    // 库文件
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    
    // Node.js 项目
    "lib": ["ESNext"],
    
    // 特定环境
    "lib": ["ES2022", "DOM"]  // 需要特定 ES 特性时
  }
}
```

#### 2.3.2 声明文件配置
```json
{
  "compilerOptions": {
    // 生成声明文件
    "declaration": true,
    "declarationMap": true,  // 生成 .d.ts.map 文件
    "emitDeclarationOnly": false,  // 是否只生成声明文件
    
    // 声明文件输出目录
    "declarationDir": "./dist/types",
    "outDir": "./dist"
  }
}
```

#### 2.3.3 Source Map 配置
```json
{
  "compilerOptions": {
    // 开发环境
    "sourceMap": true,
    "inlineSources": true,  // 内联源代码到 source map
    
    // 生产环境
    "sourceMap": true,
    "inlineSources": false,
    "sourceRoot": "/"  // 指定源文件根路径
  }
}
```

## 项目引用

### 3.1 Project References 配置

#### 3.1.1 启用项目引用
根目录 `tsconfig.json`:
```json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./packages/ui" },
    { "path": "./apps/web" },
    { "path": "./apps/mobile" }
  ]
}
```

#### 3.1.2 子项目配置
`packages/core/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../utils" }  // 依赖其他包
  ],
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts"]
}
```

### 3.2 构建优化

#### 3.2.1 增量编译配置
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

#### 3.2.2 构建命令
```bash
# 构建所有项目
tsc --build

# 清理构建缓存
tsc --build --clean

# 强制重新构建
tsc --build --force

# 监听模式
tsc --build --watch
```

## 常见问题

### 路径别名不工作？
1. 确保 `baseUrl` 设置正确
2. 检查打包工具是否配置了路径解析插件
3. IDE 可能需要重启以识别新的路径配置

### 严格模式太多错误？
1. 使用 `// @ts-expect-error` 临时忽略已知问题
2. 分文件逐步迁移，使用 `// @ts-nocheck` 跳过整个文件
3. 创建迁移计划，设置明确的时间表

### 构建速度慢？
1. 启用增量编译：`"incremental": true`
2. 使用项目引用拆分大型项目
3. 考虑使用 esbuild 或 swc 替代 tsc 进行构建

## 最佳实践

### DO ✅
- 始终启用严格模式
- 使用基础配置 + 扩展的组织方式
- 为不同场景（开发、构建、测试）使用不同配置
- 定期升级 TypeScript 版本

### DON'T ❌
- 不要禁用严格模式来"快速修复"问题
- 避免在多个地方重复相同的配置
- 不要忽略 TypeScript 的警告
- 避免使用过时的配置选项

## 下一步

完成配置规范后，请参考：
- [类型系统](./type-system) - 了解类型定义规范
- [开发工具](./toolchain) - 配置开发工具链