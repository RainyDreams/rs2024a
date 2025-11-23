<template>
  <!-- 全局背景：使用 Material 3 推荐的 Surface Container Low 颜色 -->
  <div class="p-4 sm:p-8 bg-[#F0F4F8] min-h-screen font-sans text-slate-700">
    
    <div class="max-w-[1800px] mx-auto">
      <!-- 顶部标题栏 -->
      <header class="mb-8 pl-1">
        <h1 class="text-3xl sm:text-4xl text-[#1b1b1f] font-normal tracking-tight">会话管理后台</h1>
        <p class="text-sm text-slate-500 mt-2 font-medium">Dashboard & Session Analytics</p>
      </header>

      <!-- 列表区域：带骨架屏加载动画 -->
      <div v-if="loadingList" class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <div v-for="n in 8" :key="n" class="bg-white p-6 rounded-[24px] border border-transparent shadow-sm h-40 animate-pulse">
          <div class="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div class="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div class="h-4 bg-slate-100 rounded w-3/4"></div>
        </div>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <div v-for="item in list" :key="item.id" 
          class="group relative bg-white p-6 rounded-[24px] border border-white shadow-sm transition-all duration-300 cursor-pointer
                 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 hover:z-10" 
          @click="getChatHistory(item)">
          
          <!-- 状态指示点 -->
          <div class="absolute top-6 right-6 w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow-sm"></div>

          <div class="flex flex-col h-full justify-between">
            <div>
              <!-- 昵称：防止过长挤压，使用 truncate -->
              <div class="text-xl font-medium text-[#1b1b1f] mb-1 pr-6 truncate" :title="item.nickname">
                {{ item.nickname }}
              </div>
              <!-- 用户名 -->
              <div class="text-sm text-slate-500 font-medium flex items-center gap-1">
                <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs">USER</span>
                <span class="truncate">{{ item.username }}</span>
              </div>
            </div>
            
            <!-- 底部元数据：增加间距，防止挤在一起 -->
            <div class="mt-5 pt-4 border-t border-slate-50 space-y-2">
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span class="font-medium">ID</span>
                <span class="font-mono truncate max-w-[60%] text-right">{{ item.id }}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span class="font-medium">Created</span>
                <span>{{ dayjs(JSON.parse(item.profile).createTime).format('YY/MM/DD HH:mm') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="mt-12 mb-6 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full text-xs text-slate-400 border border-slate-100">
          <span>© 2024-{{ new Date().getFullYear() }}</span>
          <a href="https://github.com/RainyDreams" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium hover:underline">零本智协项目组</a>
          <span>All rights reserved.</span>
        </div>
      </div>
    </div>

    <!-- 弹窗 1: 会话历史列表 -->
    <div v-if="dialogVisible" class="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-[#1b1b1f]/60 backdrop-blur-sm transition-opacity" @click="dialogVisible = false"></div>
      
      <!-- 弹窗主体：圆角更大，限制最大宽度 -->
      <div class="bg-[#FDFDFD] w-full max-w-5xl h-[85vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        <!-- 头部 -->
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h2 class="text-2xl font-normal text-[#1b1b1f]">会话档案</h2>
            <p class="text-sm text-slate-500 mt-0.5" v-if="selectedUser">查看 <span class="font-medium text-slate-800">{{ selectedUser.nickname }}</span> 的所有记录</p>
          </div>
          <button @click="dialogVisible = false" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 内容区：Grid 布局分割左右 -->
        <div class="flex-1 overflow-hidden">
          <div class="h-full grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            <!-- 左侧：用户信息 (固定宽度/比例) -->
            <div class="lg:col-span-4 xl:col-span-3 p-6 overflow-y-auto bg-white">
              <div v-if="selectedUser" class="flex flex-col items-center text-center">
                <div class="relative mb-4 group">
                  <img :src="selectedUser.profile.avatar" class="w-28 h-28 object-cover rounded-full border-4 border-slate-50 shadow-md bg-slate-100" />
                </div>
                <h2 class="text-xl font-medium text-[#1b1b1f] mb-1">{{ selectedUser.nickname }}</h2>
                <p class="text-sm text-slate-500 mb-6 break-all">{{ selectedUser.username }}</p>

                <!-- 信息卡片 -->
                <div class="w-full bg-slate-50 rounded-2xl p-4 text-left space-y-3 border border-slate-100">
                  <div class="flex flex-col">
                    <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">User ID</span>
                    <span class="text-xs text-slate-700 font-mono break-all">{{ selectedUser.id }}</span>
                  </div>
                   <div class="flex flex-col">
                    <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Registered</span>
                    <span class="text-sm text-slate-700">{{ dayjs(selectedUser.profile.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Identity</span>
                    <span class="text-sm text-slate-700 flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                      {{ selectedUser.profile.identityType }}
                    </span>
                  </div>
                </div>
                
                <!-- 创建信息 -->
                 <div class="w-full mt-4 bg-white border border-slate-200 rounded-2xl p-4 text-left">
                    <p class="text-sm font-medium text-slate-700 mb-2">Meta Info</p>
                    <p class="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{{ selectedUser.profile.createInfo }}</p>
                 </div>
              </div>
            </div>

            <!-- 右侧：会话列表 -->
            <div class="lg:col-span-8 xl:col-span-9 bg-[#F8F9FA] flex flex-col h-full overflow-hidden">
              <!-- 工具栏 -->
              <div class="px-6 py-3 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
                <span class="text-sm font-medium text-slate-500">共找到 {{ chatSessions.length }} 个会话</span>
                <button v-if="!loadingChatSessions" @click="selectedUser.hide=!selectedUser.hide" 
                  class="text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :class="selectedUser.hide ? 'bg-slate-400' : 'bg-blue-500'"></span>
                  {{selectedUser.hide ? '显示空会话' : '隐藏空会话'}}
                </button>
              </div>

              <!-- 列表内容区 -->
              <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <!-- Loading 状态 -->
                <div v-if="loadingChatSessions" class="space-y-4">
                  <div v-for="i in 4" :key="i" class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-pulse flex flex-col gap-3">
                    <div class="h-5 bg-slate-200 rounded w-1/3"></div>
                    <div class="flex gap-4">
                      <div class="h-3 bg-slate-100 rounded w-20"></div>
                      <div class="h-3 bg-slate-100 rounded w-20"></div>
                    </div>
                  </div>
                </div>

                <!-- 数据列表 -->
                <div v-else-if="chatSessions.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                   <template v-for="session in chatSessions" :key="session.sessionID">
                      <div v-show="!selectedUser.hide || session.title!='无标题'"
                          class="group bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm cursor-pointer transition-all
                                 hover:shadow-md hover:border-blue-400 hover:ring-1 hover:ring-blue-400 active:scale-[0.99]"
                          @click="openChatListDialog(session)">
                        <div class="flex justify-between items-start mb-3">
                          <p class="text-base font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {{ session.title || '无标题会话' }}
                          </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span class="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                             🕒 {{ dayjs(session.createTime).format('MM-DD HH:mm') }}
                          </span>
                          <span class="flex items-center gap-1 text-slate-400">
                             ⏳ 过期: {{ dayjs(session.expirationTime).format('MM-DD') }}
                          </span>
                        </div>
                      </div>
                   </template>
                </div>

                <!-- 空状态 -->
                <div v-else class="flex flex-col items-center justify-center h-full text-slate-400">
                  <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">📂</div>
                  <p>暂无聊天记录</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 2: 聊天详情 -->
    <div v-if="chatListDialogVisible" class="fixed inset-0 flex items-center justify-center z-50 p-0 sm:p-4">
       <div class="absolute inset-0 bg-[#1b1b1f]/60 backdrop-blur-sm transition-opacity" @click="chatListDialogVisible = false"></div>

       <div class="bg-white w-full sm:max-w-4xl h-full sm:h-[92vh] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in slide-in-from-bottom-10 fade-in duration-200">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 bg-white/90 backdrop-blur z-20 flex justify-between items-center">
            <div class="min-w-0">
              <h2 class="text-lg font-semibold text-[#1b1b1f] truncate">{{ sessionInfo.title || 'Chat Details' }}</h2>
              <div class="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
                 <span class="px-2 py-0.5 bg-slate-100 rounded-md">PT: {{ sessionInfo.pt }}</span>
                 <span>{{ dayjs(sessionInfo.createTime).format('YYYY-MM-DD HH:mm') }}</span>
              </div>
            </div>
            <button @click="chatListDialogVisible = false" class="ml-4 w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>
          </div>

          <!-- 聊天内容滚动区 -->
          <div class="flex-1 overflow-y-auto bg-[#F2F4F7] p-4 sm:p-8 custom-scrollbar relative">
             
             <!-- Loading Spinner -->
             <div v-if="loadingChatList" class="absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10">
               <div class="w-10 h-10 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
               <p class="mt-3 text-sm text-slate-500 font-medium">Loading messages...</p>
             </div>

             <!-- 会话元信息卡片 -->
             <div v-if="!loadingChatList && chatList.length > 0" class="mx-auto max-w-2xl mb-8 text-center">
                <div class="inline-block bg-white/80 border border-blue-100 rounded-xl p-3 text-xs text-slate-500 shadow-sm backdrop-blur-sm">
                   <div class="flex justify-center gap-4 mb-2">
                      <span>ID: {{ sessionInfo.id }}</span>
                      <span>Last: {{ dayjs(sessionInfo.lastTime).format('MM-DD HH:mm') }}</span>
                   </div>
                   <div v-if="sessionInfo.vf && sessionInfo.vf.length" class="flex flex-wrap justify-center items-center gap-1">
                      <span>VF Traces:</span>
                      <span v-for="(x, i) in sessionInfo.vf" :key="i" @click="viewVfDetails(x)" 
                        class="cursor-pointer text-blue-600 hover:underline bg-blue-50 px-1.5 rounded border border-blue-100">
                        {{ x }}
                      </span>
                   </div>
                </div>
             </div>

             <!-- 消息流 -->
             <div v-if="chatList.length > 0" class="space-y-6 max-w-3xl mx-auto">
                <div v-for="(message, index) in chatList" :key="index" 
                     class="flex flex-col"
                     :class="message.role === 'user' ? 'items-end' : 'items-start'">
                  
                  <!-- 头像/角色名 -->
                  <div class="mb-1 px-2 text-[11px] text-slate-400 font-medium flex gap-2 items-center">
                    <span>{{ message.role === 'user'? 'User' : 'AI Assistant' }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{{ dayjs(message.sendTime).format('HH:mm:ss') }}</span>
                  </div>

                  <!-- 气泡 -->
                  <div :class="[
                    'max-w-[90%] sm:max-w-[85%] px-5 py-3 shadow-sm text-[15px] leading-7 relative break-words',
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-[24px] rounded-tr-sm' 
                      : 'bg-white text-slate-800 border border-slate-200/60 rounded-[24px] rounded-tl-sm'
                  ]">
                    <!-- 文本内容 -->
                    <div class="whitespace-pre-wrap font-normal tracking-wide">{{ message.content }}</div>

                    <!-- 多媒体内容 -->
                    <div v-if="message.photo?.blob" class="mt-3 -mx-1">
                       <img class="rounded-xl border border-black/10 max-h-80 object-contain bg-black/5" :src="message.photo.blob" alt="Photo" />
                    </div>
                    <div v-if="message.audio?.blob" class="mt-3 p-2 bg-black/5 rounded-xl">
                       <audio class="w-full h-8" controls :src="message.audio.blob"></audio>
                    </div>

                    <!-- 模型调试信息 (折叠在底部，避免挤压) -->
                    <div v-if="message?.model_list" class="mt-3 pt-2 border-t border-dashed opacity-70" 
                         :class="message.role === 'user' ? 'border-white/30 text-blue-100' : 'border-slate-200 text-slate-400'">
                       <div class="flex flex-wrap gap-2 text-[10px] font-mono">
                          <span v-for="(k,m) in message.model_list" :key="m" class="bg-black/5 px-1.5 rounded">
                            {{ k.model }} ({{ k.time }}ms)
                          </span>
                       </div>
                    </div>
                  </div>

                  <!-- AI 分析框 -->
                  <div v-if="message.role === 'user' && message.analysis" class="mt-2 mr-1 max-w-[80%] self-end animate-in fade-in slide-in-from-top-2">
                     <div class="bg-amber-50 border border-amber-100 text-amber-800 text-xs p-3 rounded-xl shadow-sm flex gap-2 items-start">
                        <span class="text-lg leading-none">⚡</span>
                        <div class="leading-relaxed">{{ message.analysis }}</div>
                     </div>
                  </div>

                </div>
             </div>

             <div v-else-if="!loadingChatList" class="text-center py-20 opacity-50">
                <p>暂无对话记录</p>
             </div>
          </div>
       </div>
    </div>

    <!-- 弹窗 3: VF 详情 (Sidebar Style) -->
    <div v-if="vfDialogVisible" class="fixed inset-0 z-[60] flex justify-end">
      <div class="absolute inset-0 bg-[#1b1b1f]/30 backdrop-blur-[1px] transition-opacity" @click="vfDialogVisible = false"></div>
      
      <div class="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 relative z-10">
         <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 class="font-semibold text-slate-800">VF Fingerprint Detail</h2>
            <button @click="vfDialogVisible = false" class="text-slate-400 hover:text-slate-700"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
         </div>
         
         <div class="flex-1 overflow-y-auto p-5 bg-white">
            <div v-if="vfDetails.length" class="space-y-6">
              <div v-for="(vf, index) in vfDetails" :key="index" class="relative pl-4 border-l-2 border-blue-200">
                 <div class="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                 
                 <div class="mb-2">
                    <p class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Fingerprint</p>
                    <code class="block bg-slate-800 text-slate-200 text-[10px] p-2 rounded break-all font-mono">{{ vf.fingerprint }}</code>
                 </div>
                 
                 <div class="mb-3">
                    <p class="text-xs font-bold text-slate-500 uppercase mb-1">Time</p>
                    <p class="text-sm text-slate-800">{{ vf.time }}</p>
                 </div>

                 <div class="space-y-2">
                    <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <p class="text-xs font-semibold mb-2 text-slate-700 border-b pb-1">System Info</p>
                       <ul class="space-y-1">
                         <li v-for="(value, key) in vf.info" :key="key" class="text-xs grid grid-cols-[80px_1fr] gap-2">
                           <span class="text-slate-400 text-right truncate">{{ key }}:</span>
                           <span class="text-slate-800 truncate font-medium" :title="value">{{ value }}</span>
                         </li>
                       </ul>
                    </div>
                 </div>
              </div>
            </div>
            <div v-else class="text-center text-slate-400 mt-10">No Trace Found</div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue';
import Auth from '../../utils/auth';
import dayjs from 'dayjs';

// 状态变量
const list = ref([]);
const loadingList = ref(true); // 新增：列表加载状态
const dialogVisible = ref(false);
const chatSessions = ref([]);
const chatList = ref([]);
const chatListDialogVisible = ref(false);
const loadingChatSessions = ref(false);
const loadingChatList = ref(false);
const sessionInfo = ref({});
const selectedUser = ref(null);
const vfDialogVisible = ref(false);
const vfDetails = ref([]);

onActivated(async () => {
  loadingList.value = true; // 开始加载
  try {
    // 模拟网络延迟，让骨架屏展示一会 (可选，实际可移除 setTimeout)
    // await new Promise(r => setTimeout(r, 500)); 
    
    const res = await Auth.dangerViewGuest();
    list.value = res.content || [];
    
    // 如果列表为空，添加默认访客数据
    if (list.value.length === 0) {
       list.value = [{
        id: "__guest__",
        username: "__guest__",
        nickname: "未登录访客",
        profile: JSON.stringify({ createTime: new Date(), identityType: 'Guest', createInfo: 'Default Guest Account' })
      }];
    }
  } catch (e) {
    console.error(e);
  } finally {
    loadingList.value = false; // 结束加载
  }
});

const getChatHistory = async (item) => {
  try {
    chatSessions.value = [];
    dialogVisible.value = true;
    loadingChatSessions.value = true;
    
    // 确保 profile 是对象
    let profileObj = {};
    try {
        profileObj = typeof item.profile === 'string' ? JSON.parse(item.profile) : item.profile;
    } catch(e) { profileObj = {} }

    selectedUser.value = {
      ...item,
      profile: profileObj,
      hide: true
    };
    
    const response = await Auth.getAiChatHistory(JSON.stringify({ user: item.id }));
    if (response.code === 'ok' && response.content) {
      chatSessions.value = (response.content || []);
    } else {
      chatSessions.value = [];
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loadingChatSessions.value = false;
  }
};

function dataURLtoBlob(dataURL) {
  const matches = dataURL.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error("Invalid data URL");
  const mimeType = matches[1];
  const binaryString = atob(matches[2]);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return new Blob([uint8Array], { type: mimeType });
}

const openChatListDialog = async (session) => {
  try {
    sessionInfo.value = {};
    chatList.value = [];
    chatListDialogVisible.value = true;
    loadingChatList.value = true;
    
    const sessionResponse = await Auth.getAIChatList({ sessionID: session.sessionID });
    
    if (sessionResponse.status === 'sus') {
      chatList.value = sessionResponse.content.map((e) => {
        if (e.photo?.meta) e.photo.blob = URL.createObjectURL(dataURLtoBlob(`data:${e.photo.type};base64,${e.photo.meta}`));
        if (e.audio?.meta) e.audio.blob = URL.createObjectURL(dataURLtoBlob(`data:${e.audio.type};base64,${e.audio.meta}`));
        return e;
      });
      
      sessionInfo.value = {
        id: session.sessionID,
        createTime: session.createTime,
        title: session.title,
        lastTime: sessionResponse.lastTime,
        expirationTime: session.expirationTime,
        vf: sessionResponse.vf || [],
        pt: sessionResponse.pt || ''
      };
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loadingChatList.value = false;
  }
};

const viewVfDetails = async (vfKey) => {
  try {
    vfDetails.value = [];
    vfDialogVisible.value = true;
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
        tasks: JSON.parse(item.tasks || '[]').sort((a, b) => new Date(b.time) - new Date(a.time)),
      }));
    }
  } catch (error) {
    console.error("VF Error:", error);
  }
};
</script>

<style scoped>
/* 定义细滚动条，适应长列表 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94A3B8;
}

/* 动画工具类 */
.fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>