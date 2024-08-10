<template>
  <el-result
    icon="warning"
    title="当前操作需要登录才能进行"
    subTitle="可能您的登录已经过期或无效"
  >
    <template #extra>
      <a :href="`https://auth.chiziingiin.top/url=${url}`">
        <el-button type="primary">前往登录页面</el-button>
      </a>
    </template>
  </el-result>
</template>

<script setup>
import { ElResult,ElButton } from 'element-plus';
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
const route = useRoute();
const url = ref('')
onMounted(()=>{
  url.value = encodeURIComponent(route.query.url || '')
})
</script>