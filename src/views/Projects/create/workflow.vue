<template>
  <div class="commonPage" style="height:calc(100dvh - 60px);display: flex;flex-direction: column;">  
    <routerBack name="项目详情页" :back="`/projects/detail/${projectId}`"></routerBack>
    <div class="scroll">
      <div class="row" >
        <div class="col-12 col-xl-8">
          <div class="px-3 pt-5 pb-3">
            <div v-show="!!loading" class="py-8 px-3">
              <el-progress
                :percentage="100"
                :show-text="false"
                :indeterminate="true"
                :duration="2"
                :color="[{ color: '#904df5', percentage: 100 }]"
              />
              <p class="text-sm text-slate-400 mt-3">正在进行分析，预计需要1-3分钟，请等待</p>
            </div>
            <div v-show="!loading" class="text-lg md:text-xl lg:text-2xl">{{ ai_workflow_name }}</div>
            <div v-show="!loading" class="mt-1 mb-3 text-base md:text-lg lg:text-xl break-all">{{ ai_workflow_desc }}</div>
            <el-timeline v-show="!loading" style="max-width: 600px">
              <el-timeline-item placement="top" v-for="(item,i) in ai_workflow_list">
                <div class="normal-color">
                  <div class="font-light text-sm">步骤 {{ item.index}}</div>
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
              v-show="mode == 'input'"
              :maxlength="1000"
              @focus="onFocus"
              @keyup="onChange"
              @change="onChange"
              :disabled="loading"
              :placeholder="placeholder"
              @keydown.enter="handleEnter"
            ></el-input>
            <div class="_number">
              <!-- <span v-show="mode == 'input'">{{ now }} / 1000</span> -->
              <el-button 
                v-show="mode == 'input'"
                @click="send()" 
                :loading="loading"
                style="margin-top: 16px;"
                type="primary"
                color="rgba(144, 77, 245,1)"
              >
                智能规划
              </el-button>
              <el-button 
                v-show="mode == 'set'"
                @click="reset()" 
                :loading="loading"
                style="margin-top: 16px;"
              >
                重新规划
              </el-button>
              <el-button 
                v-show="mode == 'set'"
                @click="set()" 
                :loading="loading"
                style="margin-top: 16px;"
                type="primary"
                color="rgba(144, 77, 245,1)"
              >
                加入到项目
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import routerBack from '../../../components/routerBack.vue';
import { onActivated, onMounted,ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import Auth from '../../../utils/auth';
import { throttle } from '../../../utils/helpers'
import { ElInput,ElButton, ElMessage,ElAvatar,ElProgress,ElTimeline,ElTimelineItem } from 'element-plus';
const input = ref('')
const route = useRoute()
const router = useRouter()
const projectId = ref()
const mode = ref('input')
const ai_workflow_list = ref([])
const ai_workflow_name = ref('')
const ai_workflow_desc = ref('')
const askRef = ref();
const placeholder = ref("来吧👋说出你的需求，我们替你规划");
const loading = ref(true);
const ainput = ref()
const now = ref(0)
const onFocus = () => {
  throttledScrollToBottom();
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
function reset(){
  input.value = ''
  ai_workflow_list.value = []
  ai_workflow_name.value=''
  ai_workflow_desc.value=''
  mode.value='input'
}
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
async function send(){
  loading.value = true;
  if(input.value.trim() == ''){
    ElMessage.warning('需求不能为空');
    loading.value = false
    return;
  }
  await Auth.AI_createWorkflow({
    projectId:projectId.value,
    content:input.value,
    onmessage:async (source,model) => {
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
      console.log(ai_workflow_list.value)
    },
    onclose:()=>{

    }
  })
  // ai_workflow_name.value = res.content.name
  // ai_workflow_desc.value = res.content.desc
  let members = [];
  // ai_workflow_list.value = res.content.workflows.map((e)=>{
  //   members.push(e.user.id)
  //   e.user = {
  //     ...e.user,
  //     avatar:"",
  //     username:"",
  //     nickname:""
  //   }
  //   return e;
  // });
  loading.value = false;
  // ai_workflow_list.value = await Promise.all(res.content.workflows.map(async(e)=>{
  //   e.user = await Auth.getUserInfoByID(e.user)
  //   return e;
  // }))
  // ai_workflow_list.value.members = members;
  
  mode.value = 'set'
}
const throttledSend = throttle(send, 100); // 调整 3000 为所需的毫秒数
const throttledScrollToBottom = throttle(scrollToBottom, 800); // 调整 300 为所需的毫秒数
onActivated(async ()=>{
  onChange()
  projectId.value = route.params.projectId;
  loading.value = false;
  askRef.value.focus()
})
</script>