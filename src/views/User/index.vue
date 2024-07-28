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
      <div class="_content">
        <div >{{ profile }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { IdCardH } from '@icon-park/vue-next';
import { onActivated, ref } from 'vue';
import { ElAvatar } from 'element-plus';
import Auth from '../../utils/auth';
const profile = ref([])
onActivated(async ()=>{
  await Auth.getPrtoken();
  const res = await Auth.getUserInfo();
  profile.value = res;
  await Auth.test()
})
</script>