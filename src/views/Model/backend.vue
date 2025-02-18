<template>
  <div class="p-4 bg-slate-50 rounded-lg min-h-ss">
    <h1 class="text-3xl font-bold mb-4 text-gray-900">会话管理后台</h1>
    <div
      class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="item in list"
        :key="item.id"
        class="p-4 bg-white rounded-lg shadow-md shadow-slate-200 transition duration-200 cursor-pointer
               hover:bg-slate-100 active:scale-95"
        @click="getChatHistory(item)"
      >
        <div class="text-lg font-semibold text-gray-900">{{ item.nickname }}</div>
        <div class="text-gray-600">{{ item.username }}</div>
        <div class="text-sm text-gray-500">ID: {{ item.id }}</div>
        <div class="text-sm text-gray-400">
          {{ dayjs(JSON.parse(item.profile).createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </div>
    </div>

    <div v-if="dialogVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-ss">
      <div class="bg-slate-50 rounded-lg shadow-lg max-w-2xl max-h-ss overflow-y-auto w-full h-full">
        <div class="p-4 flex justify-between items-center sticky top-0 bg-slate-50">
          <h2 class="text-lg font-semibold">聊天记录</h2>
          <button @click="dialogVisible = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <div v-if="loadingChatSessions" class="flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <div v-if="chatSessions.length > 0 &&!loadingChatSessions" class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div v-for="session in chatSessions" :key="session.sessionID" class="p-4 bg-white rounded-lg shadow-md shadow-slate-200 transition duration-200 cursor-pointer
                hover:bg-slate-100 active:scale-95"
              @click="openChatListDialog(session)" >
              <p>{{ session.title || '无标题' }}</p>
              <p>{{ dayjs(session.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
            </div>
          </div>
          <div v-else>
            <p>暂无聊天记录</p>
          </div>

          <!-- 新增：显示用户完整信息 -->
          <div v-if="selectedUser" class="mt-8">
            <h3 class="text-2xl font-semibold mb-4">用户信息</h3>
            <div class="columns-1 sm:columns-2 md:columns-3 gap-2">
              <div class="bg-white p-4 rounded-lg shadow-md break-inside-avoid shadow-slate-200 mb-2">
                <p class="font-semibold text-gray-700 mb-2">用户名</p>
                <p class="text-gray-600">{{ selectedUser.username }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-md break-inside-avoid shadow-slate-200 mb-2">
                <p class="font-semibold text-gray-700 mb-2">昵称</p>
                <p class="text-gray-600">{{ selectedUser.nickname }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-md break-inside-avoid shadow-slate-200 mb-2">
                <p class="font-semibold text-gray-700 mb-2">ID</p>
                <p class="text-gray-600">{{ selectedUser.id }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-md break-inside-avoid shadow-slate-200 mb-2 flex items-center">
                <p class="font-semibold text-gray-700 mb-2">头像</p>
                <img :src="selectedUser.profile.avatar" alt="User Avatar" class="w-12 h-12 object-cover rounded-full ml-2" v-if="selectedUser.profile.avatar" />
                <p class="text-gray-600" v-else>无头像</p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-md break-inside-avoid shadow-slate-200 mb-2">
                <p class="font-semibold text-gray-700 mb-2">创建时间</p>
                <p class="text-gray-600">{{ dayjs(selectedUser.profile.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-md break-inside-avoid shadow-slate-200 mb-2">
                <p class="font-semibold text-gray-700 mb-2">创建信息</p>
                <p class="text-gray-600 whitespace-pre-line">{{ selectedUser.profile.createInfo }}</p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-md break-inside-avoid shadow-slate-200 mb-2">
                <p class="font-semibold text-gray-700 mb-2">身份类型</p>
                <p class="text-gray-600">{{ selectedUser.profile.identityType }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="chatListDialogVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-ss">
      <div class="bg-slate-50 rounded-lg shadow-lg max-w-2xl overflow-y-auto w-full h-full">
        <div class="p-4 flex justify-between items-center sticky top-0 bg-slate-50">
          <h2 class="text-lg font-semibold ">聊天详情</h2>
          <button @click="chatListDialogVisible = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <div v-if="loadingChatList" class="flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <div v-if="chatList.length > 0 &&!loadingChatList">
            <!-- 显示聊天记录的基本信息 -->
            <div class="mb-4 text-slate-500 text-sm">
              <p><strong>标题:</strong> {{ sessionInfo.title }}</p>
              <p><strong>创建时间:</strong> {{ dayjs(sessionInfo.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <p><strong>最后聊天时间:</strong> {{ dayjs(sessionInfo.lastTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <p><strong>过期时间:</strong> {{ dayjs(sessionInfo.expirationTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <p><strong>vf:</strong> {{ sessionInfo.vf.join(', ') }}</p>
              <p><strong>pt:</strong> {{ sessionInfo.pt }}</p>
            </div>
            <!-- 显示具体的聊天内容 -->
            <div v-for="message in chatList" :key="message.sendTime" class="mb-4">
              <div :class="['p-2 rounded-lg', message.role === 'user'? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800']">
                <p class="font-semibold">{{ message.role === 'user'? '我' : 'AI' }}<span class="ml-1 font-normal" v-if="message.role === 'user'">{{ dayjs(message.sendTime).format('YYYY-MM-DD HH:mm:ss') }}</span></p>
                <p>{{ message.content }}</p>
                <p v-if="message.role === 'user' && message.analysis" class="text-sm text-slate-500 mt-2 p-2 bg-slate-50 rounded-lg">
                  分析：{{ message.analysis }}
                </p>
              </div>
            </div>
          </div>
          <div v-else>
            <p>暂无聊天记录</p>
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

onActivated(async () => {
  list.value = list.value.concat((await Auth.dangerViewGuest()).content || []);
});

const getChatHistory = async (item) => {
  try {
    loadingChatSessions.value = true;
    const response = await Auth.getAiChatHistory(JSON.stringify({ user: item.id }));
    if (response.status ==='sus' && response.content) {
      chatSessions.value = response.content.filter(e => e.title!== '无标题');
      dialogVisible.value = true;
      selectedUser.value = {
        ...item,
        profile: JSON.parse(item.profile)
      };
    } else {
      console.error("获取SessionID失败:", response);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loadingChatSessions.value = false;
  }
};

const openChatListDialog = async (session) => {
  try {
    loadingChatList.value = true;
    const sessionResponse = await Auth.getAIChatList({ sessionID: session.sessionID });
    if (sessionResponse.status ==='sus') {
      chatList.value = sessionResponse.content;
      // 存储聊天会话的基本信息
      sessionInfo.value = {
        createTime: session.createTime,
        title: session.title,
        lastTime: session.lastTime,
        expirationTime: session.expirationTime,
        vf: sessionResponse.vf || [],
        pt: sessionResponse.pt || ''
      };
      chatListDialogVisible.value = true; // 显示聊天详情弹窗
    } else {
      console.error("获取聊天列表失败:", sessionResponse);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loadingChatList.value = false;
  }
};
</script>


<style>

.h-ss{
  height: 100vh;
  height: 100svh;
}</style>