<template>
  <div class="commonPage" style="height:calc(var(--system--height) - 60px);display: flex;flex-direction: column;">  
    <div class="scroll">
      <div class="row" >
        <div class="col-12 col-xl-8" style="margin-bottom: 0;">
          <div class="panel aichat" >
            <div class="chatList" style="min-height: 200px;">
              <div class="system">
                <el-avatar src="/logo_sm.png">小英</el-avatar>
                <div class="chatcontent" style="font-size:12px;">
                  <p>赤子英金大模型公测 编译版本CzigChat-1.0-14b@202408032254</p>
                  <p>为了更好的测试，全量开放。未来我们会将大模型融入到我们的产品中。<strong>本产品由赤子英金开发和训练，未接入任何平台API，独立运行在我们的服务器上。</strong>大服务生成的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，不代表我们的态度或观点，仅供参考学习。</p>
                  <p>使用本软件即代表同意<a target="_blank" href="https://www.chiziingiin.top/license/ai">《赤子英金大模型使用协议》</a>，如若大模型出现回答错误、不准确、不道德等问题请及时<a href="https://project.chiziingiin.top/system/feedback">反馈给我们</a>，方便改进。</p>
                  <p>需要注意的是：本页面为测试页面，聊天历史不会被保存。</p>
                </div>
              </div>
              <template v-for="(item,i) in chatList" class="chatList">
                <div class="user" v-if="item.role == 'user'"> 
                  <el-avatar>你</el-avatar>
                  <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,0]" :rotate="-12" :content="['赤子英金大模型 赤子英金大模型', fingerprint]">
                    <div class="chatcontent" v-html="md.render(item.content)"></div>
                  </el-watermark>
                </div>
                <div class="assistant" v-if="item.role == 'assistant'">
                  <el-avatar src="/logo_sm.png" fit="contain">小英</el-avatar>
                  <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,-12]" :rotate="-12" :content="['赤子英金大模型 赤子英金大模型', fingerprint]">
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
          <div :class="`ainput__wrapper ${ainputStatus ? 'active' : ''}`">
            <div class="clickWrapper" @click="changeFocus"></div>
            <el-input
              ref="askRef"
              v-model="input" 
              :autosize="{ minRows: 1, maxRows: 4 }"
              type="textarea"
              resize="none"
              size="large"
              autofocus
              class="_input"
              :maxlength="1000"
              @focus="onFocus"
              @blur="onBlur"
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
import markdownItHighlightjs from 'markdown-it-highlightjs'
import { onActivated, onMounted, ref,reactive } from "vue"
import Auth from "../../utils/auth";
import { throttle } from '../../utils/helpers'
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark } from "element-plus"; 
const md = new markdownIt().use(markdownItHighlightjs);
const chatList = ref([]);
const input = ref("");
const askRef = ref();
const placeholder = ref("来和我聊天吧，你可以试着说 你好👋");
const loading = ref(true);
const ainput = ref()
const now = ref(0)
const fingerprint = ref("")
const ainputStatus = ref(false)
const changeFocus = () => {
  askRef.value.focus()
}
const onFocus = () => {
  ainputStatus.value = true;
  throttledScrollToBottom();
}
const onBlur = () => {
  console.log(document.activeElement)
  ainputStatus.value = false;
}
const onChange = () => {
  now.value = input.value.length
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
  await Auth.chatWithAI(chatList.value,{
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
  // await send()
  loading.value = false;
  askRef.value.focus()

  // console.log(Fingerprint)
})
</script>