<template>
 <div class="commonPage">
  <routerBack name="项目列表" back="/projects/list"></routerBack>
  <div class="panel" style="padding-top: 12px;">
    <div class="_content">
      <el-skeleton v-show="loading" :rows="8" animated></el-skeleton>
      <el-tabs v-show="!loading">
        <el-tab-pane label="基本信息">
          <div class="infoList">
            <div class="text-xs mb-1 text-slate-400">项目名称</div>
            <div class="text-2xl/tight font-semibold mb-2">{{ projectDetail.name }}</div>
            <div class="text-xs mb-1 text-slate-400">项目描述</div>
            <div class="text-lg/tight break-all mb-2">{{ projectDetail.desc }}</div>
            <ul>
              <li class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,i) in projectDetail.teams">
                <div class="flex-1 shrink break-all">
                  <div class="text-md">{{ item.name }}</div>
                  <div class="text-xs text-slate-400">ID:{{ item.id }}</div>
                  <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
                <div class="text-xs text-slate-600 px-1 py-1 text-right shrink-0">
                  <div class="mt-2">
                    <el-avatar :size="20" v-for="(e) in item.persons" :src="e.avatar"></el-avatar>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <el-badge value="特色功能" class="item" :offset="[0, -2]" type="primary">
              <span>工作流</span>
            </el-badge>
          </template>
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
        </el-tab-pane>
        <el-tab-pane >
          <template #label>
            <span class="ml-4 mr-4">任务</span>
          </template>
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
        </el-tab-pane>
        <el-tab-pane label="问题">
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
        </el-tab-pane>
        <el-tab-pane label="讨论">
          <div>
            <view-discussion></view-discussion>
          </div>
          <div class="mt-3 text-center">
            <p><el-button @click="toCreate('discussion')" type="primary">
              去创建<el-icon class="el-icon--right"><Right /></el-icon>
            </el-button></p>
          </div>
        </el-tab-pane>
      </el-tabs>
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