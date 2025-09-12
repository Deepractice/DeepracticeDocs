<template>
  <div class="blog-seo">
    <!-- 结构化数据容器 -->
    <div class="structured-data" :data-json="structuredData" style="display: none;"></div>
    
    <!-- Open Graph Meta Tags（动态注入） -->
    <teleport to="head" v-if="isMounted">
      <meta property="og:site_name" content="Deepractice Docs" />
      <meta property="og:type" content="article" />
      <meta property="article:author" content="Deepractice Team" />
      <meta property="article:publisher" content="https://deepractice.ai" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@deepractice" />
      <meta name="author" content="Deepractice Team" />
      <meta name="publisher" content="Deepractice" />
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'

const { page, frontmatter, title, description } = useData()
const route = useRoute()
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
  
  // 在客户端动态注入JSON-LD脚本
  if (typeof document !== 'undefined') {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = structuredData.value
    document.head.appendChild(script)
  }
})

// 生成结构化数据
const structuredData = computed(() => {
  const baseUrl = 'https://docs.deepractice.ai'
  const currentUrl = `${baseUrl}${route.path}`
  
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title.value || "Deepractice Blog",
    "description": description.value || "Deepractice团队的技术分享与智能协同研究",
    "url": currentUrl,
    "datePublished": frontmatter.value?.date || new Date().toISOString(),
    "dateModified": page.value?.lastUpdated || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Deepractice",
      "url": "https://deepractice.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://deepractice.ai/logo.png"
      },
      "sameAs": [
        "https://github.com/Deepractice",
        "https://twitter.com/deepractice"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Deepractice",
      "url": "https://deepractice.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://deepractice.ai/logo.png",
        "width": 600,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "keywords": [
      "Deepractice",
      "深度实践",
      "智能协同",
      "AI协作",
      "人机协作",
      "ISSUE方法",
      "人工智能",
      "AI",
      "协作模式"
    ],
    "inLanguage": "zh-CN",
    "potentialAction": {
      "@type": "ReadAction",
      "target": currentUrl
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首页",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "博客",
          "item": `${baseUrl}/zh/blog/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": title.value || "文章",
          "item": currentUrl
        }
      ]
    }
  }
  
  return JSON.stringify(data, null, 2)
})
</script>