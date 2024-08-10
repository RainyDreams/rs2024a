<template>
  <div class="commonPage">
    <div class="container row">
      <div class="col-sm-12 col-xxl-8">
        <div class="big_header">
          <div class="icon"><form-one theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div>
          <div class="title">我参与的项目</div>
        </div>
        <div class="panel" v-if="loading">
          <el-skeleton animated :rows="5" />
        </div>
        <div class="panel" v-if="!loading && projectList.length==0">
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
        <div class="row" v-if="!loading && projectList.length>0" >
          <div class="col-12 col-sm-6" v-for="item in projectList">
            <div class="panel projectbox">
              <div class="text-xs mb-1 text-slate-400">项目名称</div>
              <div class="text-2xl/tight font-semibold">{{ item.name }}</div>
              <div class="text-xs mb-1 text-slate-400 mb-2 break-all">ID:{{ item.project }}</div>
              <div class="text-xs mb-1 text-slate-400">项目描述</div>
              <div class="text-lg/tight break-all mb-2">{{ item.desc }}</div>
              <div class="text-xs mb-1 text-slate-400">创建人</div>
              <div class="text-lg/tight break-all mb-2">
                <el-avatar :src="item.createuser.avatar" :size="24"></el-avatar>
                <span class="ml-1">{{ item.createuser.nickname }}</span>
              </div>
              <div class="text-xs mb-1 text-slate-400">创建时间</div>
              <div class="text-lg/tight break-all mb-2">{{ item.formatCreatetime }}</div>
              <div class="text-xs mb-1 text-slate-400">参与团队数量</div>
              <div class="text-lg/tight break-all mb-2">{{ item.teamsNumber }}</div>
              <div class="text-xs mb-1 text-slate-400">我的身份</div>
              <div class="text-lg/tight break-all mb-2">{{ item.role }}</div>
              <div class="row text-center mt-3">
                <div class="col-4 col-sm-6 col-md-3">
                  <el-statistic :value="item.workflowNumber">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        工作流
                      </div>
                    </template>
                  </el-statistic>
                </div>
                <div class="col-4 col-sm-6 col-md-3">
                  <el-statistic :value="item.taskNumber">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        任务
                      </div>
                    </template>
                  </el-statistic>
                </div>
                <div class="col-4 col-sm-6 col-md-3">
                  <el-statistic :value="item.issueNumber">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        问题
                      </div>
                    </template>
                  </el-statistic>
                </div>
                <div class="col-4 col-sm-6 col-md-3">
                  <el-statistic :value="item.discussionNumber">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        讨论
                      </div>
                    </template>
                  </el-statistic>
                </div>
              </div>
              <div class="more mt-3">
                <el-button size="large" @click="to(item.id)" color="#626aef" plain type="primary" style="width:100%">查看项目</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!loading" class="col-sm-12 col-md-12 col-lg-12 col-xxl-4 ">
        <div class="">
          <div class="big_header">
            <div class="icon"><Order theme="outline" size="24" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">意见征集</div>
          </div>
          <div class="panel">
            <div class="doc">
              <h2>你觉得这样设计好看吗</h2>
              <p>来参加我们的调研</p>
              <p><a href="https://wj.qq.com/s2/15033628/565d/">赤子英金研究性学习项目网站设计意见征集</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onActivated, onMounted, ref} from 'vue';
import Auth from '../../utils/auth';
import { WaterfallsH,Right,FormOne } from '@icon-park/vue-next';
import { ElStatistic,ElButton,ElSkeleton,ElEmpty,ElAvatar } from 'element-plus';
import { useRouter,RouterLink } from 'vue-router';
import Dayjs from 'dayjs';
const projectList = ref([])
const loading = ref(true);
const activeNames = '1'
const router = useRouter();
onActivated(async ()=>{
  const res = await Auth.getJoinedProjectList();
  projectList.value = res.content.map(item=>{
    item.formatCreatetime = Dayjs(item.createtime).format('YYYY年MM月DD日 HH:mm:ss')
    return item;
  });
  loading.value = false
})

function to(id){
  // debugger;
  router.push({
    path: '/projects/detail/'+id,
  })
}
</script>