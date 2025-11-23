<template>
  <!-- 整体背景调整为极浅的灰色，增加层次感 -->
  <div class="site-content min-h-screen bg-[#F9FAFB] font-sans">
    
    <!-- Navbar/Header 占位 (如果有的话) -->
    
    <!-- Hero Section -->
    <div class="bs-container px-4 pt-20 pb-16 md:pt-32 md:pb-24">
      <div class="max-w-5xl mx-auto text-center">
        <!-- 标题：更黑、更粗、字间距收紧 -->
        <h1 class="text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl mb-6">
          零本智协
        </h1>
        
        <!-- 副标题：增加行高，颜色变淡 -->
        <p class="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
          赤峰二中2023级12班研究性学习团队开发<br class="hidden md:block" />
          基于多模型深度思考的 AI 软件
        </p>

        <!-- 描述：强调文字使用橙色 -->
        <p class="mt-8 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          构建全面创新的市场项目解决方案体系，致力于让
          <span class="text-cf-orange font-semibold">「零成本构建创新高效应用程序」</span>
          成为现实。
        </p>

        <!-- CTA 按钮：Cloudflare 橙色风格 -->
        <router-link 
          class="inline-flex items-center justify-center h-12 px-8 text-base font-medium text-white transition-all duration-200 bg-[#F38020] hover:bg-[#D96D15] rounded-md hover:-translate-y-0.5 shadow-sm hover:shadow-md" 
          to="/"
        >
          <span>立即使用</span>
          <!-- 加一个小箭头增加引导感 -->
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </router-link>
      </div>
    </div>
    
    <!-- Feature Highlight (单一大卡片) -->
    <div class="bs-container px-4 mb-12">
      <div class="cf-card group relative overflow-hidden bg-white border border-gray-200 rounded-2xl p-8 md:p-12 lg:p-16 transition-all duration-300 hover:shadow-xl hover:border-gray-300">
        <div class="text-center">
          <h2 class="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">专注于思考</h2>
          <h2 class="text-2xl md:text-4xl font-semibold text-slate-700 mb-10">
            把剩下的工作交给 <span class="text-cf-orange">零本智协</span>
          </h2>
          <div class="space-y-4 text-lg md:text-2xl text-slate-600">
            <p>大模型深度思考的先行者</p>
            <p>以 AI 驱动项目流程的解决方案</p>
            <p>项目发展至今仍 <span class="text-cf-orange font-bold">零支出</span></p>
          </div>
        </div>
        <!-- 装饰性背景光晕 (Cloudflare 常用手法) -->
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition duration-500 pointer-events-none"></div>
      </div>
    </div>

    <!-- Grid Section -->
    <div class="bs-container px-4 mb-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        <!-- Card 1: 安全 -->
        <div class="cf-card bg-white border border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 text-blue-600">
            <!-- 图标占位 -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4">安全</h2>
          <p class="text-slate-600 mb-6 leading-relaxed">从数据的存储、传输到使用，每一个环节都经过精心设计和严格监控。</p>
          <div class="text-slate-800 font-medium text-lg">
            原创的 
            <span class="text-cf-orange text-2xl font-bold mx-1">3</span>token + 
            <span class="text-cf-orange text-2xl font-bold mx-1">1</span>授权 + 
            <span class="text-cf-orange text-2xl font-bold mx-1">N</span>验证模式
          </div>
        </div>

        <!-- Card 2: 三思而后行 -->
        <div class="cf-card bg-white border border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6 text-cf-orange">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4"><span class="text-cf-orange">三思</span>而后行</h2>
          <p class="text-slate-600 leading-relaxed">
            三模型，三重分析：理解分析、尝试回复、批判总结。<br/><br/>
            智能架构，思考问题更深入全面。迅速给出精准的解决方案，大大缩短项目周期，让你的业务<span class="text-cf-orange font-medium">降本增效</span>。
          </p>
        </div>

        <!-- Card 3: 创新 -->
        <div class="cf-card bg-white border border-gray-200 rounded-2xl p-8 md:p-10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
           <div class="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center mb-6 text-purple-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4">创新 & 智能</h2>
          <p class="text-slate-600 mb-4 leading-relaxed">我们创新性的在产品的诸多功能中融入了大模型技术，使得工作更加高效。</p>
          <ul class="space-y-2 text-slate-600">
             <li class="flex items-center"><span class="w-2 h-2 bg-cf-orange rounded-full mr-2"></span>率先提出多模型深度思考方案</li>
             <li class="flex items-center"><span class="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>提供独特而前沿的项目解决方案</li>
          </ul>
        </div>

        <!-- Card 4: 评价 (Testimonial) -->
        <div class="cf-card bg-slate-900 text-white rounded-2xl p-8 md:p-10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <!-- Cloudflare 经常会有一个深色的卡片作为对比 -->
          <h2 class="text-2xl md:text-3xl font-bold mb-6">他们这样说...</h2>
          <blockquote class="mb-6 border-l-4 border-cf-orange pl-4 italic text-gray-300 text-lg leading-relaxed">
            “零本智协 AI 工具与其他十分有名气的 AI 工具相比可为有过之而无不及，是一款实用性极强的工具。”
          </blockquote>
          <div>
            <p class="font-bold text-white text-lg">李世正</p>
            <p class="text-sm text-gray-400 mt-1">《咖啡因和牛磺酸对小鼠运动能力影响》实验小组组长</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-200 py-12 mt-12 bg-white">
      <div class="bs-container px-4 flex flex-col items-center">
        <p class="text-slate-900 font-semibold mb-2">
          赤子英金 · <span class="text-cf-orange">零本智协</span>
        </p>
        <p class="text-slate-500 text-sm mb-6">© 2025 零本智协 保留所有权利.</p>
        <div class="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
          <a href="https://oh.chiziingiin.top/license/user" class="hover:text-cf-orange transition">用户协议</a>
          <a href="https://oh.chiziingiin.top/license/private" class="hover:text-cf-orange transition">隐私政策</a>
          <a href="https://oh.chiziingiin.top/project/RS2024/explain" class="hover:text-cf-orange transition">名词介绍</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElButton, ElProgress } from 'element-plus';
import { emitter } from '../../utils/emitter';
import { onMounted, ref } from 'vue';
import { PlayOne } from '@icon-park/vue-next';
import Auth from '../../utils/auth';

const count = ref('');
const show_video = ref(false);

emitter.on('basicInfo', (re) => {
  count.value = re.visitInfo.count + '次';
});
</script>

<style scoped>
/* 引入你原来的 index.css */
@import url(./index.css);

/* 定义 Cloudflare 风格的变量和类 */
.text-cf-orange {
  color: #F38020; /* Cloudflare 标志性橙色 */
}

.bg-cf-orange {
  background-color: #F38020;
}

/* 强制使用无衬线字体，覆盖 index.css 中可能存在的 serif 设定 */
.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* 
   Cloudflare 风格的核心是:
   1. 干净的边框
   2. 极简的阴影
   3. Hover 时强调边框色
*/
.cf-card {
  /* 这些样式大部分已经通过 Tailwind 类实现了，这里作为补充兜底 */
  border: 1px solid #e5e7eb; /* border-gray-200 */
}

.cf-card:hover {
  border-color: #F38020; /* Hover 时边框变橙，这是非常 Cloudflare 的细节 */
}

/* 移除旧的样式干扰 */
.serif-text {
  font-family: inherit !important; /* 强制取消衬线体 */
}

/* 容器宽度的工具类 (假设你原来的 bs-container 没有居中) */
.bs-container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
}
</style>