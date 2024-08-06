<template>
 <div class="commonPage">
  <routerBack name="项目列表" back="/projects/list"></routerBack>
  <div class="panel">
    <div class="_content">
      <el-tabs >
        <el-tab-pane label="基本信息">
          <div class="infoList">
            <div class="title">项目名称</div>
            <div class="content">{{ projectDetail.name }}</div>
            <div class="title">项目描述</div>
            <div class="content">{{ projectDetail.desc }}</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="工作流">
          <div v-if="projectDetail.workflow.length>0">

          </div>
          <div v-else>
            <el-empty :image-size="150" >
              <template #description>
                <p>还未创建</p>
              </template>
              <template #default>
                <p><el-button @click="toCreate('workflow')" type="primary">
                  去创建<el-icon class="el-icon--right"><Right /></el-icon>
                </el-button></p>
              </template>
            </el-empty>
          </div>
        </el-tab-pane>
        <el-tab-pane label="任务">
          <div v-if="projectDetail.tasks.length>0">

          </div>
          <div v-else>
            <el-empty :image-size="150" >
              <template #description>
                <p>还未创建</p>
              </template>
              <template #default>
                <p><el-button @click="toCreate('tasks')" type="primary">
                  去创建<el-icon class="el-icon--right"><Right /></el-icon>
                </el-button></p>
              </template>
            </el-empty>
          </div>
        </el-tab-pane>
        <el-tab-pane label="问题">
          <div v-if="projectDetail.issue.length>0">

          </div>
          <div v-else>
            <el-empty :image-size="150" >
              <template #description>
                <p>还未创建</p>
              </template>
              <template #default>
                <p><el-button @click="toCreate('issue')" type="warning">
                  去创建<el-icon class="el-icon--right"><Right /></el-icon>
                </el-button></p>
              </template>
            </el-empty>
          </div>
        </el-tab-pane>
        <el-tab-pane label="讨论">
          <div v-if="projectDetail.discussion.length>0">

          </div>
          <div v-else>
            <el-empty :image-size="150" >
              <template #description>
                <p>还未创建</p>
              </template>
              <template #default>
                <p><el-button @click="toCreate('discussion')" type="primary">
                  去创建<el-icon class="el-icon--right"><Right /></el-icon>
                </el-button></p>
              </template>
            </el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
 </div>
</template>
<script setup>
import { ElTabs,ElTabPane,ElEmpty,ElIcon,ElButton } from 'element-plus';
import { Right } from '@icon-park/vue-next';
import Auth from '../../utils/auth';
import { onActivated,ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import routerBack from '../../components/routerBack.vue';
const route = useRoute();
const router = useRouter();
const projectId = ref(route.params.projectId);
const projectDetail = ref({
  name:'',
  desc:'',
  workflow:[],
  tasks:[], 
  discussion:[], 
  issue:[]
});
function toCreate(type){
  router.push(`/projects/detail-create/${type}/${projectId.value}`)
}
onActivated(async ()=>{
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectDetail({id:projectId.value})
  if(res.status == 'sus'){
    projectDetail.value = res.content;
  }
})
</script>