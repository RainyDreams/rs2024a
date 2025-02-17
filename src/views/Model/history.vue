<template>
  <div class="commonPage">
    <div class="big_header">
      <!-- <div class="icon"><form-one theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div> -->
      <div class="title">聊天历史</div>
    </div>
    <div class="notificationPage h-full">
      <el-empty :image-size="150" v-if="chatList.length == 0">
        <template #description>
          <p v-if="loading">正在获取</p>
          <p v-else>没有聊天历史</p>
        </template>
      </el-empty>   
      <div class="h-full row" v-if="chatList.length > 0">
        <div class="col-12 col-md-6 col-xl-4 mb-2 md:mb-3" v-for="item in chatList">
          <router-link 
            class="block h-full  text-slate-950 border-b py-4 px-5 border-slate-100 hover:bg-slate-50 transition-all rounded-lg bg-white" 
            :to="`/chat/${item.sessionID}`"
          >
            <p class="text-base mb-1">{{ item.title }}</p>
            <p class="text-sm text-slate-500">{{ item.formatCreateTime }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onActivated, ref } from 'vue';
import Auth from '../../utils/auth';
import { dayjs, ElButton,ElEmpty, ElMessage,ElTag,ElAvatar } from 'element-plus';
import jsCookie from 'js-cookie';
const chatList = ref([]);
const loading = ref(true)
onActivated(async ()=>{
  const { content,code } = await Auth.getAiChatHistory();
  // // console.log(content, code)
  const now = new Date().getTime();
  if(code == 'ok' || content){
    chatList.value = content.map(e=>{
      if(e.expirationTime>now){
        return {
          ...e,
          formatCreateTime:dayjs(e.createTime).format('YYYY年M月DD日 HH:mm:ss')
        }
      }
    }).filter(e=>e)
    loading.value = false
  }
})
</script>