<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
    <!-- 顶部导航栏 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 sm:px-6 shadow-sm">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">QChat 加密对话</h1>
        <div class="flex items-center space-x-3">
          <button 
            v-if="qkey" 
            @click="showKeyInfo = !showKeyInfo"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            密钥信息
          </button>
          <button 
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <i class="fa" :class="isDarkMode ? 'fa-sun-o' : 'fa-moon-o'"></i>
          </button>
        </div>
      </div>
      
      <!-- 密钥信息提示 -->
      <div v-if="showKeyInfo && qkey" class="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
        <p>当前密钥: {{ qkey.substring(0, 6) }}...{{ qkey.substring(qkey.length - 6) }}</p>
        <p>过期时间: {{ formatExpiration(expiration) }}</p>
      </div>
      
      <!-- 状态提示 -->
      <div v-if="statusMessage" class="mt-2 text-sm p-2 rounded-md" :class="statusClass">
        {{ statusMessage }}
      </div>
    </header>

    <!-- 聊天内容区域 -->
    <main class="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-3xl mx-auto space-y-6">
        <!-- 消息列表 -->
        <div v-for="(message, index) in messages" :key="index" class="flex" :class="{
          'justify-end': message.isUser,
          'justify-start': !message.isUser
        }">
          <div :class="{
            'bg-blue-500 text-white rounded-lg rounded-tl-none': message.isUser,
            'bg-white dark:bg-gray-800 rounded-lg rounded-tr-none shadow-sm border border-gray-200 dark:border-gray-700': !message.isUser,
            'max-w-[80%] p-3 sm:p-4': true
          }">
            <p v-if="message.isSystem" class="text-xs text-gray-500 dark:text-gray-400 italic">
              {{ message.content }}
            </p>
            <p v-else>
              {{ message.content }}
            </p>
            <p v-if="message.debugInfo" class="text-right text-xs mt-1 text-red-500 bg-red-100/30 p-1 rounded">
              {{ message.debugInfo }}
            </p>
            <p class="text-right text-xs mt-1 opacity-70">
              {{ formatTime(message.time) }}
            </p>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </main>

    <!-- 输入区域 -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      <div class="max-w-3xl mx-auto">
        <form @submit.prevent="sendMessage" class="flex flex-col sm:flex-row gap-3">
          <textarea
            v-model="inputMessage"
            placeholder="输入消息..."
            class="flex-1 min-h-[60px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 resize-none"
            :disabled="!qkey || isLoading"
          ></textarea>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :disabled="!inputMessage.trim() || !qkey || isLoading"
          >
            <i class="fa fa-paper-plane mr-2"></i>
            <span>发送</span>
          </button>
        </form>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          所有消息均使用AES-256-CBC加密
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import CryptoJS from 'crypto-js';

// 状态管理
const messages = ref([
  { isSystem: true, content: '欢迎使用QChat加密聊天系统', time: new Date().toISOString() }
]);
const inputMessage = ref('');
const qkey = ref('');
const expiration = ref('');
const isLoading = ref(false);
const statusMessage = ref('');
const statusType = ref('');
const showKeyInfo = ref(false);
const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

// 计算属性
const statusClass = computed(() => {
  switch(statusType.value) {
    case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
    case 'info': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  }
});

// 初始化
onMounted(() => {
  // 检查暗色模式
  updateDarkMode();
  
  // 检查是否有有效的qkey cookie
  const savedKey = getCookie('qkey');
  const savedExp = getCookie('qkey_exp');
  
  if (savedKey && savedExp && new Date(savedExp) > new Date()) {
    qkey.value = savedKey;
    expiration.value = savedExp;
    addSystemMessage('已加载现有密钥，有效期至: ' + formatExpiration(savedExp));
    loadChatHistory();
  } else {
    // 获取新的密钥
    fetchQkey();
  }
});

// 监听暗色模式变化
watch(isDarkMode, updateDarkMode);

// 暗色模式切换
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  updateDarkMode();
}

function updateDarkMode() {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// 密钥相关函数
async function fetchQkey() {
  try {
    isLoading.value = true;
    setStatus('info', '正在获取加密密钥...');
    
    const response = await fetch('/api/q/secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) throw new Error('获取密钥失败: ' + response.statusText);
    
    const data = await response.json();
    qkey.value = data.key;
    expiration.value = data.exp;
    
    // 设置cookie
    setCookie('qkey', data.key, 1/24); // 1小时有效期
    setCookie('qkey_exp', data.exp, 1/24);
    
    addSystemMessage('已获取新密钥，有效期1小时');
    loadChatHistory();
  } catch (error) {
    setStatus('error', '获取密钥失败: ' + error.message);
    console.error('Error fetching qkey:', error);
  } finally {
    isLoading.value = false;
  }
}

// 聊天相关函数
async function sendMessage() {
  if (!inputMessage.value.trim() || !qkey.value) return;
  
  const plaintext = inputMessage.value.trim();
  const timestamp = new Date().toISOString();
  
  // 添加用户消息到界面
  messages.value.push({
    isUser: true,
    content: plaintext,
    time: timestamp
  });
  
  // 清空输入框
  inputMessage.value = '';
  
  try {
    isLoading.value = true;
    setStatus('info', '正在加密并发送消息...');
    
    // 生成IV并加密消息 - 确保与后端加密参数一致
    const iv = CryptoJS.lib.WordArray.random(16); // 16字节IV用于AES-CBC
    console.log(CryptoJS.enc.Utf8.parse(qkey.value))
    const encrypted = CryptoJS.AES.encrypt(
      plaintext,
      CryptoJS.enc.Utf8.parse(qkey.value), // 确保密钥以UTF8格式解析
      { 
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    // 发送IV和加密内容 - IV以十六进制字符串发送
    const payload = {
      iv: iv.toString(CryptoJS.enc.Hex),
      content: encrypted.toString(),
      time: timestamp
    };
    
    const response = await fetch('/api/q/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `发送失败: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 解密服务器返回的二次加密内容 - 关键修复部分
    try {
      // 确保IV和密钥的编码方式与加密时一致
      const ivBytes = CryptoJS.enc.Hex.parse(data.iv);
      const keyBytes = CryptoJS.enc.Utf8.parse(qkey.value);
      
      const decrypted = CryptoJS.AES.decrypt(
        data.encryptedContent,
        keyBytes,
        { 
          iv: ivBytes,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      // 转换为UTF8字符串
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      // 验证解密结果
      if (!decryptedText) {
        throw new Error('解密结果为空，可能是密钥不匹配或数据损坏');
      }
      
      // 添加服务器响应
      messages.value.push({
        isUser: false,
        content: decryptedText,
        time: new Date().toISOString()
      });
      
      setStatus('success', '消息已加密发送并接收');
    } catch (decryptError) {
      // 添加解密错误信息到界面，方便调试
      messages.value.push({
        isUser: false,
        content: '[解密失败]',
        debugInfo: decryptError.message,
        time: new Date().toISOString()
      });
      setStatus('error', '解密失败: ' + decryptError.message);
      console.error('Decryption error:', decryptError);
    }
    
    scrollToBottom();
  } catch (error) {
    setStatus('error', '消息处理失败: ' + error.message);
    console.error('Error sending message:', error);
  } finally {
    isLoading.value = false;
  }
}

async function loadChatHistory() {
  try {
    setStatus('info', '正在加载聊天历史...');
    // 实际应用中从服务器加载历史消息
    setTimeout(() => {
      setStatus('', '');
    }, 1000);
  } catch (error) {
    setStatus('error', '加载历史失败: ' + error.message);
    console.error('Error loading history:', error);
  }
}

// 辅助函数
function addSystemMessage(content) {
  messages.value.push({
    isSystem: true,
    content,
    time: new Date().toISOString()
  });
  scrollToBottom();
}

function setStatus(type, message) {
  statusType.value = type;
  statusMessage.value = message;
  
  // 3秒后自动清除状态消息
  if (message) {
    setTimeout(() => {
      statusMessage.value = '';
    }, 3000);
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatExpiration(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function scrollToBottom() {
  setTimeout(() => {
    const chatContainer = document.querySelector('main');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 100);
}

// Cookie工具函数
function setCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
</script>

<style scoped>
/* 基础动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 消息动画 */
main > div > div {
  animation: fadeIn 0.3s ease-out forwards;
}

/* 确保在移动设备上的良好体验 */
@media (max-width: 640px) {
  textarea {
    min-height: 50px !important;
  }
  
  button[type="submit"] {
    padding: 2px 4px !important;
  }
  
  .max-w-\[80\%\] {
    max-width: 85% !important;
  }
}
</style>
