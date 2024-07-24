<template>
  <div class="interactivePage" >
    <div class="panel">
      <div class="_header">
        <span>加入</span>
        <span class="teamName">{{ teamName }}赤字英金</span>
        <span>团队</span>
      </div>
      <div class="_content">
        <p>您好，</p>
        <p>我是{{ userName }}，真诚邀请你加入{{ teamName }}团队。</p>
        <p>此致</p>
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
      </div>
      <div class="_footer">
      </div>
    </div>
  </div>
</template>

<script setup>
//检测网址传来的uid=xxx&pid=yyy然后请求服务器获取username和teamname
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Auth from '../../utils/auth';
const route = useRoute()
const teamName = ref('')
const userName = ref('')

//获取路由param
console.log(route)
const uid = route.query.uid;
const pid = route.query.pid;

async function getTeamInfo(){
  const prtoken = await Auth.getPrtoken();
  if(prtoken.status=="exist"||prtoken.status=="sus"){
    const res = await Auth.getTeamInfo({uid,pid});
    if(res.status=="sus"){
      teamName.value = res.content.teamName;
      userName.value = res.content.userName;
      loading.close();
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
    setTimeout(() => {
      window.location.href = 'https://auth.chiziingiin.top/?url='+encodeURI(window.location.href)
    },1000)
    return;
  } else {
    ElMessage({
      message: '获取团队信息失败',
      type: 'error',
    })
    return;
  }
}
onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载中',
    background: 'rgba(255,255,255,1)',
  })
  await getTeamInfo();
})
</script>
