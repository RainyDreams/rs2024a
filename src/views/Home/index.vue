<template>
  <div class="site-content Crimson">
    <div class="panel bs-container py-6 md:py-12 lg:py-16 xl:py-22 mb-6">
      <div class="row">
        <div class="col-12 col-lg-6">
          <h1 class="mt-1 text-4xl font-semibold md:mt-10 md:text-6xl/snug lg:text-7xl/snug text-transparent logo_text">零本智协</h1>
          <h3 class="text-lg/7 md:text-xl/snug lg:text-2xl/snug text-slate-500 mb-1 ">首个提出多模型思考的团队</h3>
          <h3 class="text-lg/7 md:text-xl/snug lg:text-2xl/snug text-slate-500 mb-3 md:mb-5">20余天开发的研究性学习项目</h3>
          <h3 class="text-lg/7 md:text-2xl/snug lg:text-3xl/snug text-slate-500">我们的愿景</h3>
          <h5 class="text-xl/7 md:text-3xl/snug lg:text-4xl/snug">依托尖端的 AI 技术驱动力量，构建全面创新的市场项目解决方案体系，致力于让<span class="primary-text">「零成本构建创新高效应用程序」</span>成为现实。</h5>
        </div>
        <div class="col-12 col-lg-6">
          <div class="flex h-full items-center">
            <div v-if="!show_video" class="h-full w-full flex flex-col items-center justify-center min-h-64 hover:bg-slate-400 max-h-96 transition-all bg-slate-300 cursor-pointer"
              @click="show_video=true">
              <play-one theme="filled" size="50" fill="#fff" />
              <span class="text-white text-lg mt-2">观看宣传短片</span>
            </div>
            <iframe v-else class="aspect-video" style="width:100%;" src="https://player.bilibili.com/player.html?bvid=BV1b1pQeCEcm&as_wide=0&danmaku=false&autoplay=1&muted=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
          </div>  
        </div>
      </div>
    </div>
    
    <div class="bs-container">
      <div class="panel bg-white hover:scale-105 transition duration-500  ease rounded-3xl md:rounded-[45px] py-6 md:py-12 lg:py-16 xl:py-22 px-6 md:px-12 lg:px-16 xl:px-22 mb-6 md:mb-8 lg:mb-12">
        <!-- <div class="col-12"> -->
          <h2 class="mt-2 text-3xl/snug md:text-5xl/snug lg:text-6xl/snug font-semibold">专注于思考</h2>
          <h2 class="mb-3 text-3xl/snug md:text-5xl/snug lg:text-6xl/snug font-semibold primary-text w-fit">把剩下的工作交给我们</h2>
          <p class="text-xl/7 md:text-3xl/snug lg:text-4xl/snug mb-3">大模型深度思考的先行者</p>
          <p class="text-xl/7 md:text-3xl/snug lg:text-4xl/snug mb-3">以AI驱动项目流程的解决方案</p>
          <p class="text-xl/7 md:text-3xl/snug lg:text-4xl/snug mb-3">项目发展至今仍<span class="primary-text">零支出</span></p>
        <!-- </div> -->
      </div>
    </div>
    <div class="bs-container">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 ">
        <div class="panel bg-white hover:scale-105 transition duration-500 ease rounded-3xl md:rounded-[45px] py-6 md:py-10 lg:py-16 xl:py-22 px-6 md:px-12 lg:px-16 xl:px-22">
          <h2 class="mb-3 text-3xl/snug md:mt-6 md:mb-6 md:text-4xl/snug lg:text-5xl/snug font-semibold">安全</h2>
          <p class="text-xl/7 md:text-2xl/snug lg:text-3xl/snug">从数据的存储、传输到使用，每一个环节都经过精心设计和严格监控</p>
          <p class="text-xl/7 md:text-2xl/snug lg:text-3xl/snug">
            原创的 
            <span class="primary-text font-semibold text-2xl/tight md:text-4xl/tight lg:text-5xl/tight">3</span>
            <span class="text-xl md:text-2xl/tight lg:text-3xl/tight">token</span>
            + 
            <span class="primary-text font-semibold text-2xl md:text-4xl/tight lg:text-5xl/tight">1</span>
            <span class="text-xl md:text-2xl/tight lg:text-3xl/tight">授权</span>
            + 
            <span class="primary-text font-semibold text-2xl md:text-4xl/tight lg:text-5xl/tight">N</span>
            <span class="text-xl md:text-2xl/tight lg:text-3xl/tight">验证</span>模式
          </p>
        </div>
        <div class="panel bg-white hover:scale-105 transition duration-500 ease rounded-3xl md:rounded-[45px] py-6 md:py-12 lg:py-16 xl:py-22 px-6 md:px-12 lg:px-16 xl:px-22">
          <h2 class="mb-3 text-3xl/snug md:mt-6 md:mb-6 md:text-4xl/snug lg:text-5xl/snug font-semibold"><span class="primary-text">三思</span>而后行</h2>
          <h5 class="text-xl/7 md:text-2xl/snug lg:text-3xl/snug">三模型，三重分析：理解分析、尝试回复、批判总结。<br/>智能架构，思考问题更深入全面。迅速给出精准的解决方案，大大缩短项目周期，让你的业务<span class="primary-text">降本增效</span></h5>
        </div>
        <div class="panel bg-white hover:scale-105 transition duration-500 ease rounded-3xl md:rounded-[45px] py-6 md:py-12 lg:py-16 xl:py-22 px-6 md:px-12 lg:px-16 xl:px-22">
          <h2 class="mb-3 text-3xl/snug md:mt-6 md:mb-6 md:text-4xl/snug lg:text-5xl/snug font-semibold">创新 & 智能</h2>
          <h5 class="text-xl/7 md:text-3xl/snug lg:text-4xl/snug">我们创新性的在产品的诸多功能中融入了大模型技术，使得工作更加高效</h5>
          <p class="text-xl/7 md:text-3xl/snug lg:text-4xl/snug">率先提出<span class="primary-text">多模型深度思考</span>方案</p>
          <p class="text-xl/7 md:text-3xl/snug lg:text-4xl/snug">致力于为你提供独特而前沿的项目解决方案</p>
        </div>
        <div class="panel bg-white hover:scale-105 transition duration-500 ease rounded-3xl md:rounded-[45px] py-6 md:py-12 lg:py-16 xl:py-22 px-6 md:px-12 lg:px-16 xl:px-22">
          <h2 class="mb-3 text-3xl/snug md:mt-6 md:mb-6 md:text-4xl/snug lg:text-5xl/snug font-semibold">他们这样说...</h2>
          <p class="text-xl/7 md:text-2xl/snug lg:text-3xl/snug">李世正</p>
          <p class="text-gray-600 text-base/7 md:text-lg/snug">《咖啡因和牛磺酸对小鼠运动能力影响》实验小组组长 </p>
          <p class="mt-3 md:mt-4 lg:mt-5 text-xl/7 md:text-3xl/snug lg:text-4xl/snug align-bottom ">
            <span class="primary-text text-2xl/7 md:text-4xl/snug">“</span>零本智协AI工具与其他十分有名气的AI工具相比可为有过之而无不及，是一款实用性极强的工具<span class="primary-text text-2xl/7 md:text-4xl/snug">”</span>
          </p>
        </div>
      </div>
    </div>
    
    <div class="panel bs-container py-10 md:py-16 lg:py-20 xl:py-24 mt-20">
      <h2 class="mt-18 mb-6 text-4xl/snug md:mt-20 md:mb-10 md:text-5xl/snug lg:text-6xl/snug font-semibold text-center ">探索智能世界，尝试 LinkBrain</h2>
      <h5 class="text-center mb-14 md:mb-28">
        <router-link to="/">
          <el-button size="large" class="text-2xl py-7 px-8 primary-bg" type="primary">立即使用</el-button>
        </router-link>
      </h5>
    </div>
    <!-- <div class="panel bs-container items-center justify-center flex-col py-6 md:py-8 lg:py-16" style="">
      <p class="mt-2 mb-2 text-sm/loose md:mt-3 md:mb-3 md:text-lg/loose lg:text-xl/loose break-normal text-center text-slate-700">
        <span class="hover-self-primary-text cursor-pointer">网页加载速度</span> <span class="hover-self-primary-text cursor-pointer">流式传输</span> <span class="hover-self-primary-text cursor-pointer">权限管理</span>
      <span class="md:block"></span>
        <span class="hover-self-primary-text cursor-pointer">最大化减小服务器压力</span> <span class="hover-self-primary-text cursor-pointer">预加载</span> <span class="hover-self-primary-text cursor-pointer">多次请求</span>
      <span class="md:block"></span>
        <span class="hover-self-primary-text cursor-pointer">操作实时反馈</span> <span class="hover-self-primary-text cursor-pointer">错误报告</span> <span class="hover-self-primary-text cursor-pointer">通知</span> <span class="hover-self-primary-text cursor-pointer">并发</span> <span class="hover-self-primary-text cursor-pointer">用户心理学</span>
      </p>
      <h2 class="mt-2 mb-2 text-2xl/snug md:mt-4 md:mb-4 md:text-5xl/snug lg:text-6xl/snug font-semibold text-center">我们努力解决每一个技术问题</h2>
      <p class="mt-2 mb-2 text-sm/loose md:mt-3 md:mb-3 md:text-lg/loose lg:text-xl/loose break-normal text-center text-slate-700">
        <span class="hover-self-primary-text cursor-pointer">异步</span> <span class="hover-self-primary-text cursor-pointer">队列</span> <span class="hover-self-primary-text cursor-pointer">指纹</span> <span class="hover-self-primary-text cursor-pointer">标签</span> <span class="hover-self-primary-text cursor-pointer">Cookie</span> <span class="hover-self-primary-text cursor-pointer">Redis</span> <span class="hover-self-primary-text cursor-pointer">IndexDB</span> <span class="hover-self-primary-text cursor-pointer">PWA</span>
      <span class="md:block"></span>
        <span class="hover-self-primary-text cursor-pointer">截流</span> <span class="hover-self-primary-text cursor-pointer">防抖</span> <span class="hover-self-primary-text cursor-pointer">反馈</span> <span class="hover-self-primary-text cursor-pointer">验证</span> <span class="hover-self-primary-text cursor-pointer">Session</span> <span class="hover-self-primary-text cursor-pointer">SQLite</span> <span class="hover-self-primary-text cursor-pointer">响应式</span>
      <span class="md:block"></span>
        <span class="hover-self-primary-text cursor-pointer">假跳转</span> <span class="hover-self-primary-text cursor-pointer">缓存</span> <span class="hover-self-primary-text cursor-pointer">原子化</span> <span class="hover-self-primary-text cursor-pointer">FunctionCall</span>
      </p>
    </div> -->
    <!-- <div class="panel bs-container flex items-center justify-center flex-col" style="height: 100vh;">
      <h2 class="mt-2 text-3xl/snug md:text-5xl/snug lg:text-6xl/snug font-semibold text-center">站在巨人的肩膀上</h2>
    </div> -->
    <!-- Wenjuan Layer Begin --> 
     <!-- <div id="idy_floatdiv" style="position:fixed;display:flex;right:0;bottom:10%;width:30px;border-top-left-radius:6px;border-bottom-left-radius:6px;height:100px;background:#0052d9;line-height: 24px;writing-mode:vertical-rl;align-items:center;justify-content:center;font-family:PingFangSC-Regular;font-size:16px;"> <a href="https://wj.qq.com/s2/16266998/95a2/" target="blank" style="color:#FFFFFF;text-decoration:none;">问卷调查</a> </div>  -->
    <!-- Wenjuan Layer End -->
    <!-- <div class="panel bs-container flex items-center justify-center flex-col py-10" v-show="count">
      <h2 class="text-sm md:text-xs/snug lg:text-base/snug text-center">
        
      </h2>
    </div> -->
    <div class="copyright py-5 px-2 mt-16 md:mt-20">
      <p class="text-center mb-2"><span class="">赤子英金</span> · <span class="primary-text">零本智协</span></p>
      <p class="text-center mb-2 text-xs md:text-sm">Copyright © 2024 赤峰二中2023级12班研究性学习零本智协项目组 All rights reserved.</p>
      <p class="text-center mb-2 text-xs md:text-sm">自2024年8月18日开始统计，已累计稳定提供服务
        <span class="primary-text">{{ count }}</span></p>
      <p class="text-center text-sm">
        <!-- <a title="本站支持IPv6访问" target='_blank'><img style='display:inline-block;vertical-align:middle' alt="本站支持IPv6访问" src="https://static.ipw.cn/icon/ipv6-certified-s4.svg"></a>
        <a title="本站支持SSL安全访问" target='_blank'><img style='display:inline-block;vertical-align:middle' alt="本站支持SSL安全访问" src="https://static.ipw.cn/icon/ssl-s4.svg"></a> -->
        <a href="https://www.chiziingiin.top/license/user" class="mx-2">用户协议</a>
        <a href="https://www.chiziingiin.top/license/private" class="mx-2">隐私政策</a>
        <a href="https://www.chiziingiin.top/project/RS2024/explain" class="mx-2">名词介绍</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ElButton,ElProgress } from 'element-plus';
import { emitter } from '../../utils/emitter';
import { onMounted, ref } from 'vue';
import { PlayOne } from '@icon-park/vue-next';
import Auth from '../../utils/auth';
const count = ref('')
const show_video = ref(false)
emitter.on('basicInfo',(re)=>{
  // Auth.getBasicInfo({task:async function(re){
  //   return await new Promise((resolve,reject)=>{
  //     setTimeout(()=>{
        count.value = re.visitInfo.count+'次';
  //       resolve()
  //     },1000)
  //   })
  // }})
})
</script>

<style scoped >
@import url(./index.css);
</style>