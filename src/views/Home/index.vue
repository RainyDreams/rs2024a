<template>  
  <header class="container">
    <h2 class="container__headline">欢迎来到<br/>赤子英金 RS2024-A 产品主页</h2>
  </header>
  <section class="container hero" id="hero_1">
    <div class="hero__inner">
      <div class="hero__images"><img class="hero__image" src="https://s21.ax1x.com/2024/08/04/pkvEocR.jpg"/></div>
      <div class="hero__content">
        <div class="hero__headline"><span>尝试我们的产品</span></div>
      </div>
    </div>
  </section>
  <section class="container hero" id="hero_2">
    <div class="hero__inner">
      <div class="hero__images"><img class="hero__image" src="https://s21.ax1x.com/2024/08/04/pkvEI39.jpg"/></div>
      <div class="hero__content">
        <div class="hero__headline"><span>了解我们的愿景</span></div>
      </div>
    </div>
  </section>
  <footer class="container">
    <h2 class="container__headline">梦想只是开始，探索永不止步.</h2>
  </footer>
</template>


<script setup>
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { onMounted } from 'vue';
gsap.registerPlugin(ScrollTrigger);
const heroList = [1,2]
onMounted(()=>{
  heroList.forEach((item,index)=>{
    console.log(item);
    gsap.to("#hero_"+item, {
      scrollTrigger: {
        scroller: ".routerpage",
        trigger: "#hero_"+item,
        scrub: true,
        pin: true,
        start: "center center",
        end: "bottom -100%",
        toggleClass: "active",
        ease: "power2"
      }
    });

    gsap.to("#hero_"+item+" .hero__image", {
      scrollTrigger: {
        scroller: ".routerpage",
        trigger: "#hero_"+item,
        scrub: 0.5,
        start: "top bottom",
        end: "bottom -300%",
        ease: "power2"
      },
      y: "-30%"
    });
  })
})

</script>


<style scoped lang="scss">
@import './index.scss';
</style>