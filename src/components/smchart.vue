<template>
  <!-- <v-chart ref="myChart" class="chart" :option="chartOption" /> -->
</template>
<!-- 
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';

const internalInstance = getCurrentInstance();
const echarts = internalInstance.appContext.config.globalProperties.$echarts;
const myChart = ref(null);

const chartOption = {
  grid: {
    top: 0,  // 上边缘距离容器顶部为0
    left: 0,  // 左边缘距离容器左边为0
    right: 0,  // 右边缘距离容器右边为0
    bottom: 0  // 下边缘距离容器底部为0
  },
  xAxis: {
    show:false,
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    show:false,
    type: 'value'
  },
  series: [
    {
      top: 0,  // 上边缘距离画布顶部为0
      right: 0,  // 右边缘距离画布右边为0
      bottom: 0,  // 下边缘距离画布底部为0
      left: 0,  // 左边缘距离画布左边为0
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(80, 81, 249, 0.6)'
          },
          {
            offset: 0.85,
            color: 'rgba(80, 81, 249, 0)'
          }
        ])
      },
      data: [320,560,480,750,640,990,1200],
      type: 'line',
      symbol:"none",
      showsymbol: false, 
      smooth: true
    }
  ]
};

onMounted(() => {
  if (myChart.value) {
    const dom = myChart.value.getDom()
    // debugger
    // myChart.value = echarts.init(dom, null, { renderer:'svg' });
    myChart.value.setOption(chartOption);
  }
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100px;
}
</style> -->