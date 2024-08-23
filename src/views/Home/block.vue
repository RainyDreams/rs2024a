<template>
  <el-result
    icon="warning"
    title="当前操作被拦截"
    subTitle="内部API不允许被你所使用的方法访问"
  >
    <template #extra>
      <div class="text-center">
        <p class="mb-2 text-lg">我们是学生初创项目，请不要尝试攻击、毁坏或者以任何方式使它停止工作，我们感谢你的善举</p>
        <p class="mb-2 text-lg">我们力求保证每位用户的数据安全！</p>
      </div>
      <div class="text-center mt-8">
        <p class="mb-2 text-lg">感谢你关心我们的项目</p>
        <p class="mb-2 text-lg">零本智协项目启动纪念 </p>
        <p class="mb-2 text-lg">2024年7月22日 雨窗</p>
        <pre>((hi,)=>{let us = "go and realize our dream"})(/^_^/)</pre>
      </div>
    </template>
  </el-result>
</template>

<script setup>
import { ElResult,ElButton } from 'element-plus';
</script>