<template>
  <div class="commonPage h-full  md:px-5">
    <div class="panel" v-if="loading">
      <el-skeleton class="mt-3" animated :rows="5" />
    </div>
    <div class="panel" v-if="!loading">
      <h1 class="text-2xl font-bold">当日信息</h1>
      <p class="mt-4 mb-2 text-lg font-bold">模型请求数</p>
      <el-progress
        :stroke-width="16"
        :percentage="100*(serverStatus.request / 1500).toFixed(4)"
        :color="[{ color: '#904df5', percentage: 100 }]"
      ></el-progress>
      <p class="mt-4 mb-2 text-lg font-bold">模型TOKEN数</p>
      <el-progress
        :stroke-width="16"
        :percentage="100*(serverStatus.tokens / 1e6).toFixed(4)"
        :color="[{ color: '#904df5', percentage: 100 }]"
      ></el-progress>
    </div>
  </div>        
</template>


<script setup>
import { AddressBook, Right,Order,Plus, ChargingTreasure } from "@icon-park/vue-next";
import { ref, onMounted, onActivated,reactive } from "vue";
import { ElSkeleton,ElProgress} from "element-plus";
import Auth from "../../utils/auth";
import { getDateDiff,getRole } from "../../utils/helpers";
const serverStatus = ref();
const loading = ref(true)
onActivated(async () => {
  serverStatus.value = (await Auth.getServerStatus()).content;
  loading.value = false;
})

</script>