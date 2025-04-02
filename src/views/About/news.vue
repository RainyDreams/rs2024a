<template>
<div class="aichat">
  <div class="chatList">
    <div class="panel px-3 py-6 md:py-12 lg:py-16 xl:py-22">
      <div>
        <div class=" text-center">
          <h2 class="mt-10 mb-3 text-3xl/snug md:mt-14 md:mb-6 md:text-4xl/snug lg:text-5xl/snug font-semibold">圆满完成赤峰二中<span class="primary-text">百年校庆科技节</span>展示活动</h2>
          <ul class="columns-1 md:columns-2 mb-0 md:gap-1 md:mb-1">
            <img class="" src="https://s21.ax1x.com/2024/09/13/pAnvP3t.jpg"/>
            <img class="" src="https://s21.ax1x.com/2024/09/13/pAnjH91.jpg"/>
          </ul>
          <!-- <ul  class="columns-3 mb-2 gap-0 md:gap-1"> -->
            <!-- <img class="" src="https://s21.ax1x.com/2024/09/13/pAnjb1x.jpg"/>
            <img class="" src="https://s21.ax1x.com/2024/09/13/pAnjThR.jpg"/>
            <img class="" src="https://s21.ax1x.com/2024/09/13/pAnjoN9.jpg"/> -->
          <!-- </ul> -->
          <p class="text-slate-500">赤峰二中摄影社团 姚懿轩 摄</p>
          <p class="text-xl/7 md:text-3xl/snug lg:text-4xl/snug mb-3 mt-8">相关资料</p>
          <p class="text-lg/loose"><a href="https://github.com/RainyDreams/rs2024a">软件前端开源地址</a></p>
          <p class="text-lg/loose"><a href="https://docs.qq.com/pdf/DVWdteVFOaERMT0xP?">课题展示PPT（PDF）</a></p>
          <p class="text-lg/loose"><a href="https://mp.weixin.qq.com/s/o8-AmYUw8WYAXiojc0sY9g">课题展示文档</a></p>
        </div>
      </div>
    </div>
    <div class="panel chatcontent bg-white px-3 md:px-4 lg:px-5">
      <div v-html="render"></div>
    </div>
  </div>
</div>

</template>
<script setup>
// import 'highlight.js/styles/github.min.css'; // 如果要使用浅色 GitHub 主题

// import { ElAvatar } from 'element-plus';
import markdownIt from 'markdown-it';
const md = new markdownIt({
  typographer: true, // 使用高级的打字排版
  html: true,
})
const render = md.render(`
# 零本智协项目 前端部分

> 本文由零本智协大模型自动生成，仅供参考

## 项目概述
“零本智协”项目是赤峰二中2023级12班“零本智协”团队开展的一项具有创新性的研究性学习项目。其核心目标是依托先进的AI技术，构建一套全面且创新的市场项目解决方案体系，致力于将“零成本构建创新高效应用程序”这一理念转化为现实。本前端程序作为项目的关键枢纽，整合了一系列前沿技术与精心设计的功能模块，为用户提供了一个功能强大且易于使用的操作平台。
`)
</script>