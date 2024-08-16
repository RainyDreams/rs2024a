<template>
  <div class="mb-3 min-h-48">
    <div class="border-t border-x last:border-y py-4 px-5" v-for="(item,index) in workflowList">
      <div>
        <el-tag :type="{in_progress:'primary'}[item.tag]">{{ {in_progress:'进行中'}[item.tag] }}</el-tag>
      </div>
      <h4 class="mt-2 font-semibold text-xl/normal">{{ item.name }}</h4>
      <p class="text-slate-600">{{ item.desc }}</p>
      <p class="text-sm text-slate-500">创建时间：{{ item.formatCreateTime }}</p>
      <p class="mt-2"><router-link :to="`/projects/workflow/${item.id}`"><el-button>查看详情</el-button></router-link></p>
    </div>
  </div>
</template>

<script setup>
import { onActivated,onMounted,ref } from 'vue';
import Auth from '../../../utils/auth';
import { useRoute } from 'vue-router';
import {dayjs, ElButton,ElTag} from 'element-plus'
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
  workflowList.value=res.content.map((e)=>{
    e.formatCreateTime = dayjs(e.createtime).format('YYYY年M月DD日 HH:mm:ss')
    return e;
  });
  loading.value=false;
})

</script>