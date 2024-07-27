<template>
  <div class="commonPage">
    <div class="container row">
      <div class="col-md-12 col-xxl-8">
        <div class="panel" v-for="item in projectList">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onActivated, onMounted, ref} from 'vue';
import Auth from '../../utils/auth';
const projectList = ref([])
onActivated(async ()=>{
  await Auth.getPrtoken();
  const res = await Auth.getJoinedProjectList();
  projectList.value = res.content
})
</script>