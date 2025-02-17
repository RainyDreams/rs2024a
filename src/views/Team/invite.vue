<template>
  <div class="interactivePage" >
    <div class="panel">
      <div class="_header">
        <!-- <span>加入</span>
        <span class="teamName"> {{ teamName }} </span>
        <span>团队</span> -->
        <el-avatar alt="头像"></el-avatar>
        <div class="_name">{{ teamName }}</div>
        <div class="_desc">{{ teamDesc }}</div>
      </div>
      <div class="_content">
        <p>这是一封来自 <b>{{ teamName }}</b> 团队的邀请函</p>
        <p>邀请你加入 <b>{{ teamName }}</b> 团队。</p>
        <p>请点击下面的按钮加入该团队</p>
        <p btn>
          <el-button 
            type="primary"
            size="large"
            @click="joinTeam"
            style="width: 100%"
          >
            加入团队
          </el-button>
        </p>
        <p class="tips">了解赤子英金的 <a>版权声明</a> 和 <a>免责声明</a>.</p>
      </div>
      <div class="_footer">
      </div>
    </div>
  </div>
</template>

<style scoped>
  ._header{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  ._name{
    font-size: 24px;
    margin-top: 8px;
    margin-bottom: 6px;
  }
  ._desc{
    font-size: 12px;
  }
</style>
<script setup>
//检测网址传来的uid=xxx&pid=yyy然后请求服务器获取username和teamname
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading, ElAvatar, ElButton, ElMessageBox} from 'element-plus'
import Auth from '../../utils/auth';
const route = useRoute()
const teamName = ref('')
const teamDesc = ref('')
const userName = ref('')
const router = useRouter()

//获取路由param
// // console.log(route)
const uid = route.query.uid;
const pid = route.query.pid;

async function getTeamInfo(close){
  const prtoken = await Auth.getPrtoken();
  if(prtoken.status=="exist"||prtoken.status=="sus"){
    const res = await Auth.getTeamInfo({uid,pid});
    if(res.status=="sus"){
      teamName.value = res.content.name;
      teamDesc.value = res.content.desc;
      // const userid = res.content.createuser
      close();
      return;
    } else {
      ElMessage({
        message: '获取团队信息失败',
        type: 'error',
      })
      return;
    }
  } else if (prtoken.status=="invalid") {
    ElMessage({
      message: '登录已过期，请重新登录',
      type: 'error',
    })
    router.push('/login?url=' + encodeURIComponent(route.path))
    return;
  } else {
    ElMessage({
      message: '获取团队信息失败',
      type: 'error',
    })
    return;
  }
}
async function joinTeam(){
  const res = await Auth.joinTeam({pid})
  if(res.status == 'sus'){
    if(res.content.code == 2){
      ElMessageBox.alert('你已经加入过该团队', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          router.push('/team/detail/'+pid)
        },
      });
    } else if(res.content.code == 1) {
      router.push('/status/joining');
    }
  } else {
    // else {
      ElMessage.error('加入失败')
    // }
  }
}
onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中',
    background: 'rgba(255,255,255,1)',
  })
  await getTeamInfo(()=>{loading.close()});
})
</script>
