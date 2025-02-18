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
import { RouterLink, useRoute, useRouter } from 'vue-router';
// 获取route.query.url
const route = useRoute();
const router = useRouter();
router.push({  path: route.query.url || '/user/profile',});
// emitter.emit('updateBasicAuth')
</script>