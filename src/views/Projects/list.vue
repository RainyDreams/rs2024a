<template>
  <div class="commonPage">
    <div class="container row">
      <div class="col-sm-12 col-md-12 col-xxl-8">
        <div class="big_header">
          <div class="icon"><form-one theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div>
          <div class="title">我参与的项目</div>
        </div>
        <div class="panel" v-show="loading">
          <el-skeleton animated :rows="5" />
        </div>
        <div class="panel" v-show="!loading && projectList.length==0">
          <el-empty :image-size="150" >
            <template #description>
              <p>没有参与的项目</p>
            </template>
            <template #default>
              <router-link to="/projects/create"><el-button type="primary">
                去创建项目<el-icon class="el-icon--right"><Right /></el-icon>
              </el-button></router-link>
            </template>
          </el-empty>
        </div>
        <div class="panel" v-show="!loading && projectList.length>0" v-for="project in projectList">
          <div class="commonHeader">
            <div class="title">
              <WaterfallsH class="icon" theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/>
              <span>{{ project.name }}</span>
            </div>
            <div class="desc">{{ project.desc }}</div>
          </div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="预览详情" name="1">
              <div class="_content commonCards row">
                <div class="col-md-6 col-lg-4" v-if="project.cards.tasks">
                  <div class="card ">
                    <div class="_title">{{ project.cards.tasks.title }}</div>
                    <div class="content"></div>
                    <div ></div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4" v-if="project.cards.issues">
                  <div class="card ">
                    <div class="_title">{{ project.cards.issues.title }}</div>
                    <div class="content"></div>
                    <div ></div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4" v-if="project.cards.discussion">
                  <div class="card ">
                    <div class="_title">{{ project.cards.discussion.title }}</div>
                    <div class="content"></div>
                    <div ></div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-button size="large" @click="to(project.id)">查看详情</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onActivated, onMounted, ref} from 'vue';
import Auth from '../../utils/auth';
import { WaterfallsH,Right,FormOne } from '@icon-park/vue-next';
import { ElCollapse,ElCollapseItem,ElButton,ElSkeleton,ElEmpty } from 'element-plus';
import { useRouter,RouterLink } from 'vue-router';
const projectList = ref([])
const loading = ref(true);
const activeNames = '1'
const router = useRouter();
onActivated(async ()=>{
  await Auth.getPrtoken();
  const res = await Auth.getJoinedProjectList();
  // projectList.value = res.content
  // debugger
  let tmp = []
  res.content.forEach(item=>{
    // Basic
    let cards = {
      news:{
        title:"近期动态",
        content:null,
      },
      tasks:{
        title:"任务",
        content:null,
      },
      issues:{
        title:"问题",
        content:null,
      },
      discussion:{
        title:"讨论",
        content:null,
      },
    };
    let project = {
      id:item.id,
      name:item.name,
      desc:item.desc,
      cards,
    }
    tmp.push(project)
  });
  projectList.value = tmp;
  loading.value = false
})

function to(id){
  // debugger;
  router.push({
    path: '/projects/detail/'+id,
  })
}
</script>