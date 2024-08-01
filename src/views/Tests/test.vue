<template>
  <div class="commonPage" style="height:calc(100vh - 60px)">  
    <div class="scroll" :style="{height:height}">
      <div class="row" >
        <div class="col-12 col-sm-12 col-md-6">
          <div class="panel aichat " >
            <div class="chatList" style="min-height: 200px;">
              <div class="chatcontent" style="font-size: 12px;">
                <p>赤子英金大模型公测 编译版本20240801_1455</p>
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
            
          </div>
        </div>
      </div>
    </div>
    <div class="ainput" ref="ainput">
      <div :class="`ainput__wrapper ${ainputStatus ? 'active' : ''}`">
        <el-input
          v-model="input" 
          :disabled="loading"
          :autosize="{ minRows: 1, maxRows: 3 }"
          type="textarea"
          size="large"
          autofocus
          class="_input"
          :maxlength="1000"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onChange"
          @keyup="onChange"
          placeholder="请输入内容"
        ></el-input>
        <div class="_number">
          <span>{{ now }} / 1000</span>
          <el-button 
          @click="send()" 
          :loading="loading"
          style="margin-top: 16px;"
          type="primary"
          color="rgba(144, 77, 245,1)"
        >
          发送
        </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
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
const ainput = ref()
const now = ref(0)
const font = reactive({
  color: 'rgba(0, 0, 0, .05)',
})
const height = ref('0px')
const fingerprint = ref("")
const ainputStatus = ref(false)
const onFocus = () => {
  ainputStatus.value = true
}
const onBlur = () => {
  ainputStatus.value = false
}
const onChange = () => {
  now.value = input.value.length
  height.value = `calc(100% - ${ainput.value.offsetHeight}px)`
}
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
  onChange()
  await Auth.init()
  await send()
  // console.log(Fingerprint)
})
</script>