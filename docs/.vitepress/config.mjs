import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
  title: 'Deepractice Docs',
  description: '深度实践技术文档中心 - 让AI触手可及 | Make AI at your fingertips',
  
  // 网站head配置
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'keywords', content: 'Deepractice, 深度实践, AI标准, 开源框架, 智能体, AI Agent, 标准化基础设施, 智能协同, ISSUE方法, 技术文档, 开发规范' }],
    ['meta', { name: 'author', content: 'Deepractice Team' }],
    ['meta', { property: 'og:site_name', content: 'Deepractice Docs' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:site', content: '@deepractice' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo-dark.png', media: '(prefers-color-scheme: light)' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo-light.png', media: '(prefers-color-scheme: dark)' }],
    ['link', { rel: 'canonical', href: 'https://docs.deepractice.ai' }]
  ],
  
  // 忽略死链接检查
  ignoreDeadLinks: true,
  
  // 主题配置
  themeConfig: {
    logo: {
      light: '/logo-dark.png',
      dark: '/logo-light.png'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Deepractice' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  },

  // 国际化配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '模式', link: '/zh/patterns/' },
          { text: '协议', link: '/zh/protocols/' },
          { text: '实践', link: '/zh/practice/' },
          { text: '产品', link: '/zh/products/' },
          { text: '博客', link: '/zh/blog/' },
          { text: '关于', link: '/zh/about' }
        ],

        sidebar: {
          '/zh/patterns/': [
            {
              text: '模式（Pattern）',
              items: [
                { text: '概览', link: '/zh/patterns/' },
                { text: '理解ISSUE协作范式', link: '/zh/patterns/issue-paradigm' },
                {
                  text: '内容体系',
                  collapsed: false,
                  items: [
                    { text: '理解 Deepractice 4P 内容分层模式', link: '/zh/patterns/content-system/deepractice-4p-model' },
                    { text: 'Deepractice 内容体系 — 4P × Diátaxis × PSO', link: '/zh/patterns/content-system/understanding-content-system' }
                  ]
                }
              ]
            }
          ],
          '/zh/protocols/': [
            {
              text: '协议（Protocol）',
              items: [
                { text: '概览', link: '/zh/protocols/' },
                { text: 'DPML协议规范', link: '/zh/protocols/issue-dpml-protocol' }
              ]
            }
          ],
          '/zh/products/': [
            {
              text: '产品（Instance）',
              items: [
                { text: '概览', link: '/zh/products/' },
                { text: '实例文档', link: '/zh/products/instances' }
              ]
            }
          ],
          '/zh/blog/': [
            {
              text: '博客文章',
              items: [
                { text: '最新文章', link: '/zh/blog/' },
                { text: '技术分享', link: '/zh/blog/tech' },
                { text: '团队动态', link: '/zh/blog/team' }
              ]
            }
          ],
          '/zh/practice/': [
            {
              text: '实践（Practice）',
              items: [
                { text: '概览', link: '/zh/practice/' },
                {
                  text: '内容体系规范',
                  collapsed: false,
                  items: [
                    { text: '内容体系术语表', link: '/zh/practice/content-system/glossary' },
                    { text: '内容定位规范', link: '/zh/practice/content-system/content-positioning-standard' },
                    { text: '文件命名规范', link: '/zh/practice/content-system/file-naming-convention' },
                    { text: '文档校验规范', link: '/zh/practice/content-system/document-validation-standard' },
                    { text: 'Explanation撰写规范', link: '/zh/practice/content-system/writing-explanation-standard' },
                    { text: 'How-to撰写规范', link: '/zh/practice/content-system/writing-howto-standard' },
                    { text: 'Reference撰写规范', link: '/zh/practice/content-system/writing-reference-standard' },
                    { text: 'Tutorial撰写规范', link: '/zh/practice/content-system/writing-tutorial-standard' },
                    { text: '术语表撰写规范', link: '/zh/practice/content-system/glossary-writing-standard' },
                    { text: '内容演进规范', link: '/zh/practice/content-system/content-evolution-standard' }
                  ]
                },
                {
                  text: '开发环境',
                  collapsed: false,
                  items: [
                    {
                      text: 'Monorepo',
                      collapsed: true,
                      items: [
                        { text: 'Monorepo 基础架构规范', link: '/zh/practice/development-environment/monorepo/monorepo-standard' },
                        { text: 'Monorepo 配置模板集', link: '/zh/practice/development-environment/monorepo/monorepo-configuration' },
                        { text: '如何初始化生产级 Monorepo', link: '/zh/practice/development-environment/monorepo/how-to-initialize-monorepo' },
                        { text: '理解 Monorepo 架构', link: '/zh/practice/development-environment/monorepo/understanding-monorepo-architecture' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        footer: {
          message: '基于 MIT 许可发布',
          copyright: '版权所有 © 2025 Deepractice'
        },

        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short'
          }
        },

        docFooter: {
          prev: '上一页',
          next: '下一页'
        },

        outline: {
          label: '页面导航',
          level: [2, 3]
        },

        returnToTopLabel: '回到顶部'
      }
    },
    
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Standards', link: '/en/standards/' },
          { text: 'Projects', link: '/en/projects/' },
          { text: 'Products', link: '/en/products/' },
          { text: 'Blog', link: '/en/blog/' }
        ],

        sidebar: {
          '/en/projects/': [
            {
              text: 'Projects',
              items: [
                { text: 'Overview', link: '/en/projects/' },
                { text: 'Project A', link: '/en/projects/project-a' },
                { text: 'Project B', link: '/en/projects/project-b' }
              ]
            }
          ],
          '/en/products/': [
            {
              text: 'Products',
              items: [
                { text: 'Overview', link: '/en/products/' },
                { text: 'Product 1', link: '/en/products/product-1' },
                { text: 'Product 2', link: '/en/products/product-2' }
              ]
            }
          ],
          '/en/blog/': [
            {
              text: 'Blog Posts',
              items: [
                { text: 'Latest Posts', link: '/en/blog/' },
                { text: 'Tech Sharing', link: '/en/blog/tech' },
                { text: 'Team Updates', link: '/en/blog/team' }
              ]
            }
          ],
          '/en/standards/': [
            {
              text: 'Standards',
              items: [
                { text: 'Overview', link: '/en/standards/' },
                { text: 'Code Style', link: '/en/standards/code-style' },
                { text: 'Git Standards', link: '/en/standards/git' },
                { text: 'API Design', link: '/en/standards/api' },
                { text: 'Documentation', link: '/en/standards/docs' }
              ]
            }
          ]
        },

        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2025 Deepractice'
        },

        lastUpdated: {
          text: 'Last Updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short'
          }
        },

        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },

        outline: {
          label: 'On this page',
          level: [2, 3]
        },

        returnToTopLabel: 'Return to top'
      }
    }
  },
  
  // Markdown配置
  markdown: {
    config: (md) => {
      // 使用其他markdown-it插件
    }
  },
  
  // Vite配置 - 解决依赖问题
  vite: {
    optimizeDeps: {
      include: ['@braintree/sanitize-url', 'mermaid']
    },
    resolve: {
      alias: {
        'dayjs': 'dayjs/'
      }
    }
  },
  
  // Mermaid配置
  mermaid: {
    theme: 'default'
  }
})
)