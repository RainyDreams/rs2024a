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
      <div class="h-full flex flex-col" v-if="chatList.length > 0">
        <router-link class="text-slate-950 border-b py-4 px-5 border-slate-100 hover:bg-slate-50 transition-all first:rounded-t-xl last:rounded-b-xl bg-white"
         v-for="item in chatList"
         :to="`/model/chat/${item.sessionID}`">
          <p class="text-lg mb-2">{{ item.title }}</p>
          <p class="text-base text-slate-500">{{ item.formatCreateTime }}</p>
        </router-link>
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
  // console.log(content, code)
  if(code == 'ok' || content){
    chatList.value = content.map(e=>{
      return {
        ...e,
        formatCreateTime:dayjs(e.createTime).format('YYYY年M月DD日 HH:mm:ss')
      }
    })
    loading.value = false
  }
})
</script>