<template>
  <div class="errorPage">
    <el-empty description="404 NOT FOUND" >
      <template #description>
        <h1>该页面不存在</h1>
      </template>
      <el-button type="primary" @click="goBack()">返回上一页</el-button>
    </el-empty>
  </div>
  <!-- <pre class="text-center w-full">((hi,)=>{let us = "go and realize our dream"})(/^_^/)</pre> -->
</template>

<script setup>
import { ElEmpty,ElButton } from 'element-plus';
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
  router.go(-1)
}
</script>

<style >
.errorPage svg{
  --el-empty-fill-color-0: #ffffff;
  --el-empty-fill-color-1: #edf2ff;
  --el-empty-fill-color-2: #dbe5ff;
  --el-empty-fill-color-3: #c9d9ff;
  --el-empty-fill-color-4: #b7ccff;
  --el-empty-fill-color-5: #a5c0ff;
  --el-empty-fill-color-6: #93b3ff;
  --el-empty-fill-color-7: #81a7ff;
  --el-empty-fill-color-8: #6f9aff;
  --el-empty-fill-color-9: #5e8eff;
}
.errorPage h1{
  color:#3c3e55;
  font-weight: 600;
  font-size: 28px;
}
</style>