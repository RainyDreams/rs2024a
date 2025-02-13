<template>
  <div class="commonPage bg-transparent md:rounded-lg pb-0 h-dvh pt-3" style="display: flex;flex-direction: column;">
    <div class="scroll">
      <div class="">
        <div class=" max-w-3xl m-auto" style="margin-bottom: 0;">
          <div class="panel aichat">
            <el-watermar
            k :font="{color:'rgba(0, 0, 0, .08)'}" :gap="[0,0]" :rotate="-12"
              :content="['AI生成内容仅供参考', '投资有风险，入市需谨慎','仅供分析学习，不构成投资建议']">
              <div class="chatList" style="min-height: 200px;" id="ai_chatList">
                <div class="system mb-3 md:mb-4 lg:mb-5">
                  <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像" src="/logo_sm.webp">小英</el-avatar> -->
                  <div class="flex items-stretch flex-wrap" style="font-size:14px;width:100%; ">
                    <!-- <el-skeleton :rows="3" animated v-show="welcome_loading" class="bg-white p-5 rounded-lg"></el-skeleton> -->
                    <!-- <router-link  class="h-full"> -->
                      <touch-ripple
                        :class="`flex touch-ripple h-8  mt-2  items-center w-fit cursor-pointer text-sm rounded-l-full pr-2 pl-3 py-1 overflow-hidden select-none border `"
                        :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                        :color="'#4e81fc'"
                        :opacity="0.4"
                        transition="ease-out"
                        :duration="300"
                        :keep-last-ripple="true"
                        @click="router.go(-2)"
                      >
                        <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                        <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                        <left  theme="outline" size="18" fill="#4e81fc"/>
                        <!-- </div> -->
                      </touch-ripple>
                    <!-- </router-link> -->
                    <router-link to="/home" class="h-full">
                      <touch-ripple
                        :class="`flex touch-ripple h-8  mt-2  items-center mr-1 border-l-0 w-fit cursor-pointer text-sm rounded-r-full pl-2 pr-3 py-1 overflow-hidden select-none border `"
                        :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                        :color="'#4e81fc'"
                        :opacity="0.4"
                        transition="ease-out"
                        :duration="300"
                        :keep-last-ripple="true"
                      >
                        <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                        <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                        <home  theme="outline" size="18" fill="#4e81fc"/>
                        <!-- </div> -->
                      </touch-ripple>
                    </router-link>
                    <!-- <router-link to="/quant" class="h-full" > -->
                      <touch-ripple
                        :class="`flex touch-ripple h-8  mt-2  items-center text-center mr-1  w-fit cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border `"
                        :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                        :color="'#f206'"
                        :opacity="0.4"
                        transition="ease-out"
                        :duration="300"
                        :keep-last-ripple="true"
                      >
                        <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                        <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                        <fire theme="outline" class="mr-1" size="18" fill="#f20"/>
                        <div class="text-base leading-none" style="color:#f20">零本量化</div>
                        <!-- </div> -->
                      </touch-ripple>
                    <!-- </router-link> -->
                    
                    <!-- <div v-show="!welcome_loading" class="text-base/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug" v-html="md.render(welcome)"></div> -->
                    <!-- <p><router-link to="/model/history">聊天历史</router-link></p> -->
                  </div>
                  <div v-if="!welcome_loading && !loginStatus && chatList.length!=0" class="w-full">
                    <div class="text-sm text-green-800 w-full text-center mt-4 lg:mt-8 opacity-80">未登录，正在以访客身份访问</div>
                  </div>
                  <div v-show="showModelDetail">
                    <div class="min-w-fit w-64 z-10 flex flex-col mt-2 top-10 left-0 bg-white border rounded-xl p-3 duration-100">
                      <div class="text-sm/snug mb-2 flex-1">{{ model_info.desc }}</div>
                      <div class="flex items-center opacity-80 text-xs">
                        <el-avatar alt="头像" :src="model_info.createUser.avatar" class="mr-1" :size="18" />
                        <div class="username">{{ model_info.createUser.nickname }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <template v-for="(item,i) in chatList" class="chatList" >
                  <div class="user" v-if="item.role == 'user'" :data-id="i">
                    <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像">你</el-avatar> -->
                    <div class="text-xs text-green-800 w-full text-center mb-2 opacity-50">{{ item.formatSendTime }}</div>
                    <div class="chatcontent userchatbg whitespace-pre-wrap text-base/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug max-w-full lg:max-w-md px-4 md:px-5 py-3">
                      {{item.content}} 
                    </div>
                    <div class="flex mt-2">
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="复制"
                        placement="bottom-end"
                      >
                        <div 
                          @click="copyHtml(i)"
                          class="p-2 hover:bg-orange-300  transition-all rounded-md cursor-pointer">
                          <Copy theme="outline" size="16" fill="#0005" strokeLinejoin="bevel"/>
                        </div>
                      </el-tooltip>
                      <!-- <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="复制Markdown"
                        placement="top-start"
                      >
                        <div 
                          @click="copyText(item.content)"
                          class="p-2 hover:bg-slate-100  transition-all rounded-md cursor-pointer">
                          <DocDetail theme="outline" size="16" fill="#0005" strokeLinejoin="bevel"/>
                        </div>
                      </el-tooltip> -->
                    </div>
                    <div class="analysis max-w-full" v-show="item.status != 'no_analysis'">
                      <!-- <p v-show="item.status == 'analysis'">正在思考和分析问题...</p> -->
                      <div 
                        :class="`_text text-gray-500 text-sm `+(item.status=='analysis'?'active':'')" v-show="item.show_thought" 
                        v-html="md.render(item.analysis || '')"
                      ></div>
                      <p v-if="item.analysis" @click="item.show_thought = !item.show_thought" class="flex items-center cursor-pointer justify-end">
                        {{item.show_thought?'收起':'展开'}}思考过程
                        <Down v-show="!item.show_thought" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                        <Up v-show="item.show_thought" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                      </p>
                    </div>
                    <!-- </el-watermark> -->
                  </div>
                  <div v-if="item.role=='user'" v-show="item.status != 'analysised'" class="text-base md:text-lg lg:text-xl text-green-800 w-full text-left mt-8 font-bold">
                    <span class="active-text">{{ renderStatus(item.status) }}</span>
                  </div>
                  <div class="assistant overflow-hidden" v-if="item.role == 'assistant'" :data-id="i">
                    <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像" src="/logo_sm.webp" fit="contain">小英</el-avatar> -->
                    <!-- <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,-12]" :rotate="-12"
                      :content="['零本智协大模型 零本智协大模型', fingerprint]"> -->
                    <!-- <div></div> -->
                    <div class="chatcontent text-base/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug xl:text-lg/loose" >
                      <!-- <div v-for="(e,i2) in contentRendered" :key="i2" v-if="i == chatList.length-1">
                        <div v-html="md.render(e.content)" :class="{ 'fade-in': e.fresh }" @animationend="e.fresh = false"></div>
                      </div> -->
                      <!-- 动画 -->
                      <div v-if="animateMode && i == chatList.length-1">
                        <div v-for="(e,i2) in contentRendered" :key="i2" class="hhh" style="--animate-duration:3.2s">
                          <div v-html="throttledRender(e.content)" class="animate__animated animate__fadeIn"></div>
                        </div>
                      </div>
                      <div v-else class="animate__animated animate__fadeIn" style="--animate-duration:2.5s" v-html="throttledRender(item.content)"></div>
                    </div>
                    <div class="flex">
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="复制"
                        placement="top-start"
                      >
                        <div 
                          @click="copyHtml(i)"
                          class="p-2 hover:bg-orange-300  transition-all rounded-md cursor-pointer">
                          <Copy theme="outline" size="16" fill="#0005" strokeLinejoin="bevel"/>
                        </div>
                      </el-tooltip>
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="复制Markdown"
                        placement="top-start"
                      >
                        <div 
                          @click="copyText(item.content)"
                          class="p-2 hover:bg-orange-300  transition-all rounded-md cursor-pointer">
                          <DocDetail theme="outline" size="16" fill="#0005" strokeLinejoin="bevel"/>
                        </div>
                      </el-tooltip>
                      
                    </div>
                    <!-- </el-watermark> -->
                  </div>
                </template>
              </div>
            </el-watermar>
          </div>
        </div>
      </div>
    </div>
    <p class=" text-center text-slate-500 py-1 font-sans leading-none" style="font-size: 10px;">投资决策需基于自身判断和风险承受能力，投资有风险，入市需谨慎。</p>
  </div>
</template>
<script setup>
import markdownIt from 'markdown-it';
import { onActivated, onMounted, ref,reactive, watch, nextTick } from "vue"
import Auth from "../../utils/auth";
import { throttle,functionCallPlugin, getRadomString } from '../../utils/helpers'
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark,ElSkeleton,ElTooltip,ElSwitch,ElSelect,ElOption, CASCADER_PANEL_INJECTION_KEY, ElMessageBox, dayjs } from "element-plus"; 
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { Down,Up,Copy,DocDetail,PauseOne,DeleteMode,Fire,Plus,Avatar,ApplicationMenu,History,Earth,Thermometer,Info,SmartOptimization,Left,Home } from '@icon-park/vue-next';
import { emitter } from '../../utils/emitter';
import { TouchRipple } from 'vue-touch-ripple'
import 'vue-touch-ripple/style.css'
const showModelDetail = ref(false)
const showInfo = ref(false)
const contentRendered = ref([])
const animateMode = ref(false)


const md = new markdownIt({
  typographer: true, // 使用高级的打字排版
  html: true,
  linkify: true,
});
// const contentRendered = ref([]);
// emitter.emit('toggleSidebar')

/* 主要渲染部分结束 */
const route = useRoute()
const router = useRouter()
const chatList = ref([]);
const input = ref("");
const askRef = ref();
const placeholder = ref("你好👋");
const loading = ref(true);
const ainput = ref()
const now = ref(0)
const fingerprint = ref("")
const welcome = ref('')
const welcome_loading = ref(true)
const sessionID = ref()
const stopStatus = ref(false)
const useAnalysis = ref(false);
const useInternet = ref(false);
const show_menu = ref(true)
const showStop = ref(false);
const tokensCount = ref(0)
const tokensCount2 = ref(0)
const title = ref('无标题');
const model_info = ref({
  img:'/logo_sm.webp',
  name:'默认模型',
  desc:'零本智协AI大模型',
  createUser:{
    nickname:'零本智协团队',
    avatar:'/logo_sm.webp'
  },
  createuser:''
})
// const options_analysis = [
//   {value: 'line-1', label: '分析 Gemini-002'},
//   {value: 'line-2', label: '分析 Doubao-32k'},
//   {value: 'line-3', label: '分析 Qwen-8b'},
// ];
// const options_chat = [
//   {value: 'line-1', label: '回复 Gemini-1.5-flash-001'},
//   {value: 'line-2', label: '回复 Doubao-32k'},
//   {value: 'line-3', label: '回复 X AI'},
// ];
// const options_internet = [
//   {value: 'AUTO', label: '自动联网'},
//   {value: 'DISABLE', label: '禁止联网'},
//   {value: 'ENABLE', label: '始终联网'},
// ];
const analysis_line = ref('line-1')
const chat_line = ref('line-1')

const onFocus = () => {
  throttledScrollToBottom();
}
function copyText(text){
  Auth.copyText(text.trim(),()=>{
    ElMessage.success("复制成功")
  },()=>{
    ElMessage.error("复制失败")
  })
}
function copyHtml(i){
  const html = document.querySelector('#ai_chatList>div[data-id="'+i+'"] .chatcontent').innerHTML
  Auth.copyHtml(html,()=>{
    ElMessage.success("复制成功")
  },()=>{
    ElMessage.error("复制失败")
  })
}
// function updateInputHeight() {
//   const ask = askRef.value;
//   if (!ask) return;
//   let tmp = ask.style.height+'';
//   ask.style.height = '0';
//   let newHeight = ask.scrollHeight;
//   // console.log(newHeight,tmp)
//   if (newHeight > 200) newHeight = parseInt(tmp)
//   ask.style.height = newHeight+'px';
// }
// const throttledUpdateInputHeight = throttle(updateInputHeight, 100);

// watch(input, () => {
//   throttledUpdateInputHeight();
// });
function isMobile() {
  const userAgent = navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}
const mobile = isMobile();
const handleEnter = async (event) => {
  if (event.shiftKey || mobile) {
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
const throttledGetLength = throttle((i)=>{
  const textarea = document.getElementById('input_chat_ai');
  now.value = textarea.value.length;
}, 100);
nextTick(()=>{
  const textarea = document.getElementById('input_chat_ai');
  // console.log(textarea)
  textarea.style.height = '32px';
  const scrollHeight = textarea.scrollHeight;
  textarea.style.height = scrollHeight + 'px';
  textarea.addEventListener('input', function () {
    this.style.height = '32px';
    const scrollHeight = this.scrollHeight;
    this.style.height = scrollHeight + 'px';
    throttledGetLength(textarea.value.length)
  });
})
// textarea.addEventListener('input', function () {
//   this.style.height = 'auto';
//   const scrollHeight = this.scrollHeight;
//   this.style.height = scrollHeight + 'px';
// });
// textarea.dispatchEvent(new Event('input'));
const scrollToBottom = () => {
  const scrollElement = document.getElementsByClassName('scroll')[0];
  // 丝滑滑动到最底部
  // scrollElement.scrollTop = scrollElement.scrollHeight;
  scrollElement.scrollTo({
    top: scrollElement.scrollHeight,
    behavior: 'smooth'
  });
};

const stop = async (param)=>{
  stopStatus.value=true;
  loading.value=false;
}

/* chat */
async function deepMind(targetValue, targetTime, index) {
  if(useInternet.value) {
    analysis_line.value = 'line-1';
    chatList.value[index - 1].status = 'thinking';
    //并行运行
    await Promise.all([
      Auth.deepMind_Analysis(createOptions({targetValue,targetTime,index},[],(e)=>{})),
      Auth.functionCall( {"name": "web_search","args": {"keywords": [targetValue]}}, {
        renderHtml: (html) => {
          chatList.value[index - 1].analysis += html;
        },
      })
    ]);
  }
  if (useAnalysis.value){
    let _analysis2;
    Auth.chatTaskThread.add(async () => {
      let _analysis = chatList.value[index - 1].analysis;
      chatList.value[index - 1].status = 'try';
      await Auth.deepMind_Try(createOptions({targetValue,targetTime,index},[_analysis],(e)=>{
        _analysis2 += e;
      }));
      chatList.value[index - 1].analysis += '\n\n'; 
      chatList.value[index - 1].status = 'summary';
      await Auth.deepMind_Summary(createOptions({targetValue,targetTime,index},[_analysis,_analysis2]));
    })
  }
  Auth.chatTaskThread.add(async () => {
    const id1 = setTimeout(() => {
    if(chatList.value[index - 1].status != 'analysised'){
        chatList.value[index - 1].status = 'analysising';
      }
    }, 2000);
    chatList.value[index - 1].status = 'reply';
    const id2 = setTimeout(() => {
      clearTimeout(id1);
      if(chatList.value[index - 1].status != 'analysised'){
        chatList.value[index - 1].status = 'wait';
      }
    }, 7500);
    await initiateChatWithAI({targetValue,targetTime,index});
    clearTimeout(id2);
    chatList.value[index - 1].status = 'analysised';
  })
}
function createOptions(opt,analysis,fn=()=>{}) {
  return {
    sessionID: sessionID.value,
    content: opt.targetValue,
    vf: fingerprint.value,
    analysis: analysis,
    stopStatus,
    line: analysis_line.value,
    onmessage: async (source, model) => {
      showStop.value = true;
      const decode = JSON.parse(source);
      let tmp = '';
      try{
        switch (model) {
          case 'line-1':
            tmp = decode.candidates[0].content.parts[0].text;
            tokensCount.value = decode.usageMetadata.totalTokenCount;
            if (decode.candidates[0].content.parts[0].functionCall) {
              Auth.chatTaskThread.add(async () => {
                await Auth.functionCall(decode.candidates[0].content.parts[0].functionCall, {
                  alert: (obj) => {
                    ElMessageBox.alert(md.render(obj.content), obj.title || '任务执行结果', {
                      confirmButtonText: '确定',
                      showCancelButton: false,
                      dangerouslyUseHTMLString: true,
                      showClose: false,
                    });
                  },
                  renderHtml: (html) => {
                    chatList.value[opt.index - 1].analysis += html;
                    fn(html);
                  },
                });
              });
              tmp = '\n\n';
            }
            break;
          case 'line-2':
            tmp = decode.choices[0].delta?.content;
            break;
          case 'line-3':
            tmp = decode.response;
            break;
        }
        throttledScrollToBottom();
        chatList.value[opt.index - 1].analysis += tmp;
        fn(tmp);
      }catch(e){
        await Auth.getPrtoken();
      }
      
    },
    onerror:async ()=>{
      await Auth.getPrtoken();
    },
    onclose: async (source) => {
      if (stopStatus.value == true) {
        stopStatus.value = false;
        placeholder.value = "还有什么想聊的";
        chatList.value[opt.index - 1].status = 'analysised';
        chatList.value[opt.index].content += '[回答已终止]';
      }
      //  else {
      //   await initiateChatWithAI(opt);
      // }
    },
  }
}

async function initiateChatWithAI(opt) {
  await Auth.chatWithAI({
    sessionID: sessionID.value,
    content: opt.targetValue,
    vf: fingerprint.value,
    analysis: chatList.value[opt.index - 1].analysis || '',
    stopStatus,
    useAnalysis: useAnalysis.value,
    useInternet: useInternet.value,
    line: chat_line.value,
    time: opt.targetTime,
    onerror: (source, model) => {
      console.log('错误');
      window.clarity('event', 'CHAT-AI-ERROR');
      // retryChatWithAI(opt);
    },
    onmessage: (source, model) => {
      handleOnMessage(source, model, opt);
    },
    onclose: (error,model) => {
      throttledScrollToBottom();
      handleOnClose(error,model, opt);
    },
  });
}

function retryChatWithAI(opt,line='line-3') {
  Auth.chatWithAI({
    sessionID: sessionID.value,
    content: opt.targetValue,
    vf: fingerprint.value,
    analysis: chatList.value[opt.index - 1].analysis || '',
    stopStatus,
    useAnalysis: useAnalysis.value,
    useInternet: useInternet.value,
    line: line,
    time: opt.targetTime,
    onerror: (source, model) => {
      console.log('错误');
      // ElMessage.warning('错误重新尝试失败');
      if(line=='line-3'){
        retryChatWithAI(opt,'line-2');
      } else {
        ElMessage.warning('错误重新尝试失败');
        loading.value = false;
      }
      // loading.value = false;
    },
    onmessage: (source, model) => {
      try{
        handleOnMessage(source, model, opt);
      } catch(e){
        setTimeout(()=>{
          try{
            retryChatWithAI(opt,'line-3');
          } catch(e){
            setTimeout(()=>{
              try{
                retryChatWithAI(opt,'line-3');
              } catch(e){
                ElMessage.warning('错误重新尝试失败');
              }
            },1000)
          }
        },1000)
      }
    },
    onclose: (error,model) => {
      handleOnClose(error, model ,opt);
      // loading.value = false;
    },
  });
}

function handleOnMessage(source, model, opt) {
  showStop.value = true;
  const decode = JSON.parse(source);
  let tmp = '';
  try{
    switch (model) {
      case 'line-1':
        if (!decode.candidates[0].content.parts) {
          break;
        }
        tmp = decode.candidates[0].content.parts[0].text;
        if (tmp) {
          tmp = tmp.replace(/\`\`\`lingben_bash[\s\S]*?\`\`\`/, '');
          tokensCount2.value = decode.usageMetadata.totalTokenCount;
        } else if (decode.candidates[0].content.parts[0].functionCall) {
          Auth.chatTaskThread.add(async () => {
            await Auth.functionCall(decode.candidates[0].content.parts[0].functionCall, {
              alert: (obj) => {
                ElMessageBox.alert(md.render(obj.content), obj.title || '任务执行结果', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  dangerouslyUseHTMLString: true,
                  showClose: false,
                });
              },
              renderHtml: (html) => {
                chatList.value[opt.index].content += html;
              },
            });
          });
          tmp = '\n\n';
        }
        if(!animateMode.value) animateMode.value = true;
        contentRendered.value.push({content:tmp,fresh:true});
        break;
      case 'line-2':
        tmp = decode.choices[0].delta?.content;
        break;
      case 'line-3':
        tmp = decode.choices[0].delta?.content;
        break;
      case 'line-4':
        tmp = decode.response;
        break;
    }
  }catch(e){
    ElMessage.warning('出现错误');
  }
  chatList.value[opt.index].content += tmp;
  // throttledScrollToBottom();
}


async function handleOnClose(error,model,opt) {
  stopStatus.value = false;
  showStop.value = false;
  loading.value = false;
  placeholder.value = '还有什么想聊的';
  askRef.value.focus();
  if (!chatList.value[opt.index].content) {
    if (!error) {
      chatList.value[opt.index].content += '[回答已终止].';
    }
  } else {
    if (!error) {
      if(model == 'line-1'){
        // animateMode.value = false;
        setTimeout(()=>{
          animateMode.value = false;
          contentRendered.value=[]
        },10)
      }
      // Auth.chatTaskThread.add(async () => {
        // throttledScrollToBottom();
        const res = await Auth.setAIChatResponse({
          sessionID: sessionID.value,
          content: chatList.value[opt.index].content,
          tokens: tokensCount.value + tokensCount2.value,
          title: title.value,
        });
        title.value = res.title;
        emitter.emit('updateTitle', res.title);
      // });
      
    }
  }
  // throttledScrollToBottom();
  // scrollToBottom()
  // chatList.value[opt.index - 1].status = 'analysised';
  
}

const send = async (param)=>{
  input.value = askRef.value.value
  if(input.value.trim() == '') {
    ElMessage.warning("请输入内容")
    return;
  }
  const targetTime = new Date().getTime()
  let formatSendTime;
  if(chatList.value.length>0){
    formatSendTime=(targetTime-chatList.value.findLast(e=>e.role=='user').sendTime>(30*60*1000))?dayjs(targetTime).format('YYYY-MM-DD HH:mm:ss'):''
  } else {
    formatSendTime=dayjs(targetTime).format('YYYY-MM-DD HH:mm:ss')
  }
  chatList.value.push({
    role: "user",
    content: input.value.trim(),
    status:'sending',
    analysis:"",
    show_thought:true,
    sendTime:targetTime,
    formatSendTime
  })
  chatList.value.push({
    role: "assistant",
    content: "",
  })
  const targetValue = input.value
  input.value = '';
  askRef.value.value = '';
  now.value = 0;
  setTimeout(()=>{
    throttledScrollToBottom()
    askRef.value.style.height = 0 + 'px';
  },100)
  // askRef.value.style.height = askRef.value.scrollHeight+'px'
  loading.value = true;
  askRef.value.focus();
  placeholder.value = "正在回复中...";
  window.clarity("identify", fingerprint.value, null, "CHAT-AI", null)
  if (
    useInternet.value=='AUTO'
    && (targetValue.indexOf('新闻')>-1 || targetValue.indexOf('news')>-1 || targetValue.indexOf('weather')>-1)
    && targetValue.length <= 8
  ) {
    useInternet.value=true;
  } else if (targetValue.indexOf('联网')>-1 || targetValue.indexOf('搜索')>-1) {
    useInternet.value=true;
  }
  // onChange();
  const index = chatList.value.length - 1;
  await deepMind(targetValue, targetTime, index);
  // await handleChatWithAI_Analysis({ targetValue, targetTime, index });
  // await handleChatWithAI_Analysis({targetValue,targetTime,index});
}

const loginStatus = ref(false);
const throttledSend = throttle(send, 100); // 调整 3000 为所需的毫秒数
const throttledScrollToBottom = throttle(scrollToBottom, 1000); // 调整 300 为所需的毫秒数
onMounted(async ()=>{
  const info = sessionStorage.getItem('userInfo');
  if(info){
    if(JSON.parse(info).avatar){
      loginStatus.value = true;
    }
  }
  let id = route.params.id;
  console.log('active'+id)
  // } else {
    sessionID.value = id
    // onChange()
    // await Auth.init()
    fingerprint.value = await Auth.getUserFingerprint();
    const welcomeOnline = (await Auth.getAIWelcome({sessionID:id}))
    // console.log(welcomeOnline)
    welcome.value = welcomeOnline.content;
    model_info.value = {
      ...model_info.value,
      name:welcomeOnline.model.name,
      desc:welcomeOnline.model.desc,
      createuser:welcomeOnline.model.createuser,
    };
    await Promise.all([async ()=>{
      // console.log(1)
      // console.log(model_info.value)
      model_info.value.createUser = (await Auth.getUserInfoByID({id:model_info.value.createuser}));
      return 0;
    },async ()=>{
      let tmp = 0;
      chatList.value = (await Auth.getAIChatList({sessionID:id})).content.map((e,i)=>{
        e.status = e.analysis?'analysised':'no_analysis';
        e.show_thought = false;
        return e
      });
      chatList.value.forEach((e,i)=>{
        if(e.role == 'user'){
          if(i == 0){
            e.formatSendTime = dayjs(e.sendTime).format('YYYY-MM-DD HH:mm:ss')
          } else {
            e.formatSendTime = (chatList.value[tmp].sendTime-e.sendTime>(30*60*1000))?dayjs(targetTime).format('YYYY-MM-DD HH:mm:ss'):'';
            tmp=i;
          }
        }
      })
    }].map(async(e)=>{
      return e()
    }))
    
    welcome_loading.value = false;
    loading.value = false;
    askRef.value.focus()
  // }
})
</script>




