<template>
  <div class="row">
    <div class="col-12 col-md-6">
      <div class="panel">
        <h1>来吧，说出你的需求，我们替您规划</h1>
        <el-input v-model.lazy="input"></el-input>
        <el-button @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import { useRoute } from 'vue-router';
import Auth from '../../../utils/auth';
import { ElInput,ElButton } from 'element-plus';
const input = ref('')
const route = useRoute()
const projectId = ref()
async function submit(){
  const res = await Auth.AI_createWorkflow({
    projectId:projectId.value,
    content:input.value
  })
}
onMounted(()=>{
  projectId.value = route.params.projectId;
})
</script>