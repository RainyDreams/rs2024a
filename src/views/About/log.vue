<template>
  <div class="commonPage">
    <div class="panel">
      <h1 class="text-2xl mb-2 font-semibold">更新日志</h1>
      <p class="text-lg mb-4">我们已将代码开源在GitHub，如果你也想参与其中，请提交<a target="_blank" href="https://github.com/RainyDreams/rs2024a/pulls">Pull Request</a></p>
      <el-skeleton :rows="5" animated v-show="loading"></el-skeleton>
      <div class="list" v-show="!loading">
        <template v-for="(item,i) in list">
          <p class="opacity-80 text-sm">{{item.formatDate}}</p>
          <p class="whitespace-pre-line text-md/tight">{{ item.message }}</p>
          <p class="mb-3 text-slate-500">
            <a :href="item.user_url" target="_blank"><el-avatar class="align-middle" :src="item.avatar" :size="18"/><span class="ml-1">{{ item.user }}</span></a>
          </p>
        </template>
      </div>
      <el-pagination style="margin-top: 18px;" v-model:current-page="now"
       background layout="pager" :page-count="total" @current-change="changePage"
       :pager-count="3"/>
    </div>
  </div>

</template>


<script setup>
import { onMounted, ref } from 'vue';
import { ElPagination,ElSkeleton,ElAvatar } from 'element-plus';
import Auth from '../../utils/auth';
import dayjs from 'dayjs';
const list = ref()
const total = ref(2)
const now = ref(1)
const loading = ref(true)
onMounted(async ()=>{
  let res = (await Auth.getUpdateList({page:1}))
  total.value = res.content.total;
  list.value = res.content.list.map(e=>{
    return {...e,formatDate:dayjs(e.date).format('YYYY年MM月DD日 HH:mm:ss')}
  });
  loading.value=false;
})
async function changePage(page){
  loading.value=true;
  let res = (await Auth.getUpdateList({page}));
  list.value = res.content.list.map(e=>{
    return {...e,formatDate:dayjs(e.date).format('YYYY年MM月DD日 HH:mm:ss')}
  });
  loading.value=false;
}
</script>