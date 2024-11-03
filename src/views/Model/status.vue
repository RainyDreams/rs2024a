<template>
  <div class="commonPage h-full  md:px-5">
    <div class="panel" v-if="loading">
      <el-skeleton class="mt-3" animated :rows="5" />
    </div>
    <div class="panel" v-if="!loading">
      <h1 class="text-2xl font-bold">当日信息</h1>
      <p class="mt-4 mb-1 text-lg font-bold">模型请求数</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ serverStatus.request }}</p>
      <el-progress
        :stroke-width="16"
        :percentage="Math.floor(10000*(serverStatus.request / 1500))/100"
        :color="[{ color: '#904df5', percentage: 100 }]"
      ></el-progress>
      <p class="mt-4 mb-1 text-lg font-bold">模型已用TOKEN数</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ serverStatus.tokens }}</p>
      <el-progress
        :stroke-width="16"
        :percentage="Math.floor(10000*(serverStatus.tokens / (1e6*24*60)))/100"
        :color="[{ color: '#904df5', percentage: 100 }]"
      ></el-progress>
     
      <p class="mt-4 mb-1 text-lg font-bold">服务器延迟</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ serverStatus.m }}ms</p>
      <p class="mt-4 mb-1 text-lg font-bold">指标S 响应时间</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ timer - serverStatus.s }}ms</p>
      <p class="mt-4 mb-1 text-lg font-bold">指标A 响应时间</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ serverStatus.a }}ms</p>
      <p class="mt-4 mb-1 text-lg font-bold">指标B 响应时间</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ serverStatus.b }}ms</p>
      <p class="mt-4 mb-1 text-lg font-bold">指标R 响应时间</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ serverStatus.r }}ms</p>
      <p class="mt-4 mb-1 text-lg font-bold">指标H 响应时间</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ serverStatus.h }}ms</p>
      <p class="mt-4 mb-1 text-lg font-bold">服务器IP</p>
      <p class="text-3xl mb-2 font-bold primary-text w-fit">{{ serverStatus.ip.ip }}</p>
      <p class="text-2xl mb-2 font-bold primary-text w-fit">{{ serverStatus.ip.nation }}</p>
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
const timer = ref()
const loading = ref(true)
onActivated(async () => {
  serverStatus.value = (await Auth.getServerStatus()).content;
  timer.value = Date.now()
  loading.value = false;
})

</script>