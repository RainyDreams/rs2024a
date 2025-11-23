<template>
  <!-- 全局背景：Material 3 Surface -->
  <div class="p-4 sm:p-8 bg-[#F2F6FC] min-h-screen font-sans text-[#1F1F1F]">
    
    <div class="max-w-[1800px] mx-auto">
      <!-- 顶部大标题：Google Sans 风格 -->
      <header class="mb-8 px-2 py-4">
        <h1 class="text-3xl sm:text-4xl font-normal tracking-tight text-[#1F1F1F]">会话管理后台</h1>
        <p class="text-sm text-[#444746] mt-2 font-medium flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          Dashboard & Analytics
        </p>
      </header>

      <!-- 列表区域：骨架屏与卡片 -->
      <div v-if="loadingList" class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <div v-for="n in 8" :key="n" class="bg-white p-6 rounded-[24px] h-40 animate-pulse shadow-sm"></div>
      </div>

      <div v-else class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <div v-for="item in list" :key="item.id" 
          class="group relative bg-white p-6 rounded-[24px] shadow-sm border border-transparent transition-all duration-300
                 hover:shadow-md hover:bg-[#EEF2F9] cursor-pointer active:scale-[0.98]" 
          @click="getChatHistory(item)">
          
          <div class="flex flex-col h-full justify-between">
            <div>
              <div class="flex justify-between items-start">
                <div class="text-lg font-medium text-[#1F1F1F] pr-4 truncate max-w-[80%]" :title="item.nickname">
                  {{ item.nickname }}
                </div>
                <!-- 访客/用户 徽标 -->
                <span v-if="item.id === '__guest__'" class="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider">GUEST</span>
                <span v-else class="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider">USER</span>
              </div>
              <div class="text-sm text-[#444746] mt-1 truncate">{{ item.username }}</div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-[#E1E3E1] flex flex-col gap-1.5">
              <div class="flex items-center justify-between text-xs text-[#747775]">
                <span>ID</span>
                <span class="font-mono truncate max-w-[100px] bg-[#F2F2F2] px-1.5 rounded">{{ item.id }}</span>
              </div>
              <div class="flex items-center justify-between text-xs text-[#747775]">
                <span>Created</span>
                <span>{{ dayjs(JSON.parse(item.profile).createTime).format('YY/MM/DD') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
       <!-- 版权信息 -->
      <div class="mt-12 mb-8 text-center">
        <span class="text-xs text-[#747775] bg-white/60 px-4 py-2 rounded-full">© 2024 零本智协 · All rights reserved.</span>
      </div>
    </div>

    <!-- 弹窗 1: 会话档案 (深度优化移动端高度) -->
    <div v-if="dialogVisible" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-[#1F1F1F]/40 backdrop-blur-sm transition-opacity" @click="dialogVisible = false"></div>
      
      <!-- 弹窗容器：手机端全屏(h-[100dvh])，桌面端居中(h-[85vh]) -->
      <div class="bg-[#FDFDFD] w-full sm:max-w-5xl h-[100dvh] sm:h-[85vh] 
                  rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden relative z-10 
                  animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
        
        <!-- 顶部导航栏 -->
        <div class="px-4 sm:px-6 py-4 border-b border-[#E1E3E1] flex justify-between items-center bg-white shrink-0">
          <div class="flex flex-col">
            <h2 class="text-xl font-normal text-[#1F1F1F]">会话档案</h2>
             <!-- 移动端简略显示用户名 -->
            <p class="text-xs text-[#444746] sm:hidden mt-0.5">用户: {{ selectedUser?.nickname }}</p>
          </div>
          <button @click="dialogVisible = false" class="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#E1E1E1] text-[#444746] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 内容布局：Flex Col on Mobile, Grid on Desktop -->
        <div class="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          <!-- 侧边栏：用户信息 -->
          <!-- 桌面端显示完整侧边栏，移动端隐藏（节省垂直空间） -->
          <div class="hidden lg:block lg:w-80 xl:w-96 bg-white border-r border-[#E1E3E1] p-6 overflow-y-auto shrink-0">
             <div v-if="selectedUser" class="flex flex-col items-center text-center">
                <img :src="selectedUser.profile.avatar" class="w-24 h-24 rounded-full mb-4 bg-[#F2F2F2] object-cover border-4 border-white shadow-sm" />
                <h3 class="text-lg font-medium text-[#1F1F1F]">{{ selectedUser.nickname }}</h3>
                <p class="text-sm text-[#444746] mb-6 break-all">{{ selectedUser.username }}</p>
                
                <!-- 桌面端详细信息 -->
                <div class="w-full space-y-3 text-left bg-[#F8F9FA] p-4 rounded-2xl">
                   <div class="text-xs">
                      <p class="font-medium text-[#1F1F1F] mb-1">User ID</p>
                      <p class="font-mono text-[#747775] break-all">{{ selectedUser.id }}</p>
                   </div>
                   <div class="text-xs">
                      <p class="font-medium text-[#1F1F1F] mb-1">Identity</p>
                      <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-md">{{ selectedUser.profile.identityType }}</span>
                   </div>
                   <div class="text-xs">
                      <p class="font-medium text-[#1F1F1F] mb-1">Meta</p>
                      <p class="text-[#747775] whitespace-pre-line">{{ selectedUser.profile.createInfo }}</p>
                   </div>
                </div>
             </div>
          </div>

          <!-- 移动端用户信息摘要 (可折叠，默认折叠以节省高度) -->
          <!-- 仅在 mobile 显示 -->
          <div class="lg:hidden bg-white px-4 py-3 border-b border-[#E1E3E1] shrink-0 flex items-center justify-between">
             <div class="flex items-center gap-3">
                <img :src="selectedUser?.profile.avatar" class="w-10 h-10 rounded-full bg-[#F2F2F2] object-cover" />
                <div>
                   <div class="text-sm font-medium text-[#1F1F1F]">{{ selectedUser?.nickname }}</div>
                   <div class="text-xs text-[#747775]">{{ selectedUser?.id === '__guest__' ? 'Guest Access' : 'Registered User' }}</div>
                </div>
             </div>
             <!-- 可以在这里加一个 toggle 按钮展开详细信息，为了简洁暂时省略 -->
          </div>

          <!-- 主内容区：会话列表 -->
          <!-- 关键：使用 flex-1 和 overflow-y-auto 确保只有这个区域滚动，且占满剩余高度 -->
          <div class="flex-1 flex flex-col bg-[#F2F6FC] overflow-hidden h-full w-full">
            
            <!-- 过滤器工具栏 -->
            <div class="px-4 sm:px-6 py-3 bg-[#F2F6FC] flex justify-between items-center shrink-0">
              <span class="text-xs sm:text-sm font-medium text-[#444746]">{{ chatSessions.length }} 个历史会话</span>
              <button v-if="!loadingChatSessions" @click="selectedUser.hide=!selectedUser.hide" 
                class="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors border"
                :class="selectedUser.hide ? 'bg-[#D3E3FD] text-[#041E49] border-transparent' : 'bg-white text-[#444746] border-[#747775]'">
                <svg v-if="selectedUser.hide" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                {{selectedUser.hide ? '已隐藏空会话' : '显示所有会话'}}
              </button>
            </div>

            <!-- 滚动列表 -->
            <div class="flex-1 overflow-y-auto px-4 sm:px-6 pb-20 sm:pb-6 custom-scrollbar">
               <div v-if="loadingChatSessions" class="flex flex-col items-center justify-center h-40">
                  <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
               </div>

               <div v-else-if="chatSessions.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <template v-for="session in chatSessions" :key="session.sessionID">
                    <div v-show="!selectedUser.hide || session.title!='无标题'"
                         class="bg-white p-4 rounded-[16px] border border-transparent shadow-sm active:scale-[0.99] transition-all cursor-pointer
                                hover:shadow hover:bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                         @click="openChatListDialog(session)">
                      
                      <div class="min-w-0 flex-1">
                        <h4 class="text-base font-medium text-[#1F1F1F] truncate mb-1">{{ session.title || '无标题会话' }}</h4>
                        <div class="flex items-center gap-2 text-xs text-[#747775]">
                           <span class="bg-[#F2F2F2] px-2 py-0.5 rounded-md truncate max-w-[120px] font-mono">{{ session.sessionID.slice(0,8) }}...</span>
                        </div>
                      </div>

                      <div class="flex items-center justify-between sm:justify-end gap-4 text-xs text-[#747775] font-medium border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E1E3E1]">
                        <span>{{ dayjs(session.createTime).format('MM/DD HH:mm') }}</span>
                        <svg class="w-4 h-4 text-[#C4C7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  </template>
               </div>

               <div v-else class="flex flex-col items-center justify-center h-64 text-[#8E918F]">
                  <svg class="w-12 h-12 mb-2 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                  <p>暂无会话记录</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 2: 聊天详情 (同样的全屏优化) -->
    <div v-if="chatListDialogVisible" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-[#1F1F1F]/40 backdrop-blur-sm transition-opacity" @click="chatListDialogVisible = false"></div>

      <div class="bg-[#FDFDFD] w-full sm:max-w-4xl h-[100dvh] sm:h-[90vh] 
                  rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden relative z-10
                  animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 duration-300">
        
        <!-- Header -->
        <div class="px-4 py-3 border-b border-[#E1E3E1] bg-white flex items-center gap-3 shrink-0">
          <button @click="chatListDialogVisible = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F2F2] text-[#444746]">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div class="min-w-0 flex-1">
             <h2 class="text-lg font-normal text-[#1F1F1F] truncate">{{ sessionInfo.title || '对话详情' }}</h2>
             <div class="text-xs text-[#747775] flex items-center gap-2">
               <span>{{ dayjs(sessionInfo.createTime).format('YYYY-MM-DD HH:mm') }}</span>
               <span v-if="sessionInfo.pt" class="bg-[#F2F2F2] px-1.5 rounded text-[10px]">PT: {{ sessionInfo.pt }}</span>
             </div>
          </div>
        </div>

        <!-- 聊天内容区 -->
        <div class="flex-1 overflow-y-auto bg-[#EEF2F9] p-4 custom-scrollbar">
           <div v-if="loadingChatList" class="flex justify-center py-10">
             <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
           </div>

           <div v-else class="space-y-6 max-w-3xl mx-auto pb-10">
              <!-- Info Card -->
              <div class="text-center mb-6">
                 <span class="text-[10px] text-[#747775] bg-[#E1E3E1]/50 px-3 py-1 rounded-full">Session ID: {{ sessionInfo.id }}</span>
                 <div v-if="sessionInfo.vf?.length" class="mt-2 flex justify-center gap-2 flex-wrap">
                    <span v-for="(x, i) in sessionInfo.vf" :key="i" @click="viewVfDetails(x)" 
                          class="cursor-pointer text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md hover:bg-blue-100">
                      Trace: {{ x }}
                    </span>
                 </div>
              </div>

              <div v-for="(message, index) in chatList" :key="index" 
                   class="flex flex-col w-full"
                   :class="message.role === 'user' ? 'items-end' : 'items-start'">
                
                <div :class="[
                  'max-w-[92%] sm:max-w-[80%] px-4 py-3 text-[15px] leading-relaxed shadow-sm relative',
                  message.role === 'user' 
                    ? 'bg-[#0B57D0] text-white rounded-[20px] rounded-tr-[4px]' 
                    : 'bg-white text-[#1F1F1F] rounded-[20px] rounded-tl-[4px]'
                ]">
                   <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
                   
                   <!-- 多媒体 -->
                   <div v-if="message.photo?.blob" class="mt-2"><img :src="message.photo.blob" class="rounded-lg max-h-64 object-cover" /></div>
                   <div v-if="message.audio?.blob" class="mt-2"><audio :src="message.audio.blob" controls class="h-8 w-full max-w-[200px]"></audio></div>

                   <!-- 模型信息 -->
                   <div v-if="message?.model_list" class="mt-2 pt-2 border-t border-dashed text-[10px] font-mono opacity-60"
                        :class="message.role === 'user' ? 'border-white/20' : 'border-black/10'">
                      <span v-for="(k,m) in message.model_list" :key="m" class="mr-2">{{ k.model }} ({{ k.time }}ms)</span>
                   </div>
                </div>
                
                <span class="text-[10px] text-[#8E918F] mt-1 px-2">
                   {{ message.role === 'user' ? 'You' : 'AI' }} · {{ dayjs(message.sendTime).format('HH:mm') }}
                </span>

                 <!-- 分析框 -->
                <div v-if="message.role === 'user' && message.analysis" class="max-w-[90%] mt-1 mr-2 bg-[#FFD8E4]/40 border border-[#FFD8E4] p-3 rounded-xl text-xs text-[#5C1D32] flex gap-2">
                   <span>⚡</span><div>{{ message.analysis }}</div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- VF Sidebar -->
    <div v-if="vfDialogVisible" class="fixed inset-0 z-[60] flex justify-end">
       <div class="absolute inset-0 bg-[#1F1F1F]/40 backdrop-blur-sm" @click="vfDialogVisible = false"></div>
       <div class="bg-white w-full max-w-md h-full shadow-xl relative z-10 flex flex-col animate-in slide-in-from-right duration-300">
          <div class="p-4 border-b flex justify-between items-center bg-[#F8F9FA]">
             <h3 class="font-medium">Fingerprint Details</h3>
             <button @click="vfDialogVisible = false" class="p-2 hover:bg-gray-200 rounded-full"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
             <div v-for="(vf, index) in vfDetails" :key="index" class="mb-6 pl-4 border-l-2 border-blue-500">
                <div class="text-xs font-mono bg-[#1F1F1F] text-white p-2 rounded mb-2 break-all">{{ vf.fingerprint }}</div>
                <div class="text-sm text-gray-600 mb-2">{{ vf.time }}</div>
                <div class="bg-[#F2F6FC] p-3 rounded-lg text-xs space-y-1">
                   <div v-for="(v, k) in vf.info" :key="k" class="flex justify-between"><span class="text-gray-500">{{k}}:</span> <span class="font-medium">{{v}}</span></div>
                </div>
             </div>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue';
import Auth from '../../utils/auth';
import dayjs from 'dayjs';

// Guest 常量定义
const guestItem = {
  id: "__guest__",
  username: "__guest__",
  nickname: "未登录访客",
  profile: JSON.stringify({
    createTime: new Date(),
    identityType: 'Guest',
    avatar: 'https://www.gstatic.com/images/branding/product/1x/avatar_square_blue_512dp.png', // Google 默认头像风格
    createInfo: 'Default system guest account'
  })
};

const list = ref([guestItem]);
const loadingList = ref(true);
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
  loadingList.value = true;
  try {
    const res = await Auth.dangerViewGuest();
    // 合并 guest 和 API 数据
    list.value = [guestItem, ...(res.content || [])];
  } catch (e) {
    list.value = [guestItem];
  } finally {
    loadingList.value = false;
  }
});

const getChatHistory = async (item) => {
  try {
    chatSessions.value = [];
    dialogVisible.value = true;
    loadingChatSessions.value = true;
    
    let profileObj = {};
    try { profileObj = typeof item.profile === 'string' ? JSON.parse(item.profile) : item.profile; } catch(e) {}
    // 给没有头像的用户一个默认头像
    if(!profileObj.avatar) profileObj.avatar = `https://ui-avatars.com/api/?name=${item.nickname}&background=random`;

    selectedUser.value = { ...item, profile: profileObj, hide: true };
    
    const response = await Auth.getAiChatHistory(JSON.stringify({ user: item.id }));
    chatSessions.value = (response.code === 'ok' && response.content) ? response.content : [];
  } catch (error) {
    console.error(error);
  } finally {
    loadingChatSessions.value = false;
  }
};

function dataURLtoBlob(dataURL) {
  const matches = dataURL.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error("Invalid data URL");
  return new Blob([Uint8Array.from(atob(matches[2]), c => c.charCodeAt(0))], { type: matches[1] });
}

const openChatListDialog = async (session) => {
  try {
    sessionInfo.value = {};
    chatList.value = [];
    chatListDialogVisible.value = true;
    loadingChatList.value = true;
    
    const res = await Auth.getAIChatList({ sessionID: session.sessionID });
    if (res.status === 'sus') {
      chatList.value = res.content.map((e) => {
        if (e.photo?.meta) e.photo.blob = URL.createObjectURL(dataURLtoBlob(`data:${e.photo.type};base64,${e.photo.meta}`));
        if (e.audio?.meta) e.audio.blob = URL.createObjectURL(dataURLtoBlob(`data:${e.audio.type};base64,${e.audio.meta}`));
        return e;
      });
      sessionInfo.value = {
        id: session.sessionID,
        createTime: session.createTime,
        title: session.title,
        lastTime: res.lastTime,
        vf: res.vf || [],
        pt: res.pt || ''
      };
    }
  } finally {
    loadingChatList.value = false;
  }
};

const viewVfDetails = async (vfKey) => {
    // ... 保持原有的 VF 逻辑 ...
    vfDetails.value = []; 
    vfDialogVisible.value = true;
    try {
        const response = await fetch('/api/danger/viewVf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: vfKey }),
        });
        const data = await response.json();
        if (data.content) {
            vfDetails.value = data.content.map(item => ({
                fingerprint: item.fingerprint,
                time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'),
                info: JSON.parse(item.info),
                user: JSON.parse(item.user)
            }));
        }
    } catch (e) { console.error(e) }
};
</script>

<style scoped>
/* 隐藏 Webkit 滚动条，但保留功能，或使用极简滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #C4C7C5;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>