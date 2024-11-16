<template>
  <el-result
    icon="info"
    title="你已登录，无需重复登录"
  >
    <template #extra>
      <router-link to="/user/profile">
        <el-button type="primary">前往用户页面</el-button>
      </router-link>
    </template>
  </el-result>
</template>

<script setup>
import { ElResult,ElButton } from 'element-plus';
import { RouterLink } from 'vue-router';
emitter.emit('updateBasicAuth')
</script>