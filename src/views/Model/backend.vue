<template>
  <div class="p-4 bg-slate-50 rounded-lg min-h-screen">
    <h1 class="text-3xl font-bold mb-4 text-gray-900">会话管理后台</h1>
    <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-for="item in list" :key="item.id" class="p-4 bg-white rounded-lg shadow-md shadow-slate-200 transition duration-200 cursor-pointer
               hover:bg-slate-100 active:scale-95" @click="getChatHistory(item)">
        <div class="text-lg font-semibold text-gray-900">{{ item.nickname }}</div>
        <div class="text-gray-600">{{ item.username }}</div>
        <div class="text-sm text-gray-500">ID: {{ item.id }}</div>
        <div class="text-sm text-gray-400">
          {{ dayjs(JSON.parse(item.profile).createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </div>
    </div>
    <div class="copyright mt-5">
      <div class="text-sm text-gray-500 w-full text-center">© 2024-{{ new Date().getFullYear() }} <a href="https://github.com/RainyDreams" target="_blank" class="text-blue-500 hover:underline">零本智协项目组</a>. All rights reserved.</div>
    </div>
    <div v-if="dialogVisible"
      class="fixed flex justify-center inset-0 bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-ss">
      <div class="bg-slate-50 rounded-lg shadow-lg max-w-3xl h-full w-full overflow-hidden pb-4 flex flex-col">
        <div class="p-4 flex justify-between items-center w-full">
          <h2 class="text-lg font-semibold">聊天记录</h2>
          <button @click="dialogVisible = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1">
          <!-- 新增：显示用户完整信息 -->
          <div v-if="selectedUser" class="">
            <div class="columns-1 md:columns-2  gap-3">
              <div class="bg-white p-4 rounded-xl shadow-md shadow-slate-100 mb-4 max-w-sm mx-auto">
                <div class="flex items-center mb-4">
                  <img :src="selectedUser.profile.avatar" alt=""
                    class="w-16 h-16 object-cover rounded-full border-2 border-gray-300 mr-4 bg-slate-200"
                    />
                  <div>
                    <h2 class="text-2xl font-semibold text-gray-800">{{ selectedUser.nickname }}</h2>
                    <p class="text-sm text-gray-500">{{ selectedUser.username }}</p>
                  </div>
                </div>
                <div class="space-y-1 text-xs">
                  <p class="text-gray-600">{{ selectedUser.id }}</p>
                  <p class="text-gray-600">{{ dayjs(selectedUser.profile.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
                  <p class="text-gray-600">{{ selectedUser.profile.identityType }}</p>
                </div>
              </div>
              <div v-if="loadingChatSessions" class="flex flex-col justify-center items-center mt-6">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p class="w-full mt-3 mb-4 text-center">正在查找</p>
              </div>
              <p v-if="!loadingChatSessions" class="mb-3 w-full px-2" @click="selectedUser.hide=!selectedUser.hide"><span class="text-blue-700 font-semibold">已{{selectedUser.hide?'隐藏':'显示'}}</span>无内容会话</p>
              <div v-if="chatSessions.length > 0 " v-show="!selectedUser.hide || session.title!='无标题'" v-for="session in chatSessions"
                :key="session.sessionID" class="p-4 bg-white rounded-lg shadow-md shadow-slate-200 w-full h-full overflow-auto mb-3 transition duration-200 cursor-pointer
                  hover:bg-slate-100 active:scale-95" @click="openChatListDialog(session)">
                <p class="text-lg/relaxed font-semibold text-slate-700">{{ session.title || '无标题' }}</p>
                <p>{{ dayjs(session.createTime).format('YYYY-MM-DD HH:mm:ss') }} 创建</p>
                <p>{{ dayjs(session.expirationTime).format('YYYY-MM-DD HH:mm:ss') }} 过期</p>
              </div>
              <div v-else-if="!loadingChatSessions" class="flex flex-col justify-center items-center">
                <p class="w-full mt-5 text-center mb-5">暂无聊天记录</p>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-md break-inside-avoid shadow-slate-200 mb-2">
                <p class="font-semibold text-gray-700 mb-2">创建信息</p>
                <p class="text-gray-600 whitespace-pre-line">{{ selectedUser.profile.createInfo }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="chatListDialogVisible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-ss">
      <div class="bg-slate-50 rounded-lg shadow-lg max-w-2xl overflow-y-auto w-full h-full">
        <div class="p-4 flex justify-between items-center sticky top-0 bg-slate-50">
          <h2 class="text-lg font-semibold ">聊天详情</h2>
          <button @click="chatListDialogVisible = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <div v-if="loadingChatList" class="flex flex-col justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p class="w-full mt-3 mb-4 text-center">正在查找</p>
          </div>
          <div v-if="chatList.length > 0">
            <!-- 显示聊天记录的基本信息 -->
            <div class="mb-4 text-slate-500 text-sm">
              <p><strong>标题:</strong> {{ sessionInfo.title }}</p>
              <p><strong>创建时间:</strong> {{ dayjs(sessionInfo.createTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <p><strong>最后聊天时间:</strong> {{ dayjs(sessionInfo.lastTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <p><strong>过期时间:</strong> {{ dayjs(sessionInfo.expirationTime).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <p><strong>vf:</strong> 
                <ul>
                  <li v-for="(x, i) in sessionInfo.vf" :key="i" @click="viewVfDetails(x)" class="text-blue-500 cursor-pointer hover:underline">
                    {{ x }}
                  </li>
                </ul>
              </p>
              <p><strong>id:</strong> {{ sessionInfo.id }}</p>
              <p><strong>pt:</strong> {{ sessionInfo.pt }}</p>
            </div>
            <!-- 显示具体的聊天内容 -->
            <div v-for="message in chatList" :key="message.sendTime" class="mb-4">
              <div
                :class="['p-2 rounded-lg', message.role === 'user'? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800']">
                <p class="font-semibold">{{ message.role === 'user'? '用户' : 'AI' }}<span class="ml-1 font-normal"
                    v-if="message.role === 'user'">{{ dayjs(message.sendTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                </p>
                <p>{{ message.content }}</p>
                <template v-if="message.photo?.blob">
                  <div class="py-2"><img class="max-w-full rounded-2xl text-slate-400 text-sm" :src="message.photo.blob" alt="[图片]隐私保护已删除"></div>
                </template>
                <template v-if="message.audio?.blob">
                  <div class="py-2"><audio class="max-w-full" controls :src="message.audio.blob" ></audio></div>
                </template>
                <p v-if="message.role === 'user' && message.analysis"
                  class="text-sm text-slate-500 mt-2 p-2 bg-slate-50 rounded-lg">
                  分析：{{ message.analysis }}
                </p>
              </div>
            </div>
          </div>
          <div v-else-if="!loadingChatList">
            <p>暂无聊天记录</p>
          </div>
        </div>
      </div>
    </div>

    <!-- VF 详细信息弹窗 -->
    <div v-if="vfDialogVisible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-ss">
      <div class="bg-slate-50 rounded-lg shadow-lg max-w-2xl overflow-y-auto w-full h-full">
        <div class="p-4 flex justify-between items-center sticky top-0 bg-slate-50">
          <h2 class="text-lg font-semibold">VF 详情</h2>
          <button @click="vfDialogVisible = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <div v-if="vfDetails.length > 0">
            <div v-for="(vf, index) in vfDetails" :key="index" class="mb-4">
              <p><strong>用户:</strong> {{ vf.user.join(', ') }}</p>
              <p><strong>指纹:</strong> {{ vf.fingerprint }}</p>
              <p><strong>时间:</strong> {{ vf.time }}</p>
              <p><strong>信息:</strong></p>
              <ul>
                <li v-for="(value, key) in vf.info" :key="key">{{ key }}: {{ value }}</li>
              </ul>
              <p><strong>任务:</strong></p>
              <ul>
                <li v-for="(task, taskIndex) in vf.tasks" :key="taskIndex">
                  <p><strong>时间:</strong> {{ dayjs(task.time).format('YYYY-MM-DD HH:mm:ss') }}</p>
                  <ul>
                    <li v-for="(value, key) in task" :key="key">{{ key }}: {{ value }}</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <p>暂无 VF 信息</p>
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
      profile: JSON.parse(item.profile)
    };
    const response = await Auth.getAiChatHistory(JSON.stringify({ user: item.id }));
    if (response.code === 'ok' && response.content) {
      chatSessions.value = (response.content || []);
      selectedUser.value.hide = true;
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
        user: item.user,
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

<style>
.h-ss {
  height: 100vh;
  height: 100svh;
}
</style>