<template>
  <div class="commonPage bg-slate-50 md:rounded-lg pb-0 h-dvh pt-3" style="display: flex;flex-direction: column;">
    <div class="scroll">
      <div class="">
        <div class=" max-w-3xl m-auto" style="margin-bottom: 0;">
          <div class="panel aichat">
            <div class="flex items-stretch flex-wrap" style="font-size:14px;width:100%; ">
                <!-- <el-skeleton :rows="3" animated v-show="welcome_loading" class="bg-white p-5 rounded-lg"></el-skeleton> -->
                <!-- <router-link  class="h-full"> -->
              <touch-ripple
                :class="`flex touch-ripple h-8  mt-2  items-center w-fit cursor-pointer text-sm rounded-full px-3 overflow-hidden select-none border `"
                :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                :color="'#6491fc'"
                :opacity="0.4"
                transition="ease-out"
                :duration="300"
                :keep-last-ripple="true"
                @click="tryAgain"
              >
                <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                <refresh theme="outline" size="18" fill="#6491fc"/>
                <!-- </div> -->
              </touch-ripple>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ainput" ref="ainput">
      <div class="">
        <div class="max-w-3xl m-auto">
          <div :class="` transition-all duration-200 `">
            <div :class="`ainput__wrapper cursor-pointer px-3 _active`">
              <div class="textarea el-input--large _input flex-1">
                <div
                  class="textarea__inner opacity-40 text-center font-normal text-base/8 select-none"
                  placeholder="正在连接"
                  type="textarea"
                  resize="none" 
                  size="large" 
                  autofocus 
                  :maxlength="2000"
                  style="resize: none; min-height: 30px; height: 30px;"
                >正在连接</div>
              </div>
              <!-- <el-input ></el-input> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class=" text-center text-slate-500 py-1 font-sans leading-none" style="font-size: 10px;">内容由零本 LinkBrain AI 生成，请仔细甄别</p>
  </div>
</template>
<script setup>
import { onActivated, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TouchRipple } from 'vue-touch-ripple'
import { Refresh } from '@icon-park/vue-next'
import 'vue-touch-ripple/style.css'
import Auth from '../../utils/auth'
const route = useRoute()
const router = useRouter()
const tryAgain = async () => {
  let model = route.query.model || ''
  // const e = await Auth.getAISessionID({model});
  // const {status, content} = e
  // if(status === "sus"){
    router.push('/chat/new?model='+model+'&mode=new')
  // }
}
onActivated(async () => {
  // console.log(1)
  await tryAgain()
})
</script>