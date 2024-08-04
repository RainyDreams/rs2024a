<template>
  <div class="commonPage">
    <routerBack name="项目详情页" :back="`/projects/detail/${projectId}`"></routerBack>
    <div class="panel">
      <div class="_header">
        <div class="icon"><file-addition theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
        <div class="title">创建{{ type }}</div>
      </div>
      <div class="_content">
        <discussion v-if="createType=='discussion'" />
        <workflow v-else-if="createType=='workflow'" />
        <issue v-else-if="createType=='issue'" />
        <taasks v-else-if="createType=='tasks'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import discussion from "./create/discussion.vue";
import workflow from "./create/workflow.vue";
import issue from "./create/issue.vue";
import taasks from "./create/tasks.vue";
import { ref,onMounted,reactive, onActivated, nextTick } from 'vue'
import { FileAddition, Refresh } from '@icon-park/vue-next'; 
import routerBack from '../../components/routerBack.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = ref('');
const createType = ref('');
const type = ref('');
function Update(){
  console.log(route)
  createType.value = route.params.type;
  projectId.value = route.params.projectId;
  type.value = {
    workflow:'工作流',
    tasks:'任务', 
    discussion:'讨论', 
    issue:'问题'
  }[createType.value] || '参数错误'
}
onActivated(()=>{
  Update()
})
</script>

