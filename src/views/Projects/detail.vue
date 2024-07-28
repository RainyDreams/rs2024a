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
        <el-tab-pane label="工作流">工作流</el-tab-pane>
        <el-tab-pane label="任务">任务</el-tab-pane>
        <el-tab-pane label="问题">问题</el-tab-pane>
        <el-tab-pane label="讨论">讨论</el-tab-pane>
      </el-tabs>
    </div>
  </div>
 </div>
</template>


<style >
/* // .commonPage .el-tabs{
//   .el-tabs__header{
//     padding:12px 0 !important;
//   }
//   .el-tabs__nav-scroll{
//     padding-bottom: 8px;
//   }
//   .el-tabs__item{
//     margin:0 12px;
//     padding:0 12px !important;
//     height:30px;
//     font-weight: 600;
//     border-radius: 6px;
//     &:hover{
//       background-color: #eff1f4;
//     }
//     // &.is-active{
//     //   background-color: rgb(34, 98, 251);
//     //   color:#fff;
//     // }
//   }
// } */
</style>
<script setup>
import { ElTabs,ElTabPane } from 'element-plus';
import Auth from '../../utils/auth';
import { onActivated,ref } from 'vue';
import { useRoute } from 'vue-router';
import routerBack from '../../components/routerBack.vue';
const route = useRoute();
const projectDetail = ref({
  name:'',
  description:''
});
onActivated(async ()=>{
  await Auth.getPrtoken();
  // 获取param
  const { projectId } = route.params;
  const res = await Auth.getProjectDetail({id:projectId})
  console.log(res)
  if(res.status == 'sus'){
    projectDetail.value = res.content;
  }
})
</script>