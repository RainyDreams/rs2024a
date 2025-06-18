<template>
<div class="max-w-3xl m-auto px-5 pt-6">
  <routerBack name="上一页"></routerBack>
  <div class="">
    <!-- <p class="text-lg mb-4">我们已将代码开源在GitHub，如果你也想参与其中，请提交<a target="_blank" href="https://github.com/RainyDreams/rs2024a/pulls">Pull Request</a></p> -->
    <el-skeleton :rows="5" animated v-show="loading"></el-skeleton>
    <section class="list" v-show="!loading">
      <article
        class=" md:flex last:border-0 border-b border-stone-300 py-4" v-for="(item, i) in list" :tabindex="i">
        <p class="opacity-80 text-xs md:text-sm mb-2 shrink-0">{{ item.formatDate }}</p>
        <div class="md:pl-6 serif-text">
          <p class="mt-1 mb-1 text-slate-500">
            <a :href="item.user_url" target="_blank">
              <el-avatar class="align-middle" :src="item.avatar":size="18" />
              <span class="ml-1">{{ item.user }}</span>
            </a>
          </p>
          <p class="whitespace-pre-line text-sm md:text-base/relaxed">
            {{item.message }}
          </p>
        </div>
      </article>
    </section>
    <el-pagination style="margin-top: 18px;background-color: #f9f8f6;" class="sticky bottom-0 pt-3 pb-6" v-model:current-page="now" background layout="pager" :page-count="total"
      @current-change="changePage" :pager-count="4" />
  </div>
</div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { ElPagination, ElSkeleton, ElAvatar, ElButton } from 'element-plus';
import { Down, Up } from '@icon-park/vue-next';
import routerBack from '../../components/routerBack.vue';
import Auth from '../../utils/auth';
import dayjs from 'dayjs';
const list = ref()
const total = ref(2)
const now = ref(1)
const loading = ref(true)
onMounted(async () => {
  let res = (await Auth.getUpdateList({ page: 1 }))
  total.value = res.content.total;
  list.value = res.content.list.map(e => {
    return { ...e, formatDate: dayjs(e.date).format('YYYY年MM月DD日 HH:mm:ss'), show_full_message: false }
  });
  loading.value = false;
})
// }
async function changePage(page) {
  loading.value = true;
  let res = (await Auth.getUpdateList({ page }));
  list.value = res.content.list.map(e => {
    return { ...e, formatDate: dayjs(e.date).format('YYYY年MM月DD日 HH:mm:ss') }
  });
  loading.value = false;
}
</script>