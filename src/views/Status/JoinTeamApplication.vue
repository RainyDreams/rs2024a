<template>
  <el-result
    v-if="code == '1'"
    icon="success"
    title="操作成功"
  >
    <template #extra>
      <!-- <router-link to="/user/profile">
        <el-button type="primary">前往用户页面</el-button>
      </router-link> -->
    </template>
  </el-result>
  <el-result
    v-else-if="code == '2'"
    icon="warning"
    title="重复操作"
  >
    <template #extra>
      <!-- <router-link to="/user/profile">
        <el-button type="primary">前往用户页面</el-button>
      </router-link> -->
    </template>
  </el-result>
  <el-result
    v-else-if="code == '3'"
    icon="warning"
    title="没有权限"
  >
    <template #extra>
      <!-- <router-link to="/user/profile">
        <el-button type="primary">前往用户页面</el-button>
      </router-link> -->
    </template>
  </el-result>
  <el-result
    v-else-if="code == '4'"
    icon="warning"
    title="你已经是团队成员"
  >
    <template #extra>
      <!-- <router-link to="/user/profile">
        <el-button type="primary">前往用户页面</el-button>
      </router-link> -->
    </template>
  </el-result>
</template>

<script setup>
import {ElResult} from 'element-plus'
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
const route = useRoute()
const code = ref(route.query.code)
onMounted(()=>{
  setTimeout(()=>{
    window.close()
  },5000)
})
</script>