<template>
  <div class="commonPage row">  
    <div class="col-12 col-sm-12 col-md-6">
      <div class="panel aichat " >
        <div class="chatList" style="min-height: 200px;">
          <div class="chatcontent">
            <p>赤子英金大模型公测</p>
            <p>为了更好的测试，全量开放，所有人都可以访问。请及时反应使用大模型遇到的问题，方便我们改进。</p>
            <p>大模型可能存在不准确信息</p>
          </div>
          <template v-for="(item,i) in chatList" class="chatList">
            <div class="user" v-if="item.role == 'user'">
              <el-avatar>你</el-avatar>
              <el-watermark :font="font" :gap="[30,0]" :rotate="-12" :content="['用户文本', fingerprint]">
                <div class="chatcontent" v-html="md.render(item.content)"></div>
              </el-watermark>
            </div>
            <div class="assistant" v-if="item.role == 'assistant'">
              <el-avatar>小英</el-avatar>
              <el-watermark :font="font" :gap="[30,0]" :rotate="-12" :content="['赤子英金大模型', fingerprint]">
                <div class="chatcontent" v-html="md.render(item.content)"></div>
              </el-watermark>
            </div>
          </template>
        </div>
        <div class="input" style="display:flex;align-items:flex-end;" >
          <!-- <el-form-item> -->
          <el-input
            v-model="input" 
            :disabled="loading"
            :autosize="{ minRows: 1, maxRows: 3 }"
            type="textarea"
          ></el-input>
          <el-button @click="send()" :loading="loading">发送</el-button>
          <!-- </el-form-item> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style >
.aichat{
  background-color: transparent !important;
  padding: 0px !important;
  padding-bottom: 48px !important;
}
.i-loading {
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: baseline;
  border-radius: 3px;
  margin-left: 2px;
  animation: 0.75s ease infinite spinner-grow;
  background-color: rgba(34, 98, 251, 0.5);
}

.i-loading::before {
  content: 'loading';
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

@keyframes spinner-grow {
  0% {
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: none;
  }
}
.chatList .user .el-avatar{
  --el-avatar-bg-color:rgba(63, 124, 255, 0.75) !important;
  backdrop-filter: blur(8px);
}
.chatList .assistant .el-avatar{
  --el-avatar-bg-color:rgba(144, 77, 245,0.75) !important;
  backdrop-filter: blur(8px);
}
.chatList{
  padding-bottom: 16px;
}
.chatList .chatcontent{
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 1.45em;
  color:#3c3e55;
  padding:12px;
  background-color: #fffd;
  border-radius: 12px;
  margin-top:10px;
  margin-bottom: 18px;
  min-height: 44.3px;
}
.chatList .chatcontent h1{
  line-height: 1.45em;
  font-size: 24px;
  margin-top: 4px;
  margin-bottom: 8px;
}
.chatList .chatcontent h2{
  line-height: 1.45em;
  font-size: 20px;
  margin-top: 4px;
  margin-bottom: 8px;
}
.chatList .chatcontent h3{
  line-height: 1.45em;
  font-size: 16px;
  margin-top: 4px;
  margin-bottom: 8px;
}
.chatList .chatcontent h4{
  line-height: 1.45em;
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 8px;
}
</style>
<script setup>
import markdownIt from 'markdown-it'
const md = new markdownIt()
import { onActivated, onMounted, ref,reactive } from "vue"
import Auth from "../../utils/auth";
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark } from "element-plus"; 
const messages = ref([]);
const chatList = ref([]);
const input = ref("你好");
const chatID = ref("");
const loading = ref(true);
const font = reactive({
  color: 'rgba(0, 0, 0, .05)',
})
const fingerprint = ref("")

const send = async (param)=>{
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
  setTimeout(()=>{
    document.getElementsByClassName('routerpage')[0].scrollTop=document.getElementsByClassName('routerpage')[0].scrollHeight
  },500)

  const index = chatList.value.length - 1;
  fingerprint.value = await Auth.getUserFingerprint()
  await Auth.chatWithAI(chatList.value,{
    fingerprint:fingerprint.value,
    onmessage:(event,source) => {
      if(event.data != '[DONE]'){
        chatList.value[index].content+=JSON.parse(event.data).response;
        document.getElementsByClassName('routerpage')[0].scrollTop=document.getElementsByClassName('routerpage')[0].scrollHeight
      } else {
        source.close();
        loading.value = false;
        document.getElementsByClassName('routerpage')[0].scrollTop=document.getElementsByClassName('routerpage')[0].scrollHeight
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
  ElMessage.info('正在尝试使用访客身份登录，请稍等');
  await Auth.init()
  await send()
  // console.log(Fingerprint)
})
</script>