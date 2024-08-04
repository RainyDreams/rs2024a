<template>  
  <header class="container">
    <h2 class="container__headline">欢迎来到<br/>赤子英金 RS2024-A 产品主页</h2>
  </header>
  <section class="scrollText">
    <div >CHIZIINGIIN DESIGN CHIZIINGIIN DESIGN CHIZIINGIIN DESIGN CHIZIINGIIN DESIGN</div>
  </section>
  <section class="container showMain">
    <h2 class="container__headline no showMainLine">
      <div class="maintext" >来！</div>
      <div class="maintext" >使</div>
      <div class="maintext" >用</div>
      <div class="maintext" >我</div>
      <div class="maintext" >们</div>
      <div class="maintext" >的</div>
      <div class="maintext" >协</div>
      <div class="maintext" >作</div>
      <div class="maintext" >产</div>
      <div class="maintext" >品</div>
      <div class="maintext" >，</div>
      <div class="maintext" >提</div>
      <div class="maintext" >高</div>
      <div class="maintext" >您</div>
      <div class="maintext" >的</div>
      <div class="maintext" >工</div>
      <div class="maintext" >作</div>
      <div class="maintext" >效</div>
      <div class="maintext" >率</div>
      <div class="maintext" >。</div>
    </h2>
  </section>
  <section class="scrollText">
    <div >CHIZIINGIIN DESIGN CHIZIINGIIN DESIGN CHIZIINGIIN DESIGN CHIZIINGIIN DESIGN</div>
  </section>
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
    <h2 class="container__headline">梦想只是开始  探索永不止步</h2>
  </footer>
  <div class="container__copyright">Copyright © 2024 CHIZIINGIIN All rights reserved.</div>
  <div class="container__copyright">关于我们的 <a href="">用户协议</a> 和 <a href="">隐私政策</a>。</div>
  <div style="height:5vh;"></div>
</template>


<script setup>
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { onMounted, ref } from 'vue';
gsap.registerPlugin(ScrollTrigger);
onMounted(()=>{
  gsap.to(".showMain", {
    scrollTrigger: {
      scroller: ".routerpage",
      trigger: ".showMain",
      pin: true,
      start: "center center",
      end: "bottom -100%",
      ease: "power2"
    },
  });
  gsap.fromTo('.showMainLine', {  x:0.6*window.innerWidth  }, {
    x: -Math.abs(document.querySelector('.showMainLine').scrollWidth - window.innerWidth),
    scrollTrigger: { 
      scroller: ".routerpage",
      trigger: ".showMain", 
      scrub: 0.5,
      ease: "power2",
      start: "center center"/*+index*window.innerHeight+"px"*/,
      end: "bottom top" /*+(index+1)*window.innerHeight+"px"*/,
    }
  });
  gsap.utils.toArray('.maintext').forEach((item,index)=>{
    gsap.fromTo(item, {  y:-0.6*index*window.innerHeight  }, {
      y: 0,
      scrollTrigger: { 
        scroller: ".routerpage",
        trigger: ".showMain", 
        ease: "power2",
        start: "top top"/*+index*window.innerHeight+"px"*/,
        end: "top top+=50vh"/*+(index+1)*window.innerHeight+"px"*/,
      }
    });
  });
  gsap.utils.toArray('.hero').forEach((item,index)=>{
    gsap.to(item, {
      scrollTrigger: {
        scroller: ".routerpage",
        trigger: item,
        scrub: 0,
        pin: true,
        start: "center center",
        end: "bottom -100%",
        toggleClass: "active",
        ease: "power2"
      }
    })
    gsap.to(item.querySelector(".hero__image"), {
      scrollTrigger: {
        scroller: ".routerpage",
        trigger: item,
        scrub: 0.5,
        start: "top bottom",
        end: "bottom -300%",
        ease: "power2"
      },
      y: "-30%"
    });
  });
  gsap.utils.toArray('.scrollText').forEach((section,index)=>{
    const [x,xEnd] = index%2 ? [0,-1*window.innerWidth]:[-1*window.innerWidth,0];
    gsap.fromTo(section.children[0], {  x  }, {
      x: xEnd,
      scrollTrigger: { 
        scroller: ".routerpage",
        trigger: section, 
        scrub: 1,
        ease: "power2",
        start: "top bottom",
        end: "bottom -200px",
      }
    });
  })
  
})

</script>


<style scoped lang="scss">
@import './index.scss';
</style>