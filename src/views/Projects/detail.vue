<template>
 <div class="commonPage">
  <routerBack name="项目列表" back="/projects/list"></routerBack>
  <div class="panel" style="padding-top: 12px;">
    <div class="_content">
      <el-skeleton v-show="loading" :rows="8" animated></el-skeleton>
      <div class="flex gap-2 pb-2 mb-3 flex-wrap pt-2 border-b border-slate-100">
        <div 
          :class="`tab-item px-4 py-2 hover:bg-slate-50 normal-color rounded-md cursor-pointer relative ${panel==0?'primary-text active':''}`"
          @click="panel = 0"  
        >
          基本信息
        </div>
        <div 
          :class="`tab-item px-4 py-2 hover:bg-slate-50 normal-color rounded-md cursor-pointer relative ${panel==1?'primary-text active':''}`"
          @click="panel = 1"  
        >
          工作流
        </div>
        <div 
          :class="`tab-item px-4 py-2 hover:bg-slate-50 normal-color rounded-md cursor-pointer relative ${panel==2?'primary-text active':''}`"
          @click="panel = 2"  
        >
          任务
        </div>
        <div 
          :class="`tab-item px-4 py-2 hover:bg-slate-50 normal-color rounded-md cursor-pointer relative ${panel==3?'primary-text active':''}`"
          @click="panel = 3"  
        >
          问题
        </div>
        <div 
          :class="`tab-item px-4 py-2 hover:bg-slate-50 normal-color rounded-md cursor-pointer relative ${panel==4?'primary-text active':''}`"
          @click="panel = 4"  
        >
          讨论
        </div>
      </div>
      <div v-show="!loading">
        <div v-show="panel == 0">
          <div class="infoList">
            <div class="text-xs mb-1 text-slate-400">项目名称</div>
            <div class="text-2xl/tight font-semibold mb-2">{{ projectDetail.name }}</div>
            <div class="text-xs mb-1 text-slate-400">项目描述</div>
            <div class="text-lg/tight break-all mb-2">{{ projectDetail.desc }}</div>
            <ul>
              <router-link :to="`/team/detail/${item.id}`" class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,i) in projectDetail.teams">
                <div class="flex-1 shrink break-all">
                  <div class="text-md">{{ item.name }}</div>
                  <div class="text-xs text-slate-400">ID:{{ item.id }}</div>
                  <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
                <div class="text-xs text-slate-600 px-1 py-1 text-right shrink-0">
                  <div class="mt-2 flex flex-wrap max-w-10 sm:max-w-16 md:max-w-20">
                    <el-avatar class="shrink-0 mr-1 mb-1" :size="20" v-for="(e) in item.persons.slice(0,6)" :src="e.avatar"></el-avatar>
                    <span v-if="item.persons.length>6">...</span>
                  </div>
                </div>
              </router-link>
            </ul>
          </div>
        </div>
        <div v-show="panel == 1">
          <!-- <template #label>
            <el-badge value="特色功能" class="item" :offset="[0, -2]" type="primary">
              <span>工作流</span>
            </el-badge>
          </template> -->
          <div v-if="projectDetail.workflow.length>0">
            <view-workflow></view-workflow>
          </div>
          <div v-else>
            <el-empty :image-size="150" >
              <template #description>
                <p>还未创建</p>
              </template>
            </el-empty>
          </div>
          <div class="mt-3 text-center">
            <p><el-button @click="toCreate('workflow')" type="primary">
              去创建<el-icon class="el-icon--right"><Right /></el-icon>
            </el-button></p>
          </div>
        </div>
        <div v-show="panel == 2">
          <!-- <template #label>
            <span class="ml-4 mr-4">任务</span>
          </template> -->
          <div v-if="projectDetail.task.length>0">
            <view-task></view-task>
          </div>
          <div v-else>
            <el-empty :image-size="150" >
              <template #description>
                <p>还未创建</p>
              </template>
            </el-empty>
          </div>
          <div class="mt-3 text-center">
            <p><el-button @click="toCreate('task')" type="primary">
              去创建<el-icon class="el-icon--right"><Right /></el-icon>
            </el-button></p>
          </div>
        </div>
        <div v-show="panel == 3">
          <div v-if="projectDetail.issue.length>0">
            <view-issue></view-issue>
          </div>
          <div v-else>
            <el-empty :image-size="150" >
              <template #description>
                <p>还未创建</p>
              </template>
            </el-empty>
          </div>
          <div class="mt-3 text-center">
            <p><el-button @click="toCreate('issue')" type="warning">
              去创建<el-icon class="el-icon--right"><Right /></el-icon>
            </el-button></p>
          </div>
        </div>
        <div v-show="panel == 4 ">
          <div>
            <view-discussion></view-discussion>
          </div>
          <div class="mt-3 text-center">
            <p><el-button @click="toCreate('discussion')" type="primary">
              去创建<el-icon class="el-icon--right"><Right /></el-icon>
            </el-button></p>
          </div>
        </div>
      </div>
    </div>
  </div>
 </div>
</template>
<script setup>
import ViewWorkflow from './view/workflow.vue'
import ViewTask from './view/task.vue'
import ViewIssue from './view/issue.vue'
import ViewDiscussion from './view/discussion.vue';
import { ElTabs,ElTabPane,ElEmpty,ElIcon,ElButton,ElBadge,ElSkeleton,ElAvatar } from 'element-plus';
import { Right } from '@icon-park/vue-next';
import Auth from '../../utils/auth';
import { onActivated,ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import routerBack from '../../components/routerBack.vue';
const route = useRoute();
const loading = ref(true)
const router = useRouter();
const projectId = ref(route.params.projectId);
const panel = ref(0)
const projectDetail = ref({
  name:'',
  desc:'',
  workflow:[],
  task:[], 
  discussion:[], 
  issue:[]
});
function toCreate(type){
  router.push(`/projects/detail-create/${type}/${projectId.value}`)
}
onActivated(async ()=>{
  loading.value = true;
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectDetail({id:projectId.value})
  if(res.status == 'sus'){
    projectDetail.value = res.content;
  }
  loading.value = false;
})
</script>

<style scoped>
.tab-item::after{
  content: "";
  position: absolute;
  display: block;
  /* bottom: 3px; */
  /* z-index: -1; */
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-image: linear-gradient(105deg, rgba(34, 99, 251, 0.0823529412) 20%, rgba(128, 31, 255, 0.0823529412) 88.8%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.1s ease-in-out;
}
.tab-item.active::after{
  opacity: 1;
  visibility: visible;
}
</style>