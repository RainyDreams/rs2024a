<template>
  <div class="commonPage" style="height:calc(100dvh - 60px);display: flex;flex-direction: column;">  
    <div class="scroll">
      <div class="row" >
        <div class="col-12 col-xl-8" style="margin-bottom: 0;">
          <div class="panel aichat" >
            <div class="chatList" style="min-height: 200px;">
              <div class="system">
                <el-avatar alt="头像" src="/logo_sm.webp">小英</el-avatar>
                <div class="chatcontent" style="font-size:14px;width:100%;" >
                  <el-skeleton :rows="5" animated v-show="welcome_loading"></el-skeleton>
                  <div v-show="!welcome_loading" v-html="md.render(welcome)"></div>
                </div>
              </div>
              <template v-for="(item,i) in chatList" class="chatList">
                <div class="user" v-if="item.role == 'user'"> 
                  <el-avatar alt="头像">你</el-avatar>
                  <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,0]" :rotate="-12" :content="['零本智协大模型 零本智协大模型', fingerprint]">
                    <div class="chatcontent" v-html="md.render(item.content)"></div>
                  </el-watermark>
                </div>
                <div class="assistant" v-if="item.role == 'assistant'">
                  <el-avatar alt="头像" src="/logo_sm.webp" fit="contain">小英</el-avatar>
                  <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,-12]" :rotate="-12" :content="['零本智协大模型 零本智协大模型', fingerprint]">
                    <div class="chatcontent" v-html="md.render(item.content) || `<span class='i-loading'></span>`"></div>
                  </el-watermark>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ainput" ref="ainput">
      <div class="row">
        <div class="col-12 col-xl-8">
          <div :class="`ainput__wrapper`">
            <el-input
              ref="askRef"
              v-model.lazy="input"
              :autosize="{ minRows: 1, maxRows: 4 }"
              type="textarea"
              resize="none"
              size="large"
              autofocus
              class="_input"
              :maxlength="1000"
              @focus="onFocus"
              @keyup="onChange"
              @change="onChange"
              :placeholder="placeholder"
              @keydown.enter="handleEnter"
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
    </div>
  </div>
</template>
<script setup>
import markdownIt from 'markdown-it';
// import markdownItHighlightjs from 'markdown-it-highlightjs'
import { onActivated, onMounted, ref,reactive } from "vue"
import Auth from "../../utils/auth";
import { throttle } from '../../utils/helpers'
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark,ElSkeleton } from "element-plus"; 
const md = new markdownIt()
const chatList = ref([]);
const input = ref("");
const askRef = ref();
const placeholder = ref("试着说：帮我分析一下");
const loading = ref(true);
const ainput = ref()
const now = ref(0)
const fingerprint = ref("")
const welcome = ref('')
const welcome_loading = ref(true)
const onFocus = () => {
  throttledScrollToBottom();
}
const onChange = () => {
  now.value = input.value.length
  // input.value = askRef.value.value
}
const handleEnter = async (event) => {
  if (event.shiftKey) {
    return;
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if(!loading.value){
      loading.value=true;
      throttledSend()
    }
  }
}
const scrollToBottom = () => {
  const scrollElement = document.getElementsByClassName('scroll')[0];
  scrollElement.scrollTop = scrollElement.scrollHeight;
};
const send = async (param)=>{
  if(input.value.trim() == '') {
    ElMessage.warning("请输入内容")
    return;
  }
  chatList.value.push({
    role: "user",
    content: input.value.trim() 
  })
  chatList.value.push({
    role: "assistant",
    content: ""
  })
  input.value = '';
  loading.value = true;
  askRef.value.focus();
  placeholder.value = "正在回复中...";
  setTimeout(()=>{
    throttledScrollToBottom();
  },100)
  onChange();
  const index = chatList.value.length - 1;
  fingerprint.value = await Auth.getUserFingerprint();
  window.clarity("identify", fingerprint.value, null, "TEST-AI", null)
  await Auth.chatWithAIAnlysis(chatList.value,{
    fingerprint:fingerprint.value,
    onclose:(source) => {
      loading.value = false;
      throttledScrollToBottom()
      placeholder.value = "还有什么想聊的";
      askRef.value.focus()
    },
    onmessage:(source) => {
      chatList.value[index].content+=JSON.parse(source).response;
      throttledScrollToBottom()
    },
  })
}
const throttledSend = throttle(send, 100); // 调整 3000 为所需的毫秒数
const throttledScrollToBottom = throttle(scrollToBottom, 800); // 调整 300 为所需的毫秒数
onActivated(async ()=>{
  // loading.value = false;
  onChange()
  await Auth.init()
  welcome.value = (await Auth.getAIAnlysisWelcome()).content
  welcome_loading.value = false;
  loading.value = false;
  askRef.value.focus()

  // console.log(Fingerprint)
})
</script>