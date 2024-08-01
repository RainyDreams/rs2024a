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
          <h2>{{profile.nickname}}</h2>
        </div>
      </div>
    </div>
  </div>
  <div class="commonPage">
    <div class="panel" v-if="loading">
      <el-skeleton animated :rows="5" />
    </div>
    <div class="panel" v-if="!loading" >
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
import { ElAvatar,ElSkeleton } from 'element-plus';
import Auth from '../../utils/auth';
const profile = ref({
  nickname: '加载中',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
})
const loading = ref(true)
onActivated(async ()=>{
  // // await // Auth.getPrtoken();
  const res = await Auth.getUserInfo();
  profile.value = res.content;
  loading.value=false;
})
</script>