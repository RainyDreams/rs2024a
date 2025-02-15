<template>
  <div class="commonPage bg-transparent md:rounded-lg pb-0 h-screen pt-3" style="display: flex;flex-direction: column;">
    <div class="scroll">
      <div class="">
        <div class=" max-w-3xl m-auto" style="margin-bottom: 0;">
          <div class="panel aichat">
            <el-watermar :font="{ color: 'rgba(0, 0, 0, .08)' }" :gap="[0, 0]" :rotate="-12"
              :content="['AI生成内容仅供参考', '投资有风险，入市需谨慎', '仅供分析学习，不构成投资建议']">
              <div class="chatList" style="min-height: 200px;" id="ai_chatList">
                <div class="system mb-3 md:mb-4 lg:mb-5">
                  <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像" src="/logo_sm.webp">小英</el-avatar> -->
                  <div class="flex items-stretch flex-wrap" style="font-size:14px;width:100%; ">
                    <!-- <el-skeleton :rows="3" animated v-show="welcome_loading" class="bg-white p-5 rounded-lg"></el-skeleton> -->
                    <!-- <router-link  class="h-full"> -->
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center w-fit cursor-pointer text-sm rounded-l-full pr-2 pl-3 py-1 overflow-hidden select-none border `"
                      :style="{ clipPath: 'none', backgroundColor: '#fff' }" :color="'#4e81fc'" :opacity="0.4"
                      transition="ease-out" :duration="300" :keep-last-ripple="true" @click="router.go(-2)">
                      <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                      <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                      <left theme="outline" size="18" fill="#4e81fc" />
                      <!-- </div> -->
                    </touch-ripple>
                    <!-- </router-link> -->
                    <router-link to="/home" class="h-full">
                      <touch-ripple
                        :class="`flex touch-ripple h-8  mt-2  items-center mr-1 border-l-0 w-fit cursor-pointer text-sm rounded-r-full pl-2 pr-3 py-1 overflow-hidden select-none border `"
                        :style="{ clipPath: 'none', backgroundColor: '#fff' }" :color="'#4e81fc'" :opacity="0.4"
                        transition="ease-out" :duration="300" :keep-last-ripple="true">
                        <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                        <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                        <home theme="outline" size="18" fill="#4e81fc" />
                        <!-- </div> -->
                      </touch-ripple>
                    </router-link>
                    <!-- <router-link to="/quant" class="h-full" > -->
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center text-center mr-1  w-fit cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border `"
                      :style="{ clipPath: 'none', backgroundColor: '#fff' }" :color="'#f206'" :opacity="0.4"
                      transition="ease-out" :duration="300" :keep-last-ripple="true">
                      <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                      <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                      <fire theme="outline" class="mr-1" size="18" fill="#f20" />
                      <div class="text-base leading-none" style="color:#f20">零本量化</div>
                      <!-- </div> -->
                    </touch-ripple>
                    <!-- </router-link> -->

                    <!-- <div v-show="!welcome_loading" class="text-base/snug sm:text-base/snug md:text-base/snug lg:text-lg/snug" v-html="md.render(welcome)"></div> -->
                    <!-- <p><router-link to="/model/history">聊天历史</router-link></p> -->
                  </div>
                </div>
                <div class="mainAnalysis">
                  <h3 >强势股票</h3>
                  <el-table :data="qsgc" style="width: 100%" height="350">
                    <el-table-column fixed width="120" label="股票信息">
                      <template #default="scope">
                        <div class="text-left">
                          <div>{{ scope.row.mc }}</div> <!-- 名称 -->
                          <div class="">{{ scope.row.dm }}</div> <!-- 代码 -->
                        </div>
                      </template>
                    </el-table-column>
                    <!-- 当前价格 -->
                    <el-table-column prop="p" label="价格（元）" width="120" />
                    <!-- 涨停价 -->
                    <el-table-column prop="ztp" label="涨停价（元）" width="120" />
                    <!-- 涨停统计 -->
                    <el-table-column label="涨停统计" width="120">
                      <template #default="scope">
                        <span>{{ scope.row.tj.split('/').join('天')+'板' }}</span>
                      </template>
                    </el-table-column>
                    <!-- 涨幅 -->
                    <el-table-column prop="zf" label="涨幅（%）" width="120" />
                    <!-- 成交额 -->
                    <el-table-column prop="cje" label="成交额（元）" width="150" />
                    <!-- 涨速 -->
                    <el-table-column prop="zs" label="涨速（%）" width="120" />
                    <!-- 是否新高 -->
                    <el-table-column label="是否新高" width="120">
                      <template #default="scope">
                        <span>{{ scope.row.nh === 1 ? '是' : '否' }}</span>
                      </template>
                    </el-table-column>
                    <!-- 量比 -->
                    <el-table-column prop="lb" label="量比" width="120" />
                    <!-- 换手率 -->
                    <el-table-column prop="hs" label="换手率（%）" width="120" />
                    <!-- 流通市值 -->
                    <el-table-column prop="lt" label="流通市值（元）" width="150" />
                    <!-- 总市值 -->
                    <el-table-column prop="zsz" label="总市值（元）" width="150" />
                  </el-table>
                </div>
              </div>
            </el-watermar>
          </div>
        </div>
      </div>
    </div>
    <p class=" text-center text-slate-500 py-1 font-sans leading-none" style="font-size: 10px;">投资决策需基于自身判断和风险承受能力，投资有风险，入市需谨慎。</p>
  </div>
</template>
<script setup>
import { onActivated, onMounted, ref, reactive, watch, nextTick } from "vue"
import {Scheduler} from "../../utils/auth";
import { ElTable,ElTableColumn  } from "element-plus";
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { Fire,Left, Home } from '@icon-park/vue-next';
import { TouchRipple } from 'vue-touch-ripple'
import 'vue-touch-ripple/style.css'
import Quant from './quant.js'
const qsgc = ref()
onActivated(async ()=>{
  qsgc.value = await Quant.fetchStrongStocks();
  const StockTaskThread = new Scheduler(2);
  await Promise.all(qsgc.value.map(async (stock)=>{
    await StockTaskThread.add(async ()=>{
      stock.tj = await Quant.fetchStockRelatedInfo(stock.dm.replace(/sz|sh/,''));
      await new Promise((resolve)=>{setTimeout(()=>{resolve();},1000)})
    })
  }))
  const countMap = new Map();
})
</script>
