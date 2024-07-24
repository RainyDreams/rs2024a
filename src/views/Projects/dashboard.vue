<template>

  <div class="commonPage">
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-lg-8">
          <div class="panel">
            <div class="_header">
              <div class="icon"><ListView theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
              <div class="title">每周简报</div>
            </div>
            <div class="_content">
              <div class="cards">
                <div class="card" v-for="(item,i) in 8">
                  <el-statistic :value="98500">
                    <template #title>
                      <div style="display: inline-flex; align-items: center">
                        Daily active users
                        <el-tooltip
                          effect="dark"
                          content="Number of users who logged into the product in one day"
                          placement="top"
                        >
                          <el-icon style="margin-left: 4px" :size="12">
                            <Warning />
                          </el-icon>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-statistic>
                </div>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="_header">
              <div class="icon"><MarketAnalysis theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
              <div class="title">完成进度分析</div>
            </div>
            <div class="_content"></div>
          </div>
        </div>
        <div class="col-md-12 col-lg-4">
          <div class="panel">
            <div class="_header">
              <div class="icon"><Order theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
              <div class="title">今日待办</div>
            </div>
            <div class="_content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ListView, MarketAnalysis, Order } from '@icon-park/vue-next';
</script>