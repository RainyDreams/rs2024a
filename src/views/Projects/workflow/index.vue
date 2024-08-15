<template>
  <div class="commonPage">
    <routerBack name="项目详情" back="/projects/list"></routerBack>
    <div class="panel">
      <div v-show="!!loading" class="py-8 px-3">
        <el-progress
          :percentage="100"
          :show-text="false"
          :indeterminate="true"
          :duration="2"
          :color="[{ color: '#904df5', percentage: 100 }]"
        />
        <p class="text-sm text-slate-400 mt-3">正在加载，请等待</p>
      </div>
      <div v-if="!loading" style="max-width: 600px">
        <div class="text-lg md:text-xl lg:text-2xl">{{ wk.name }}</div>
        <div class="mt-1 mb-3 text-base/loose lg:text-lg/loose break-all">{{ wk.desc }}</div>
        <p class="text-xs text-slate-400">创建人</p>
        <div class="flex mt-2 bg-white border rounded-xl w-fit py-2 px-3 mb-3">
          <div class="flex items-center "><el-avatar :src="wk.createUserInfo.avatar" :size="40"></el-avatar></div>
          <div class="flex-1 ml-2">
            <p class="text-base md:text-lg/tight">{{ wk.createUserInfo.nickname }}</p>
            <p class="text-xs text-slate-400">用户名：{{ wk.createUserInfo.username }}</p>
          </div>
        </div>
        <div v-if="wk.createuser == user" class="mb-3">
          <el-button type="danger" plain @click="remove">删除工作流</el-button>
        </div>
        <p class="text-xs text-slate-400">创建时间</p>
        <div class="text-base md:text-lg/tight">{{ wk.formatCreateTime }}</div>
        <el-timeline class="mt-5">
          <el-timeline-item placement="top" v-for="(e,i) in wk.workflows">
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
import routerBack from '../../../components/routerBack.vue'
import { onActivated, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Auth from '../../../utils/auth';
import dayjs from 'dayjs';
import { ElTimeline,ElTimelineItem,ElProgress,ElAvatar,ElButton, ElMessage, ElMessageBox } from 'element-plus';
const route = useRoute();
const router = useRouter()
const loading = ref(true);
const wk = ref({
  createUserInfo:{

  }
})
const wk_id = ref(route.params.id)
const user = ref()
const remove = async () => {
  ElMessageBox.alert('确定删除该工作流？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showCancelButton: true,
    showClose: false,
    type: 'warning',
    callback: async (action) => {
      if (action == 'confirm') {
        const res = await Auth.removeProjectItem({
          type:'workflow',
          id:wk_id.value
        })
        if(res.status == 'sus'){
          ElMessage.success('删除成功')
          router.back()
        }
      }
    }
  })
}
onActivated(async ()=>{
  user.value = (await Auth.getUser()).id
  wk_id.value = route.params.id
  const res = await Auth.getProjectItemByID({
    type:'workflow',
    id:wk_id.value
  })
  wk.value={
    ...res.content,
    createUserInfo:await Auth.getUserInfoByID({id:res.content.createuser}),
    formatCreateTime:dayjs(res.content.createtime).format('YYYY年M月DD日 HH:mm:ss')
  };
  loading.value=false;
})
</script>