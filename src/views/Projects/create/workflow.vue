<template>
  <div class="commonPage bg-white md:rounded-lg" style="height:calc(100vh - 60px);display: flex;flex-direction: column;">
    <div class="scroll">
      <div class="row">
        <div class="col-12 col-xl-8" style="margin-bottom: 0;">
          <div class="panel aichat">
            <el-watermark :font="{color:'rgba(0, 0, 0, .038)'}" :gap="[0,0]" :rotate="-12"
              :content="['零本智协大模型 生成内容仅供参考', sessionID,fingerprint]">
              <div class="chatList" style="min-height: 200px;" id="ai_chatList">
                <template v-for="(item,i) in chatList" class="chatList" >
                  <div class="user" v-if="item.role == 'user'" :data-id="i">
                    <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像">你</el-avatar> -->
                    <div class="chatcontent text-base/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug" v-html="md.render(item.content)"></div>
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
                    <!-- <div class="analysis" v-show="item.status != 'no_analysis'" style="max-width: 60%;">
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
                    </div> -->
                    <!-- </el-watermark> -->
                  </div>
                  <div class="assistant " v-if="item.role == 'assistant'" :data-id="i">
                    <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像" src="/logo_sm.webp" fit="contain">小英</el-avatar> -->
                    <!-- <el-watermark :font="{color:'rgba(0, 0, 0, .05)'}" :gap="[0,-12]" :rotate="-12"
                      :content="['零本智协大模型 零本智协大模型', fingerprint]"> -->
                    
                    <!-- <div class="chatcontent text-base/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug" v-html="md.render(item.content) || `<span class='i-loading'></span>`"></div> -->

                    <div >
                      <div class="text-lg md:text-xl lg:text-2xl">{{ ai_workflow_name }}</div>
                      <div class="mt-1 mb-3 text-base md:text-lg lg:text-xl break-all">{{ ai_workflow_desc }}</div>
                      <el-timeline style="max-width: 600px">
                        <el-timeline-item placement="top" v-for="(item,i) in ai_workflow_list">
                          <div class="normal-color">
                            <div class="font-light text-sm">步骤 {{ item.index }}</div>
                            <div class="py-3 px-3 bg-white border rounded-xl mb-2 last:mb-0" v-for="task in item.task">
                              <div class="font-semibold text-lg md:text-xl">{{ task.name }}</div>
                              <div class="text-base md:text-lg mb-1">{{ task.desc }}</div>
                              <div>{{ task.content }}</div>
                            </div>
                          </div>
                          <div class="flex mt-2 bg-white border rounded-xl w-fit py-2 px-3">
                            <div class="flex items-center "><el-avatar :src="item.user.avatar" :size="40"></el-avatar></div>
                            <div class="flex-1 ml-2">
                              <p class="text-base md:text-lg/tight">{{ item.user.nickname }}</p>
                              <p class="text-xs text-slate-400">用户名：{{ item.user.username }}</p>
                            </div>
                          </div>
                        </el-timeline-item>
                      </el-timeline>
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
                      <el-button 
                        v-show="item.content"
                        @click="set()" 
                        :loading="loading"
                        type="primary"
                        color="rgba(144, 77, 245,1)"
                      >
                        加入到项目
                      </el-button>
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
            <div class="max-w-md w-full">
              <p class="items-center flex justify-end mt-1 mb-1 h-6">
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
              <el-button @click="stop()" v-show="loading && showStop" type="primary"
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
// import markdownItHighlightjs from 'markdown-it-highlightjs'
import { onActivated, onMounted, ref,reactive, watch } from "vue"
import Auth from "../../../utils/auth";
import { throttle } from '../../../utils/helpers'
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark,ElSkeleton,ElTooltip,ElTimeline,ElTimelineItem} from "element-plus"; 
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { Down,Up,Copy,DocDetail,PauseOne } from '@icon-park/vue-next';
const md = new markdownIt()
// md.use(markdownItHighlightjs)
const route = useRoute()
const router = useRouter()
const chatList = ref([]);
const input = ref("");
const askRef = ref();
const placeholder = ref("来和我聊天吧，你可以试着说 你好👋");
const loading = ref(true);
const ainput = ref()
const fingerprint = ref("")
const sessionID = ref()
const stopStatus = ref(false)
const show_menu = ref(false)
const showStop = ref(false);
const projectId = ref()
const ai_workflow_list = ref([])
const ai_workflow_name = ref('')
const ai_workflow_desc = ref('')


const chat_line = ref('line-1')
const onFocus = () => {
  throttledScrollToBottom();
}
function copyText(text){
  Auth.copyText(text,()=>{
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
async function set(){
  loading.value=true;
  const res = await Auth.createProjectItem({
    type:"workflow",
    projectId:projectId.value,
    name:ai_workflow_name.value,
    desc:ai_workflow_desc.value,
    members:ai_workflow_list.value.members,
    workflows:ai_workflow_list.value
  })
  if(res.status == 'sus'){
    ElMessage.success('创建成功')
    router.push('/projects/detail/'+projectId.value+'')
    // routerBack.back()
  } else {
    ElMessage.error('创建失败')
  }
  loading.value=false;
}
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
  window.clarity("identify", fingerprint.value, null, "TEST-AI", null)
  setTimeout(()=>{
    throttledScrollToBottom();
  },100)
  // onChange();
  const index = chatList.value.length - 1;
  await Auth.AI_createWorkflow({
    projectId:projectId.value,
    content:targetValue,
    vf:fingerprint.value,
    line:chat_line.value,
    onmessage:async (source,model) => {
      showStop.value=true;
      let tmp='';
          // tmp=decode.response;
      const decode = JSON.parse(source);
      // console.log(decode)
      // chatList.value[index-1].analysis+=tmp;
      const res = JSON.parse(decode.candidates[0].content.parts[0].text);
      ai_workflow_name.value = res.name;
      ai_workflow_desc.value = res.desc;
      ai_workflow_list.value = res.workflows;
      let members = [];
      ai_workflow_list.value = await Promise.all(res.workflows.map(async(e)=>{
        members.push(e.user.id)
        e.user = await Auth.getUserInfoByID(e.user)
        return e;
      }))
      ai_workflow_list.value.members = members;
          // break;
        // case 'line-2':
        //   tmp=decode.choices[0].delta?.content;
        //   break;
        // case 'line-3':
        //   tmp=decode.response;
        //   break;
      
      chatList.value[index-1].analysis+=tmp;
      throttledScrollToBottom()
    },
    onclose:async (source) => {
      throttledScrollToBottom()
      loading.value=false;
      stopStatus.value=false;
      showStop.value=false;
      placeholder.value = "还有什么想聊的";
      chatList.value[index].content+='[回答已终止]';
    },
  })
  
}
const throttledSend = throttle(send, 100); // 调整 3000 为所需的毫秒数
const throttledScrollToBottom = throttle(scrollToBottom, 800); // 调整 300 为所需的毫秒数
onActivated(async ()=>{
  // let id = route.params.id;
  // let model = route.query.model
  // if(!id || id=='new'){
  //   const {content} = await Auth.getAISessionID({model})
  //   id = route.params.id
  //   if(route.path=='/model/chat/new') {
  //     router.push('/model/chat/'+content)
  //     id = content;
  //   }
  // }
  // } else {
    // sessionID.value = id
    // onChange()
    // await Auth.init()
    projectId.value = route.params.projectId;
    fingerprint.value = await Auth.getUserFingerprint();
    // const welcomeOnline = (await Auth.getAIWelcome({sessionID:id}))
    // console.log(welcomeOnline)
    // welcome.value = welcomeOnline.content;
    // model_info.value = {
    //   ...model_info.value,
    //   name:welcomeOnline.model.name,
    //   desc:welcomeOnline.model.desc,
    //   createuser:welcomeOnline.model.createuser,
    // };
    // await Promise.all([async ()=>{
    //   // console.log(1)
    //   console.log(model_info.value)
    //   model_info.value.createUser = (await Auth.getUserInfoByID({id:model_info.value.createuser}));
    //   return 0;
    // },async ()=>{
    //   chatList.value = (await Auth.getAIChatList({sessionID:id})).content.map(e=>{
    //     e.status = e.analysis?'analysised':'no_analysis';
    //     return e
    //   });
    // }].map(async(e)=>{
    //   return e()
    // }))
    
    // welcome_loading.value = false;
    loading.value = false;
    askRef.value.focus()
  // }
})
</script>