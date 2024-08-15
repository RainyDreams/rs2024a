<template>

  <div class="commonPage">
    <div class="panel" v-if="loading">
      <el-skeleton animated :rows="5" />
    </div>
    <div class="row" v-if="!loading">
      <div class="col-md-12 col-lg-8">
        <div class="panel">
          <div class="_header">
            <div class="icon"><ListView theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">简报</div>
          </div>
          <div class="_content text-center">
            <div class="row">
              <div class="col-6 col-sm-4 col-lg-3">
                <el-statistic :value="dashboard.project">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      项目
                    </div>
                  </template>
                </el-statistic>
              </div>
              <div class="col-6 col-sm-4 col-lg-3">
                <el-statistic :value="dashboard.workflow">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      工作流
                    </div>
                  </template>
                </el-statistic>
              </div>
              <div class="col-6 col-sm-4 col-lg-3">
                <el-statistic :value="dashboard.task">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      任务
                    </div>
                  </template>
                </el-statistic>
              </div>
              <div class="col-6 col-sm-4 col-lg-3">
                <el-statistic :value="dashboard.issue">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      问题
                    </div>
                  </template>
                </el-statistic>
              </div>
              <div class="col-6 col-sm-4 col-lg-3">
                <el-statistic :value="dashboard.discussion">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      讨论
                    </div>
                  </template>
                </el-statistic>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-8">
        <div class="panel">
          <div class="_header">
            <div class="icon"><Order theme="outline" size="20" fill="currentColor" strokeLinejoin="bevel"/></div>
            <div class="title">指标分析</div>
          </div>
          <div class="_content">
            <el-progress
              v-show="loading2"
              class="mb-6"
              :percentage="100"
              :show-text="false"
              :indeterminate="true"
              :duration="2"
              :color="[{ color: '#904df5', percentage: 100 }]"
            />
            <div v-html="md.render(anlysis)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import markdownIt from 'markdown-it';
import { ListView, MarketAnalysis, Order } from '@icon-park/vue-next';
import { onMounted, reactive, ref } from 'vue';
import { ElStatistic, ElTooltip, ElIcon,ElSkeleton,ElProgress } from 'element-plus';
import Auth from '../../utils/auth';
const md = new markdownIt()
const dashboard = ref({});
const anlysis = ref('')
const loading = ref(true)
const loading2 = ref(true)
onMounted(async ()=>{
  // await // Auth.getPrtoken();
  await Promise.all([
    (async function(){
      dashboard.value = (await Auth.getDashboard()).content;
      loading.value = false
    })(),
    (async function(){
      anlysis.value = (await Auth.getDashboardAnlysis({
        onclose:()=>{
          loading2.value = false
        },
        onmessage:(e)=>{
          anlysis.value += JSON.parse(e).response;
        }
      })).content;
    })()
  ])
})

</script>