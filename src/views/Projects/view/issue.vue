<template>
  <div class="row">
    <div class="col-12 col-md-6 col-xl-4" v-for="(item,index) in issueList" :key="index">
      <div class="issueCard prcard">
        <div class="name">{{ item.name }}</div>
        <div class="userline">
          <el-avatar :src="item.myProfile.avatar"></el-avatar>
          <div class="nickname">{{ item.myProfile.nickname }}</div>
          <div class="role">{{ item.myProfile.role }}</div>
        </div>
        <div class="desc">
          {{ item.desc }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated,onMounted,ref } from 'vue';
import Auth from '../../../utils/auth';
import { useRoute } from 'vue-router';
const route = useRoute();
const projectId = ref();
const issueList = ref([]);
onMounted(async ()=>{
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectItem({
    type:'issue',projectId:projectId.value
  })
  issueList.value=res.content;
})

</script>