<template>
    <div class=" w-full bg-paper px-6 py-12 relative min-h-svh">
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 text-center mb-16 md:mb-20 tracking-wide">
        我们的价值观
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div class="bg-white/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
          <h3 class="text-3xl font-serif font-semibold text-indigo-800 mb-5">
            站在巨人的肩膀上
          </h3>
          <p class="text-gray-800 font-serif leading-relaxed text-lg">
            我们秉持开放与传承的精神，深知任何创新都离不开前人的积累与探索。零本智协立足于全球科技发展的丰硕成果之上，积极拥抱开源知识、共享资源与先进技术，致力于加速自身成长，并推动科技社区的共同进步。我们尊重每一位贡献者的智慧，珍视每一次无私的分享，力求在前人的基础上，构建更加卓越、惠及未来的科技生态。
          </p>
        </div>

        <div class="bg-white/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
          <h3 class="text-3xl font-serif font-semibold text-emerald-800 mb-5">
            科技平权
          </h3>
          <p class="text-gray-800 font-serif leading-relaxed text-lg">
            我们坚信科技应服务于全人类，而非少数人的特权。零本智协致力于弥合数字鸿沟，降低科技的使用门槛，力求让先进的科技成果惠及更广泛的群体，特别是那些在科技资源上相对薄弱的地区与人群。我们相信，通过科技的普及与共享，能够促进社会公平，赋能每个人平等地享有科技进步带来的福祉，共同迈向更加美好的未来。
          </p>
        </div>

        <div class="bg-white/80 p-8 rounded-2xl shadow-xl backdrop-blur-md">
          <h3 class="text-3xl font-serif font-semibold text-teal-800 mb-5">
            低成本绿色
          </h3>
          <p class="text-gray-800 font-serif leading-relaxed text-lg">
            我们倡导高效、经济、可持续的科技发展模式。零本智协在追求技术创新的同时，始终关注资源效率与环境保护。我们力求以更低的资源消耗、更经济的投入，实现科技的可持续发展，并积极探索绿色科技的应用与推广，为构建环境友好型社会贡献力量。我们相信，科技进步与环境保护可以并行不悖，共同塑造人类与自然和谐共生的美好未来。
          </p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ValuesPage',
}
</script>

<style scoped>
/* 自定义纸张背景 */
.bg-paper {
  background-color: #f8f5f0; /* 纸张底色 */
  position: relative;
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4d0c8' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
}
</style>    