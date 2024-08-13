<template>
  <div class="commonPage" style="height:calc(100dvh - 60px);display: flex;flex-direction: column;">  
    <routerBack name="项目详情页" :back="`/projects/detail/${projectId}`"></routerBack>
    <div class="scroll">
      <div class="row" >
        <div class="col-12 col-xl-8">
          <div>
            <div>{{ ai_workflow_name }}</div>
            <div>{{ ai_workflow_desc }}</div>
            <el-timeline style="max-width: 600px">
              <el-timeline-item placement="top" v-for="(item,i) in ai_workflow_list">
                <div>
                  <div>{{ item.index }}</div>
                  <div>
                    <div v-for="task in item.task">
                      <div>{{ task.name }}</div>
                      <div>{{ task.desc }}</div>
                      <div>{{ task.content }}</div>
                    </div>
                  </div>
                </div>
                <div>
                  {{ item.user.id }}
                  <!-- <div><el-avatar :src=""></el-avatar></div> -->
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
                智能规划
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
import { useRoute } from 'vue-router';
import Auth from '../../../utils/auth';
import { throttle } from '../../../utils/helpers'
import { ElInput,ElButton, ElMessage,ElAvatar,ElProgress,ElTimeline,ElTimelineItem } from 'element-plus';
const input = ref('')
const route = useRoute()
const projectId = ref()
const ai_workflow_list = ref([{
  index:1,
  task:[
    {
      name:'',
      desc:'',
      content:''
    }
  ],
  user:{
    id:'',
    avatar:''
  }
}])
const ai_workflow_name = ref('')
const ai_workflow_desc = ref('')
const askRef = ref();
const placeholder = ref("来吧👋说出你的需求，我们替您规划");
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

async function send(){
  loading.value = true;
  if(input.value.trim() == ''){
    ElMessage.warning('需求不能为空');
    return;
  }
  const res = await Auth.AI_createWorkflow({
    projectId:projectId.value,
    content:input.value
  })
  ai_workflow_name.value = res.content.name
  ai_workflow_desc.value = res.content.desc
  ai_workflow_list.value = res.content.workflows;
  loading.value = false;

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