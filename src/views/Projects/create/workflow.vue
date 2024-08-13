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
    loading.value = false
    return;
  }
  // const res = await Auth.AI_createWorkflow({
  //   projectId:projectId.value,
  //   content:input.value
  // })
  const res = {
    "status": "sus",
    "content": {
        "name": "产品开发工作流优化方案",
        "desc": "针对'你好啊'项目，特别是测试团队，本方案旨在创建一个高效、协同的产品开发工作流，确保每个环节都有明确的责任人与任务内容，同时解决用户提出的索引命名空字符串问题。",
        "workflows": [
            {
                "user": {
                    "id": "r1rls8j00ttk8qjcqv9j4e2cacwfcv",
                    "role": "owner",
                    "team": "k2wf8rjon3i1j9uunjooj8j7vfl3b1"
                },
                "task": [
                    {
                        "id": "task001",
                        "name": "需求分析",
                        "desc": "收集并分析项目需求，确定产品功能与性能指标。",
                        "content": "组织全体成员会议，明确产品定位与目标用户群。"
                    }
                ],
                "index": 1
            },
            {
                "user": {
                    "id": "a1ocmctvvsvfat9vmhb8ou4sa2bv9o",
                    "role": "member",
                    "team": "k2wf8rjon3i1j9uunjooj8j7vfl3b1"
                },
                "task": [
                    {
                        "id": "task002",
                        "name": "原型设计",
                        "desc": "根据需求分析结果，设计产品界面原型。",
                        "content": "使用Sketch或Figma完成初步设计稿，准备设计评审会议。"
                    }
                ],
                "index": 2
            },
            {
                "user": {
                    "id": "t8ur0fac7kn6nve75nezfkw1r1mmor",
                    "role": "member",
                    "team": "k2wf8rjon3i1j9uunjooj8j7vfl3b1"
                },
                "task": [
                    {
                        "id": "task003",
                        "name": "前端开发",
                        "desc": "依据设计原型，进行前端页面编码实现。",
                        "content": "使用React框架开发交互式页面，确保与设计稿一致。"
                    }
                ],
                "index": 3
            },
            {
                "user": {
                    "id": "6este3fvttvh006dbrtvc08z9cc4cb",
                    "role": "member",
                    "team": "k2wf8rjon3i1j9uunjooj8j7vfl3b1"
                },
                "task": [
                    {
                        "id": "task004",
                        "name": "后端开发",
                        "desc": "构建后端服务，支持前端功能实现。",
                        "content": "使用Node.js与Express搭建服务器，实现数据接口。"
                    }
                ],
                "index": 4
            },
            {
                "user": {
                    "id": "r1rls8j00ttk8qjcqv9j4e2cacwfcv",
                    "role": "owner",
                    "team": "k2wf8rjon3i1j9uunjooj8j7vfl3b1"
                },
                "task": [
                    {
                        "id": "task005",
                        "name": "集成测试",
                        "desc": "完成前后端集成，进行全面功能与性能测试。",
                        "content": "组织团队进行系统测试，记录并修复发现的问题。"
                    }
                ],
                "index": 5
            }
        ]
    },
    "workflow_Promt": [
        {
            "role": "system",
            "content": "\n\t你现在是一个函数机器，用户输入需求，你完整的回复内容\n\t现在请你回答用户的需求，并给出一个符合用户需求的解决方案，请使用以下JSON格式输出，但是不要回复代码块，直接回复纯文本。现在这是一个例子：\n\t项目信息参考：{\"id\":\"5r7i5htmbrnr6t83umfj7uv5wa5r48\",\"teams\":[{\"id\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\",\"persons\":[{\"role\":\"owner\",\"id\":\"r1rls8j00ttk8qjcqv9j4e2cacwfcv\",\"team\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\"},{\"role\":\"member\",\"id\":\"a1ocmctvvsvfat9vmhb8ou4sa2bv9o\",\"team\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\"},{\"role\":\"member\",\"id\":\"t8ur0fac7kn6nve75nezfkw1r1mmor\",\"team\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\"},{\"role\":\"member\",\"id\":\"6este3fvttvh006dbrtvc08z9cc4cb\",\"team\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\"}],\"name\":\"测试团队\",\"desc\":\"这是一个测试团队，我们的目标是制作一款爆品\"}],\"name\":\"你好啊\",\"desc\":\"你好你好.\"}\n\t以下是一个回复示例，仅供参考有什么KEY和格式，在实际回复中，需要你补全内容，需要符合逻辑和用户需求，忘掉示例的具体内容，仅记住他的格式！\n\t一定要有流程性，连贯性，高效性，协同性。\n\t{\n\t\t\"name\":\"（创新的符合用户需求的名称）\",\n\t\t\"desc\":\"（创新详细的描述）\",\n\t\t\"workflows\":\n\t\t[（步骤）\n\t\t\t{\n\t\t\t\t\"user\":{\n          \"id\": ,\n\t\t\t\t\t\"role\":,\n          \"team\":\n        },\n\t\t\t\t\"task\":[\n\t\t\t\t\t{\n\t\t\t\t\t\t\"id\": （任务的ID）,\n\t\t\t\t\t\t\"name\":\"（任务的名称）\",\n\t\t\t\t\t\t\"desc\":\"（具体的描述）\",\n\t\t\t\t\t\t\"content\":\"（具体的内容）\",\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\t\"id\":（任务的ID）,\n\t\t\t\t\t\t\"name\":\"（任务的名称）\",\n\t\t\t\t\t\t\"desc\":\"（具体的描述）\",\n\t\t\t\t\t\t\"content\":\"（具体的内容）\",\n\t\t\t\t\t}\n\t\t\t\t\t（可以一个步骤多个任务）\n\t\t\t\t],\n\t\t\t\t\"index\":Number（任务的下标，可以与上一个步骤相同，即与上一任务同时进行）\n\t\t\t}\n\t\t]\n\t}\n\t"
        },
        {
            "role": "user",
            "content": "以下是项目信息{\"id\":\"5r7i5htmbrnr6t83umfj7uv5wa5r48\",\"teams\":[{\"id\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\",\"persons\":[{\"role\":\"owner\",\"id\":\"r1rls8j00ttk8qjcqv9j4e2cacwfcv\",\"team\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\"},{\"role\":\"member\",\"id\":\"a1ocmctvvsvfat9vmhb8ou4sa2bv9o\",\"team\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\"},{\"role\":\"member\",\"id\":\"t8ur0fac7kn6nve75nezfkw1r1mmor\",\"team\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\"},{\"role\":\"member\",\"id\":\"6este3fvttvh006dbrtvc08z9cc4cb\",\"team\":\"k2wf8rjon3i1j9uunjooj8j7vfl3b1\"}],\"name\":\"测试团队\",\"desc\":\"这是一个测试团队，我们的目标是制作一款爆品\"}],\"name\":\"你好啊\",\"desc\":\"你好你好.\"}和用户对创建工作流的需求“Index must have a name and cannot be an empty string”，请开始你的回答。一定要完整周全符合逻辑的回答我，不要省略！回复结果不要含有注释，确保JSON格式正确符合规范"
        }
    ]
}
  ai_workflow_name.value = res.content.name
  ai_workflow_desc.value = res.content.desc
  ai_workflow_list.value = res.content.workflows;
  ai_workflow_list.value = Promise.all(res.content.workflows.map(async(e)=>{
    e.user = await Auth.getUserInfoByID(e.user.id)
  }))
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