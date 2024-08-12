<template>
  <div class="row">
    <div class="col-12 col-md-6 col-xl-4" v-for="(item,index) in discussionList" :key="index">
      <div class="discussionCard prcard">
        <div class="name">{{ item.name }}</div>
        <div class="userline">
          <el-avatar :src="item.myProfile.avatar"></el-avatar>
          <div class="nickname">{{ item.myProfile.nickname }}</div>
          <div class="role">{{ getRole(item.myProfile.role) }}</div>
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
import { getRole } from '../../../utils/helpers';
const route = useRoute();
const projectId = ref();
const discussionList = ref([]);
onMounted(async ()=>{
  projectId.value = route.params.projectId;
  const res = await Auth.getProjectItem({
    type:'discussion',projectId:projectId.value
  })
  discussionList.value=res.content;
})

</script>