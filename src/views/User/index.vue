<template>
  <div class="commonPage">
    <div class="panel" v-if="loading">
      <el-skeleton animated :rows="5" />
    </div>
    <div class="row" v-if="!loading">
      <div class="col-12 col-md-6 col-lg-4 ">
        <div class="panel">
          <div class="flex flex-row">
            <div class="flex items-center mr-3">
              <el-avatar :src="profile.avatar" :size="60"></el-avatar>
            </div>
            <div class="flex justify-center flex-col ">
              <div class="text-xl font-semibold truncate">{{ profile.nickname }}</div>
              <el-tooltip
                effect="dark"
                content="正在建设中..."
                placement="bottom"
              >
                <div class="break-all">{{ profile.sign || '暂无签名' }}</div>
              </el-tooltip>
            </div>
          </div>
          <el-button style="width: 100%;" @click="logout" class="mt-4" round size="large">退出登录</el-button>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-8 ">
        <div class="panel text-center">
          <div class="row">
            <div class="col-6 col-sm-4 col-md-4 col-lg-3">
              <el-statistic :value="profile.teams.length">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    团队
                    <el-tooltip
                      effect="dark"
                      content="你创建和加入的团队数量"
                      placement="top"
                    >
                      <info style="margin-left: 4px;cursor: pointer;" theme="outline" :size="12" fill="#555" strokeLinejoin="bevel"/>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </div>
            <div class="col-6 col-sm-4 col-md-4 col-lg-3">
              <el-statistic :value="profile.projects.length">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    项目
                    <el-tooltip
                      effect="dark"
                      content="你创建和加入的项目数量"
                      placement="top"
                    >
                      <info style="margin-left: 4px;cursor: pointer;" theme="outline" :size="12" fill="#555" strokeLinejoin="bevel"/>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </div>
            <div class="col-6 col-sm-4 col-md-4 col-lg-3">
              <el-statistic :value="profile.workflow.length">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    工作流
                    <el-tooltip
                      effect="dark"
                      content="你创建和加入的工作流数量"
                     placement="top"
                    >
                      <info style="margin-left: 4px;cursor: pointer;" theme="outline" :size="12" fill="#555" strokeLinejoin="bevel"/>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </div>
            <div class="col-6 col-sm-4 col-md-4 col-lg-3">
              <el-statistic :value="profile.task.length">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    任务
                    <el-tooltip
                      effect="dark"
                      content="你创建和加入的任务数量"
                      placement="top"
                    >
                      <info style="margin-left: 4px;cursor: pointer;" theme="outline" :size="12" fill="#555" strokeLinejoin="bevel"/>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </div>
            <div class="col-6 col-sm-4 col-md-4 col-lg-3">
              <el-statistic :value="profile.issue.length">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    问题
                    <el-tooltip
                      effect="dark"
                      content="你创建和加入的问题数量"
                      placement="top"
                    >
                      <info style="margin-left: 4px;cursor: pointer;" theme="outline" :size="12" fill="#555" strokeLinejoin="bevel"/>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </div>
            <div class="col-6 col-sm-4 col-md-4 col-lg-3">
              <el-statistic :value="profile.discussion.length">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    讨论
                    <el-tooltip
                      effect="dark"
                      content="你创建和加入的讨论数量"
                     placement="top"
                    >
                      <info style="margin-left: 4px;cursor: pointer;" theme="outline" :size="12" fill="#555" strokeLinejoin="bevel"/>
                    </el-tooltip>
                  </div>
                </template>
              </el-statistic>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="panel">
          <div class="_header">
            <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">团队</div>
          </div>
          <div class="_content">
            <ul>
              <li class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,i) in profile.teams">
                <div class="flex-1 shrink break-all">
                  <div class="text-md">{{ item.name }}</div>
                  <div class="text-xs text-slate-400">ID:{{ item.team }}</div>
                  <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
                <div class="text-xs text-slate-600 px-1 py-1 text-right shrink-0">
                  <div>我的身份</div>
                  <div>{{ getRole(item.role) }}</div>
                  <div class="mt-2">
                    <el-avatar :size="20" v-for="(e) in item.persons" :src="e.avatar"></el-avatar>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="panel">
          <div class="_header">
            <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">项目</div>
          </div>
          <div class="_content">
            <ul>
              <li class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,i) in profile.projects">
                <div class="flex-1 shrink break-all">
                  <div class="text-md">{{ item.name }}</div>
                  <div class="text-xs text-slate-400">ID:{{ item.project }}</div>
                  <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
                <div class="text-xs text-slate-600 px-1 py-1 text-right shrink-0">
                  <div>我的身份</div>
                  <div>{{ getRole(item.role) }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="panel">
          <div class="_header">
            <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">工作流</div>
          </div>
          <div class="_content">
            <ul>
              <li class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,i) in profile.workflow">
                <div class="flex-1 shrink break-all">
                  <div class="text-md">{{ item.name }}</div>
                  <div class="text-xs text-slate-400">ID:{{ item.workflow }}</div>
                  <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
                <div class="text-xs text-slate-600 px-1 py-1 text-right shrink-0">
                  <div>我的身份</div>
                  <div>{{ getRole(item.role) }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="panel">
          <div class="_header">
            <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">任务</div>
          </div>
          <div class="_content">
            <ul>
              <li class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,i) in profile.task">
                <div class="flex-1 shrink break-all">
                  <div class="text-md">{{ item.name }}</div>
                  <div class="text-xs text-slate-400">ID:{{ item.task }}</div>
                  <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
                <div class="text-xs text-slate-600 px-1 py-1 text-right shrink-0">
                  <div>我的身份</div>
                  <div>{{ getRole(item.role) }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="panel">
          <div class="_header">
            <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">问题</div>
          </div>
          <div class="_content">
            <ul>
              <li class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,i) in profile.issue">
                <div class="flex-1 shrink break-all">
                  <div class="text-md">{{ item.name }}</div>
                  <div class="text-xs text-slate-400">ID:{{ item.issue }}</div>
                  <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
                <div class="text-xs text-slate-600 px-1 py-1 text-right shrink-0">
                  <div>我的身份</div>
                  <div>{{ getRole(item.role) }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="panel">
          <div class="_header">
            <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">讨论</div>
          </div>
          <div class="_content">
            <ul>
              <li class="flex border border-slate-200 px-4 py-3 rounded-md mb-3 last:mb-0" v-for="(item,i) in profile.discussion">
                <div class="flex-1 shrink break-all">
                  <div class="text-md">{{ item.name }}</div>
                  <div class="text-xs text-slate-400">ID:{{ item.id }}</div>
                  <div class="text-sm text-slate-600 mt-1">{{ item.desc }}</div>
                </div>
                <div class="text-xs text-slate-600 px-1 py-1 text-right shrink-0">
                  <div>我的身份</div>
                  <div>{{ getRole(item.role) }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="panel">
          <div class="_header">
            <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">创建信息</div>
          </div>
          <div class="_contnet">
            <p>账户ID</p>
            <p>{{ profile.id.slice(0,15) + '*****' + profile.id.slice(20,30) }}</p>
            <p>账户类型</p>
            <p>{{ profile.identityType }}</p>
            <p>创建时间</p>
            <p>{{ dayjs(profile.createTime).format('YYYY年M月DD日 HH:mm:ss') }}</p>
            <p>创建IP</p>
            <p>{{ profile.createIP }}</p>
            <p>{{ profile.formatCreateIP }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 
    <div class="panel" v-if="!loading" >
      <div class="_header">
        <div class="title">基本信息</div>
      </div>
      <div class="_content">
        
        <el-upload
          class="avatar-uploader"
          action="/api/uploadAvatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="handleUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
    </div> -->
  </div>
</template>
<script setup>
import { Info,IdCardH } from '@icon-park/vue-next';
import { onActivated, onMounted, ref } from 'vue';
import { ElAvatar,ElStatistic, ElMessageBox,ElTooltip,ElSkeleton,ElButton, dayjs} from 'element-plus';
import Auth from '../../utils/auth';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getRole } from '../../utils/helpers';
import axios from 'axios';
import { useRouter } from 'vue-router';
const profile = ref({
  nickname: '加载中',
  avatar: 'https://lingben.chiziingiin.top/api/avatar/',
  sign: '暂无签名',
  teams: [],
  projects: [],
  workflow: [],
  task: [],
  issue: [],
  discussion: []
})
const imageUrl = ref('')
const loading = ref(true)
const router = useRouter()
onActivated(async ()=>{
  const res = await Auth.getUserInfo();
  profile.value = res.content;
  profile.value.formatCreateIP = (await Auth.getIP(profile.value.createIP)).content;
  loading.value=false;
})
async function logout(){
  ElMessageBox.alert('确定要退出吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showCancelButton:true,
    callback: async (action) => {
      if (action === 'confirm') {
        loading.value=true;
        const res = await Auth.logout();
        if(res.status == 'sus'){
          sessionStorage.removeItem('userInfo')
          ElMessageBox.alert('退出成功', '提示', {
            confirmButtonText: '确定',
            showClose:false,
            callback: action => {
              router.push('/login')
              // window.location.href = 'https://auth.chiziingiin.top/relogin';
            }
          })
        } else {
          loading.value=false;
        }
      }
    },
  });
}
function handleUpload(options) {
  const file = options.file;
  if (file.type.startsWith('image')) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const base64Image = e.target.result;
      const data = {
        imageBase64: base64Image,
      };
      axios.post('/api/uploadAvatar', data)
      .then(response => {
        // // console.log(response,options);
        profile.value.avatar = 'https://lingben.chiziingiin.top/api/avatar/'+ response.data.content;
      })
      .catch(error => {
        // console.error(error);
      });
    };
  } else {
    ElMessage.error('请上传图片文件');
    // console.error('不是图片文件');
  }
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.panel{
  height: 100%;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>