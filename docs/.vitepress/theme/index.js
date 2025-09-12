import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import BlogFooter from './components/BlogFooter.vue'
import BlogSEO from './components/BlogSEO.vue'
import './custom.css'
import { useRoute } from 'vitepress'

export default {
  extends: DefaultTheme,
  
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => {
        const route = useRoute()
        // 在博客文章页面注入SEO数据
        if (route.path.includes('/blog/') && !route.path.endsWith('/blog/')) {
          return h(BlogSEO)
        }
        return null
      },
      'doc-footer-before': () => {
        const route = useRoute()
        // 在文档底部导航之前显示Footer
        if (route.path.includes('/blog/') && !route.path.endsWith('/blog/')) {
          return h(BlogFooter)
        }
        return null
      }
    })
  },
  
  enhanceApp({ app }) {
    // 全局注册组件
    app.component('BlogFooter', BlogFooter)
    app.component('BlogSEO', BlogSEO)
  }
}