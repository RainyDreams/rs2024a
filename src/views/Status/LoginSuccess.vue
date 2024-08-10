<template>
  <el-result
    icon="success"
    title="登录成功"
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
</script>