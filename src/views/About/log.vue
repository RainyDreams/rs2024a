<template>
  <div class="commonPage">
    <routerBack name="上一页"></routerBack>
    <div class="panel">
      <h1 class="text-2xl mb-2 font-semibold">更新日志</h1>
      <!-- <p class="text-lg mb-4">我们已将代码开源在GitHub，如果你也想参与其中，请提交<a target="_blank" href="https://github.com/RainyDreams/rs2024a/pulls">Pull Request</a></p> -->
      <el-skeleton :rows="5" animated v-show="loading"></el-skeleton>
      <div class="list" v-show="!loading">
        <div class="shadow-slate-50 border-t border-l border-r last:border-b bg-white transition-all py-2 px-3 md:py-4 md:px-5" 
          v-for="(item,i) in list"
          :tabindex="i"
          >
          <p class="mt-1 text-slate-500">
            处理人：<a :href="item.user_url" target="_blank"><el-avatar class="align-middle" :src="item.avatar" :size="18"/><span class="ml-1">{{ item.user }}</span></a>
          </p>
          <p class="opacity-80 text-xs md:text-sm mb-2">{{item.formatDate}}</p>
          <p v-show="!item.show_full_message" class="text-sm/tight md:text-base/relaxed">{{ item.short_message }}</p>
          <p v-show="item.show_full_message" class="whitespace-pre-line text-sm/tight md:text-base/relaxed">{{ item.message }}</p>
          <p class="my-2" v-show="item.short_message != item.message"><el-button @click="item.show_full_message=!item.show_full_message" link type="primary">
            {{item.show_full_message?'收起':'展开'}}
            <!-- <template> -->
            <span>
              <up v-show="item.show_full_message" theme="outline" size="16" fill="currentColor" strokeLinejoin="bevel"/>
              <down v-show="!item.show_full_message"theme="outline" size="16" fill="currentColor" strokeLinejoin="bevel"/>
            </span>
            <!-- </template> -->
          </el-button></p>
        </div>
      </div>
      <el-pagination style="margin-top: 18px;" v-model:current-page="now"
       background layout="pager" :page-count="total" @current-change="changePage"
       :pager-count="3"/>
    </div>
  </div>

</template>


<script setup>
import { onMounted, ref } from 'vue';
import { ElPagination,ElSkeleton,ElAvatar,ElButton } from 'element-plus';
import { Down,Up } from '@icon-park/vue-next';
import routerBack from '../../components/routerBack.vue';
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
    return {...e,formatDate:dayjs(e.date).format('YYYY年MM月DD日 HH:mm:ss'),show_full_message:false}
  });
  loading.value=false;
})
// }
async function changePage(page){
  loading.value=true;
  let res = (await Auth.getUpdateList({page}));
  list.value = res.content.list.map(e=>{
    return {...e,formatDate:dayjs(e.date).format('YYYY年MM月DD日 HH:mm:ss')}
  });
  loading.value=false;
}
</script>