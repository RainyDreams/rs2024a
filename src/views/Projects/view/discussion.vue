<template>
  <div class="row">
    <div v-if="discussionList.length == 0">
      <el-empty :image-size="150" >
        <template #description>
          <p>还未创建</p>
        </template>
      </el-empty>
    </div>
    <div class="col-12 col-md-6" v-for="(item,index) in discussionList" :key="index">
      <div class="border py-4 px-3">
        <div>
          <el-tag :type="{active:'success'}[item.tag]">{{ {active:'开启'}[item.tag] }}</el-tag>
          <el-tag class="ml-2" v-for="tag in item.tags">{{ tag }}</el-tag>
        </div>
        <h4 class="mt-2 font-semibold text-xl/normal">{{ item.name }}</h4>
        <p class="text-slate-600">{{ item.desc }}</p>
        <p class="text-sm text-slate-500">讨论创建时间：{{ item.formatCreateTime }}</p>
        <p class="mt-2"><router-link :to="`/projects/discussion/${item.id}`"><el-button>参与讨论</el-button></router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated,onMounted,ref } from 'vue';
import Auth from '../../../utils/auth';
import { useRoute } from 'vue-router';
import { ElTag,dayjs,ElButton,ElEmpty } from 'element-plus';
import { getRole } from '../../../utils/helpers';
const route = useRoute();
const projectId = ref();
const discussionList = ref([]);
onMounted(async ()=>{
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectItem({
    type:'discussion',projectId:projectId.value
  })
  discussionList.value=res.content.map((e)=>{
    return {
      ...e,
      formatCreateTime:dayjs(e.createTime).format('YYYY年M月DD日 HH:mm:ss'),
    }
  });
})

</script>