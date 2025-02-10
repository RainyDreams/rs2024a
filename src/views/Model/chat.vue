<template>
  <div class="commonPage bg-transparent md:rounded-lg pb-0" style="height:calc(100dvh - 60px);display: flex;flex-direction: column;">
    <div class="scroll">
      <div class="">
        <div class=" max-w-3xl m-auto" style="margin-bottom: 0;">
          <div class="panel aichat">
            <el-watermark :font="{color:'rgba(0, 0, 0, .01)'}" :gap="[0,0]" :rotate="-12"
              :content="['零本智协大模型 生成内容仅供参考', sessionID,fingerprint]">
              <div class="chatList" style="min-height: 200px;" id="ai_chatList">
                <div class="system">
                  <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像" src="/logo_sm.webp">小英</el-avatar> -->
                  <div class="flex items-stretch" style="font-size:14px;width:100%;">
                    <!-- <el-skeleton :rows="3" animated v-show="welcome_loading" class="bg-white p-5 rounded-lg"></el-skeleton> -->
                    <div v-show="!welcome_loading" class="group relative w-fit">
                      <touch-ripple
                        :class="`flex touch-ripple items-center w-fit mr-1 cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border `+(showModelDetail?'text-orange-950':'text-orange-950')"
                        :style="{ clipPath: 'none', backgroundColor: showModelDetail?'#ffedd5':'#fff' }"
                        :color="showModelDetail?'#f7deb7':'#f7deb7'"
                        :opacity="0.4"
                        transition="ease-out"
                        :duration="300"
                        :keep-last-ripple="true"
                        @click="showModelDetail=!showModelDetail"
                      >
                        <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                        <img alt="头像" :src="model_info.img" class="mr-1 w-4 h-4 rounded-full" />
                        <div class="text-base">{{ model_info.name }}</div>
                        <!-- </div> -->
                      </touch-ripple>
                    </div>
                    <div v-show="!welcome_loading" class="group relative w-fit">
                      <touch-ripple
                        :class="`flex touch-ripple h-full items-center w-fit mr-1 cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border `+(showInfo?'text-orange-950':'text-orange-950')"
                        :style="{ clipPath: 'none', backgroundColor: showInfo?'#ffedd5':'#fff' }"
                        :color="showInfo?'#f7deb7':'#f7deb7'"
                        :opacity="0.4"
                        transition="ease-out"
                        :duration="300"
                        :keep-last-ripple="true"
                        @click="showInfo=!showInfo"
                      >
                        <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                          <info theme="outline" size="18" fill="#ff9d00"/>
                        <!-- </div> -->
                      </touch-ripple>
                      
                    </div>
                    <!-- <div v-show="!welcome_loading" class="text-base/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug" v-html="md.render(welcome)"></div> -->
                    <!-- <p><router-link to="/model/history">聊天历史</router-link></p> -->
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
                  <div v-show="showInfo">
                    <div class="min-w-fit w-64 z-10 flex flex-col mt-2 left-4 right-4 mx-auto bg-white border rounded-xl p-3 duration-100">
                      <div class="w-full text-sm/snug">由于服务器成本原因，对大模型所有用户限制如下：每分钟15次，每天1000次提问。</div>
                    </div>
                  </div>
                  <!-- 欢迎 -->
                  <div :class="`duration-1000 trasition-all overflow-hidden w-full `+(chatList.length!=0?'max-h-0':'max-h-96')">
                    <div v-if="!welcome_loading" :class="`chat_welcome mt-14 md:mt-18 2xl:mt-24 w-full animate__animated `+((chatList.length==0)?'animate__fadeInUp':'animate__fadeOutUp')">
                      <h2 class="text-center w-full text-2xl md:text-4xl 2xl:text-5xl font-bold">你好！来聊点什么吧</h2>
                    </div>
                  </div>
                </div>
                <template v-for="(item,i) in chatList" class="chatList" >
                  <div class="user" v-if="item.role == 'user'" :data-id="i">
                    <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像">你</el-avatar> -->
                    <div class="text-xs text-green-800 w-full text-center mb-2 font-thin">{{ item.formatSendTime }}</div>
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
                        class="_text text-gray-500 text-sm " v-show="item.status != 'analysised'" 
                        v-html="md.render(item.analysis || '')"
                      ></div>
                      <p v-if="item.analysis" v-show="item.status == 'analysised' || item.status == 'show_analysis'" @click="item.status = item.status=='show_analysis'?'analysised':'show_analysis'" class="flex items-center cursor-pointer justify-end">
                        {{item.status == 'analysised'?'展开':'收起'}}思考过程
                        <Down v-show="item.status == 'analysised'" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                        <Up v-show="item.status != 'analysised'" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                      </p>
                    </div>
                    <!-- </el-watermark> -->
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
            </el-watermark>
          </div>
        </div>
      </div>
    </div>
    <div class="ainput" ref="ainput">
      <div class="">
        <div class="max-w-3xl m-auto">
          <div class="relative w-full">
            <div :class="`flex flex-col w-full px-3 bg-orange-300 rounded-t-[25px] pt-2 pb-1 ease `+(show_menu?'bottom-0 opacity-100 relative':'opacity-0')" style="position:absolute;bottom:-25px;transition: bottom 0.2s,opacity 0.2s;left:0;">
              <touch-ripple
                :class="`touch-ripple w-fit mr-1 cursor-pointer text-sm rounded-full px-3 py-2 overflow-hidden select-none border `+(useAnalysis?'text-white border-green-700':'text-green-700 border-green-700')"
                :style="{ clipPath: 'none', backgroundColor: useAnalysis?'#1a842f':'#fff' }"
                :color="useAnalysis?'#fff':'#1a842f'"
                :opacity="0.4"
                transition="ease-out"
                :duration="300"
                :keep-last-ripple="true"
                @click="useAnalysis=!useAnalysis"
              >
                <span class="flex items-center align-middle"><SmartOptimization class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">深入思考</span></span>
              </touch-ripple>
              <!-- <touch-ripple
                :class="`touch-ripple w-fit cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border `+(useAnalysis?'text-white':'text-green-700')"
                :style="{ clipPath: 'none', backgroundColor: useAnalysis?'#1a842f':'#fff' }"
                :color="useAnalysis?'#fff':'#1a842f'"
                :opacity="0.4"
                transition="ease-out"
                :duration="400"
                :keep-last-ripple="true"
                @click="useAnalysis=!useAnalysis"
              >
                <span>深入思考</span> -->
              <!-- </touch-ripple> -->
            </div>
          </div>
          <div :class="`bg-orange-300 transition-all duration-100 `+(show_menu?'rounded-b-[25px]':'rounded-[25px]')">
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
                  :maxlength="2000"
                  @focus="onFocus"
                  :placeholder="placeholder" 
                  @keydown.enter="handleEnter"
                  style="resize: none; min-height: 30px; height: 30px;"
                >
                </textarea>
              </div>
              <!-- <el-input ></el-input> -->
              <div class="_number ml-2">
                <!-- <span>{{ now }} / 1000</span> -->
                <!-- <add-mode theme="outline" size="24" fill="#555"/> -->
                <!-- <application-menu theme="outline" size="24" fill="#333"/> -->
                <touch-ripple
                  :class="`touch-ripple flex items-center justify-center h-[32px] w-[32px]  mr-1 cursor-pointer rounded-full overflow-hidden select-none border `+((show_menu)?'text-white':'text-green-900')"
                  :style="{ clipPath: 'none', backgroundColor: (show_menu)?'#006b2c':'#fff' }"
                  :color="(show_menu)?'#fff':'#006b2c'"
                  :opacity="0.4"
                  transition="ease-out"
                  :duration="300"
                  :keep-last-ripple="true"
                  @click="show_menu=!show_menu"
                >
                  <component  :is="ApplicationMenu" :class="`cursor-pointer transition w-fit h-fit `+(show_menu?'opacity-100':'opacity-70')" theme="outline" size="18" fill="currentColor"/>
                </touch-ripple>
                <el-button @click="send()" :loading="loading" v-show="!showStop" type="primary"
                  color="#006b2c" class="ml-1 rounded-full w-8 h-8" ><up v-show="!loading"  theme="outline" size="18" fill="#fff" :strokeWidth="5" strokeLinejoin="bevel"/></el-button>
                <el-button @click="stop()" v-show="loading && !welcome_loading && showStop" type="primary"
                  color="#006b2c" class="ml-1 rounded-full w-8 h-8" >
                  <!-- 终止 -->
                  <!-- <forbid theme="outline" size="24" fill="#555" :strokeWidth="3" strokeLinejoin="bevel"/> -->
                  <PauseOne theme="outline" size="18" fill="#fff" :strokeWidth="5" strokeLinejoin="bevel"/>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class=" text-center text-slate-500 py-1 font-sans leading-none" style="font-size: 10px;">内容由 OriginSynq AI 生成，请仔细甄别</p>
  </div>
</template>
<script setup>
import markdownIt from 'markdown-it';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import math from 'markdown-it-texmath';
import Katex from 'katex';
import hljs from 'highlight.js';
// import 'highlight.js/styles/github.min.css'; // 如果要使用浅色 GitHub 主题
import { onActivated, onMounted, ref,reactive, watch } from "vue"
import Auth from "../../utils/auth";
import { throttle,functionCallPlugin, getRadomString } from '../../utils/helpers'
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark,ElSkeleton,ElTooltip,ElSwitch,ElSelect,ElOption, CASCADER_PANEL_INJECTION_KEY, ElMessageBox, dayjs } from "element-plus"; 
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { Down,Up,Copy,DocDetail,PauseOne,DeleteMode,AddMode,ApplicationMenu, Thermometer,Info,SmartOptimization } from '@icon-park/vue-next';
import { emitter } from '../../utils/emitter';
import { TouchRipple } from 'vue-touch-ripple'
import 'vue-touch-ripple/style.css'
const showModelDetail = ref(false)
const showInfo = ref(false)
const contentRendered = ref([])
const animateMode = ref(false)
const throttledRender = (e)=>{
  return md.render(e)
}
function copyCode(codeId) {
  const code = window['czig_code_html' + codeId];
  console.log(code)
  window.copyText(code, () => {
    ElMessage.success("复制成功")
  }, () => {
    ElMessage.error("复制失败")
  })
}
window.copyCode = copyCode;

const md = new markdownIt({
  typographer: true, // 使用高级的打字排版
  html: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && markdownIt.utils.isStringEmpty(lang)) { return `<pre class="language-${lang}"><code>${md.utils.escapeHtml(str)}</code></pre>`; } 
    else if (lang && hljs.getLanguage(lang)) { try { return `<pre class="language-${lang}"><code>${hljs.highlight(lang, str, true).value}</code></pre>`; } catch (__) { } } else { // 未知语言，使用默认渲染 
      return `<pre class="language-unknown"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  }
});
hljs.registerLanguage('lingben_bash', (hljs) => ({
  keywords: {
    keyword: 'if else for while switch case break continue return',
    built_in: 'true false'
  },
  contains: [
    hljs.QUOTE_STRING_MODE,
    hljs.NUMBER_MODE,
  ]
}));
md.use(markdownItHighlightjs,{
  inline: true,
  hljs,
});
md.renderer.rules.fence = function(tokens, idx, options, env, self) {
  var token = tokens[idx];
  var info = token.info.trim().split(/\s+/);
  var langName = info[0];
  var highlightedCode;
  if (langName.toLowerCase().indexOf('lingben_bash')>-1) {
    highlightedCode = md.render(token.content);
    return `<div class="czig-news-block">
      <div class="language-label sticky bg-slate-200 px-3 py-2">零本智协智能查询</div>
      <div class="bg-slate-100 px-3 py-2">${highlightedCode}</div>
    </div>`
  } else if (hljs.getLanguage(langName)) {
    try {
      highlightedCode = hljs.highlight(token.content, { language: langName }).value;
    } catch (err) {
      // highlightedCode = token.content;
      highlightedCode = md.utils.escapeHtml(token.content); // 发生错误时，转义内容
    }
  } else {
    highlightedCode = md.utils.escapeHtml(token.content);
    // return self.renderToken(tokens, idx, options);
  }
  const codeid= getRadomString(10)
  window['czig_code_html'+codeid] = token.content;
  //on绑定事件
  return `<div class="czig-code-block sticky text-base rounded-lg overflow-auto my-2">
    <div class="language-label sticky bg-slate-200 px-3 py-2 flex align-middle justify-between items-center"> 
      <span>${langName}</span>
      <svg id="code_${codeid}" onclick="copyCode('${codeid}')" class="hover:opacity-80 cursor-pointer trasition opacity-100" width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="#0007" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"></path><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="none" stroke="#0007" stroke-width="4" stroke-linejoin="bevel"></path></svg>
    </div>
    <pre class="px-3 bg-slate-100"><code class="hljs bg-slate-100 text-sm ${langName}">${highlightedCode}</code></pre>
  </div>`;
};
md.use(math,{
  engine: Katex,
  delimiters: 'dollars',
  blockClass: 'katex-block',
  inlineClass: 'katex-inline',
  errorClass: 'error',
  katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
});
// const contentRendered = ref([]);
emitter.emit('toggleSidebar')

/* 主要渲染部分结束 */
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
const stopStatus = ref(false)
const useAnalysis = ref(false);
const show_menu = ref(true)
const showStop = ref(false);
const tokensCount = ref(0)
const tokensCount2 = ref(0)
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
const options_analysis = [
  {value: 'line-1', label: '分析 Gemini-002'},
  {value: 'line-2', label: '分析 Doubao-32k'},
  {value: 'line-3', label: '分析 Qwen-8b'},
];
const options_chat = [
  {value: 'line-1', label: '回复 Gemini-1.5-flash-001'},
  {value: 'line-2', label: '回复 Doubao-32k'},
  {value: 'line-3', label: '回复 X AI'},
];
const options_internet = [
  {value: 'AUTO', label: '自动联网'},
  {value: 'DISABLE', label: '禁止联网'},
  {value: 'ENABLE', label: '始终联网'},
];
const analysis_line = ref('line-1')
const chat_line = ref('line-1')
const useInternet = ref('AUTO');
const useFunction = ref(false);

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
function updateInputHeight() {
  const ask = askRef.value;
  if (!ask) return;
  let tmp = ask.style.height+'';
  ask.style.height = '0';
  let newHeight = ask.scrollHeight;
  // console.log(newHeight,tmp)
  if (newHeight > 200) newHeight = parseInt(tmp)
  ask.style.height = newHeight+'px';
}
const throttledUpdateInputHeight = throttle(updateInputHeight, 100);

watch(input, () => {
  throttledUpdateInputHeight();
});
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

const stop = async (param)=>{
  stopStatus.value=true;
  loading.value=false;
}

/* chat */
async function deepMind(targetValue, targetTime, index) {
  if(useAnalysis.value) {
    analysis_line.value = 'line-1';
    await Auth.deepMind_Analysis(createOptions({targetValue,targetTime,index},'','分析'));
    chatList.value[index - 1].analysis += '【尝试回复开始】\n';
    analysis_line.value = 'line-1';
    await Auth.deepMind_Try(createOptions({targetValue,targetTime,index},chatList.value[index - 1].analysis+'你要根据以上分析尝试初步进行回复','尝试回复'));
    chatList.value[index - 1].analysis += '【总结开始】\n';
    await Auth.deepMind_Summary(createOptions({targetValue,targetTime,index},chatList.value[index - 1].analysis+'你要根据以上分析和初步回复（尝试）进行批判性建设性的总结和必要资料的查询以便于最终回复','总结'));
    chatList.value[index - 1].analysis += '\n请开始优化后的最终回复\n';
    await initiateChatWithAI({targetValue,targetTime,index});
  } else {
    await initiateChatWithAI({targetValue,targetTime,index});
  }
}
function createOptions(opt,analysis,endTarget) {
  return {
    sessionID: sessionID.value,
    content: opt.targetValue,
    vf: fingerprint.value,
    analysis: analysis,
    stopStatus,
    line: analysis_line.value,
    onmessage: (source, model) => {
      showStop.value = true;
      const decode = JSON.parse(source);
      let tmp = '';
      switch (model) {
        case 'line-1':
          tmp = decode.candidates[0].content.parts[0].text;
          tokensCount.value = decode.usageMetadata.totalTokenCount;
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
    },
    onclose: async (source) => {
      chatList.value[opt.index - 1].analysis += '\n【'+endTarget+'结束】\n';
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
    analysis: useAnalysis.value ? chatList.value[opt.index - 1].analysis : '',
    stopStatus,
    useAnalysis: useAnalysis.value,
    useFunction: useFunction.value,
    line: chat_line.value,
    time: opt.targetTime,
    onerror: (source, model) => {
      console.log('错误');
      window.clarity('event', 'CHAT-AI-ERROR');
      retryChatWithAI(opt);
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
    analysis: useAnalysis.value ? chatList.value[opt.index - 1].analysis : '',
    stopStatus,
    useAnalysis: useAnalysis.value,
    useFunction: useFunction.value,
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
  chatList.value[opt.index].content += tmp;
  // throttledScrollToBottom();
}


function handleOnClose(error,model,opt) {
  stopStatus.value = false;
  showStop.value = false;
  loading.value = false;
  useFunction.value = false;
  if (!chatList.value[opt.index].content) {
    if (!error) {
      chatList.value[opt.index].content += '[回答已终止].';
    }
  } else {
    if (!error) {
      Auth.chatTaskThread.add(async () => {
        // throttledScrollToBottom();
        await Auth.setAIChatResponse({
          sessionID: sessionID.value,
          content: chatList.value[opt.index].content,
          tokens: tokensCount.value + tokensCount2.value,
        });
      });
      if(model == 'line-1'){
        // animateMode.value = false;
        setTimeout(()=>{
          animateMode.value = false;
          contentRendered.value=[]
        },100)
      }
    }
  }
  // throttledScrollToBottom();
  // scrollToBottom()
  // chatList.value[opt.index - 1].status = 'analysised';
  placeholder.value = '还有什么想聊的';
  askRef.value.focus();
}

const send = async (param)=>{
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
    status:'analysis',
    analysis:"【分析开始】\n",
    sendTime:targetTime,
    formatSendTime
  })
  chatList.value.push({
    role: "assistant",
    content: "",
  })
  const targetValue = input.value
  input.value = '';
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
    useFunction.value=true;
  } else if (useInternet.value=='ENABLE'){
    useFunction.value=true;
  } else if (targetValue.indexOf('联网回答')>-1){
    useFunction.value=true;
  }
  // onChange();
  const index = chatList.value.length - 1;
  await deepMind(targetValue, targetTime, index);
  // await handleChatWithAI_Analysis({ targetValue, targetTime, index });
  // await handleChatWithAI_Analysis({targetValue,targetTime,index});
}





const throttledSend = throttle(send, 100); // 调整 3000 为所需的毫秒数
const throttledScrollToBottom = throttle(scrollToBottom, 100); // 调整 300 为所需的毫秒数
onActivated(async ()=>{
  let id = route.params.id;
  let model = route.query.model
  if(!id || id==='new'){
    const {content} = await Auth.getAISessionID({model})
    id = route.params.id
    if(route.path==='/model/chat/new') {
      router.push('/model/chat/'+content)
      id = content;
    }
  }
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




