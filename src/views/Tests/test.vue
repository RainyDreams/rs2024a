<template>
  <div class="commonPage" style="height:calc(var(--system--height) - 60px);display: flex;flex-direction: column;">  
    <div class="scroll">
      <div class="row" >
        <div class="col-12 col-xl-8" style="margin-bottom: 0;">
          <div class="panel aichat" >
            <div class="chatList" style="min-height: 200px;">
              <div class="system">
                <el-avatar>小英</el-avatar>
                <div class="chatcontent" style="font-size: 12px;">
                  <p>赤子英金大模型公测 编译版本20240801_1455</p>
                  <p>为了更好的测试，全量开放。请及时反应使用大模型遇到的问题，方便我们改进。未来我们会将大模型融入到我们的产品中。</p>
                  <p>大服务生成的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，不代表我们的态度或观点，仅供参考学习。</p>
                  <p>使用本软件即代表同意<a target="_blank" href="https://www.chiziingiin.top/license/ai">《赤子英金大模型使用协议》</a></p>
                </div>
              </div>
              <template v-for="(item,i) in chatList" class="chatList">
                <div class="user" v-if="item.role == 'user'">
                  <el-avatar>你</el-avatar>
                  <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,0]" :rotate="-12" :content="['用户文本 赤子英金大模型 公测', fingerprint]">
                    <div class="chatcontent" v-html="md.render(item.content)"></div>
                  </el-watermark>
                </div>
                <div class="assistant" v-if="item.role == 'assistant'">
                  <el-avatar>小英</el-avatar>
                  <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,-12]" :rotate="-12" :content="['公测 赤子英金大模型 公测', fingerprint]">
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
            <el-input
              ref="askRef"
              v-model="input" 
              :readonly="loading"
              :autosize="{ minRows: 1, maxRows: 3 }"
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
const onFocus = () => {
  ainputStatus.value = true
}
const onBlur = () => {
  ainputStatus.value = false
}
const onChange = () => {
  now.value = input.value.length
}
const scrollToBottom = () => {
  const scrollElement = document.getElementsByClassName('scroll')[0];
  scrollElement.scrollTop = scrollElement.scrollHeight;
};
const throttledScrollToBottom = throttle(scrollToBottom, 300); // 调整 300 为所需的毫秒数
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
  input.value = '';
  placeholder.value = "正在回复中...";
  setTimeout(()=>{
    throttledScrollToBottom()
  },100)
  onChange()
  const index = chatList.value.length - 1;
  fingerprint.value = await Auth.getUserFingerprint()
  await Auth.chatWithAI(chatList.value,{
    fingerprint:fingerprint.value,
    onmessage:(event,source) => {
      if(event.data != '[DONE]'){
        chatList.value[index].content+=JSON.parse(event.data).response;
        throttledScrollToBottom()
        placeholder.value = "还有什么想聊的";
        askRef.value.focus()
      } else {
        source.close();
        loading.value = false;
        throttledScrollToBottom()
      }
    },
    onerror: (event,source)=>{
      source.close();
      loading.value = false;
    }
  })
}
onActivated(async ()=>{
  // loading.value = false;
  ElMessage.info('正在尝试使用访客身份登录，请稍等');
  onChange()
  await Auth.init()
  // await send()
  loading.value = false;
  askRef.value.focus()

  // console.log(Fingerprint)
})
</script>