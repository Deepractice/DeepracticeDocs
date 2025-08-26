import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Deepractice Docs',
  description: 'Technical documentation center',
  
  // 忽略死链接检查
  ignoreDeadLinks: true,
  
  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    
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
          { text: '项目', link: '/zh/projects/' },
          { text: '产品', link: '/zh/products/' },
          { text: '博客', link: '/zh/blog/' },
          { text: '开发规范', link: '/zh/standards/' }
        ],

        sidebar: {
          '/zh/projects/': [
            {
              text: '项目',
              items: [
                { text: '项目概览', link: '/zh/projects/' },
                { text: '项目A', link: '/zh/projects/project-a' },
                { text: '项目B', link: '/zh/projects/project-b' }
              ]
            }
          ],
          '/zh/products/': [
            {
              text: '产品',
              items: [
                { text: '产品概览', link: '/zh/products/' },
                { text: '产品1', link: '/zh/products/product-1' },
                { text: '产品2', link: '/zh/products/product-2' }
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
          '/zh/standards/': [
            {
              text: '开发规范',
              items: [
                { text: '概述', link: '/zh/standards/' },
                { text: '代码规范', link: '/zh/standards/code-style' },
                { text: 'Git规范', link: '/zh/standards/git' },
                { text: 'API设计规范', link: '/zh/standards/api' },
                { text: '文档规范', link: '/zh/standards/docs' }
              ]
            }
          ]
        },

        footer: {
          message: '基于 MIT 许可发布',
          copyright: '版权所有 © 2024-现在 Deepractice'
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
          { text: 'Projects', link: '/en/projects/' },
          { text: 'Products', link: '/en/products/' },
          { text: 'Blog', link: '/en/blog/' },
          { text: 'Standards', link: '/en/standards/' }
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
              text: 'Development Standards',
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
          copyright: 'Copyright © 2024-present Deepractice'
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
  }
})