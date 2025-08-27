# 文档命名规范

## 第一条 文件命名

### 1.1 通用命名规则

#### 1.1.1 命名风格
文件名使用 **kebab-case**（烤串命名法），即全小写字母，单词间用连字符分隔。

**正确示例：**
- `user-guide.md`
- `api-reference.md`
- `getting-started.md`

**错误示例：**
- `UserGuide.md` ❌ (PascalCase)
- `user_guide.md` ❌ (snake_case)
- `userguide.md` ❌ (无分隔)

#### 1.1.2 字符限制
- 只使用小写字母 `a-z`
- 数字 `0-9`
- 连字符 `-`
- 不使用空格、下划线或其他特殊字符

#### 1.1.3 长度限制
文件名长度不超过 50 个字符，保持简洁明了。

### 1.2 特殊文件命名

#### 1.2.1 索引文件
每个目录的主页面统一命名为 `index.md`。

#### 1.2.2 README 文件
项目根目录说明文件命名为 `README.md`（保持大写）。

#### 1.2.3 配置文件
配置文件保持工具约定的命名，如：
- `.vitepress/config.mjs`
- `.gitignore`
- `package.json`

## 第二条 目录命名

### 2.1 目录命名规则

#### 2.1.1 命名风格
目录名同样使用 **kebab-case**。

**示例：**
```
standards/
├── documentation/
├── code-style/
├── git-workflow/
└── api-design/
```

#### 2.1.2 语义化命名
目录名应清晰表达其内容类别：
- 使用名词或名词短语
- 避免使用动词
- 避免缩写（除非是广泛认可的缩写）

### 2.2 目录层级命名

#### 2.2.1 语言目录
- 中文：`zh/`
- 英文：`en/`
- 日文：`ja/`

#### 2.2.2 功能目录
- 规范：`standards/`
- 指南：`guides/`
- 参考：`reference/`
- 教程：`tutorials/`
- 示例：`examples/`

## 第三条 文档标识符

### 3.1 文档 ID 规范

#### 3.1.1 ID 格式
当文档需要唯一标识符时，使用以下格式：
`{category}-{topic}-{subtopic}`

**示例：**
- `std-doc-structure` (规范-文档-结构)
- `guide-setup-env` (指南-配置-环境)

#### 3.1.2 ID 使用场景
- 文档间交叉引用
- 自动化文档生成
- 文档版本管理

### 3.2 版本号命名

#### 3.2.1 版本文件命名
需要版本控制的文档，在文件名中包含版本号：
`{name}-v{major}.{minor}.md`

**示例：**
- `api-specification-v1.0.md`
- `api-specification-v2.1.md`

#### 3.2.2 版本目录组织
```
api/
├── v1/
│   └── reference.md
├── v2/
│   └── reference.md
└── latest -> v2/  # 符号链接指向最新版本
```

## 第四条 中英文命名

### 4.1 语言使用原则

#### 4.1.1 文件名语言
- 技术术语优先使用英文
- 通用概念可使用英文
- 避免拼音命名

**推荐：**
- `getting-started.md`
- `user-guide.md`
- `faq.md`

**避免：**
- `kaishi.md` ❌
- `yonghu-zhinan.md` ❌

#### 4.1.2 路径保持一致
同一路径下的文件应保持语言一致性。

### 4.2 缩写规范

#### 4.2.1 常用缩写
允许使用业界广泛认可的缩写：
- `api` - Application Programming Interface
- `faq` - Frequently Asked Questions  
- `sdk` - Software Development Kit
- `cli` - Command Line Interface

#### 4.2.2 自定义缩写
项目特有的缩写需在文档中定义说明：
- 首次出现时给出全称
- 在项目词汇表中统一管理