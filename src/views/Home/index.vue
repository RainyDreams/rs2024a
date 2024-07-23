<template>
  <div class="page_home pageroot">
    <div class="_container">
      <div class="cardview cards row">
        <div class="card col-md-6 col-lg-4">
          <div class="_header">
            <div class="icon"></div>
            <div class="title">项目</div>
            <div class="number">22</div>
          </div>
          <div class="hr"></div>
          <div class="smallchart">
            <sm-chart></sm-chart>
          </div>
        </div>
        <div class="card"></div>
        <div class="card"></div>
      </div>
      <div class="taskview cards">
      </div>
      <h2></h2>
    </div>
    <div class="_sidebar">
      <div class="_header">
        <h2>今日概览</h2>
        <div class="btn-box"></div>
      </div>
      <div class="hr"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_home{
  display: flex;
}
</style>

<style>@import url(../../styles/grid.scss);</style>

<script setup>
import SmChart from '../../components/smchart.vue';
</script>