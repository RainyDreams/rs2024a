<template>
  <div class="commonPage">
    <div class="panel">
      <h1 class="text-xl mb-3 font-semibold">更新日志</h1>
      <el-skeleton :rows="5" animated v-show="loading"></el-skeleton>
      <div class="list" v-show="!loading">
        <template v-for="(item,i) in list">
          <p class="opacity-80 text-sm">{{item.formatDate}}</p>
          <p class="mb-2 whitespace-pre-line text-md/tight">{{ item.message }}</p>
        </template>
      </div>
      <el-pagination style="margin-top: 18px;" v-model:current-page="now"
       background layout="prev, pager, next" :page-count="total" @current-change="changePage"
       :pager-count="3"/>
    </div>
  </div>

</template>


<script setup>
import { onMounted, ref } from 'vue';
import { ElPagination,ElSkeleton } from 'element-plus';
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