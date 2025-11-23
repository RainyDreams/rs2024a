<template>
  <!-- 全局背景调整为 Google 风格的浅灰白 -->
  <div class="p-4 sm:p-6 bg-[#f8f9fa] min-h-screen font-sans text-slate-800">
    
    <!-- 顶部标题栏：更轻盈的字体和留白 -->
    <div class="max-w-[1600px] mx-auto">
      <header class="mb-8 px-2 pt-2">
        <h1 class="text-3xl md:text-4xl font-medium text-[#1f1f1f] tracking-tight">会话管理后台</h1>
        <p class="text-sm text-slate-500 mt-2">Dashboard & Analytics</p>
      </header>

      <!-- 卡片网格 -->
      <div class="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="item in list" :key="item.id" 
          class="group relative bg-white p-5 rounded-[20px] border border-gray-200 shadow-sm transition-all duration-300 cursor-pointer
                 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5" 
          @click="getChatHistory(item)">
          
          <!-- 装饰性的 Google 风格色彩条 -->
          <div class="absolute top-5 right-5 w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div class="flex flex-col h-full justify-between">
            <div>
              <div class="text-xl font-medium text-[#1f1f1f] mb-1 group-hover:text-blue-600 transition-colors">
                {{ item.nickname }}
              </div>
              <div class="text-sm text-slate-500 font-medium mb-3">{{ item.username }}</div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1">
              <div class="text-xs text-slate-400 font-mono flex items-center">
                <span class="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 mr-2">ID</span>
                <span class="truncate">{{ item.id }}</span>
              </div>
              <div class="text-xs text-slate-400 flex items-center">
                 <span class="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 mr-2">TIME</span>
                {{ dayjs(JSON.parse(item.profile).createTime).format('YYYY-MM-DD HH:mm') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="copyright mt-12 mb-6">
        <div class="text-sm text-slate-400 w-full text-center font-medium">
          © 2024-{{ new Date().getFullYear() }} 
          <a href="https://github.com/RainyDreams" target="_blank" class="text-blue-600 hover:text-blue-700 hover:underline transition-colors">零本智协项目组</a>
          <span class="mx-1">·</span> All rights reserved.
        </div>
      </div>
    </div>

    <!-- 弹窗 1: 会话列表 -->
    <div v-if="dialogVisible"
      class="fixed inset-0 flex items-center justify-center bg-[#1f1f1f]/40 backdrop-blur-[2px] z-50 px-4 py-6">
      <!-- Modal Card: 更大的圆角，更柔和的阴影 -->
      <div class="bg-[#fef7ff] md:bg-white rounded-[28px] shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-white/50">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 class="text-xl font-normal text-[#1f1f1f]">聊天会话</h2>
            <p class="text-xs text-slate-500" v-if="selectedUser">{{ selectedUser.nickname }} 的历史记录</p>
          </div>
          <button @click="dialogVisible = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1 bg-[#f8f9fa]">
          <div v-if="selectedUser">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <!-- 左侧：用户信息卡片 -->
              <div class="lg:col-span-1 space-y-4">
                <div class="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div class="relative mb-4">
                    <img :src="selectedUser.profile.avatar" alt=""
                      class="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md bg-slate-200" />
                    <div class="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <h2 class="text-xl font-medium text-[#1f1f1f]">{{ selectedUser.nickname }}</h2>
                  <p class="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 font-medium">{{ selectedUser.username }}</p>
                  
                  <div class="w-full mt-6 space-y-3 text-left">
                    <div class="flex justify-between text-xs py-2 border-b border-gray-50">
                      <span class="text-slate-400">ID</span>
                      <span class="text-slate-600 font-mono">{{ selectedUser.id }}</span>
                    </div>
                    <div class="flex justify-between text-xs py-2 border-b border-gray-50">
                      <span class="text-slate-400">注册时间</span>
                      <span class="text-slate-600">{{ dayjs(selectedUser.profile.createTime).format('YY/MM/DD HH:mm') }}</span>
                    </div>
                    <div class="flex justify-between text-xs py-2">
                      <span class="text-slate-400">身份类型</span>
                      <span class="text-slate-600">{{ selectedUser.profile.identityType }}</span>
                    </div>
                  </div>
                </div>

                <div class="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
                   <p class="font-medium text-[#1f1f1f] mb-3 text-sm">创建信息</p>
                   <p class="text-xs text-slate-500 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-xl">{{ selectedUser.profile.createInfo }}</p>
                </div>
              </div>

              <!-- 右侧：会话列表 -->
              <div class="lg:col-span-2">
                <div v-if="loadingChatSessions" class="flex flex-col justify-center items-center h-64">
                   <div class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                   <p class="mt-4 text-slate-400 text-sm">正在同步数据...</p>
                </div>

                <div v-else>
                   <div class="flex justify-between items-center mb-4 px-2">
                     <h3 class="text-sm font-medium text-slate-500">会话历史</h3>
                     <button @click="selectedUser.hide=!selectedUser.hide" 
                       class="text-xs font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                       {{selectedUser.hide ? '显示' : '隐藏'}}空会话
                     </button>
                   </div>

                   <div v-if="chatSessions.length > 0" class="space-y-3">
                      <div v-for="session in chatSessions" 
                           v-show="!selectedUser.hide || session.title!='无标题'"
                           :key="session.sessionID" 
                           class="group bg-white p-4 rounded-[20px] border border-gray-200 shadow-sm cursor-pointer transition-all
                                  hover:shadow-md hover:border-blue-300 hover:bg-blue-50/30"
                           @click="openChatListDialog(session)">
                        <div class="flex justify-between items-start">
                          <p class="text-base font-medium text-[#1f1f1f] group-hover:text-blue-700 transition-colors">
                            {{ session.title || '无标题' }}
                          </p>
                          <span class="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            {{ dayjs(session.createTime).format('MM-DD') }}
                          </span>
                        </div>
                        <div class="mt-2 flex gap-4 text-xs text-slate-400">
                          <span>创建: {{ dayjs(session.createTime).format('HH:mm:ss') }}</span>
                          <span>过期: {{ dayjs(session.expirationTime).format('MM-DD HH:mm') }}</span>
                        </div>
                      </div>
                   </div>
                   
                   <div v-else class="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-[24px] border border-dashed border-gray-300">
                     <p>暂无聊天记录</p>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 2: 聊天详情 (Material Chat Style) -->
    <div v-if="chatListDialogVisible"
      class="fixed inset-0 flex items-center justify-center bg-[#1f1f1f]/40 backdrop-blur-[2px] z-50 px-4 py-6">
      <div class="bg-white rounded-[28px] shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden border border-white/50">
        
        <!-- Header -->
        <div class="px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-100 flex justify-between items-center z-10">
          <div class="flex flex-col">
             <h2 class="text-lg font-medium text-[#1f1f1f]">{{ sessionInfo.title || '聊天详情' }}</h2>
             <div class="flex gap-2 text-[10px] text-slate-500 mt-1">
                <span class="bg-slate-100 px-1.5 rounded">PT: {{ sessionInfo.pt }}</span>
                <span>{{ dayjs(sessionInfo.createTime).format('MM-DD HH:mm') }}</span>
             </div>
          </div>
          <button @click="chatListDialogVisible = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-0 flex-1 overflow-y-auto bg-[#f8f9fa] relative">
           <div v-if="loadingChatList" class="absolute inset-0 flex flex-col justify-center items-center bg-white/80 z-20">
             <div class="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
           </div>

           <div class="p-6 space-y-6">
              <!-- Meta Info Card -->
              <div class="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-xs text-slate-600 mb-6">
                 <div class="grid grid-cols-2 gap-2">
                    <p><strong class="text-blue-700">ID:</strong> {{ sessionInfo.id }}</p>
                    <p><strong class="text-blue-700">最后活动:</strong> {{ dayjs(sessionInfo.lastTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
                 </div>
                 <div class="mt-2 pt-2 border-t border-blue-100">
                    <strong>VF (点击查看):</strong>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span v-for="(x, i) in sessionInfo.vf" :key="i" 
                            @click="viewVfDetails(x)" 
                            class="cursor-pointer bg-white text-blue-600 border border-blue-200 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                        {{ x }}
                      </span>
                    </div>
                 </div>
              </div>

              <!-- Chat Bubbles -->
              <div v-if="chatList.length > 0" class="space-y-6">
                <div v-for="message in chatList" :key="message.sendTime" 
                     class="flex flex-col w-full"
                     :class="message.role === 'user' ? 'items-end' : 'items-start'">
                  
                  <!-- Role Label -->
                  <span class="text-[10px] text-slate-400 mb-1 px-2">
                    {{ message.role === 'user'? 'User' : 'AI' }} · {{ dayjs(message.sendTime).format('HH:mm:ss') }}
                  </span>

                  <!-- Bubble -->
                  <div :class="[
                    'max-w-[85%] p-4 shadow-sm relative text-sm leading-relaxed',
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-[20px] rounded-tr-[4px]' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-[20px] rounded-tl-[4px]'
                  ]">
                    <!-- Model Debug Info -->
                    <div v-if="message?.model_list" class="mb-2 pb-2 border-b border-gray-100/20 text-[10px] opacity-70 font-mono">
                       <div v-for="(k,m) in message.model_list" :key="m">{{ k.model }} | {{ k.mode }} | {{ k.time }}ms</div>
                    </div>

                    <p class="whitespace-pre-wrap">{{ message.content }}</p>

                    <!-- Media -->
                    <template v-if="message.photo?.blob">
                      <div class="mt-3 rounded-xl overflow-hidden border border-white/20">
                         <img class="max-w-full" :src="message.photo.blob" alt="Image">
                      </div>
                    </template>
                     <template v-if="message.audio?.blob">
                      <div class="mt-3">
                         <audio class="max-w-full h-8" controls :src="message.audio.blob"></audio>
                      </div>
                    </template>
                  </div>

                  <!-- Analysis Block -->
                  <div v-if="message.role === 'user' && message.analysis"
                       class="mt-2 max-w-[80%] p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 text-xs rounded-xl">
                     <span class="font-bold mr-1">⚡ 分析:</span> {{ message.analysis }}
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center text-slate-400 py-10">暂无对话内容</div>
           </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 3: VF 详情 -->
    <div v-if="vfDialogVisible"
      class="fixed inset-0 flex items-center justify-center bg-[#1f1f1f]/40 backdrop-blur-[2px] z-50 px-4 py-6">
      <div class="bg-white rounded-[28px] shadow-2xl w-full max-w-2xl h-auto max-h-[85vh] flex flex-col overflow-hidden">
        <div class="px-6 py-4 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-medium text-slate-800">VF 详情分析</h2>
          <button @click="vfDialogVisible = false" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto bg-white">
          <div v-if="vfDetails.length > 0" class="space-y-6">
            <div v-for="(vf, index) in vfDetails" :key="index" class="bg-[#f8f9fa] rounded-2xl p-5 border border-gray-200 text-sm">
              <div class="grid grid-cols-1 gap-2 mb-3 pb-3 border-b border-gray-200">
                 <p><span class="font-semibold text-slate-700">Fingerprint:</span> <span class="font-mono text-slate-500 text-xs">{{ vf.fingerprint }}</span></p>
                 <p><span class="font-semibold text-slate-700">Time:</span> <span class="text-slate-500">{{ vf.time }}</span></p>
                 <p><span class="font-semibold text-slate-700">User:</span> <span class="text-slate-500">{{ vf.user.join(', ') }}</span></p>
              </div>
              
              <div class="mb-4">
                <p class="font-semibold text-slate-700 mb-1">Info:</p>
                <div class="bg-white p-3 rounded-xl border border-gray-100">
                  <ul class="list-none space-y-1">
                    <li v-for="(value, key) in vf.info" :key="key" class="flex justify-between text-xs">
                      <span class="text-slate-500">{{ key }}</span>
                      <span class="text-slate-800 font-medium">{{ value }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <p class="font-semibold text-slate-700 mb-1">Tasks:</p>
                <div class="space-y-2">
                   <div v-for="(task, taskIndex) in vf.tasks" :key="taskIndex" class="bg-white p-3 rounded-xl border border-gray-100">
                     <p class="text-xs text-blue-600 mb-1 font-medium">{{ dayjs(task.time).format('YYYY-MM-DD HH:mm:ss') }}</p>
                     <ul class="list-disc pl-4 text-xs text-slate-600">
                       <li v-for="(value, key) in task" :key="key"><span class="opacity-70">{{ key }}:</span> {{ value }}</li>
                     </ul>
                   </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-slate-400 py-4">暂无 VF 信息</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue';
import Auth from '../../utils/auth';
import dayjs from 'dayjs';

const list = ref([{
  id: "__guest__",
  username: "__guest__",
  nickname: "未登录访客",
  profile: "{}"
}]);
const dialogVisible = ref(false);
const chatSessions = ref([]);
const chatList = ref([]);
const chatListDialogVisible = ref(false);
const loadingChatSessions = ref(false);
const loadingChatList = ref(false);
const sessionInfo = ref({});
const selectedUser = ref(null);

// 新增 VF 相关变量
const vfDialogVisible = ref(false); // 控制 VF 弹窗的显示状态
const vfDetails = ref([]); // 存储 VF 详细信息

onActivated(async () => {
  list.value = list.value.concat((await Auth.dangerViewGuest()).content || []);
});

const getChatHistory = async (item) => {
  try {
    chatSessions.value = [];
    dialogVisible.value = true;
    loadingChatSessions.value = true;
    selectedUser.value = {
      ...item,
      profile: JSON.parse(item.profile),
      hide: true // 默认隐藏空会话
    };
    const response = await Auth.getAiChatHistory(JSON.stringify({ user: item.id }));
    if (response.code === 'ok' && response.content) {
      chatSessions.value = (response.content || []);
    } else {
      chatSessions.value = [];
      console.error("获取SessionID失败:", response);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loadingChatSessions.value = false;
  }
};

function dataURLtoBlob(dataURL) {
  const matches = dataURL.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid data URL format");
  }
  const mimeType = matches[1]; // 提取 MIME 类型
  const base64Data = matches[2]; // 提取 Base64 数据
  const binaryString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return new Blob([uint8Array], { type: mimeType });
}

const openChatListDialog = async (session) => {
  try {
    sessionInfo.value = {};
    chatList.value = [];
    chatListDialogVisible.value = true; // 显示聊天详情弹窗
    loadingChatList.value = true;
    const sessionResponse = await Auth.getAIChatList({ sessionID: session.sessionID });
    if (sessionResponse.status === 'sus') {
      chatList.value = sessionResponse.content.map((e) => {
        if (e.photo) {
          if (e.photo.meta) {
            e.photo.blob = URL.createObjectURL(dataURLtoBlob(`data:${e.photo.type};base64,${e.photo.meta}`));
          }
        }
        if (e.audio) {
          if (e.audio.meta) {
            e.audio.blob = URL.createObjectURL(dataURLtoBlob(`data:${e.audio.type};base64,${e.audio.meta}`));
          }
        }
        return e;
      });
      // 存储聊天会话的基本信息
      sessionInfo.value = {
        id: session.sessionID,
        createTime: session.createTime,
        title: session.title,
        lastTime: sessionResponse.lastTime,
        expirationTime: session.expirationTime,
        vf: sessionResponse.vf || [],
        pt: sessionResponse.pt || ''
      };
    } else {
      console.error("获取聊天列表失败:", sessionResponse);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loadingChatList.value = false;
  }
};

// 查询 VF 详细信息的方法
const viewVfDetails = async (vfKey) => {
  try {
    vfDetails.value = []; // 清空之前的 VF 信息
    vfDialogVisible.value = true; // 显示弹窗
    const response = await fetch('/api/danger/viewVf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: vfKey }),
    });
    const data = await response.json();
    if (data.content) {
      vfDetails.value = data.content.map((item) => ({
        user: JSON.parse(item.user),
        fingerprint: item.fingerprint,
        time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'),
        info: JSON.parse(item.info),
        tasks: JSON.parse(item.tasks).sort((a, b) => new Date(b.time) - new Date(a.time)),
      }));
    } else {
      console.error("获取 VF 信息失败:", data);
    }
  } catch (error) {
    console.error("Error fetching VF details:", error);
  }
};
</script>

<style scoped>
/* Google Font 优化 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 隐藏滚动条但保留功能 (可选) */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>