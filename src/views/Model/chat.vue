<template>
  <div class="commonPage bg-white md:rounded-lg" style="height:calc(100dvh - 60px);display: flex;flex-direction: column;">
    <div class="scroll">
      <div class="row">
        <div class="col-12 col-xl-8" style="margin-bottom: 0;">
          <div class="panel aichat">
            <el-watermark :font="{color:'rgba(0, 0, 0, .008)'}" :gap="[0,0]" :rotate="-12"
              :content="['零本智协大模型 生成内容仅供参考', sessionID,fingerprint]">
              <div class="chatList" style="min-height: 200px;" id="ai_chatList">
                <div class="system">
                  <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像" src="/logo_sm.webp">小英</el-avatar> -->
                  <div class="" style="font-size:14px;width:100%;">
                    <el-skeleton :rows="3" animated v-show="welcome_loading"></el-skeleton>
                    <div v-show="!welcome_loading" class="modelbox p-3 sm:p-4 cursor-pointer rounded-lg h-full border m-2 shadow-none force">
                      <div class="flex items-center h-full">
                        <div class="mr-1 md:mr-2">
                          <img alt="头像" :src="model_info.img" class="mr-1" :size="38" />
                        </div>
                        <div class="flex flex-col justify-between h-full">
                          <div class="text-xl font-bold mb-1">{{ model_info.name }}</div>
                          <div class="text-sm/snug mb-2 flex-1">{{ model_info.desc }}</div>
                          <div class="flex items-center opacity-80 text-xs">
                            <el-avatar alt="头像" :src="model_info.createUser.avatar" class="mr-1" :size="18" />
                            <div class="username">{{ model_info.createUser.nickname }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-show="!welcome_loading" class="text-base/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug" v-html="md.render(welcome)"></div>
                    <p><router-link to="/model/history">聊天历史</router-link></p>
                  </div>
                </div>
                <template v-for="(item,i) in chatList" class="chatList" >
                  <div class="user" v-if="item.role == 'user'" :data-id="i">
                    <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像">你</el-avatar> -->
                    <div class="chatcontent whitespace-pre text-sm/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug max-w-screen-sm bg-slate-100 px-4 md:px-5 py-3" >
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
                          class="p-2 hover:bg-slate-100  transition-all rounded-md cursor-pointer">
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
                    <div class="analysis" v-show="item.status != 'no_analysis'" style="max-width: 60%;">
                      <p v-show="item.status == 'analysis'">正在思考和分析问题...</p>
                      <div 
                        class="_text text-gray-500 text-sm " v-show="item.status != 'analysised'" 
                        v-html="md.render(item.analysis || '')"
                      ></div>
                      <p v-show="item.status == 'analysised' || item.status == 'show_analysis'" @click="item.status = item.status=='show_analysis'?'analysised':'show_analysis'" class="flex items-center cursor-pointer justify-end">
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
                    
                    <div class="chatcontent text-sm/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug" v-html="md.render(item.content) || `<span class='i-loading'></span>`"></div>
                    <div class="flex">
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="复制"
                        placement="top-start"
                      >
                        <div 
                          @click="copyHtml(i)"
                          class="p-2 hover:bg-slate-100  transition-all rounded-md cursor-pointer">
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
                          class="p-2 hover:bg-slate-100  transition-all rounded-md cursor-pointer">
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
      <div class="row">
        <div class="col-12 col-xl-8 mb-1 md:mb-2 lg:mb-3 ">
          <div class="flex flex-col items-end mb-1">
            <div class="max-w-lg w-full">
              <p v-show="show_menu">
                <p class="flex gap-1 justify-end pt-3" >
                  <el-select v-model="useInternet" placeholder="" class="mb-1">
                    <el-option
                      v-for="item in options_internet"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="analysis_line" placeholder="分析线路" class="mb-1">
                    <el-option
                      v-for="item in options_analysis"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="chat_line" placeholder="回答线路" class="mb-1">
                    <el-option
                      v-for="item in options_chat"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </p>
              </p>
              <p class="items-center flex justify-end mt-1 mb-1 h-6">
                <!-- <p v-show="show_menu">
                  
                  
                </p> -->
                <span v-show="show_menu">深入思考<el-switch v-model="useAnalysis" class="ml-1 mr-2" /></span>
                <span @click="show_menu=!show_menu" type="text" style="color:rgba(144, 77, 245,1)" class="cursor-pointer flex items-center text-sm">
                  <span class="">{{show_menu?'隐藏':'更多'}}</span>
                  <Down v-show="show_menu" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                  <Up v-show="!show_menu" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                </span>
              </p>
            </div>
          </div>
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
            <div class="_number">
              <!-- <span>{{ now }} / 1000</span> -->
              <el-button @click="send()" :loading="loading" v-show="!showStop" type="primary"
                color="rgba(144, 77, 245,1)" class="ml-1" >
                发送
              </el-button>
              <el-button @click="stop()" v-show="loading && !welcome_loading && showStop" type="primary"
                color="rgba(144, 77, 245,1)" class="ml-1" >
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
import { throttle,functionCallPlugin } from '../../utils/helpers'
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark,ElSkeleton,ElTooltip,ElSwitch,ElSelect,ElOption, CASCADER_PANEL_INJECTION_KEY, ElMessageBox } from "element-plus"; 
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { Down,Up,Copy,DocDetail,PauseOne } from '@icon-park/vue-next';
const md = new markdownIt({
  typographer: true, // 使用高级的打字排版
  html: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && !markdownIt.utils.isStringEmpty(lang)) {
      return `<pre class="language-${lang}"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    } else {
      return `<pre class="language-text"><code>${md.utils.escapeHtml(str)}</code></pre>`;
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
  return `<div class="czig-code-block sticky text-base rounded-lg overflow-auto my-2">
    <div class="language-label sticky bg-slate-200 px-3 py-2">${langName}</div>
    <pre class="px-3 bg-slate-100"><code class="hljs bg-slate-100 text-sm ${langName}">${highlightedCode}</code></pre>
  </div>`;
};
// md.use(math,{
//   engine: Katex,
//   delimiters: 'dollars',
//   blockClass: 'katex-block',
//   inlineClass: 'katex-inline',
//   errorClass: 'error',
//   katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
// });

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
const show_menu = ref(false)
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
  {value: 'line-3', label: '回复 Qwen-8b'},
];
const options_internet = [
  {value: 'AUTO', label: '自动联网'},
  {value: 'DISABLE', label: '禁止联网'},
  {value: 'ENABLE', label: '始终联网'},
];
const analysis_line = ref('line-2')
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
watch(input, () => {
  // now.value = input.value.length;
  askRef.value.style.height=0;
  if(askRef.value.scrollHeight > askRef.value.clientHeight && askRef.value.scrollHeight < 200){
    askRef.value.style.height = askRef.value.scrollHeight+'px'
  } else if(askRef.value.scrollHeight <= askRef.value.clientHeight && askRef.value.scrollHeight < 200) {
    askRef.value.style.height = askRef.value.scrollHeight+'px'
  } else {
    askRef.value.style.height = '200px'
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
const stop = async (param)=>{
  stopStatus.value=true;
  loading.value=false;
}
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
  setTimeout(()=>{
    // throttledScrollToBottom()
    askRef.value.style.height = 0 + 'px';
  },100)
  // askRef.value.style.height = askRef.value.scrollHeight+'px'
  loading.value = true;
  askRef.value.focus();
  placeholder.value = "正在回复中...";
  window.clarity("identify", fingerprint.value, null, "CHAT-AI", null)
  setTimeout(()=>{
    throttledScrollToBottom();
  },100)
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
  await Auth.chatWithAI_Analysis({
    sessionID:sessionID.value,
    content:targetValue,
    vf:fingerprint.value,
    useAnalysis:useAnalysis.value,
    stopStatus,
    line:analysis_line.value,
    onmessage:(source,model) => {
      showStop.value=true;
      const decode = JSON.parse(source);
      let tmp='';
      switch (model) {
        case 'line-1':
          // tmp=decode.response;
          tmp=decode.candidates[0].content.parts[0].text ;
          tokensCount.value=decode.usageMetadata.totalTokenCount;
          break;
        case 'line-2':
          tmp=decode.choices[0].delta?.content;
          break;
        case 'line-3':
          tmp=decode.response;
          break;
      }
      chatList.value[index-1].analysis+=tmp;
      throttledScrollToBottom()
    },
    onclose:async (source) => {
      throttledScrollToBottom()
      if(stopStatus.value==true){
        // debugger;
        stopStatus.value=false;
        placeholder.value = "还有什么想聊的";
        chatList.value[index-1].status = 'analysised'
        chatList.value[index].content+='[回答已终止]';
      } else {
        await Auth.chatWithAI({
          sessionID:sessionID.value,
          content:targetValue,
          vf:fingerprint.value,
          analysis:useAnalysis.value?chatList.value[index-1].analysis:'',
          stopStatus,
          useAnalysis:useAnalysis.value,
          useFunction:useFunction.value,
          line:chat_line.value,
          onmessage:(source,model) => {
            showStop.value=true;
            let decode = JSON.parse(source);
            let tmp='';
            switch (model) {
              case 'line-1':
                if(!decode.candidates[0].content.parts){
                  break;
                }
                tmp=decode.candidates[0].content.parts[0].text;
                if(tmp){
                  tmp = tmp.replace(/\`\`\`lingben_bash[\s\S]*?\`\`\`/, '')
                  tokensCount2.value=decode.usageMetadata.totalTokenCount;
                } else if(decode.candidates[0].content.parts[0].functionCall){
                  Auth.chatTaskThread.add(async ()=>{
                    await Auth.functionCall(decode.candidates[0].content.parts[0].functionCall,{
                      alert:(obj)=>{
                        ElMessageBox.alert(md.render(obj.content), obj.title||'任务执行结果',{
                          confirmButtonText: '确定',
                          showCancelButton: false,
                          dangerouslyUseHTMLString: true,
                          showClose:false
                        })
                      },
                      renderHtml:(html)=>{
                        chatList.value[index].content+=html
                      }
                    })
                  })
                  tmp = '\n\n';
                }
                break;
              case 'line-2':
                tmp=decode.choices[0].delta?.content;
                break;
              case 'line-3':
                tmp=decode.response;
                break;
            }
            chatList.value[index].content+=tmp;
            throttledScrollToBottom()
          },
          onclose:(source) => {
            stopStatus.value=false;
            showStop.value=false;
            loading.value = false;
            useFunction.value=false;
            if(!chatList.value[index].content){
              chatList.value[index].content+='[回答已终止].';
            } else {
              Auth.chatTaskThread.add(async ()=>{
                throttledScrollToBottom()
                Auth.setAIChatResponse({
                  sessionID:sessionID.value,
                  content:chatList.value[index].content,
                  tokens:tokensCount.value+tokensCount2.value
                })
              })
            }
            
            throttledScrollToBottom()
            chatList.value[index-1].status = 'analysised'
            placeholder.value = "还有什么想聊的";
            askRef.value.focus()
          },
        })
    }
    },
  })
  
}
const throttledSend = throttle(send, 100); // 调整 3000 为所需的毫秒数
const throttledScrollToBottom = throttle(scrollToBottom, 800); // 调整 300 为所需的毫秒数
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
      chatList.value = (await Auth.getAIChatList({sessionID:id})).content.map(e=>{
        e.status = e.analysis?'analysised':'no_analysis';
        return e
      });
    }].map(async(e)=>{
      return e()
    }))
    
    welcome_loading.value = false;
    loading.value = false;
    askRef.value.focus()
  // }
})
</script>