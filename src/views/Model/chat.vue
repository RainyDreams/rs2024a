<template>
  <div class="commonPage bg-slate-50 md:rounded-lg pb-0 h-dvh pt-3" style="display: flex;flex-direction: column;">
    <div id="wechat-tip" v-if="weixinDialogVisible" class="fixed flex top-0 left-0 w-full bg-slate-800 bg-opacity-40 text-white p-4 text-center text-sm  z-40">
      <span class="flex-1 pr-2">您正在使用微信访问本站，建议使用浏览器打开</span>
      <button @click="weixinDialogVisible = false" class="text-white rounded-full h-9 p-2 w-9 flex-shrink-0 bg-slate-900 bg-opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div 
      :class="`scroll active`"
      @scroll.passive="checkScollStatus"
    >
      <!-- <div class=""> -->
        <div class=" max-w-3xl m-auto" style="margin-bottom: 0;">
          <div class="aichat">
            <el-watermark :font="{color:'rgba(0, 0, 0, 0.001)'}" :gap="[0,0]" :rotate="-12"
              :content="['零本智协大模型 生成内容仅供参考', sessionID,fingerprint]">
              <div class="title text-center w-full text-xs sticky top-0 z-30 bg-slate-50 pb-1 truncate px-5" >{{ title }}</div>
              <div class="system mb-3 md:mb-4 lg:mb-5 block">
                  <div class="flex items-stretch flex-wrap" style="font-size:14px;width:100%; ">
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center w-fit cursor-pointer text-sm rounded-l-full pr-2 pl-3 py-1 overflow-hidden select-none border `"
                      :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                      :color="'#4e81fc'"
                      :opacity="0.4"
                      transition="ease-out"
                      :duration="200"
                      :keep-last-ripple="false"
                      @click="router.go(-2)"
                    >
                      <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                      <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                      <left  theme="outline" size="18" fill="#4e81fc"/>
                      <!-- </div> -->
                    </touch-ripple>
                  <!-- </router-link> -->
                  <router-link to="/home" class="h-full">
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center mr-1 border-l-0 w-fit cursor-pointer text-sm rounded-r-full pl-2 pr-3 py-1 overflow-hidden select-none border text-slate-950`"
                      :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                      :color="'#4e81fc'"
                      :opacity="0.4"
                      transition="ease-out"
                      :duration="200"
                      :keep-last-ripple="false"
                    >
                      <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                      <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                      <home  theme="outline" size="18" fill="#4e81fc"/>
                      <!-- </div> -->
                    </touch-ripple>
                  </router-link>
                  <router-link to="/model/square" class="h-full">
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center text-center mr-1  w-fit cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border text-slate-950`"
                      :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                      :color="'#4e81fc'"
                      :opacity="0.4"
                      transition="ease-out"
                      :duration="200"
                      :keep-last-ripple="false"
                    >
                      <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                      <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                      <SmartOptimization theme="outline" class="mr-1" size="18" fill="#4e81fc"/>
                      <div class="text-base leading-none" style="color:rgb(18,30,60);">模型库</div>
                      <!-- </div> -->
                    </touch-ripple>
                  </router-link>
                  <router-link to="/model/history" class="h-full"  v-if="loginStatus" >
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center text-center mr-1  w-fit cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border text-slate-950`"
                      :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                      :color="'#4e81fc'"
                      :opacity="0.4"
                      transition="ease-out"
                      :duration="200"
                      :keep-last-ripple="false"
                    >
                      <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                      <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                      <history  theme="outline" class="mr-1" size="18" fill="#4e81fc"/>
                      <div class="text-base leading-none" style="color:rgb(18,30,60);">聊天历史</div>
                      <!-- </div> -->
                    </touch-ripple>
                  </router-link>
                  <touch-ripple
                    :class="`flex touch-ripple h-8  mt-2  items-center w-fit mr-1 cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border `+(showModelDetail?'text-slate-950':'text-slate-950')"
                    :style="{ clipPath: 'none', backgroundColor: showModelDetail?'#4e81fc44':'#fff' }"
                    :color="showModelDetail?'#fff':'#4e81fc'"
                    :opacity="0.4"
                    transition="ease-out"
                    :duration="200"
                    :keep-last-ripple="false"
                    @click="showModelDetail=!showModelDetail"
                  >
                    <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                    <img alt="头像" :src="model_info.img" class="mr-1 w-4 h-4 rounded-full" />
                    <div class="text-base leading-none">{{ model_info.name || "获取中" }}</div>
                    <!-- </div> -->
                  </touch-ripple>
                  <touch-ripple
                    :class="`flex touch-ripple h-8  mt-2  items-center w-fit mr-1 cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border `+(showInfo?'text-slate-950':'text-slate-950')"
                    :style="{ clipPath: 'none', backgroundColor: showInfo?'#ffedd5':'#fff' }"
                    :color="showInfo?'#f7deb7':'#f7deb7'"
                    :opacity="0.4"
                    transition="ease-out"
                    :duration="200"
                    :keep-last-ripple="false"
                    @click="showInfo=!showInfo"
                  >
                    <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                      <info theme="outline" class="mr-1" size="18" fill="#ff9d00"/>
                      <div class="text-base leading-none">信息</div>
                    <!-- </div> -->
                  </touch-ripple>
                  <!-- <router-link to="/quant" class="h-full" >
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center text-center mr-1  w-fit cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border `"
                      :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                      :color="'#f206'"
                      :opacity="0.4"
                      transition="ease-out"
                      :duration="200"
                      :keep-last-ripple="true"
                    >
                      <fire theme="outline" class="mr-1" size="18" fill="#f20"/>
                      <div class="text-base leading-none" style="color:#f20">零本量化</div>
                    </touch-ripple>
                  </router-link> -->
                  <router-link :to="`/login?url=%2Fchat%2F%3Fs%3D${sessionID}`" class="h-full" v-if="!loginStatus" >
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center text-center mr-1  w-fit cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border text-slate-950`"
                      :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                      :color="'#4e81fc'"
                      :opacity="0.4"
                      transition="ease-out"
                      :duration="200"
                      :keep-last-ripple="false"
                    >
                      <!-- <div class="flex items-center w-fit bg-white border rounded-full py-1 px-3 overflow-hidden cursor-default hover:bg-slate-50 transition"> -->
                      <!-- <img alt="主页" src="/logo.webp" class="mr-1 w-4 h-4 rounded-full" /> -->
                      <avatar theme="outline" class="mr-1" size="18" fill="#4e81fc"/>
                      <div class="text-base leading-none" style="color:rgb(18,30,60);">登录</div>
                      <!-- </div> -->
                    </touch-ripple>
                  </router-link>
                  
                  <!-- <div v-show="!welcome_loading" class="text-base/relaxed sm:text-base/relaxed md:text-base/relaxed lg:text-lg/relaxed" v-html="md.render(welcome)"></div> -->
                  <!-- <p><router-link to="/model/history">聊天历史</router-link></p> -->
                </div>
                <div v-if="!welcome_loading && !loginStatus && chatList.length!=0" class="w-full">
                  <div class="text-sm text-slate-800 w-full text-center mt-4 lg:mt-8 opacity-80">未登录，正在以访客身份对话，对话不会被保留</div>
                </div>
                <div v-show="showModelDetail">
                  <div class="min-w-fit w-64 z-10 flex flex-col mt-2 top-10 left-0 bg-white border rounded-xl p-3 duration-100">
                    <div class="text-sm/relaxed mb-2 flex-1">{{ model_info.desc }}</div>
                    <div class="flex items-center opacity-80 text-xs">
                      <el-avatar alt="头像" :src="model_info.createUser.avatar" class="mr-1" :size="18" />
                      <div class="username">{{ model_info.createUser.nickname }}</div>
                    </div>
                  </div>
                </div>
                <div v-show="showInfo">
                  <div class="min-w-fit w-64 z-10 flex flex-col mt-2 left-4 right-4 bg-white border rounded-xl p-3 duration-100">
                    <p>查看<router-link class="text-blue-500" to="/about/log">更新日志</router-link></p>
                    <!-- <p class="mb-2">了解<router-link class="text-blue-500" to="/model/story">背后的故事</router-link></p> -->
                    <p class="mb-2"><a target="_blank" class="text-blue-500" href="https://www.chiziingiin.top/">赤子英金官网</a></p>
                    <div class="w-full text-sm/relaxed">提示：由于服务器成本原因，对大模型所有用户限制如下 每分钟不超过15次，每天不超过1000次提问。</div>
                  </div>
                </div>
                <!-- 欢迎 -->
                <div :class="`duration-1000 trasition-all overflow-hidden w-full `+(chatList.length!=0?'max-h-0':'max-h-96')">
                  <div :class="`chat_welcome mt-14 sm:mt-18 md:mt-24 xl:mt-30 w-full `">
                    <h2 v-if="!welcome_loading" :class="`text-center w-full text-3xl animate__animated md:text-4xl lg:text-5xl font-bold `+((chatList.length==0 && !welcome_loading)?'animate__fadeInDown':'animate__fadeOutUp')">你好！来聊点什么吧</h2>
                    <!-- <h2 :class="`text-center w-full text-3xl md:text-4xl lg:text-5xl font-bold animate__animated `+((chatList.length==0 && welcome_loading)?'animate__fadeInUp':'animate__fadeOutDown')">正在建立连接</h2> -->
                  </div>                
                </div>
              </div>
              <div class="chatList" style="min-height: 0px;" id="ai_chatList">
                <template v-for="(item,i) in chatList" class="chatList" :key="i">
                  <template  v-if="item.role == 'user'">
                    <div class="user " :data-id="i">
                      <!-- <el-avatar class="h-6 w-6 md:h-10 md:w-10" alt="头像">你</el-avatar> -->
                      <div class="text-xs text-slate-800 w-full text-center mb-2 opacity-50">{{ item.formatSendTime }}</div>
                      <div class="flex items-end group">
                        <el-tooltip
                          class="box-item opacity-0 group-hover:opacity-100"
                          effect="dark"
                          content="复制"
                          placement="bottom-start"
                        >
                          <div 
                            @click="copyText(item.content)"
                            class="p-2 hover:bg-slate-100 border-transparent mb-1 opacity-50 hover:opacity-100 hover:border-slate-200 border h-[35px] mr-2 w-[35px] transition-all rounded-md cursor-pointer">
                            <Copy theme="outline" size="16" fill="#0007" :strokewidth="5" strokeLinejoin="bevel"/>
                          </div>
                        </el-tooltip>
                        <div class="chatcontent min-h-8 border border-blue-200 break-words w-fit min-w-6 px-4 py-2 rounded-3xl bg-blue-100 text-blue-900 whitespace-pre-wrap text-base/relaxed sm:text-base/relaxed md:text-base/relaxed lg:text-lg/relaxed max-w-full lg:max-w-md"
                        >
                          <div>{{item.content}}</div>
                          <template v-if="item.photo?.meta">
                            <div class="py-2"><img class="max-w-full rounded-2xl text-slate-400 text-sm" :src="item.photo.blob" alt="[图片]隐私保护已删除"></div>
                          </template>
                          <template v-if="item.audio?.blob && item.audio?.meta">
                            <div class="py-2"><audio class="max-w-full" controls :src="item.audio.blob" ></audio></div>
                          </template>
                          <template v-if="item.audio?.uri">
                            <div class="py-2">
                              <audio v-if="item.audio.blob" class="max-w-full" controls :src="item.audio.blob" ></audio>
                              <p v-else>
                                [音频]为保护隐私，已采用匿名发送
                              </p>
                            </div>
                          </template>
                        </div>
                        
                      </div>
                      <div class="analysis max-w-full mt-2" v-show="item.status != 'no_analysis' && item.analysis">
                        <!-- <p v-show="item.status == 'analysis'">正在思考和分析问题...</p> -->
                        <div 
                          :class="`_text text-gray-500 text-xs lg:text-sm px-4 py-5  border border-slate-200 bg-white rounded-xl `+(item.status=='analysis'?'active':'')"
                          v-show="item.show_thought" 
                        >
                          <div v-for="(item,i2) in item.renderedAnalysis" :key="i2" v-html="item" class="chat_animate_in"></div>
                        </div>
                        <p v-if="item.analysis" @click="item.show_thought = !item.show_thought" class="flex items-center cursor-pointer justify-end">
                          <span class="py-2 px-3 border border-slate-200 bg-white mt-2 items-center leading-none hover:bg-slate-100  transition-all rounded-lg cursor-pointer flex">
                            <SmartOptimization class="h-fit w-fit mr-1" theme="outline" size="16" fill="currentColor"/>{{item.show_thought?'收起':'展开'}}思考过程
                          </span>
                          <!-- <Down v-show="!item.show_thought" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/>
                          <Up v-show="item.show_thought" class="rounded-full bg-gray-500 ml-1" theme="outline" size="14" fill="#fff" strokeLinejoin="bevel"/> --> 
                        </p>
                      </div>
                      <!-- </el-watermark> -->
                    </div>
                  </template>
                  <template v-else-if="item.role == 'assistant'">
                    <div class="assistant" :data-id="i">
                      <div class="chatcontent text-sm mt-4 px-2 sm:text-base/relaxed md:text-base/relaxed lg:text-lg/relaxed xl:text-lg/loose" >
                        <!-- <template > -->
                        <div v-for="(item,i2) in item.renderedContent" :key="i2" v-html="item" class="chat_animate_in"></div>
                        <!-- </template> -->
                      </div>
                      <div class="flex">
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="复制"
                          placement="bottom-start"
                        >
                          <div 
                            @click="copyText(item.content)"
                            class="p-2 hover:bg-slate-100 border-transparent hover:border-slate-200 border transition-all rounded-md cursor-pointer mr-1">
                            <Copy theme="outline" size="16" fill="#0007" :strokewidth="5" strokeLinejoin="bevel"/>
                          </div>
                        </el-tooltip>
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          content="按格式复制"
                          placement="bottom-start"
                        >
                          <div 
                            @click="copyHtml(i)"
                            class="p-2 hover:bg-slate-100 border-transparent hover:border-slate-200 border transition-all rounded-md cursor-pointer mr-1">
                            <DocDetail theme="outline" size="16" fill="#0007" :strokewidth="5" strokeLinejoin="bevel"/>
                          </div>
                        </el-tooltip> 
                        <div v-if="item.model" class="flex leading-none items-center text-slate-400 text-xs">{{ item.model }}模型回复</div>
                      </div>
                      <!-- </el-watermark> -->
                    </div>
                  </template>
                  <template v-else-if="item.role == 'lingben'">
                    <div class="assistant" :data-id="i">
                      <div class="chatcontent animate_chat text-sm mt-4 px-2 sm:text-base/relaxed md:text-base/relaxed lg:text-lg/relaxed xl:text-lg/loose" >
                        <template v-for="(item,i2) in item.renderedContent">
                          <div v-html="item"></div>
                        </template>
                      </div>
                    </div>
                  </template>
                </template>
                <div class="my-5">
                  <div class="text-slate-700 opacity-85 border-slate-200  border rounded-md cursor-pointer hover:bg-slate-100 px-3 py-1 text-sm/loose lg:text-base/loose my-2" 
                  v-for="(item) in suggestions" @click="ask(item)">
                    {{ item }}
                  </div>
                </div>
              </div>
            </el-watermark>
          </div>
        </div>
      <!-- </div> -->
    </div>
    <div :data-show="uploadPhotoDialogVisible" class="fixed flex justify-center items-end inset-0 bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-svh autohidden">
      <div class="bg-slate-50 rounded-lg shadow-lg max-w-3xl w-full overflow-hidden pb-4 flex flex-col max-h-[320px] min-h-64">
        <div class="p-4 flex justify-between items-center w-full">
          <h2 class="text-lg font-semibold">上传图片</h2>
          <button v-show="!uploadPhoto.blob" @click="uploadPhotoDialogVisible = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button v-show="uploadPhoto.blob" @click="uploadPhotoDialogVisible = false" class="bg-blue-200 text-blue-500 font-bold rounded-md px-4 py-2">
            完成
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1 flex flex-col">
          <!-- 提示区域 -->
          <div v-if="uploadPhoto.blob" class="py-4 px-4 bg-green-100 max-w-md w-full mx-auto font-bold text-green-700 rounded-md text-lg text-center mb-4">
            <p>上传成功</p>
          </div>
          <!-- 文件上传区域 -->
          <div class="flex flex-col items-center justify-center space-y-4 w-full">
            <div v-if="uploadPhoto.blob" class="relative w-full max-w-md mb-4">
              <img
                :src="uploadPhoto.blob"
                alt="上传的图片"
                class="w-full h-auto rounded-lg shadow-lg shadow-slate-200 object-cover transition-transform hover:scale-105 duration-500"
              />
              <!-- 清除按钮 -->
              <button
                @click="clearUploadPhoto"
                class="absolute bottom-2 right-2 bg-red-500 leading-none items-center px-2 py-1 rounded-full text-white opacity-60 flex hover:bg-red-600 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                清除图片
              </button>
            </div>
            <!-- 自定义文件上传按钮 -->
            <div :data-show="!uploadPhoto.blob" class="autohidden lg:mt-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md">
              <!-- 拍照按钮 -->
              <label
                for="cameraInput"
                v-show="mobile"
                class="w-full py-3 px-6 bg-green-500 text-white font-medium rounded-lg cursor-pointer hover:bg-green-600 transition-colors duration-300 text-center"
              >
                拍照
              </label>
              <input
                id="cameraInput"
                type="file"
                ref="cameraInput"
                @change="handlePhoto"
                accept="image/*"
                capture="environment"
                class="hidden"
              />
              <label
                for="galleryInput"
                class="w-full py-3 px-6 bg-blue-500 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-300 text-center"
              >
                从相册选择
              </label>
              <input
                id="galleryInput"
                type="file"
                ref="galleryInput"
                @change="handlePhoto"
                accept="image/*"
                class="hidden"
              />
            </div>
            <!-- 提示信息 -->
            <p v-if="!uploadPhoto.blob" class="text-gray-500 text-sm text-center">
              请选择一张图片进行上传。
            </p>
          </div>
        </div>
      </div>
    </div>
    <div :data-show="uploadPhotoDialogLoading" class="fixed flex justify-center items-center inset-0 bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-svh autohidden">
      <div class="p-6 bg-white rounded-3xl">
        <svg class="animate-spin inline-block ml-1 mr-2 h-5 w-5 text-blue-500 " style="animation-duration:0.6s !important;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>上传中
      </div>
    </div>
    <div :data-show="recordMode" class="fixed flex justify-center items-end inset-0 bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-svh autohidden">
      <div class="bg-slate-50 rounded-lg shadow-lg max-w-xl w-full overflow-hidden pb-4 flex flex-col max-h-[320px] min-h-64">
        <div class="p-4 flex justify-between items-center w-full">
          <h2 class="text-lg font-semibold">录音</h2>
          <button @click="closeRecordDialog" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          <!-- 录音时间显示 -->
          <div
            v-show="isRecording"
            class="relative mb-4 text-lg font-semibold text-blue-600 animate-pulse"
          >
            <span class="text-transparent bg-clip-text bg-blue-500">
              {{ recordTime }} s
            </span>
          </div>
          <button
            @click="toggleRecording"
            id="recordAudio"
            :class="[
              'relative px-6 py-3 flex select-none text-lg font-semibold rounded-md shadow-md transition duration-300 transform',
              isRecording 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white scale-105' 
                : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
            ]"
            aria-label="按住录音"
            tabindex="0"
          >
            <Acoustic theme="outline" size="20" fill="currentColor" :strokeWidth="4" strokeLinejoin="bevel" />
            <span class="leading-none ml-2">{{isRecording?'正在':'开始'}}录音</span>
          </button>
        </div>
      </div>
    </div>
    <div class="ainput" ref="ainput">
      <div class="">
        <div class="max-w-3xl m-auto">
          <div class="relative w-full">
            <div :class="`relative flex w-full ml-3 pt-1 pb-1 ease  `+(show_menu?'bottom-0 opacity-100 relative':'opacity-0')" style="position:absolute;bottom:-25px;transition: bottom 0.35s,opacity 0.3s;left:0;">
              <touch-ripple
                :class="`touch-ripple w-fit flex-shrink-0 mr-1 cursor-pointer text-sm rounded-lg items-center px-2 py-2 overflow-hidden select-none border text-slate-700 bg-slate-50`"
                :style="{ clipPath: 'none', backgroundColor: '#fff' }"
                :color="'#f1f5f9'"
                :opacity="0.4"
                transition="ease-out"
                :duration="200"
                :keep-last-ripple="false"
                @click="applynew"
              >
                <span class="flex items-center align-middle"><plus class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/></span>
              </touch-ripple>
              <div v-show="statusText"
                class="text-base md:text-lg pointer-events-none lg:text-xl text-green-800 w-fit  text-left font-bold absolute bottom-10 left-2 pb-0 mt-1 mb-2">
                <span class=" flex items-center bg-slate-50 z-30 px-3 rounded-3xl py-2 border border-slate-200">
                    <svg class="animate-spin inline-block ml-1 mr-2 h-5 w-5 text-blue-500 " style="animation-duration:0.6s !important;animation-timing-function: cubic-bezier(0.32, 0.59, 0.69, 0.46) !important;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg><span class="active-text text-lg leading-none align-bottom text-blue-500">{{ statusText }}</span>
                </span>
              </div>
              <touch-ripple
                :class="`touch-ripple transition-all pointer-events-none duration-100 delay-75 ${scrollStatus?'opacity-100 visible':'opacity-0 invisible'} shadow-xl z-10 shadow-slate-400  absolute bottom-20 left-0 mx-auto right-0 w-fit flex-shrink-0 cursor-pointer text-sm rounded-full items-center px-2 py-2 overflow-hidden select-none bg-white border border-slate-300 text-slate-500`"
                :style="{ clipPath: 'none', backgroundColor: '#fff' }"
                :color="'#f1f5f9'"
                :opacity="0.4"
                transition="ease-out"
                :duration="200"
                :keep-last-ripple="false"
                @click="scrollToBottom"
              >
                <span class="flex items-center align-middle"><arrow-down class="h-fit w-fit" theme="outline" size="16"  fill="currentColor"/></span>
              </touch-ripple>
              <div class="flex pl-1 ss-none overflow-x-auto scroll-container">
                <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-2 cursor-pointer text-sm rounded-lg items-center px-3 py-2 overflow-hidden select-none border `+(useAnalysis?'text-blue-600 bg-blue-100 border-blue-500':'border-slate-200 text-slate-700 bg-slate-50')"
                  :style="{ clipPath: 'none', backgroundColor: useAnalysis?'#3b82f6':'#fff' }"
                  :color="useAnalysis?'#dbeafe':'#f1f5f9'"
                  :opacity="0.4"
                  transition="ease-out"
                  :duration="200"
                  :keep-last-ripple="false"
                  @start="analysisBtn"
                >
                  <span class="flex items-center align-middle"><SmartOptimization class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">思考</span></span>
                </touch-ripple>
                <touch-ripple
                  :class="`relative touch-ripple w-fit flex-shrink-0 mr-2 cursor-pointer text-sm rounded-lg items-center px-3 py-2 select-none border `+(usePreview?'text-blue-600 bg-blue-100 border-blue-500':'border-slate-200 text-slate-700 bg-slate-50')"
                  :style="{ clipPath: 'none', backgroundColor: usePreview?'#3b82f6':'#fff' }"
                  :color="usePreview?'#dbeafe':'#f1f5f9'"
                  :opacity="0.4"
                  transition="ease-out"
                  :keep-last-ripple="false"
                  :duration="200"
                  @start="previewBtn"
                >
                <!-- <div
                  v-if="isFirstVisit"
                  class="absolute z-20 bottom-full left-1/2 text-slate-800 bg-white border text-sm px-3 py-2 rounded-md opacity-100 visible transition-opacity duration-300"
                  @click="qx"
                >
                  推荐你打开这个新增的功能哦！
                </div> -->
                  <span class="flex items-center align-middle"><PreviewOpen class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">预览<span class="text-[10px] ml-[2px]">测试</span></span></span>
                </touch-ripple>
                <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-2 cursor-pointer text-sm rounded-lg items-center px-3 py-2 overflow-hidden select-none border `+(useInternet?'text-blue-600 bg-blue-100 border-blue-500':'border-slate-200 text-slate-700 bg-slate-50')"
                  :style="{ clipPath: 'none', backgroundColor: useInternet?'#3b82f6':'#fff' }"
                  :color="useInternet?'#dbeafe':'#f1f5f9'"
                  :opacity="0.4"
                  transition="ease-out"
                  :keep-last-ripple="false"
                  :duration="200"
                  @start="internetBtn"
                >
                  <span class="flex items-center align-middle"><earth class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">搜索</span></span>
                </touch-ripple>
                <!-- <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-2 cursor-pointer text-sm rounded-lg items-center px-3 py-2 overflow-hidden select-none border `+(useDraw?'text-blue-600 bg-blue-100 border-blue-500':'border-slate-200 text-slate-700 bg-slate-50')"
                  :style="{ clipPath: 'none', backgroundColor: useDraw?'#3b82f6':'#fff' }"
                  :color="useDraw?'#dbeafe':'#f1f5f9'"
                  :opacity="0.4"
                  transition="ease-out"
                  :keep-last-ripple="false"
                  :duration="200"
                  @start="drawBtn"
                >
                  <span class="flex items-center align-middle"><platte class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">绘图<span class="text-[10px] ml-[2px]">测试</span></span></span>
                </touch-ripple> -->
                <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-2 cursor-pointer text-sm rounded-lg items-center px-3 py-2 overflow-hidden select-none border `+(useTask?'text-blue-600 bg-blue-100 border-blue-500':'border-slate-200 text-slate-700 bg-slate-50')"
                  :style="{ clipPath: 'none', backgroundColor: useTask?'#3b82f6':'#fff' }"
                  :color="useTask?'#dbeafe':'#f1f5f9'"
                  :opacity="0.4"
                  transition="ease-out"
                  :keep-last-ripple="false"
                  :duration="200"
                  @start="taskBtn"
                >
                  <span class="flex items-center align-middle"><list-two class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">多任务<span class="text-[10px] ml-[2px]">测试</span></span></span>
                </touch-ripple>
                <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-2 cursor-pointer text-sm rounded-lg items-center px-3 py-2 overflow-hidden select-none border `+(usePhoto?'text-blue-600 bg-blue-100 border-blue-500':'border-slate-200 text-slate-700 bg-slate-50')"
                  :style="{ clipPath: 'none', backgroundColor: usePhoto?'#3b82f6':'#fff' }"
                  :color="usePhoto?'#dbeafe':'#f1f5f9'"
                  :opacity="0.4"
                  transition="ease-out"
                  :keep-last-ripple="false"
                  :duration="200"
                  @click="openUploadPhotoDialog"
                >
                  <span class="flex items-center align-middle"><pic class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">图片</span></span>
                </touch-ripple>
                <touch-ripple
                    :class="`touch-ripple w-fit flex-shrink-0 mr-2 cursor-pointer text-sm rounded-lg items-center px-3 py-2 overflow-hidden select-none border `+(useAudio?'text-blue-600 bg-blue-100 border-blue-500':'border-slate-200 text-slate-700 bg-slate-50')"
                    :style="{ clipPath: 'none', backgroundColor: '#fff' }"
                    :color="'#bfdbfe'"
                    :opacity="0.4"
                    transition="ease"
                    :duration="200"
                    :data-show="!useAudio"
                    :keep-last-ripple="false"
                    @start="openRecordDialog"
                  >
                    <span class="flex items-center align-middle"><Acoustic theme="outline" size="16" fill="currentColor" :strokeWidth="5" strokeLinejoin="bevel"/><span class="h-fit leading-none ml-1">音频</span></span>
                </touch-ripple>
                <div class="h-full w-5 flex-shrink-0"></div>
              </div>
            </div>
          </div>
          <div :class="` `+(show_menu?'rounded-b-[25px] delay-200':'rounded-[25px]')" style="">
            <div :class="`ainput__wrapper items-stretch border border-slate-200 shadow-lg focus-within:shadow-xl focus-within:shadow-slate-200 transition-all duration-500 focus-within:border-slate-300 shadow-slate-100`">
              <div 
                class="textarea _input flex-1 leading-none transition-all max-h-72 md:max-h-80 min-h-8"
                :data-show="!isRecording" 
                id="input_chat_ai_div"
                style="height:var(--inputContainerHeight);--inputContainerHeight:64px;">
                ><textarea
                  id="input_chat_ai"
                  class="textarea__inner w-full text-base/6 py-1 font-medium max-h-72 md:max-h-80 min-h-16"
                  type="textarea"
                  resize="none" 
                  size="large" 
                  autofocus 
                  :maxlength="40960"
                  autocomplete="off"
                  :placeholder="placeholder" 
                  @keydown.enter="handleEnter"
                  @input="handleInput"
                  style="resize:none;min-height: 32px;height:var(--inputContainerHeight);"
              ></textarea></div>
              <div :class="`flex flex-col justify-between items-center`">
                <span class="text-xs text-right opacity-50 text-slate-800 py-2" v-show="(now>=99)">{{ now }}</span>
                <div :class="`_number flex-1`">
                  <!-- <touch-ripple
                    :class="`touch-ripple items-center justify-center h-8 w-8  mr-1 cursor-pointer rounded-full overflow-hidden transition select-none flex `+((show_menu)?'bg-blue-100 text-blue-500':'bg-slate-100 text-slate-500')"
                    :style="{ clipPath: 'none', backgroundColor: '#fff' }"
                    :color="'#f1f5f9'"
                    :opacity="0.4"
                    transition="ease-out"
                    :duration="200"
                    :keep-last-ripple="false"
                    @start="show_menu=!show_menu"
                  >
                    <component  :is="ApplicationMenu" :class="`cursor-pointer transition w-fit h-fit `" theme="outline" size="18" fill="currentColor"/>
                  </touch-ripple> -->
                  <touch-ripple
                    :class="`touch-ripple items-center justify-center h-8 w-8  mr-1 cursor-pointer transition rounded-full overflow-hidden select-none `+(showStop?'hidden ':'flex ')+(sendActive?'text-white bg-blue-500':' bg-slate-100 text-slate-500')"
                    :style="{ clipPath: 'none', backgroundColor: '#3b82f6' }"
                    :color="'#fff'"
                    :opacity="0.4"
                    transition="ease"
                    :duration="200"
                    :keep-last-ripple="false"
                    @start="send()"
                  >
                    <up theme="outline" size="18" fill="currentColor" :strokeWidth="5" strokeLinejoin="bevel"/>
                  </touch-ripple>
                  <touch-ripple
                    :class="`touch-ripple text-white items-center justify-center h-8 w-8  mr-1 cursor-pointer rounded-full overflow-hidden select-none border border-blue-500 `+(showStop?'flex':'hidden')"
                    :style="{ clipPath: 'none', backgroundColor: '#3b82f6' }"
                    :color="'#fff'"
                    :opacity="0.4"
                    transition="ease"
                    :duration="200"
                    :keep-last-ripple="false"
                    @start="stop()"
                  >
                    <PauseOne theme="outline" size="18" fill="currentColor" :strokeWidth="5" strokeLinejoin="bevel"/>
                  </touch-ripple>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio v-if="audioUrl" :src="audioUrl" controls class="mt- hidden"></audio>
    <div :class="'transition-all h-0 duration-300 ease-linear '+(chatList.length == 0?`max-limit md:h-20 lg:h-32 `:'')"></div>
    <p class=" text-center text-slate-500 py-1 font-sans leading-none" style="font-size: 10px;">内容由零本 LinkBrain AI 生成，请仔细甄别</p>
  </div>
</template>
<script setup>
import markdownIt from 'markdown-it';
import imageCompression from 'browser-image-compression';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import math, { use } from 'markdown-it-texmath';
import Katex from 'katex';
import hljs from 'highlight.js';
// import 'highlight.js/styles/github.min.css'; // 如果要使用浅色 GitHub 主题
import { onActivated, onMounted, ref,reactive, watch, nextTick } from "vue"
import Auth from "../../utils/auth";
import { throttle,functionCallPlugin, getRadomString, debounce } from '../../utils/helpers'
import { ElInput,ElButton,ElMessage,ElAvatar,ElWatermark,ElSkeleton,ElTooltip,ElSwitch,ElSelect,ElOption, CASCADER_PANEL_INJECTION_KEY, ElMessageBox, dayjs } from "element-plus"; 
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { Down,Up,Copy,DocDetail,PauseOne,ListTwo,Acoustic,Platte,ArrowDown,Pic,Plus,Avatar,PreviewOpen,History,Earth,Thermometer,Info,SmartOptimization,Left,Home, FolderBlock } from '@icon-park/vue-next';
import { emitter } from '../../utils/emitter';
import { TouchRipple } from 'vue-touch-ripple'
import 'vue-touch-ripple/style.css'
import { set } from 'nprogress';
const showModelDetail = ref(false)
const showInfo = ref(false)
const contentRendered = ref([])
const animateMode = ref(false)
const cameraInput = ref(null);
const galleryInput = ref(null)
const uploadPhotoDialogVisible = ref(false);
const uploadPhoto = ref({})
const uploadPhotoDialogLoading = ref(false)
const usePhoto = ref(false);
const weixinDialogVisible = ref(false);

//audio
const isRecording = ref(false);
const mediaRecorder = ref(null);
const mediaRecoderStream = ref(null);
const audioChunks = ref([]);
const audioUrl = ref('');
const useAudio = ref(false);
const uploadAudio = ref({});
const recordMode = ref(false);
const recordTime = ref(0);
const toggleRecording = async ()=>{
  if(isRecording.value){
    stopRecording();
  } else {
    await startRecording();
  }
}
const closeRecordDialog = ()=>{
  recordMode.value=false;
  mediaRecorder.value.stop();
  uploadPhotoDialogLoading.value = true;
  isRecording.value = false;
  if (mediaRecoderStream.value) {
    mediaRecoderStream.value.getTracks().forEach(track => track.stop());
  }
  isRecording.value = false;
}
const uploadFile = async (file) => {
  try {
    // 读取文件内容（ArrayBuffer）
    const fileContent = await file.arrayBuffer(); 
    const numBytes = fileContent.byteLength;
    const response = await fetch(`/api/ai/upload/beta`, {
      method: "POST",
      headers: {
        "X-Goog-Upload-Command": "start, upload, finalize",
        "X-Goog-Upload-Header-Content-Length": numBytes.toString(),
        "X-Goog-Upload-Header-Content-Type": file.type,
        "Content-Type": file.type, // 设置文件的 MIME 类型
      },
      body: fileContent, // 直接上传文件内容
    });
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Failed to upload file: ${response.statusText} (${errorDetails})`);
    }
    const responseData = await response.json();
    return responseData.file?.uri; // 返回文件 URI
  } catch (error) {
    console.error("上传失败:", error);
    return null;
  }
};
const openRecordDialog = async ()=>{
  recordMode.value=true;
}
const startRecording = async (event) => {
  useAudio.value = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks.value = [];
    mediaRecorder.value = new MediaRecorder(stream);
    mediaRecoderStream.value = stream;
    mediaRecorder.value.on
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };
    let timev;
    mediaRecorder.value.onstart=()=>{
      timev = setInterval(()=>{
        recordTime.value++;
      },1000)
    }
    mediaRecorder.value.onstop = () => {
      clearInterval(timev);
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
      audioUrl.value = URL.createObjectURL(audioBlob);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (true) {
          Auth.chatTaskThread.add(async ()=>{
            const url = await uploadFile(audioBlob);
            uploadAudio.value = {
              type: 'audio/wav',
              uri:url,
              blob: audioUrl.value
            }
          })
        } else {
          const dataUrl = reader.result;
          const [header, base64] = dataUrl.split(',');
          const mimeTypeMatch = header.match(/:(.*?);/);
          const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : '';
          uploadAudio.value = {
            type: mimeType,
            meta: base64,
            blob: audioUrl.value
          }
        }
        useAudio.value = true;
        recordMode.value=false;
        mediaRecorder.value=null;
        Auth.chatTaskThread.add(async ()=>{
          uploadPhotoDialogLoading.value = false;
          send();
        })
      };
      reader.readAsDataURL(audioBlob);
    };
    // uploadPhotoDialogLoading.value = true;
    recordTime.value = 0;
    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (error) {
    useAudio.value = false;
    console.error('无法访问麦克风:', error);
    ElMessageBox.alert('无法访问麦克风', '错误', {
      confirmButtonText: '确定',
      type: 'error',
    });
  }
};
const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
    uploadPhotoDialogLoading.value = true;
    isRecording.value = false;
    if (mediaRecoderStream.value) {
      mediaRecoderStream.value.getTracks().forEach(track => track.stop());
    }
    isRecording.value = false;
  }
};

// photo
function clearUploadPhoto(){
  cameraInput.value.value = "";
  galleryInput.value.value = "";
  uploadPhoto.value = {};
  usePhoto.value = false;
}
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
function dataURLtoBlob(dataURL) {
  const matches = dataURL.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid data URL format");
  }
  const mimeType = matches[1]; // 提取 MIME 类型
  const base64Data = matches[2]; // 提取 Base64 数据
  const binaryString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return new Blob([uint8Array], { type: mimeType });
}
const handlePhoto = async (event) => {
  try {
    uploadPhoto.value = {};
    usePhoto.value = false;
    uploadPhotoDialogLoading.value = true;
    const file = await resizeImage(event.target.files[0]);
    if (!file) {
      console.error("No file selected.");
      return;
    }
    const base64Data = await toBase64(file);
    // const fileUri = `data:${file.type};base64,${base64Data}`;
    const blobUrl = URL.createObjectURL(file);

    if (base64Data) {
      uploadPhoto.value = {
        type: file.type,
        blob: blobUrl,
        meta:base64Data
      };
      usePhoto.value = true;
      ElMessage.success({
        message: `上传成功`,
        type: 'success',
      });
    } else {
      URL.revokeObjectURL(blobUrl);
      console.error(`No URI found in the response for file ${file.name}`);
      uploadPhoto.value = {};
      ElMessageBox.alert(`上传失败`,`上传失败`,{
        confirmButtonText: '确定',
        type: 'error',
      });
      usePhoto.value = false;
      cameraInput.value.value = "";
      galleryInput.value.value = "";
    }
  } catch (error) {
    console.error("Error:", error);
    uploadPhoto.value = {};
    usePhoto.value = false;
    ElMessageBox.alert(`上传失败`,`上传失败`,{
      confirmButtonText: '确定',
      type: 'error',
    });
    galleryInput.value.value = "";
    cameraInput.value.value = "";
  } finally {
    uploadPhotoDialogLoading.value = false;
  }
};
// 图片调整大小函数
async function resizeImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null); // 如果不是图片文件，直接返回 null
      return;
    }
    const MAX_SIZE = 256 * 1024; // 最大文件大小
    const MAX_DIMENSION = 1024; // 最大宽度或高度
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // 调整图片尺寸
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        } else {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }
      }
      canvas.width = width;
      canvas.height = height;

      // 绘制调整后的图片，并设置白色背景（JPEG 不支持透明度）
      ctx.fillStyle = '#FFFFFF'; // 设置白色背景
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // 压缩图片并检查大小
      let quality = 0.9; // 初始质量
      const compress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to resize image."));
              return;
            }

            // 检查文件大小是否满足要求
            if (blob.size <= MAX_SIZE) {
              // 强制转换为 JPEG 格式，并重命名文件扩展名为 .jpg
              const fileName = file.name.replace(/\.(png|jpeg|gif|webp)$/i, '.jpg');
              resolve(new File([blob], fileName, { type: 'image/jpeg' }));
            } else if (quality > 0.4) {
              // 如果文件过大且质量未降到最低，继续降低质量
              quality -= 0.05;
              compress();
            } else {
              // 如果质量降到最低仍不满足要求，尝试进一步缩小尺寸
              width *= 0.9;
              height *= 0.9;
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              quality = 0.9; // 重置质量
              compress();
            }
          },
          'image/jpeg', // 强制使用 JPEG 格式
          quality
        );
      };

      // 开始压缩
      compress();
    };
    img.onerror = (error) => reject(error);
    img.src = URL.createObjectURL(file);
  });
}

function renderStatus(status) {
  switch (status) {
    case 'sending':
      return '发送中';
    case 'searching':
      return '搜索中';
    case 'wait':
      return '即将完成';
    case 'analysising':
      return '分析问题';
    case 'thinking':
      return '思考问题';
    case 'try':
      return '深入思考';
    case 'summary':
      return '批判总结';
    case 'reply':
      return '综合回复';
    default:
      return '';
  }
}
function analysisBtn() {
  useAnalysis.value=!useAnalysis.value;
  if(useAnalysis.value){
    useTask.value=false;
    useDraw.value=false;
  }
  // if(!useInternet.value && useAnalysis.value){useInternet.value=true}
}
function taskBtn(){
  useTask.value=!useTask.value;
  if(useTask.value){
    useAnalysis.value=false;
    useDraw.value=false;
    usePreview.value=false;
  }
}
function previewBtn(){
  usePreview.value=!usePreview.value;
  if(usePreview.value){
    useDraw.value=false;
    useTask.value=false;
    // useAnalysis.value=true;
  }
}
function drawBtn(){
  useDraw.value=!useDraw.value;
  if(useDraw.value){
    useAnalysis.value=false;
    useTask.value=false;
    usePreview.value=false;
    useInternet.value=false;
  }
}
function internetBtn(){
  useInternet.value=!useInternet.value;
  if(useInternet.value){
    useDraw.value=false;
  }
}
function copyCode(codeId) {
  const code = window['czig_code_html' + codeId];
  // // console.log(code)
  window.copyText(code, () => {
    ElMessage.success("复制成功")
  }, () => {
    ElMessage.error("复制失败")
  })
}
window.copyCode = copyCode;

const md = new markdownIt({
  typographer: true, // 使用高级的打字排版
  html: false,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && markdownIt.utils.isStringEmpty(lang)) { return `<pre class="language-${lang}"><code>${md.utils.escapeHtml(str)}</code></pre>`; } 
    else if (lang && hljs.getLanguage(lang)) { try { return `<pre class="language-${lang}"><code>${hljs.highlight(lang, str, true).value}</code></pre>`; } catch (__) { } } else { // 未知语言，使用默认渲染 
      return `<pre class="language-unknown"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  }
});
hljs.registerLanguage('lingben_bash', (hljs) => ({
  keywords: {
    keyword: 'if else for while switch case break continue return',
    built_in: 'true false'
  },
  contains: [
    hljs.QUOTE_STRING_MODE,
    hljs.NUMBER_MODE,
  ]
}));
md.use(markdownItHighlightjs,{
  inline: true,
  hljs,
});
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  
  // 检查是否已经有 target 属性
  let hasTarget = token.attrIndex('target') !== -1;
  if (!hasTarget) {
    // 添加 target="_blank"
    token.attrPush(['target', '_blank']);
  }

  // 添加 rel="noopener noreferrer" 以提高安全性
  let hasRel = token.attrIndex('rel') !== -1;
  if (!hasRel) {
    token.attrPush(['rel', 'noopener noreferrer']);
  }

  // 使用默认的渲染逻辑
  return self.renderToken(tokens, idx, options);
};
md.renderer.rules.fence = function(tokens, idx, options, env, self) {
  var token = tokens[idx];
  var info = token.info.trim().split(/\s+/);
  var langName = info[0];
  var highlightedCode;
  if (langName.toLowerCase().indexOf('draw')>-1) {
    // console.log(token.content)
    const code = token.content;
    // console.log(code)
    // highlightedCode = md.render(token.content);
    return `
<div lingben-draw>
    <pre class="hidden">${code}</pre>
    <span class="flex w-fit items-center bg-slate-50 z-30 mb-2 px-3 rounded-3xl py-2 border border-slate-200">
        <svg class="animate-spin inline-block ml-1 mr-2 h-5 w-5 text-blue-500 " style="animation-duration:0.6s !important;animation-timing-function: cubic-bezier(0.32, 0.59, 0.69, 0.46) !important;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg><span class="active-text text-lg leading-none align-bottom">等待中...</span>
    </span>
    <img src=""/>
</div>`
  } else if (hljs.getLanguage(langName)) {
    try {
      highlightedCode = hljs.highlight(token.content, { language: langName }).value;
    } catch (err) {
      // highlightedCode = token.content;
      highlightedCode = md.utils.escapeHtml(token.content); // 发生错误时，转义内容
    }
  } else {
    highlightedCode = md.utils.escapeHtml(token.content);
    // return self.renderToken(tokens, idx, options);
  }
  const codeid= getRadomString(10)
  window['czig_code_html'+codeid] = token.content;
  //on绑定事件
  return `<div class="czig-code-block sticky text-base rounded-lg overflow-auto my-2">
    <div class="language-label sticky bg-slate-200 truncate px-3 py-2 flex align-middle justify-between items-center"> 
      <span class="truncate">${langName}</span>
      <svg id="code_${codeid}" onclick="copyCode('${codeid}')" class="hover:opacity-80 cursor-pointer trasition opacity-100" width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="#0007" stroke-width="4" stroke-linecap="round" stroke-linejoin="bevel"></path><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="none" stroke="#0007" stroke-width="4" stroke-linejoin="bevel"></path></svg>
    </div>
    <pre class="px-3 bg-slate-100"><code class="hljs bg-slate-100 text-sm ${langName}">${highlightedCode}</code></pre>
  </div>`;
};
md.use(math,{
  engine: Katex,
  delimiters: 'dollars',
  blockClass: 'katex-block',
  inlineClass: 'katex-inline',
  errorClass: 'error',
  katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
});

/* 主要渲染部分结束 */
const route = useRoute();
const router = useRouter();
const chatList = ref([]);
const input = ref("");
const placeholder = ref("你好👋");
const loading = ref(true);
const ainput = ref();
const now = ref(0);
const fingerprint = ref("");
const welcome = ref('');
const welcome_loading = ref(true);
const sessionID = ref();
const stopStatus = ref(false);
const useAnalysis = ref(false);
const useInternet = ref(false);
const useTask = ref(false);
const useDraw = ref(false);
const usePreview = ref(false);
const show_menu = ref(true)
const showStop = ref(false);
const title = ref('无标题');
const statusText = ref('');
const suggestions = ref([]);
const loginStatus = ref(false);
const model = ref('');
const default_model = {
  img:'/logo_sm.webp',
  name:'默认模型',
  desc:'零本智协AI大模型',
  createUser:{
    nickname:'零本智协团队',
    avatar:'/logo_sm.webp'
  },
  createuser:''
}
const model_info = ref(default_model)
const analysis_line = ref('line-1')
const chat_line = ref('line-1')
const sendActive = ref(false);
const scrollStatus = ref(false);
const isFirstVisit = ref(false);


const openUploadPhotoDialog =()=>{
  uploadPhotoDialogVisible.value = true;
}
function copyText(text){
  Auth.copyText(text.trim(),()=>{
    ElMessage.success("复制成功")
  },()=>{
    ElMessage.error("复制失败")
  })
}
function copyHtml(i){
  const html = document.querySelector('#ai_chatList>div[data-id="'+i+'"] .chatcontent').innerHTML
  Auth.copyHtml(html,()=>{
    ElMessage.success("复制成功")
  },()=>{
    ElMessage.error("复制失败")
  })
}
function isMobile() {
  const userAgent = navigator.userAgent;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}
function isWeChatBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua);
}
const mobile = isMobile();
const handleEnter = async (event) => {
  if (event.shiftKey || mobile) {
    input.value = document.getElementById('input_chat_ai').value
    return;
  } else if (event.key === 'Enter') {
    event.preventDefault();
    input.value = document.getElementById('input_chat_ai').value
    if(!loading.value && (input.value.trim() || usePhoto.value)){
      throttledSend()
    }
  }
}
const handleInput = async (event) => {
  sendActive.value = !(document.getElementById('input_chat_ai').value?.trim() == '' && !usePhoto.value && !useAudio.value)
} 
function ask(q){
  document.getElementById('input_chat_ai').value=q;
  suggestions.value=[];
  send();
}
async function setInputHeight(){
  const textarea = document.getElementById('input_chat_ai')
  const textareaCssContainer = document.getElementById('input_chat_ai_div')
  textareaCssContainer.style.setProperty('--inputContainerHeight', '64px');
  const scrollHeight = textarea.scrollHeight;
  // console.log(scrollHeight);
  textareaCssContainer.style.setProperty('--inputContainerHeight', scrollHeight+'px');
  now.value = textarea.value.length;
}
const debouncedSetInputHeight = debounce(setInputHeight, 20);
nextTick(()=>{
  const textarea = document.getElementById('input_chat_ai')
  window.textarea2 = textarea;
  textarea.addEventListener('input', function () {
    setInputHeight();
  });
  const touchRipple = document.querySelectorAll('.touch-ripple,.dde');
  touchRipple.forEach((el) => {
    el.addEventListener('mousedown', function (event) {
      event.preventDefault();
    });
  });
  if(isWeChatBrowser()){
    weixinDialogVisible.value = true;
  }

})
  
const hasVisited = localStorage.getItem('hasVisited');
if (!hasVisited) {
  isFirstVisit.value = true;
}

function qx(){
  localStorage.setItem('hasVisited', 'true');
  isFirstVisit.value = false
}
const scrollToBottom = () => {
  const scrollElement = document.getElementsByClassName('scroll')[0];
  // if(scrollStatus){
  scrollElement.scrollTo({
    top: scrollElement.scrollHeight,
    behavior: 'smooth',
    duration: 500,
  });
  scrollStatus.value = false;
  // }
};
const checkScollStatus = debounce(()=>{
  const scrollElement = document.getElementsByClassName('scroll')[0];
  if(scrollElement.scrollHeight - (Math.floor(scrollElement.scrollTop) + scrollElement.clientHeight) >= 150){
    scrollStatus.value=true;
  } else {
    scrollStatus.value=false;
  }
},200)

const stop = async (param)=>{
  stopStatus.value=true;
  showStop.value=false;
  loading.value=false;
}
const htmlParser = new DOMParser();

const task_ = async()=>{
  document.querySelectorAll('div[lingben-draw]').forEach(e=>{
    const code = e.children[0].innerText;
    // console.dir(e.children);
    const safeEval = (code) => {
      return new Function(`"use strict";\n\n${code}`)();
    };
    let fn = async ()=>{
      try{
        const canvas = safeEval(code);
        // console.log(canvas);
        let before = e.children[2].src;
        if(before){
          URL.revokeObjectURL(before);
        }
        const dataurl = canvas.toDataURL('image/png',1);
        let blob=URL.createObjectURL(dataURLtoBlob(`data:image/png;base64,${dataurl}`));
        e.children[2].src = blob;
        e.children[2].className='czig-draw rounded-md shadow-md shadow-slate-100 max-h-[400px]';
        e.children[1].classList.remove('flex');
        e.children[1].classList.add('hidden');
      }catch(e){}
    };
    fn();
  });
}
const renderAnalysis = (index)=>{
  // chatList.value[index].renderedAnalysis
  // = md.render(chatList.value[index].analysis);
  const now = md.render(chatList.value[index].analysis);
  // if(previous){
  // const doc = htmlParser.parseFromString(html, 'text/html');
  chatList.value[index].renderedAnalysis = splitHtmlFirstLevelRegex(now)
}
const renderContentTask = async (index,isStream)=>{
  // const previous = chatList.value[index].renderedContent;
  const now = md.render(chatList.value[index].content);
  // if(previous){
  // const doc = htmlParser.parseFromString(html, 'text/html');
  chatList.value[index].renderedContent = splitHtmlFirstLevelRegex(now)
  setTimeout(()=>{
    task_();
  },500)
}
function splitHtmlFirstLevelRegex(htmlStr) { const doc = htmlParser.parseFromString(htmlStr, 'text/html');
  const fragment = doc.createDocumentFragment();
  
  // 将 HTML 内容移入 DocumentFragment（避免污染真实 DOM）
  Array.from(doc.body.childNodes).forEach(node => {
    fragment.appendChild(node);
  });

  // 过滤出顶级元素节点
  return Array.from(fragment.childNodes).filter(node => 
    node.nodeType === Node.ELEMENT_NODE
  ).map(e=>e.outerHTML);
}
const renderContent = renderContentTask

/* chat */
async function deepMind(targetValue, targetTime, index) {
  const t_phoho = usePhoto.value;
  const p_photo = uploadPhoto.value;
  const t_audio = useAudio.value;
  const p_audio = uploadAudio.value;
  const beforeTime = Date.now();
  const _useAnalysis_ = useAnalysis.value;
  const _useInternet_ = useInternet.value;
  const _useTask_ = useTask.value;
  const _useDraw_ = useDraw.value;
  const _usePreview_ = usePreview.value;
  debouncedScrollToBottom();
  showStop.value = true;
  Auth.chatTaskThread.add(async () => {
    chatList.value[index - 1].status = 'reply';
    statusText.value = '正在传输';
    await DeepMindWithAI({targetValue,targetTime,index,_useAnalysis_,_useInternet_,_useTask_,_useDraw_,_usePreview_,photo:t_phoho?p_photo:null,audio:t_audio?p_audio:null});
    chatList.value[index - 1].status = 'analysised';
    statusText.value = '';
  })
}
async function DeepMindWithAI(opt,count) {
  showStop.value = true;
  await Auth.chatWithAI({
    sessionID: sessionID.value,
    content: opt.targetValue,
    model:model.value,
    vf: fingerprint.value,
    analysis: chatList.value[opt.index - 1].analysis || '',
    stopStatus,
    useAnalysis: opt._useAnalysis_,
    useInternet: opt._useInternet_,
    useTask:opt._useTask_,
    useDraw:opt._useDraw_,
    usePreview:opt._usePreview_,
    line: chat_line.value,
    time: opt.targetTime,
    photo: opt.photo,
    audio: opt.audio,
    onerror: (source, model) => {
      window.clarity('event', 'CHAT-AI-ERROR');
      if(source.message.indexOf('UpstashError')>-1){
        source='文件体积过大'
      }
      chatList.value[opt.index].content += '\n\n[服务器繁忙]\n\n'+source;
      renderContent(opt.index);
    },
    onmessage: (source, model) => {
      // console.log(source,model);
      if(count) opt.counter=1;
      handleOnMessage(source, model, opt);
    },
    onclose: (error,model) => {
      handleOnClose(error,model, opt);
      if(opt.photo){
        usePhoto.value = false;
        uploadPhoto.value = {};
        cameraInput.value.value = '';
        galleryInput.value.value = '';
      }
      if(opt.audio){
        useAudio.value = false;
        uploadAudio.value = {};
      }
    },
  });
}
function handleOnMessage(res, m , opt) {
  try{
    checkScollStatus();
    Auth.decodeStream(res, {
      chatMessage: (source) => {
        chatList.value[opt.index].content += source;
        renderContent(opt.index);
        // debouncedScrollToBottom();
      },
      analysisMessage: (source) => {
        chatList.value[opt.index - 1].analysis += source;
        renderAnalysis(opt.index - 1);
        // debouncedScrollToBottom();
      },
      title:(source)=>{
        title.value = source;
        emitter.emit('updateTitle', source);
      },
      suggestions:(source)=>{
        suggestions.value = source;
      },
      info:(source)=>{
        console.log(source,opt);
        if(source.status){
          statusText.value = source.status;
        }
        if(source.info.mode == 'text'){
          chatList.value[opt.index].model = source.info.version;
        }
      },
      config:(source)=>{
        if(source.type == 'session'){
          sessionID.value = source.content;
          router.push('/chat/?s='+source.content+'&model='+model.value); 
        }
      },
      draw:(source)=>{
        // console.log(source);
        const code  = source.code;
        const safeEval = (code) => {
          return new Function(`"use strict";\n\n${code}`)();
        };
        let fn = async ()=>{
          const canvas = safeEval(code);
          console.log(canvas);
          const dataurl = canvas.toDataURL('image/png',1);
          let blob=URL.createObjectURL(dataURLtoBlob(`data:image/png;base64,${dataurl}`));
          chatList.value[opt.index].content += `\n\n生成的图片如下\n\n![AI生成的图片](${blob})\n\n`;
          renderContent(opt.index);
          // document.body.appendChild(canvas);
          // document.body.appendChild(canvas);
        };
        fn();
      },
      preview:(preview)=>{
        try{
          ElMessageBox.alert('即将打开新的网页以预览生成的内容', '提示', {
            confirmButtonText: '确定',
            showClose:true,
            callback: action => {
              if(action === 'confirm'){
                window.open(preview.url);
              }
            }
          })
        }catch(e){}
      }
    });
  }catch(e){
    console.log(e)
  }
}
async function handleOnClose(error,model,opt) {
  stopStatus.value = false;
  showStop.value = false;
  loading.value = false;
  placeholder.value = '还有什么想聊的';
  document.getElementById('input_chat_ai').focus();
  if (!chatList.value[opt.index].content) {
    if (!error) {  }
  } else {
    if (!error) {
      
      // if(model == 'line-1'){
      //   // animateMode.value = false;
      //   setTimeout(()=>{
      //     animateMode.value = false;
      //     contentRendered.value=[]
      //   },10)
      // }
      await Auth.saveChatRecords(sessionID.value, chatList.value[opt.index-1])
      await Auth.saveChatRecords(sessionID.value, chatList.value[opt.index])
    }
  }
}
const send = async (param)=>{
  if(loading.value){
    return;
  }
  input.value = document.getElementById('input_chat_ai').value
  if(input.value?.trim() == '' && !usePhoto.value && !useAudio.value) {
    // ElMessage.warning("Shift + Enter 换行");
    return;
  }
  const targetTime = new Date().getTime()
  let formatSendTime;
  if(chatList.value.length>0){
    formatSendTime=(targetTime-chatList.value.findLast(e=>e.role=='user').sendTime>(30*60*1000))?dayjs(targetTime).format('YYYY-MM-DD HH:mm:ss'):''
  } else {
    formatSendTime=dayjs(targetTime).format('YYYY-MM-DD HH:mm:ss')
  }
  chatList.value.push({
    role: "user",
    content: input.value.trim(),
    status:'sending',
    analysis:"",
    renderedAnalysis:'',
    show_thought:true,
    sendTime:targetTime,
    formatSendTime,
    photo:usePhoto.value?uploadPhoto.value:null,
    audio:useAudio.value?uploadAudio.value:null,
  })
  chatList.value.push({
    role: "assistant",
    content: "",
    renderedContent:''
  })
  const targetValue = input.value
  input.value = '';
  document.getElementById('input_chat_ai').value = '';
  now.value = 0;
  suggestions.value = [];
  const textareaCssContainer = document.getElementById('input_chat_ai_div')
  textareaCssContainer.style.setProperty('--inputContainerHeight', '64px');
  // document.getElementById('input_chat_ai').style.height = document.getElementById('input_chat_ai').scrollHeight+'px'
  loading.value = true;
  document.getElementById('input_chat_ai').focus();
  placeholder.value = "正在回复中...";
  window.clarity("identify", fingerprint.value, null, "CHAT-AI", null)
  if (
    useInternet.value=='AUTO'
    && (targetValue.indexOf('新闻')>-1 || targetValue.indexOf('news')>-1 || targetValue.indexOf('weather')>-1)
    && targetValue.length <= 8
  ) {
    useInternet.value=true;
  } else if (targetValue.indexOf('联网')>-1 || targetValue.indexOf('搜索')>-1) {
    useInternet.value=true;
  }
  // onChange();
  const index = chatList.value.length - 1;
  await deepMind(targetValue, targetTime, index,);
}

const throttledSend = throttle(send, 100);
const debouncedScrollToBottom = debounce(scrollToBottom, 700); 
const throttledScrollToBottom = throttle(scrollToBottom, 1500); 
let applying = false
async function applysession({id,mode}){
  placeholder.value = '你好👋';
  if(mode == 'new'){
    applying = true;
    fingerprint.value = await Auth.getUserFingerprint();
    loading.value = false;
    placeholder.value = '你好👋';
    model_info.value = default_model;
    welcome_loading.value = false;
    chatList.value = [];
    title.value = '无标题';
    emitter.emit('updateTitle', '无标题');
    welcome.value = '';
    suggestions.value = [];
    sessionID.value = '';
    router.push('/chat/?model='+model.value);
    applying = false;
    return ;
  }
  // Auth.chatTaskThread.add(async()=>{
    if(sessionID.value){
      let tmp = 0;
      chatList.value = JSON.parse(localStorage.getItem('chat_'+sessionID.value) || '[]');
      chatList.value.forEach((e,i)=>{
        if(e.role == 'user'){
          e.status = e.analysis?'analysised':'no_analysis';
          e.show_thought = false;
          if(e.photo){
            if(e.photo.meta){
              e.photo.blob=URL.createObjectURL(dataURLtoBlob(`data:${e.photo.type};base64,${e.photo.meta}`));
            }
          }
          if(e.audio){
            if(e.audio.meta){
              e.audio.blob=URL.createObjectURL(dataURLtoBlob(`data:${e.audio.type};base64,${e.audio.meta}`));
            } else {
              e.audio.blob=null;
            }
          }
          if(e.analysis){
            renderAnalysis(i);
          }
          if(i == 0){
            e.formatSendTime = dayjs(e.sendTime).format('YYYY-MM-DD HH:mm:ss')
          } else {
            e.formatSendTime = (chatList.value[tmp].sendTime-e.sendTime>(30*60*1000))?dayjs(targetTime).format('YYYY-MM-DD HH:mm:ss'):'';
            tmp=i;
          }
        } else {
          renderContent(i)
        }
      })
      debouncedScrollToBottom()
      loading.value = false;
      welcome_loading.value = false;
      Auth.chatTaskThread.add(async ()=>{
        const getList = (await Auth.getAIChatList({sessionID:sessionID.value,mode,model:model.value,vf:fingerprint.value}))
        welcome.value = getList.welcome;
        model_info.value = {
          ...model_info.value,
          name:getList.model.name,
          desc:getList.model.desc,
          createuser:getList.model.createuser,
        };
        chatList.value = (await Auth.replaceAndUpdateUserRecords(sessionID.value,getList.content,chatList.value)).map((e,i)=>{
          e.status = e.analysis?'analysised':'no_analysis';
          e.show_thought = false;
          if(e.photo){
            if(e.photo.meta){
              e.photo.blob=URL.createObjectURL(dataURLtoBlob(`data:${e.photo.type};base64,${e.photo.meta}`));
            }
          }
          if(e.audio){
            if(e.audio.meta){
              e.audio.blob=URL.createObjectURL(dataURLtoBlob(`data:${e.audio.type};base64,${e.audio.meta}`));
            } else {
              e.audio.blob=null;
            }
          }
          return e
        });
        title.value = getList.title || title.value;
        chatList.value.forEach((e,i)=>{
          if(e.role == 'user'){
            if(e.analysis){
              renderAnalysis(i);
            }
            if(i == 0){
              e.formatSendTime = dayjs(e.sendTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              e.formatSendTime = (chatList.value[tmp].sendTime-e.sendTime>(30*60*1000))?dayjs(targetTime).format('YYYY-MM-DD HH:mm:ss'):'';
              tmp=i;
            }
          } else {
            renderContent(i)
          }
        })
        setTimeout(()=>{
          scrollToBottom()
        },50)
        model_info.value.createUser = (await Auth.getUserInfoByID({id:model_info.value.createuser}));
      })
    } else {
      loading.value = false;
      placeholder.value = '你好👋';
      welcome_loading.value = false;
    }
  applying = false
}
async function applynew(){
  if(applying) return;
  await stop();
  Auth.chatTaskThread.clear();
  stopStatus.value=false;
  showStop.value=false;
  loading.value=false;
  const res = await applysession({id:'',mode:'new'});
  debouncedScrollToBottom();
}

onMounted(async ()=>{
  const info = sessionStorage.getItem('userInfo');
  if(info){
    if(JSON.parse(info).avatar){
      loginStatus.value = true;
    }
  }
  await Auth.db_init()
  sessionID.value = route.query.s;
  model.value = route.query.model || '';
  let action = route.query.action;
  let mode = undefined;
  if(route.query.mode == 'new'){
    mode = 'new';
  }
  loading.value = false;
  if(action){
    let actionValue = localStorage.getItem(action);
    input.value = actionValue;
    document.querySelector('#input_chat_ai').value = actionValue;
    setInputHeight()
  }
  await applysession({id:sessionID,mode:mode})
  if(action){
    send();
    localStorage.removeItem(action);
  }

})
</script>

<style scoped>

.autohidden{
  display: none !important;
  visibility: hidden;
  transition: all .2s ease;
  opacity: 0;
}
.autohidden[data-show="true"]{
  display: flex !important;
  visibility: visible;
  opacity: 1;
  /* transition-delay: 1s; */
}
.ss-none::-webkit-scrollbar{
  width: 0;
  height:0;
}
.scroll-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 37px;
  width: 6px;
  height: 100%;
  display: block;
  flex-shrink: 0;
  z-index: 2;
  background: linear-gradient(to left, rgba(248, 250, 252,0) 0%, rgba(248, 250, 252,1) 100%);
  pointer-events: none;
}
.scroll-container::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  height: 100%;
  display: block;
  flex-shrink: 0;
  z-index: 2;
  background: linear-gradient(to right, rgba(248, 250, 252,0) 0%, rgba(248, 250, 252,1) 100%);
  pointer-events: none;
}
.max-limit{
  max-height:15%;
}
</style>