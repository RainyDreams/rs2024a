<template>
  <div class="min-h-screen bg-[#f0f2f5] font-sans pb-20">
    
    <!-- 顶部导航栏 (模拟 Google App Bar) -->
    <header class="sticky top-0 z-10 bg-[#f0f2f5]/90 backdrop-blur-md border-b border-transparent transition-all duration-200">
      <div class="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- 圆形返回按钮 (Material IconButton) -->
          <button 
            class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors -ml-2"
            @click="$router.back()"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 class="text-xl font-normal text-gray-800 tracking-tight">更新动态</h1>
        </div>
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-4 pt-4 sm:px-6">
      
      <!-- 信息卡片 (Material Surface Variant) -->
      <!-- 使用柔和的圆角和淡色背景，去掉了生硬的边框 -->
      <div class="mb-6 bg-[#d3e3fd] text-[#041e49] rounded-3xl p-5 flex gap-4 items-start shadow-sm">
        <div class="mt-1 shrink-0 text-[#0b57d0]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="opacity-90"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <div>
          <p class="text-sm sm:text-base font-medium leading-relaxed">
            项目代码已开源。欢迎提交 Pull Request 参与贡献。
          </p>
          <a 
            target="_blank" 
            href="https://github.com/RainyDreams/rs2024a/pulls" 
            class="mt-3 inline-flex items-center justify-center px-4 py-2 bg-white text-[#0b57d0] text-sm font-medium rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            前往 GitHub
          </a>
        </div>
      </div>

      <!-- 骨架屏 -->
      <div v-show="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="bg-white p-6 rounded-3xl shadow-sm">
          <el-skeleton :rows="3" animated />
        </div>
      </div>

      <!-- 卡片列表 (Cards) -->
      <!-- Google 风格：每个条目是一个独立的实体（Card），而不是列表的一行 -->
      <section class="space-y-4" v-show="!loading">
        <article
          v-for="(item, i) in list" :key="i"
          class="bg-white rounded-[28px] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100/50"
        >
          <!-- 卡片头部：用户信息 + 时间 -->
          <div class="flex items-center justify-between mb-4">
            <a :href="item.user_url" target="_blank" class="flex items-center group">
              <div class="relative">
                <el-avatar :src="item.avatar" :size="40" class="ring-2 ring-white shadow-sm" />
                <!-- 状态指示点 (装饰用) -->
                <!-- <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-500"></span> -->
              </div>
              <div class="ml-3 flex flex-col">
                <span class="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {{ item.user }}
                </span>
                <!-- 移动端友好的时间显示 (相对更小的字) -->
                <span class="text-xs text-gray-500 font-medium">
                  {{ item.formatDate }}
                </span>
              </div>
            </a>
            
            <!-- 装饰性图标或更多菜单 (可选) -->
            <button class="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
          </div>

          <!-- 卡片内容 -->
          <!-- 增大行高，提升移动端阅读体验 -->
          <div class="text-[15px] sm:text-base text-gray-700 leading-relaxed whitespace-pre-line pl-1">
            {{ item.message }}
          </div>
        </article>
      </section>

      <!-- 底部翻页 (Material Pill Pagination) -->
      <div class="py-8 flex justify-center">
        <div class="bg-white rounded-full shadow-sm px-2 py-1 flex items-center">
          <el-pagination 
            v-model:current-page="now" 
            background 
            layout="prev, pager, next" 
            :page-count="total"
            @current-change="changePage" 
            :pager-count="5"
            class="google-pagination" 
          />
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElPagination, ElSkeleton, ElAvatar } from 'element-plus';
import Auth from '../../utils/auth';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文包

dayjs.locale('zh-cn'); 

const list = ref([])
const total = ref(2)
const now = ref(1)
const loading = ref(true)

onMounted(async () => {
  await fetchData(1);
})

async function changePage(page) {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  await fetchData(page);
}

async function fetchData(page) {
  loading.value = true;
  try {
    let res = (await Auth.getUpdateList({ page }));
    if(res && res.content) {
      total.value = res.content.total;
      list.value = res.content.list.map(e => {
        // Google 风格日期：如果是今年，通常省略年份，或者使用更自然的语言
        // 这里为了清晰保留完整格式，但改用斜杠或自然语言
        return { 
          ...e, 
          formatDate: dayjs(e.date).format('YYYY年M月D日 HH:mm'),
          user_url: e.user_url || 'javascript:;' 
        }
      });
    }
  } catch(e) {
    console.error(e);
  }
  loading.value = false;
}
</script>

<style scoped>
/* Google Material Style Pagination Overrides */
/* 核心思路：变成圆形按钮，去掉方形边框 */

:deep(.google-pagination .el-pagination.is-background .el-pager li) {
  background-color: transparent;
  color: #5f6368; /* Google Grey 700 */
  border-radius: 50%; /* 完全圆形 */
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin: 0 2px;
  font-weight: 500;
  transition: background-color 0.2s;
  border: none;
}

:deep(.google-pagination .el-pagination.is-background .el-pager li:hover) {
  background-color: #f1f3f4; /* Light Gray Hover */
  color: #202124;
}

:deep(.google-pagination .el-pagination.is-background .el-pager li.is-active) {
  background-color: #1a73e8; /* Google Blue */
  color: #fff;
  box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15); /* Elevation 1 */
}

:deep(.google-pagination .el-pagination.is-background .btn-prev),
:deep(.google-pagination .el-pagination.is-background .btn-next) {
  background-color: transparent;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: #5f6368;
}

:deep(.google-pagination .el-pagination.is-background .btn-prev:disabled),
:deep(.google-pagination .el-pagination.is-background .btn-next:disabled) {
  color: #dadce0;
}
</style>