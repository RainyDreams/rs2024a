<template>
  <h1>项目代码测试专用</h1>
</template>

<script setup>
import { onActivated, ref } from "vue"
import Auth from "../../utils/auth";
onActivated(async ()=>{
  console.log(111)
  await Auth.test();
})
</script>