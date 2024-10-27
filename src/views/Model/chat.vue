<template>
  <div class="commonPage bg-white md:rounded-lg" style="height:calc(100dvh - 60px);display: flex;flex-direction: column;">
    <div class="scroll">
      <div class="row">
        <div class="col-12 col-xl-8" style="margin-bottom: 0;">
          <div class="panel aichat">
            <el-watermark :font="{color:'rgba(0, 0, 0, .03)'}" :gap="[0,0]" :rotate="-12"
              :content="['零本智协大模型 零本智协大模型', fingerprint]">
              <div class="chatList" style="min-height: 200px;">
                <div class="system">
                  <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像" src="/logo_sm.webp">小英</el-avatar>
                  <div class="chatcontent" style="font-size:14px;width:100%;">
                    <el-skeleton :rows="3" animated v-show="welcome_loading"></el-skeleton>
                    <div v-show="!welcome_loading" v-html="md.render(welcome)"></div>
                    <p><router-link to="/model/history">聊天历史</router-link></p>
                  </div>
                </div>
                <template v-for="(item,i) in chatList" class="chatList">
                  <div class="user" v-if="item.role == 'user'">
                    <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像">你</el-avatar> -->
                    <div class="chatcontent" v-html="md.render(item.content)"></div>
                    <div class="analysis" v-show="item.status != 'no_analysis'"> 
                      <p v-show="item.status == 'analysis'">正在思考和分析问题...</p>
                      <div class="_text text-gray-500 text-sm " v-show="item.status != 'analysised'" v-html="md.render(item.analysis || '')"></div>
                      <p v-show="item.status == 'analysised' || item.status == 'show_analysis'" @click="item.status = item.status=='show_analysis'?'analysised':'show_analysis'" class="flex items-center cursor-pointer justify-end">
                        {{item.status == 'analysised'?'展开':'收起'}}思考过程
                        <Down v-show="item.status == 'analysised'" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                        <Up v-show="item.status != 'analysised'" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                      </p>
                    </div>
                    <!-- </el-watermark> -->
                  </div>
                  <div class="assistant" v-if="item.role == 'assistant'">
                    <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像" src="/logo_sm.webp" fit="contain">小英</el-avatar> -->
                    <!-- <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,-12]" :rotate="-12"
                      :content="['零本智协大模型 零本智协大模型', fingerprint]"> -->
                    
                    <div class="chatcontent" v-html="md.render(item.content) || `<span class='i-loading'></span>`"></div>
                    <!-- </el-watermark> -->
                  </div>
                </template>
              </div>
            </el-watermark>
          </div>
        </div>
      </div>
    </div>
    <div class="ainput" ref="ainput">
      <div class="row">
        <div class="col-12 col-xl-8 mb-1 md:mb-2">
          <div :class="`ainput__wrapper`">
            <div class="el-textarea el-input--large _input flex-1">
              <textarea
                class="el-textarea__inner"
                ref="askRef"
                v-model="input" 
                type="textarea"
                resize="none" 
                size="large" 
                autofocus 
                :maxlength="1000"
                @focus="onFocus"
                :placeholder="placeholder" 
                @keydown.enter="handleEnter"
                style="resize: none; min-height: 30px; height: 30px;"
              >
              </textarea>
            </div>
            <!-- <el-input ></el-input> -->
            <div class="_number">
              <!-- <span>{{ now }} / 1000</span> -->
              <el-button @click="send()" :loading="loading" type="primary"
                color="rgba(144, 77, 245,1)" class="ml-1" >
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
import { onActivated, onMounted, ref,reactive, watch } from "vue"
import Auth from "../../utils/auth";
import { throttle } from '../../utils/helpers'
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark,ElSkeleton } from "element-plus"; 
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { Down,Up } from '@icon-park/vue-next';
const md = new markdownIt()
const route = useRoute()
const router = useRouter()
const chatList = ref([]);
const input = ref("");
const askRef = ref();
const placeholder = ref("来和我聊天吧，你可以试着说 你好👋");
const loading = ref(true);
const ainput = ref()
// const now = ref(0)
const fingerprint = ref("")
const welcome = ref('')
const welcome_loading = ref(true)
const sessionID = ref()
const onFocus = () => {
  throttledScrollToBottom();
}
watch(input, () => {
  // now.value = input.value.length;
  askRef.value.style.height=0;
  if(askRef.value.scrollHeight > askRef.value.clientHeight && askRef.value.scrollHeight < 200){
    askRef.value.style.height = askRef.value.scrollHeight+'px'
  } else if(askRef.value.scrollHeight < askRef.value.clientHeight && askRef.value.scrollHeight < 200) {
    askRef.value.style.height = askRef.value.scrollHeight+'px'
  }
})
const handleEnter = async (event) => {
  if (event.shiftKey) {
    input.value = askRef.value.value
    return;
  } else if (event.key === 'Enter') {
    event.preventDefault();
    input.value = askRef.value.value
    if(!loading.value){
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
    content: input.value.trim(),
    status:'analysis',
    analysis:""
  })
  chatList.value.push({
    role: "assistant",
    content: "",
  })
  const targetValue = input.value
  input.value = '';
  loading.value = true;
  askRef.value.focus();
  placeholder.value = "正在回复中...";
  fingerprint.value = await Auth.getUserFingerprint();
  window.clarity("identify", fingerprint.value, null, "TEST-AI", null)
  setTimeout(()=>{
    throttledScrollToBottom();
  },100)
  // onChange();
  const index = chatList.value.length - 1;
  await Auth.chatWithAI_Analysis({
    sessionID:sessionID.value,
    content:targetValue,
    vf:fingerprint.value,
    onclose:async (source) => {
      chatList.value[index-1].status = 'analysised'
      await Auth.chatWithAI({
        sessionID:sessionID.value,
        content:targetValue,
        vf:fingerprint.value,
        analysis:chatList.value[index-1].analysis,
        onclose:(source) => {
          loading.value = false;
          Auth.setAIChatResponse({
            sessionID:sessionID.value,
            content:chatList.value[index].content,
            // analysis:chatList.value[index].analysis,
          })
          throttledScrollToBottom()
          placeholder.value = "还有什么想聊的";
          askRef.value.focus()
        },
        onmessage:(source) => {
          chatList.value[index].content+=JSON.parse(source).choices[0].delta.content;
          throttledScrollToBottom()
        },
      })
    },
    onmessage:(source) => {
      chatList.value[index-1].analysis+=JSON.parse(source).choices[0].delta.content;
      throttledScrollToBottom()
    },
  })
  
}
const throttledSend = throttle(send, 100); // 调整 3000 为所需的毫秒数
const throttledScrollToBottom = throttle(scrollToBottom, 800); // 调整 300 为所需的毫秒数
onActivated(async ()=>{
  let id = route.params.id
  if(!id || id=='new'){
    const {content} = await Auth.getAISessionID()
    id = route.params.id
    if(route.path=='/model/chat/new') {
      router.push('/model/chat/'+content)
      id = content;
    }
  }
  // } else {
    sessionID.value = id
    // onChange()
    // await Auth.init()
    welcome.value = (await Auth.getAIWelcome()).content;
    chatList.value = (await Auth.getAIChatList({sessionID:id})).content.map(e=>{
      e.status = e.analysis?'analysised':'no_analysis';
      return e
    });
    welcome_loading.value = false;
    loading.value = false;
    askRef.value.focus()
  // }
})
</script>