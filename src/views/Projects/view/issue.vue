<template>
  <div class="row">
    <div class="col-12" v-for="(item,index) in issueList" :key="index">
      <div class="border-y py-4 px-3">
        <div>
          <el-tag :type="{open:'success'}[item.tag]">{{ {open:'开启'}[item.tag] }}</el-tag>
          <el-tag class="ml-2" v-for="tag in item.tags">{{ tag }}</el-tag>
        </div>
        <h4 class="mt-2 font-semibold text-xl/normal">{{ item.name }}</h4>
        <p class="text-slate-600">{{ item.desc }}</p>
        <p class="text-sm text-slate-500">问题出现时间：{{ item.formatStartTime }}</p>
        <p class="text-sm text-slate-500">问题创建时间：{{ item.formatCreateTime }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated,onMounted,ref } from 'vue';
import Auth from '../../../utils/auth';
import { ElTag,dayjs } from 'element-plus';
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = ref();
const issueList = ref([]);
onMounted(async ()=>{
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectItem({
    type:'issue',projectId:projectId.value
  })
  issueList.value=res.content.map((e)=>{
    return {
      ...e,
      formatCreateTime:dayjs(e.createTime).format('YYYY年M月DD日 HH:mm:ss'),
      formatStartTime:dayjs(e.startTime).format('YYYY年M月DD日 HH:mm:ss'),
    }
  });
})

</script>