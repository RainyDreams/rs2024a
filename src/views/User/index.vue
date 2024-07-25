<template>
  <div class="userPage">
    <div class="background"></div>
    <div class="panel">
      <div class="userline">
        <div class="_avatar">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            :size="100"
          ></el-avatar>
        </div>
        <div class="content">
          <h2>用户名</h2>
        </div>
      </div>
    </div>
  </div>
  <div class="commonPage">
    <div class="panel">
      <div class="_header">
        <div class="icon"><IdCardH theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
        <div class="title">基本信息</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { IdCardH } from '@icon-park/vue-next';
</script>

<!-- <script setup>
import { onMounted, ref } from 'vue';
import Cookies from 'js-cookie';
async function loginUser() {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username:username.value, password:password.value })
  });
  if (response.status === 200) {
    const data = await response.json();
    if(data.status == 'sus'){
      Cookies.set('czigauth', `${(new Date().getTime()).toString(36)}`, { expires: new Date(data.content.expires),Domain:'.chiziingiin.top' });
    }
  } else {
    console.error('登录失败');
  }
}
async function getPrToken() {
  const response = await fetch('/api/prtoken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.status === 200) {
    const data = await response.json();
    console.log('Received prtoken:', data.prtoken);
  } else {
    console.error('Failed to get prtoken:', response.statusText);
  }
}
onMounted(async ()=>{
  await loginUser();
  await getPrToken();
})
</script> -->