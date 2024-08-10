<template>
  <div class="row">
    <div class="col-12 col-md-6 col-xl-4" v-for="(item,index) in taskList" :key="index">
      <div class="rounded border px-4 py-3">
        <div class="flex">
          <div class="flex items-center px-2 mr-2">
            <el-button></el-button>
          </div>
          <div class="flex-1">
            <div class="">
              <el-tag v-if="item.isMine" size="small">我的任务</el-tag>
              <el-tag class="ml-2" v-if="item.tag == 'active'" size="small" type="success">正在进行</el-tag>
            </div>
            <h4 class="text-lg/normal font-semibold mt-1">{{ item.name }}</h4>
            <p class="text-sm text-slate-500">{{ item.desc }}</p>
            <p class="text-sm text-slate-500">开始时间：{{ item.formatStartTime }}</p>
            <p class="text-sm text-slate-500">结束时间：{{ item.formatEndTime }}</p>
          </div>
          <div>
            <el-tooltip :content="member.nickname" v-for="member in item.members">
              <el-avatar :src="member.avatar"></el-avatar>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated,onMounted,ref } from 'vue';
import { ElTag,ElButton, dayjs,ElAvatar,ElTooltip } from 'element-plus';
import Auth from '../../../utils/auth';
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = ref();
const taskList = ref([]);
onMounted(async ()=>{
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectItem({
    type:'task',projectId:projectId.value
  })
  taskList.value=res.content.map((e)=>{
    return {
      ...e,
      formatStartTime:dayjs(e.startTime).format('YYYY年MM月DD日 HH:mm:ss'),
      formatEndTime:dayjs(e.endTime).format('YYYY年MM月DD日 HH:mm:ss'),
    }
  });
})

</script>