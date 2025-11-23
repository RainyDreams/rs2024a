<template>
  <!-- 背景：使用 MD3 推荐的 Surface Container Low -->
  <div class="p-3 sm:p-6 bg-[#F0F4F9] min-h-screen font-sans text-[#1F1F1F]">
    
    <div class="max-w-[1920px] mx-auto">
      <!-- 顶部导航：大标题 + 状态栏 -->
      <header class="mb-6 px-2 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-normal text-[#1F1F1F] tracking-tight">会话管理控制台</h1>
          <p class="text-sm text-[#444746] mt-1 font-medium">Session Analytics & Trace</p>
        </div>
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E1E3E1]">
           <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
           <span class="text-xs font-medium text-[#444746]">System Active</span>
        </div>
      </header>

      <!-- 主列表：骨架屏加载 -->
      <div v-if="loadingList" class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <div v-for="n in 8" :key="n" class="bg-white h-48 rounded-[24px] animate-pulse"></div>
      </div>

      <!-- 主列表：用户卡片 -->
      <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <div v-for="item in list" :key="item.id" 
          class="group relative bg-[#FDFDFD] p-5 rounded-[24px] transition-all duration-300 cursor-pointer overflow-hidden
                 hover:shadow-lg hover:bg-[#EEF2F9] active:scale-[0.98] border border-transparent hover:border-[#D3E3FD]" 
          @click="getChatHistory(item)">
          
          <div class="flex flex-col h-full relative z-10">
            <div class="flex justify-between items-start mb-3">
              <div class="min-w-0 pr-2">
                <div class="text-lg font-medium text-[#1F1F1F] truncate" :title="item.nickname">{{ item.nickname }}</div>
                <div class="text-xs text-[#444746] mt-0.5 truncate opacity-80">{{ item.username }}</div>
              </div>
              <div class="shrink-0">
                 <img v-if="JSON.parse(item.profile).avatar" :src="JSON.parse(item.profile).avatar" class="w-10 h-10 rounded-full object-cover border border-[#E1E3E1]">
                 <div v-else class="w-10 h-10 rounded-full bg-[#E1E3E1] flex items-center justify-center text-[10px] text-[#444746] font-bold">
                    {{ item.nickname.charAt(0).toUpperCase() }}
                 </div>
              </div>
            </div>

            <div class="mt-auto pt-3 border-t border-[#F0F4F9] group-hover:border-[#DEE2E6] transition-colors space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#747775] font-medium">ID</span>
                <span class="bg-[#F0F4F9] text-[#1F1F1F] px-2 py-0.5 rounded-md font-mono truncate max-w-[100px] group-hover:bg-white">{{ item.id }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                 <span class="text-[#747775] font-medium">Reg. Time</span>
                 <span class="text-[#444746]">{{ dayjs(JSON.parse(item.profile).createTime).format('YY/MM/DD') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-12 text-center text-xs text-[#8E918F] font-medium">
         © 2024 零本智协 Project Group · Material Design 3 Interface
      </div>
    </div>

    <!-- 弹窗 1: 会话档案 (Session Archive) -->
    <div v-if="dialogVisible" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-[#1F1F1F]/40 backdrop-blur-sm transition-opacity" @click="dialogVisible = false"></div>
      
      <div class="bg-[#FDFDFD] w-full sm:max-w-6xl h-[100dvh] sm:h-[90vh] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in slide-in-from-bottom-8 duration-300">
        
        <!-- 顶部栏 -->
        <div class="px-6 py-4 bg-white border-b border-[#E1E3E1] flex justify-between items-center shrink-0">
          <div>
             <h2 class="text-xl font-normal text-[#1F1F1F]">Session Archive</h2>
             <p class="text-xs text-[#444746] mt-0.5 sm:hidden">User: {{ selectedUser?.nickname }}</p>
          </div>
          <button @click="dialogVisible = false" class="w-10 h-10 rounded-full hover:bg-[#F0F4F9] flex items-center justify-center text-[#444746] transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="flex-1 overflow-hidden flex flex-col lg:flex-row bg-[#F2F6FC]">
          
          <!-- 左侧：用户信息 (Mobile 折叠 / Desktop 侧边) -->
          <div class="bg-white lg:w-80 xl:w-96 shrink-0 border-r border-[#E1E3E1] overflow-y-auto lg:block" 
               :class="showMobileProfile ? 'block h-auto max-h-[40vh] border-b' : 'hidden'">
            <div v-if="selectedUser" class="p-6">
               <div class="flex flex-col items-center text-center mb-6">
                  <img :src="selectedUser.profile.avatar || `https://ui-avatars.com/api/?name=${selectedUser.nickname}`" 
                       class="w-24 h-24 rounded-full border-4 border-[#F2F6FC] shadow-sm object-cover mb-3" />
                  <h3 class="text-xl font-medium text-[#1F1F1F]">{{ selectedUser.nickname }}</h3>
                  <span class="mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                    {{ selectedUser.profile.identityType || 'Guest' }}
                  </span>
               </div>
               
               <!-- 用户元数据面板 -->
               <div class="bg-[#F8F9FA] rounded-2xl p-4 space-y-3 border border-[#E1E3E1]">
                  <div>
                     <p class="text-[10px] uppercase tracking-wider text-[#747775] font-bold mb-1">UUID</p>
                     <p class="text-xs font-mono text-[#1F1F1F] break-all leading-relaxed">{{ selectedUser.id }}</p>
                  </div>
                  <div>
                     <p class="text-[10px] uppercase tracking-wider text-[#747775] font-bold mb-1">Meta Info</p>
                     <p class="text-xs text-[#444746] whitespace-pre-wrap leading-relaxed">{{ selectedUser.profile.createInfo }}</p>
                  </div>
               </div>
            </div>
          </div>
          
          <!-- Mobile 端用户摘要栏 (仅在移动端显示，点击切换详情) -->
          <div class="lg:hidden bg-white px-4 py-3 border-b border-[#E1E3E1] flex items-center justify-between shrink-0" @click="showMobileProfile = !showMobileProfile">
             <div class="flex items-center gap-3">
               <img :src="selectedUser?.profile.avatar || `https://ui-avatars.com/api/?name=${selectedUser?.nickname}`" class="w-8 h-8 rounded-full" />
               <span class="font-medium text-sm">{{ selectedUser?.nickname }}</span>
             </div>
             <svg class="w-5 h-5 text-[#747775] transition-transform" :class="showMobileProfile?'rotate-180':''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>

          <!-- 右侧：会话列表 -->
          <div class="flex-1 flex flex-col overflow-hidden h-full relative">
            <!-- 过滤条 -->
            <div class="px-4 sm:px-6 py-3 flex justify-between items-center shrink-0">
               <span class="text-xs sm:text-sm font-medium text-[#444746]">Total {{ chatSessions.length }} sessions</span>
               <button @click="selectedUser.hide=!selectedUser.hide" class="text-xs font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                  {{selectedUser.hide ? 'Show All' : 'Hide Empty'}}
               </button>
            </div>

            <div class="flex-1 overflow-y-auto px-4 sm:px-6 pb-8 custom-scrollbar">
               <div v-if="loadingChatSessions" class="flex justify-center py-10"><div class="spinner"></div></div>
               
               <div v-else-if="chatSessions.length > 0" class="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  <template v-for="session in chatSessions" :key="session.sessionID">
                     <div v-show="!selectedUser.hide || session.title!='无标题'"
                          class="group bg-white p-4 rounded-[20px] border border-transparent shadow-sm hover:shadow-md hover:border-[#A8C7FA] cursor-pointer transition-all active:scale-[0.99]"
                          @click="openChatListDialog(session)">
                        
                        <div class="flex justify-between items-start mb-2">
                           <h4 class="text-[15px] font-medium text-[#1F1F1F] truncate pr-4">{{ session.title || 'Untitled Session' }}</h4>
                           <span class="bg-[#F2F2F2] text-[#444746] text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0">
                              {{ session.sessionID.slice(0,6) }}
                           </span>
                        </div>

                        <div class="flex flex-col gap-1 mt-3 pt-3 border-t border-[#F2F2F2] text-xs text-[#747775]">
                           <div class="flex justify-between">
                              <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Created</span>
                              <span>{{ dayjs(session.createTime).format('MM-DD HH:mm') }}</span>
                           </div>
                           <!-- 恢复：显示过期时间 -->
                           <div class="flex justify-between text-red-400/80">
                              <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Expires</span>
                              <span>{{ dayjs(session.expirationTime).format('MM-DD HH:mm') }}</span>
                           </div>
                        </div>
                     </div>
                  </template>
               </div>
               <div v-else class="text-center py-20 text-[#8E918F]">No history found</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 2: 聊天详情 (Chat Detail) -->
    <div v-if="chatListDialogVisible" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div class="absolute inset-0 bg-[#1F1F1F]/40 backdrop-blur-sm transition-opacity" @click="chatListDialogVisible = false"></div>

      <div class="bg-white w-full sm:max-w-5xl h-[100dvh] sm:h-[92vh] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-300">
         
         <!-- Header -->
         <div class="px-4 sm:px-6 py-3 border-b border-[#E1E3E1] bg-white flex items-center justify-between shrink-0 z-20">
            <div class="min-w-0 flex-1 mr-4">
               <h2 class="text-lg font-normal text-[#1F1F1F] truncate">{{ sessionInfo.title || 'Chat Details' }}</h2>
               <div class="flex items-center gap-2 text-xs text-[#747775] mt-0.5">
                  <span class="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>{{ dayjs(sessionInfo.createTime).format('YYYY-MM-DD HH:mm') }}</span>
               </div>
            </div>
            <button @click="chatListDialogVisible = false" class="w-10 h-10 rounded-full hover:bg-[#F2F2F2] flex items-center justify-center text-[#444746]">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
         </div>

         <!-- 内容区域 -->
         <div class="flex-1 overflow-y-auto bg-[#EEF2F9] p-4 sm:p-8 custom-scrollbar relative">
            <div v-if="loadingChatList" class="flex justify-center py-10"><div class="spinner"></div></div>

            <div v-else class="max-w-3xl mx-auto pb-10">
               
               <!-- 核心功能：可折叠的技术元数据面板 (Tech Metadata Panel) -->
               <!-- 解决 PT 过长且不美观的问题 -->
               <div class="bg-white rounded-[20px] border border-[#E1E3E1] shadow-sm mb-8 overflow-hidden transition-all duration-300"
                    :class="metaExpanded ? 'ring-2 ring-blue-100' : ''">
                  
                  <!-- 面板头部 (点击切换) -->
                  <div class="px-4 py-3 flex justify-between items-center cursor-pointer bg-[#F8F9FA] hover:bg-[#F0F4F9]" @click="metaExpanded = !metaExpanded">
                     <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span class="text-sm font-medium text-[#444746]">Session Metadata</span>
                        <span v-if="!metaExpanded" class="text-xs text-[#8E918F] ml-2 font-mono">{{ sessionInfo.id }}</span>
                     </div>
                     <svg class="w-5 h-5 text-[#747775] transition-transform duration-300" :class="metaExpanded ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>

                  <!-- 面板详情 (折叠内容) -->
                  <div v-show="metaExpanded" class="p-4 border-t border-[#E1E3E1] space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                     <!-- 基础信息 Grid -->
                     <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                           <p class="text-[#747775] font-medium mb-1">Session ID</p>
                           <p class="font-mono bg-[#F2F2F2] p-1.5 rounded text-[#1F1F1F] break-all select-all">{{ sessionInfo.id }}</p>
                        </div>
                         <div>
                           <p class="text-[#747775] font-medium mb-1">Last Activity</p>
                           <p class="font-mono bg-[#F2F2F2] p-1.5 rounded text-[#1F1F1F]">{{ dayjs(sessionInfo.lastTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
                        </div>
                        <div>
                           <p class="text-[#747775] font-medium mb-1">Expiration</p>
                           <p class="font-mono bg-[#F2F2F2] p-1.5 rounded text-red-600">{{ dayjs(sessionInfo.expirationTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
                        </div>
                        <div>
                           <p class="text-[#747775] font-medium mb-1">VF Traces</p>
                           <div class="flex flex-wrap gap-1">
                              <span v-for="(vf, i) in sessionInfo.vf" :key="i" @click="viewVfDetails(vf)"
                                    class="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 select-all">
                                 {{ vf }}
                              </span>
                           </div>
                        </div>
                     </div>

                     <!-- PT 字段：长文本折叠处理 -->
                     <div v-if="sessionInfo.pt">
                        <div class="flex justify-between items-center mb-1">
                           <p class="text-[#747775] font-medium text-xs">Page Token (PT)</p>
                           <button @click="copyToClip(sessionInfo.pt)" class="text-[10px] text-blue-600 hover:underline">Copy Token</button>
                        </div>
                        <div class="relative group">
                           <div class="bg-[#F2F2F2] p-2 rounded text-[10px] font-mono text-[#444746] break-all max-h-24 overflow-y-auto custom-scrollbar">
                              {{ sessionInfo.pt }}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- 消息流 -->
               <div v-if="chatList.length > 0" class="space-y-6">
                  <div v-for="(message, index) in chatList" :key="index" 
                       class="flex flex-col w-full"
                       :class="message.role === 'user' ? 'items-end' : 'items-start'">
                     
                     <div class="mb-1 px-1 flex items-center gap-2 text-[11px] text-[#747775]">
                        <span class="font-medium">{{ message.role === 'user'? 'You' : 'Assistant' }}</span>
                        <span>{{ dayjs(message.sendTime).format('MM-DD HH:mm:ss') }}</span>
                     </div>

                     <div :class="[
                        'max-w-[90%] sm:max-w-[80%] px-5 py-3 text-[15px] leading-7 shadow-sm relative break-words',
                        message.role === 'user' 
                           ? 'bg-[#0B57D0] text-white rounded-[24px] rounded-tr-[4px]' 
                           : 'bg-white text-[#1F1F1F] border border-[#E1E3E1] rounded-[24px] rounded-tl-[4px]'
                     ]">
                        <div class="whitespace-pre-wrap">{{ message.content }}</div>

                        <!-- 媒体 -->
                        <div v-if="message.photo?.blob" class="mt-3">
                           <img :src="message.photo.blob" class="rounded-xl border border-black/5 max-h-80 object-contain bg-black/5" />
                        </div>
                        <div v-if="message.audio?.blob" class="mt-3">
                           <audio :src="message.audio.blob" controls class="w-full h-8 rounded"></audio>
                        </div>

                        <!-- 恢复：模型调试信息 (Model Info) -->
                        <div v-if="message?.model_list" class="mt-3 pt-2 border-t border-dashed text-[14px] font-mono opacity-70"
                             :class="message.role === 'user' ? 'border-white/20' : 'border-[#1F1F1F]/10'">
                           <div class="flex flex-wrap gap-x-3 gap-y-1">
                              <span v-for="(k,m) in message.model_list" :key="m">
                                 <strong>{{ k.model }}</strong> <span class="opacity-70">({{ k.mode }})</span> {{ k.time }}ms
                              </span>
                           </div>
                        </div>
                     </div>
                     
                     <!-- 分析框 -->
                     <div v-if="message.role === 'user' && message.analysis" 
                          class="mt-2 max-w-[85%] bg-[#FFF8E1] border border-[#FFE082] text-[#5D4037] text-xs p-3 rounded-xl flex gap-2">
                        <span>⚡</span><span>{{ message.analysis }}</span>
                     </div>
                  </div>
               </div>
               <div v-else class="text-center text-[#8E918F] py-10">No messages in this session.</div>
            </div>
         </div>
      </div>
    </div>

    <!-- VF Sidebar (Material Side Sheet) -->
    <div v-if="vfDialogVisible" class="fixed inset-0 z-[60] flex justify-end">
       <div class="absolute inset-0 bg-[#1F1F1F]/40 backdrop-blur-sm transition-opacity" @click="vfDialogVisible = false"></div>
       
       <div class="bg-[#FDFDFD] w-full max-w-md h-full shadow-2xl relative z-10 flex flex-col animate-in slide-in-from-right duration-300">
          <div class="px-6 py-4 border-b border-[#E1E3E1] bg-white flex justify-between items-center">
             <h3 class="text-lg font-normal text-[#1F1F1F]">Trace Fingerprint</h3>
             <button @click="vfDialogVisible = false" class="p-2 hover:bg-[#F2F2F2] rounded-full"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
             <div v-if="vfDetails.length" class="space-y-8 relative">
                <!-- 时间轴线 -->
                <div class="absolute left-[19px] top-2 bottom-0 w-[2px] bg-[#E1E3E1]"></div>

                <div v-for="(vf, index) in vfDetails" :key="index" class="relative pl-8">
                   <!-- 时间轴点 -->
                   <div class="absolute left-3 top-1.5 w-3 h-3 bg-[#0B57D0] rounded-full border-2 border-white shadow-sm z-10"></div>
                   
                   <div class="mb-3">
                      <div class="text-xs font-bold text-[#0B57D0] uppercase tracking-wider mb-1">Fingerprint</div>
                      <code class="block bg-[#1F1F1F] text-white text-[10px] p-2.5 rounded-lg break-all font-mono shadow-sm">{{ vf.fingerprint }}</code>
                   </div>
                   
                   <div class="mb-3">
                      <div class="text-[10px] font-bold text-[#747775] uppercase mb-1">Time</div>
                      <div class="text-sm text-[#1F1F1F] font-medium">{{ vf.time }}</div>
                   </div>

                   <div class="bg-[#F8F9FA] border border-[#E1E3E1] rounded-xl p-3 text-xs space-y-2 mb-3">
                      <p class="font-semibold text-[#444746] border-b border-[#E1E3E1] pb-1">System Info</p>
                      <div v-for="(v, k) in vf.info" :key="k" class="flex justify-between gap-2">
                        <span class="text-[#747775]">{{k}}:</span> <span class="font-medium text-[#1F1F1F] truncate max-w-[150px]">{{v}}</span>
                      </div>
                   </div>
                   
                   <!-- 恢复：Tasks 任务列表 -->
                   <div v-if="vf.tasks && vf.tasks.length" class="space-y-2">
                      <p class="text-[10px] font-bold text-[#747775] uppercase">Tasks</p>
                      <div v-for="(task, ti) in vf.tasks" :key="ti" class="bg-blue-50 p-2 rounded-lg text-xs border border-blue-100">
                         <div class="text-blue-800 font-mono mb-1 text-[10px]">{{ dayjs(task.time).format('YYYY-MM-DD HH:mm:ss') }}</div>
                         <ul class="list-disc pl-4 text-[#444746]">
                            <li v-for="(tv, tk) in task" :key="tk" v-show="tk!=='time'"><span class="opacity-70">{{tk}}:</span> {{tv}}</li>
                         </ul>
                      </div>
                   </div>
                </div>
             </div>
             <div v-else class="flex flex-col items-center justify-center h-64 text-[#8E918F]">
                <p>No trace data found</p>
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

// 常量与状态
const guestItem = {
  id: "__guest__",
  username: "__guest__",
  nickname: "未登录访客",
  profile: JSON.stringify({
    createTime: new Date(),
    identityType: 'Guest',
    avatar: '', 
    createInfo: 'Default System Guest Account'
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
const showMobileProfile = ref(false); // 移动端折叠状态
const metaExpanded = ref(false); // 技术面板折叠状态

onActivated(async () => {
  loadingList.value = true;
  try {
    const res = await Auth.dangerViewGuest();
    list.value = [guestItem, ...(res.content || [])];
  } catch (e) {
    console.error(e);
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
    showMobileProfile.value = false; // 默认收起移动端画像
    
    let profileObj = {};
    try { profileObj = typeof item.profile === 'string' ? JSON.parse(item.profile) : item.profile; } catch(e) {}
    
    selectedUser.value = { ...item, profile: profileObj, hide: true };
    
    const response = await Auth.getAiChatHistory(JSON.stringify({ user: item.id }));
    chatSessions.value = (response.code === 'ok' && response.content) ? response.content : [];
  } catch (error) {
    console.error(error);
  } finally {
    loadingChatSessions.value = false;
  }
};

// Helper: Base64 to Blob
function dataURLtoBlob(dataURL) {
  const matches = dataURL.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error("Invalid data URL");
  return new Blob([Uint8Array.from(atob(matches[2]), c => c.charCodeAt(0))], { type: matches[1] });
}

// Helper: Copy
const copyToClip = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!'); // 实际项目中可替换为 Toast
  });
};

const openChatListDialog = async (session) => {
  try {
    sessionInfo.value = {};
    chatList.value = [];
    chatListDialogVisible.value = true;
    loadingChatList.value = true;
    metaExpanded.value = false; // 每次打开默认收起技术面板
    
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
        expirationTime: session.expirationTime,
        vf: res.vf || [],
        pt: res.pt || ''
      };
    }
  } finally {
    loadingChatList.value = false;
  }
};

const viewVfDetails = async (vfKey) => {
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
                user: JSON.parse(item.user),
                tasks: JSON.parse(item.tasks || '[]').sort((a, b) => new Date(b.time) - new Date(a.time))
            }));
        }
    } catch (e) { console.error(e) }
};
</script>

<style scoped>
/* Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e1e3e1;
  border-top-color: #0b57d0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Custom Scrollbar for Webkit */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #C4C7C5;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #8E918F;
}
</style>