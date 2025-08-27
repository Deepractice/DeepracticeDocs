#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 获取命令行参数
const args = process.argv.slice(2)
const packageName = args[0]

// 检查参数
if (!packageName) {
  console.log('Usage: node create-package.js <package-name>')
  console.log('Example: node create-package.js utils')
  process.exit(1)
}

// 定义路径
const rootDir = path.join(__dirname, '..', '..')
const packageDir = path.join(rootDir, 'packages', packageName)

// 检查包是否已存在
if (fs.existsSync(packageDir)) {
  console.error(`Error: Package ${packageName} already exists!`)
  process.exit(1)
}

// 创建目录结构
fs.mkdirSync(path.join(packageDir, 'src'), { recursive: true })

// package.json 内容
const packageJson = {
  name: `@myproject/${packageName}`,
  version: '1.0.0',
  type: 'module',
  main: './dist/index.js',
  module: './dist/index.mjs',
  types: './dist/index.d.ts',
  files: ['dist'],
  scripts: {
    dev: 'tsup --watch',
    build: 'tsup',
    test: "echo 'No tests yet'",
    lint: "echo 'No linting yet'",
    'type-check': 'tsc --noEmit',
    clean: 'rm -rf dist *.tsbuildinfo'
  },
  devDependencies: {
    tsup: 'workspace:*',
    typescript: 'workspace:*'
  }
}

// tsconfig.json 内容
const tsConfig = {
  extends: '../../configs/typescript/base.json',
  compilerOptions: {
    rootDir: './src',
    outDir: './dist',
    composite: true
  },
  include: ['src/**/*'],
  exclude: ['**/*.test.ts', '**/*.spec.ts']
}

// tsup.config.ts 内容
const tsupConfig = `import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
})
`

// index.ts 内容
const indexTs = `export const hello = (name: string) => \`Hello from ${packageName}, \${name}!\`

export default {
  name: '${packageName}',
  version: '1.0.0',
}
`

// 写入文件
try {
  // 写入 package.json
  fs.writeFileSync(
    path.join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )

  // 写入 tsconfig.json
  fs.writeFileSync(
    path.join(packageDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  )

  // 写入 tsup.config.ts
  fs.writeFileSync(
    path.join(packageDir, 'tsup.config.ts'),
    tsupConfig
  )

  // 写入 index.ts
  fs.writeFileSync(
    path.join(packageDir, 'src', 'index.ts'),
    indexTs
  )

  console.log(`✅ Package @myproject/${packageName} created successfully!`)
  console.log(`📁 Location: ${packageDir}`)
  console.log('')
  console.log('Next steps:')
  console.log('1. pnpm install')
  console.log(`2. pnpm build --filter @myproject/${packageName}`)
} catch (error) {
  console.error('Error creating package:', error.message)
  process.exit(1)
}