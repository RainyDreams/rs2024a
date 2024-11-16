<template>
  <el-result
    icon="warning"
    title="当前操作需要登录才能进行"
    subTitle="可能你的登录已经过期或无效"
  >
    <template #extra>
      <a @click="open()">
        <el-button type="primary">前往登录页面</el-button>
      </a>
    </template>
  </el-result>
</template>

<script setup>
import { ElResult,ElButton } from 'element-plus';
import Auth from '../../utils/auth';
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter()
const url = ref('')
emitter.emit('updateBasicAuth')
async function open(){
  router.push(`/login?url=${url.value}&mode=window`);
  // await Auth.openWindow(`https://auth.chiziingiin.top/?url=${url.value}&mode=window`)
} 

onMounted(()=>{
  url.value = encodeURIComponent(route.query.url || '')
})
</script>