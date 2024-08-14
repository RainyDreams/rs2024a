<template>
  <div class="row mb-3 min-h-48">
    <div class="col-12 " v-for="(item,index) in workflowList" :key="index">
      <div class="workflowCard prcard">
        <div v-show="!loading" class="text-lg md:text-xl lg:text-2xl">{{ item.name }}</div>
        <div v-show="!loading" class="mt-1 mb-3 text-base md:text-lg lg:text-xl break-all">{{ item.desc }}</div>
        <el-timeline v-show="!loading" style="max-width: 600px">
          <el-timeline-item placement="top" v-for="(e,i) in item.workflows">
            <div class="normal-color">
              <div class="font-light text-sm">步骤 {{ e.index+1 }}</div>
              <div class="py-3 px-3 bg-white border rounded-xl mb-2 last:mb-0" v-for="task in e.task">
                <div class="font-semibold text-lg md:text-xl">{{ task.name }}</div>
                <div class="text-base md:text-lg mb-1">{{ task.desc }}</div>
                <div>{{ task.content }}</div>
              </div>
            </div>
            <div class="flex mt-2 bg-white border rounded-xl w-fit py-2 px-3">
              <div class="flex items-center "><el-avatar :src="e.user.avatar" :size="40"></el-avatar></div>
              <div class="flex-1 ml-2">
                <p class="text-base md:text-lg/tight">{{ e.user.nickname }}</p>
                <p class="text-xs text-slate-400">用户名：{{ e.user.username }}</p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated,onMounted,ref } from 'vue';
import Auth from '../../../utils/auth';
import { useRoute } from 'vue-router';
import {ElTimeline,ElTimelineItem} from 'element-plus'
import { getRole } from '../../../utils/helpers';
const route = useRoute();
const projectId = ref();
const workflowList = ref([]);
const loading = ref(true);
onMounted(async ()=>{
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectItem({
    type:'workflow',projectId:projectId.value
  })
  workflowList.value=res.content;
  loading.value=false;
})

</script>