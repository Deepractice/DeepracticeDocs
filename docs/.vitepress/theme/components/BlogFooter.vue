<template>
  <div class="blog-footer">
    <div class="brand-banner">
      <div class="banner-content">
        <div class="logo-section">
          <span class="brand-logo">🏗️</span>
          <strong>深度实践 | Deepractice</strong>
        </div>
        
        <div class="brand-slogan">
          <p>让AI触手可及 | Make AI at your fingertips</p>
        </div>
        
        <div class="description">
          <p>{{ description }}</p>
        </div>
        
        <div class="links">
          <a href="https://deepractice.ai" target="_blank" rel="noopener">
            🌐 访问官网
          </a>
          <span class="separator">•</span>
          <a href="https://github.com/Deepractice" target="_blank" rel="noopener">
            💻 GitHub
          </a>
          <span class="separator">•</span>
          <a href="mailto:sean@deepracticex.com">
            ✉️ 联系我们
          </a>
        </div>
        
        <div class="copyright">
          <p>© 2025 Deepractice. AI时代的标准制定者</p>
        </div>
      </div>
    </div>
    
    <div class="article-meta" v-if="showMeta">
      <div class="meta-tags">
        <span class="tag">#AI标准</span>
        <span class="tag">#开源框架</span>
        <span class="tag">#智能体</span>
        <span class="tag">#Deepractice</span>
      </div>
    </div>
    
    <!-- SEO优化内容（供爬虫读取） -->
    <div class="seo-content">
      深度实践 | Deepractice
      使命：让AI触手可及 | Make AI at your fingertips
      愿景：成为AI时代的标准制定者
      价值观：实践、协作、创新
      深度实践致力于成为AI时代的标准制定者，通过开源协议和框架，为智能体应用开发提供标准化基础设施
      本文由Deepractice团队原创发布
      智能协同 | 开源框架 | 标准化基础设施 | AI Agent开发
      商务合作与技术咨询: sean@deepracticex.com
      官网: https://deepractice.ai
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const props = defineProps({
  description: {
    type: String,
    default: '深度实践致力于成为AI时代的标准制定者，通过开源协议和框架，为智能体应用开发提供标准化基础设施。'
  },
  showMeta: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.blog-footer {
  margin-top: 3rem;
  margin-bottom: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.brand-banner {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  transition: all 0.3s ease;
}

.brand-banner:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  color: var(--vp-c-brand-1);
}

.brand-logo {
  font-size: 1.5rem;
}

.brand-slogan {
  margin-bottom: 1rem;
  color: var(--vp-c-text-2);
  font-style: italic;
  font-size: 1rem;
}

.brand-slogan p {
  margin: 0;
  line-height: 1.5;
}

.description {
  margin: 1rem 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.links a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.links a:hover {
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.separator {
  color: var(--vp-c-divider);
  margin: 0 0.25rem;
}

.copyright {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider-light);
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.article-meta {
  margin-top: 2rem;
}

.meta-tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
}

.tag:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* 暗色模式适配 */
.dark .brand-banner {
  background: var(--vp-c-bg-soft);
}

.dark .links a:hover {
  background: var(--vp-c-brand-soft);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .brand-banner {
    padding: 1.5rem 1rem;
  }
  
  .logo-section {
    font-size: 1.1rem;
  }
  
  .links {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .separator {
    display: none;
  }
  
  .links a {
    width: 100%;
    text-align: center;
  }
}

/* SEO优化的隐藏文本（供爬虫读取） */
.seo-content {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>

