<template>
  <div class="commonPage">  
    <div class="panel">
      <div class="chatList" style="min-height: 200px;">
        <div >
          <p>赤子英金大模型公测</p>
          <p>今天为了更好的测试，全量开放，所有人都可以访问。请及时反应使用大模型遇到的问题，方便我们改进。</p>
          <template v-for="(item,i) in chatList" class="chatList">
            <p class="user" v-if="item.role == 'user'">{{ item.content }}</p>
            <p class="assistant" v-if="item.role == 'assistant'">{{ item.content }}</p>
          </template>
          
        </div>
      </div>
      <div class="input" style="display: flex;" >
        <!-- <el-form-item> -->
          <el-input v-model="input" :disabled="loading"></el-input>
          <el-button @click="send()" :loading="loading">发送</el-button>
        <!-- </el-form-item> -->
      </div>
    </div>
  </div>
</template>
<style scoped>
.chatList{
  padding-bottom: 16px;
}
.chatList p{
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.45em;
  color:#3c3e55;
}
.user::before{
  content: "用户：";
  color: #409EFF;
}
.assistant::before{
  content: "助手：";
  color: #67C23A;
}
</style>
<script setup>
import { onActivated, onMounted, ref } from "vue"
import Auth from "../../utils/auth";
import { ElInput,ElButton,ElMessage,ElForm } from "element-plus"; 
const messages = ref([]);
const chatList = ref([]);
const input = ref("你好");
const chatID = ref("")
const loading = ref(true)
const send = async ()=>{
  if(input.value == '') {
    ElMessage.warning("请输入内容")
    return;
  }
  loading.value = true;
  chatList.value.push({
    role: "user",
    content: input.value
  })
  chatList.value.push({
    role: "assistant",
    content: ""
  })
  input.value = ''
  const index = chatList.value.length - 1;
  await Auth.chatWithAI(chatList.value,{
    onmessage:(event,source) => {
      // debugger;
      // console.log(event.data,event.data == '[DONE]')
      if(event.data != '[DONE]'){
        chatList.value[index].content+=JSON.parse(event.data).response;
      } else {
        source.close();
        loading.value = false;
      }
    },
    onerror: (event,source)=>{
      source.close();
      loading.value = false;
    }
  })
}
onMounted(async ()=>{
  // loading.value = false;
  await Auth.init()
  await send()
  // chatID.value = await Auth.getChatID(
  // chatID.value = await Auth.getChatID();
})
</script>