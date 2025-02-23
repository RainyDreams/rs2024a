<template>
  <div class="commonPage bg-slate-50 md:rounded-lg pb-0 h-dvh pt-3" style="display: flex;flex-direction: column;">
    <div id="wechat-tip" v-if="weixinDialogVisible" class="fixed flex top-0 left-0 w-full bg-slate-800 bg-opacity-40 text-white p-4 text-center text-sm  z-40">
      <span class="flex-1 pr-2">您正在使用微信浏览器访问本站，建议使用浏览器打开</span>
      <button @click="weixinDialogVisible = false" class="text-white rounded-full h-9 p-2 w-9 flex-shrink-0 bg-slate-900 bg-opacity-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="scroll">
      <!-- <div class=""> -->
        <div class=" max-w-3xl m-auto" style="margin-bottom: 0;">
          <div class="aichat">
            <el-watermark :font="{color:'rgba(0, 0, 0, 0.001)'}" :gap="[0,0]" :rotate="-12"
              :content="['零本智协大模型 生成内容仅供参考', sessionID,fingerprint]">
              <div class="title text-center w-full text-lg sticky top-0 z-30 bg-slate-50 pb-1 truncate px-5" >{{ title }}</div>
              <div class="system mb-3 md:mb-4 lg:mb-5 block">
                  <div class="flex items-stretch flex-wrap" style="font-size:14px;width:100%; ">
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center w-fit cursor-pointer text-sm rounded-l-full pr-2 pl-3 py-1 overflow-hidden select-none border `"
                      :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                      :color="'#4e81fc'"
                      :opacity="0.4"
                      transition="ease-out"
                      :duration="200"
                      :keep-last-ripple="true"
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
                      :keep-last-ripple="true"
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
                      :keep-last-ripple="true"
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
                      :keep-last-ripple="true"
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
                    :keep-last-ripple="true"
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
                    :keep-last-ripple="true"
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
                  <router-link :to="`/login?url=/chat/${sessionID}`" class="h-full" v-if="!loginStatus" >
                    <touch-ripple
                      :class="`flex touch-ripple h-8  mt-2  items-center text-center mr-1  w-fit cursor-pointer text-sm rounded-full px-3 py-1 overflow-hidden select-none border text-slate-950`"
                      :style="{ clipPath: 'none', backgroundColor:'#fff' }"
                      :color="'#4e81fc'"
                      :opacity="0.4"
                      transition="ease-out"
                      :duration="200"
                      :keep-last-ripple="true"
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
                    <p>查看<router-link to="/about/log">更新日志</router-link></p>
                    <div class="w-full text-sm/relaxed">由于服务器成本原因，对大模型所有用户限制如下：每分钟15次，每天1000次提问。</div>
                  </div>
                </div>
                <!-- 欢迎 -->
                <div :class="`duration-1000 trasition-all overflow-hidden w-full `+(chatList.length!=0?'max-h-0':'max-h-96')">
                  <div :class="`chat_welcome mt-14 sm:mt-18 md:mt-24 xl:mt-30 w-full animate__animated `+((chatList.length==0)?'animate__fadeInUp':'animate__fadeOutUp')">
                    <h2 class="text-center w-full text-3xl md:text-4xl lg:text-5xl font-bold">你好！来聊点什么吧</h2>
                  </div>
                </div>
              </div>
              <div class="chatList" style="min-height: 200px;" id="ai_chatList">
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
                          <template v-if="item.audio?.meta">
                            <div class="py-2"><audio class="max-w-full" controls :src="item.audio.blob" ></audio></div>
                          </template>
                        </div>
                        
                      </div>
                      <div class="analysis max-w-full mt-2" v-show="item.status != 'no_analysis' && item.analysis">
                        <!-- <p v-show="item.status == 'analysis'">正在思考和分析问题...</p> -->
                        <div 
                          :class="`_text text-gray-500 text-xs lg:text-sm  px-4 py-5  border border-slate-200 bg-white rounded-xl `+(item.status=='analysis'?'active':'')"
                          v-show="item.show_thought" 
                          v-html="item.renderedAnalysis"
                        ></div>
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
                      <div class="chatcontent text-base/relaxed mt-4 px-2 sm:text-base/relaxed md:text-base/relaxed lg:text-lg/relaxed xl:text-lg/loose" >
                        <div class="animate__animated animate__fadeIn" style="--animate-duration:2.5s" v-html="item.renderedContent"></div>
                      </div>
                      <div v-show="chatList[i-1].status != 'analysised' && chatList[i-1].status != 'no_analysis'"
                        class="text-base md:text-lg lg:text-xl text-green-800 w-fit  text-left font-bold sticky bottom-0 pb-1 mt-1 mb-2">
                        <span class=" flex items-center bg-slate-50 z-30 px-3 rounded-3xl py-2 border border-slate-200">
                            <svg class="animate-spin inline-block ml-1 mr-2 h-5 w-5 text-blue-500 " style="animation-duration:0.6s !important;animation-timing-function: cubic-bezier(0.32, 0.59, 0.69, 0.46) !important;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg><span class="active-text text-lg leading-none align-bottom">{{ renderStatus(chatList[i-1].status)}}</span>
                        </span>
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
                            class="p-2 hover:bg-slate-100 border-transparent hover:border-slate-200 border transition-all rounded-md cursor-pointer">
                            <DocDetail theme="outline" size="16" fill="#0007" :strokewidth="5" strokeLinejoin="bevel"/>
                          </div>
                        </el-tooltip>
                        
                      </div>
                      <!-- </el-watermark> -->
                    </div>
                  </template>
                </template>
                <div class="my-5">
                  <div class="bg-white text-blue-950 opacity-85 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 px-3 py-2 text-sm/tight md:text-base/tight my-3" v-for="(item) in suggestions" @click="ask(item)">
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
                @change="handleFileUpload"
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
                @change="handleFileUpload"
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
    <div :data-show="recordMode" class="fixed flex justify-center items-center inset-0 bg-black bg-opacity-50 z-50 w-screen px-4 pt-16 pb-4 h-svh autohidden">
      <div class="bg-slate-50 rounded-lg shadow-lg max-w-xl w-full overflow-hidden pb-4 flex flex-col max-h-[320px] min-h-64">
        <div class="p-4 flex justify-between items-center w-full">
          <h2 class="text-lg font-semibold">录音</h2>
          <button @click="recordMode = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto flex-1 flex flex-col">
          <h2 class="mb-6 w-full text-center text-blue-500 text-lg">开始录音</h2>
          <button
            @mousedown="startRecording" 
            @mouseup="stopRecording" 
            @touchstart="startRecording" 
            @touchend="stopRecording"
            id="recordAudio"
            :class="[
              'px-6 py-3 text-lg font-semibold rounded-md shadow-md transition duration-300 shadow-blue-100',
              isRecording ? 'bg-blue-500 text-white' : 'text-blue-500 border-blue-500 border'
            ]"
          >
            <Acoustic theme="outline" size="18" fill="currentColor" :strokeWidth="5" strokeLinejoin="bevel"/> 
            <span class="leading-none ml-2">按住录音</span>
          </button>
        </div>
      </div>
    </div>
    <div class="ainput" ref="ainput">
      <div class="">
        <div class="max-w-3xl m-auto">
          <div class="relative w-full">
            <div :class="`flex w-full px-3 rounded-t-[25px] pt-2 pb-1 ease `+(show_menu?'bottom-0 opacity-100 relative':'opacity-0')" style="position:absolute;bottom:-25px;transition: bottom 0.35s,opacity 0.3s;left:0;background-color: #e2e8f080;backdrop-filter: blur(4px);">
              <div class="flex overflow-x-auto rounded-t-[16px] ss-none">
                <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-1 cursor-pointer text-sm rounded-full px-2 py-2 overflow-hidden select-none border border-blue-500 text-blue-500 `"
                  :style="{ clipPath: 'none', backgroundColor: '#fff' }"
                  :color="'#4e81fc'"
                  :opacity="0.4"
                  transition="ease-out"
                  :duration="200"
                  @start="router.push('/?model='+model)"
                >
                  <span class="flex items-center align-middle"><plus class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/></span>
                </touch-ripple>
                <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-1 cursor-pointer text-sm rounded-full px-3 py-2 overflow-hidden select-none border `+(useAnalysis?'text-white border-blue-500':'text-blue-500 border-blue-500')"
                  :style="{ clipPath: 'none', backgroundColor: useAnalysis?'#3b82f6':'#fff' }"
                  :color="useAnalysis?'#fff':'#3b82f6'"
                  :opacity="0.4"
                  transition="ease-out"
                  :duration="200"
                  @start="analysisBtn"
                >
                  <span class="flex items-center align-middle"><SmartOptimization class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">深入思考</span></span>
                </touch-ripple>
                <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-1 cursor-pointer text-sm rounded-full px-3 py-2 overflow-hidden select-none border `+(useInternet?'text-white border-blue-500':'text-blue-500 border-blue-500')"
                  :style="{ clipPath: 'none', backgroundColor: useInternet?'#3b82f6':'#fff' }"
                  :color="useInternet?'#fff':'#3b82f6'"
                  :opacity="0.4"
                  transition="ease-out"
                  :duration="200"
                  @start="useInternet=!useInternet"
                >
                  <span class="flex items-center align-middle"><earth class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">联网搜索</span></span>
                </touch-ripple>
                <touch-ripple
                  :class="`touch-ripple w-fit flex-shrink-0 mr-1 cursor-pointer text-sm rounded-full px-3 py-2 overflow-hidden select-none border `+(usePhoto?'text-white border-blue-500':'text-blue-500 border-blue-500')"
                  :style="{ clipPath: 'none', backgroundColor: usePhoto?'#3b82f6':'#fff' }"
                  :color="usePhoto?'#fff':'#3b82f6'"
                  :opacity="0.4"
                  transition="ease-out"
                  :duration="200"
                  @click="openUploadPhotoDialog"
                >
                  <span class="flex items-center align-middle"><pic class="h-fit w-fit" theme="outline" size="16" fill="currentColor"/><span class="h-fit leading-none ml-1">上传图片</span></span>
                </touch-ripple>
              </div>
            </div>
          </div>
          <div :class="` `+(show_menu?'rounded-b-[25px] delay-200':'rounded-[25px]')" style="background-color: #e2e8f080;">
            <div :class="`ainput__wrapper items-stretch `">
              <div 
                class="textarea _input flex-1 leading-none transition-all max-h-72 md:max-h-80 min-h-8"
                :data-show="!isRecording" 
                id="input_chat_ai_div"
                style="height:var(--inputContainerHeight);--inputContainerHeight:32px;">
                ><textarea
                  id="input_chat_ai"
                  class="textarea__inner w-full text-base/6 py-1 font-medium max-h-72 md:max-h-80 min-h-8"
                  type="textarea"
                  resize="none" 
                  size="large" 
                  autofocus 
                  :maxlength="40960"
                  autocomplete="off"
                  :placeholder="placeholder" 
                  @keydown.enter="handleEnter"
                  style="resize:none;min-height: 32px;height:var(--inputContainerHeight);"
                ></textarea></div>
              <div :class="`flex flex-col justify-between items-center`">
                <span class="text-xs text-right opacity-50 text-slate-800 py-2" v-show="(now>=99)">{{ now }}</span>
                <div :class="`_number flex-1`">
                  <touch-ripple
                    :class="`touch-ripple flex  items-center justify-center h-8 w-8  mr-1 cursor-pointer rounded-full overflow-hidden select-none border `+((show_menu)?'text-white border-blue-500':'text-blue-500')"
                    :style="{ clipPath: 'none', backgroundColor: (show_menu)?'#3b82f6':'#fff' }"
                    :color="(show_menu)?'#fff':'#3b82f6'"
                    :opacity="0.4"
                    transition="ease-out"
                    :duration="200"
                    :keep-last-ripple="true"
                    @start="show_menu=!show_menu"
                  >
                    <component  :is="ApplicationMenu" :class="`cursor-pointer transition w-fit h-fit `" theme="outline" size="18" fill="currentColor"/>
                  </touch-ripple>
                  <touch-ripple
                    :class="`touch-ripple text-white autohidden items-center justify-center h-8 w-8  mr-1 cursor-pointer rounded-full overflow-hidden select-none border border-blue-500 `"
                    :style="{ clipPath: 'none', backgroundColor: '#3b82f6' }"
                    :color="'#fff'"
                    :opacity="0.4"
                    transition="ease"
                    :duration="200"
                    :data-show="!useAudio"
                    @start="openRecordDialog"
                  >
                    <Acoustic theme="outline" size="18" fill="currentColor" :strokeWidth="5" strokeLinejoin="bevel"/> 
                  </touch-ripple>
                  <touch-ripple
                    :class="`touch-ripple text-white items-center justify-center h-8 w-8  mr-1 cursor-pointer rounded-full overflow-hidden select-none border border-blue-500 `+(showStop?'hidden':'flex')"
                    :style="{ clipPath: 'none', backgroundColor: '#3b82f6' }"
                    :color="'#fff'"
                    :opacity="0.4"
                    transition="ease"
                    :duration="200"
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
    <p class=" text-center text-slate-500 py-1 font-sans leading-none" style="font-size: 10px;">内容由零本 OriginSynq AI 生成，请仔细甄别</p>
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
import { Down,Up,Copy,DocDetail,PauseOne,DeleteMode,Acoustic,Fire,Pic,Plus,Avatar,ApplicationMenu,History,Earth,Thermometer,Info,SmartOptimization,Left,Home } from '@icon-park/vue-next';
import { emitter } from '../../utils/emitter';
import { TouchRipple } from 'vue-touch-ripple'
import 'vue-touch-ripple/style.css'
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
const audioChunks = ref([]);
const audioUrl = ref('');
const useAudio = ref(false);
const uploadAudio = ref({});
const recordMode = ref(false);
const openRecordDialog = ()=>{
  recordMode.value=true;
  document.querySelector('recordAudio').focus()
}
const startRecording = async (event) => {
  // event.preventDefault();
  useAudio.value = false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks.value = [];
    mediaRecorder.value = new MediaRecorder(stream);
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };
    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
      audioUrl.value = URL.createObjectURL(audioBlob);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const [header, base64] = dataUrl.split(',');
        const mimeTypeMatch = header.match(/:(.*?);/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : '';
        uploadAudio.value = {
          type: mimeType,
          meta: base64,
          blob: audioUrl.value
        }
        mediaRecorder.value.stop();
        useAudio.value = true;
        recordMode.value=false;
        send();
      };
      reader.readAsDataURL(audioBlob);
      stream.getTracks().forEach(track => track.stop());
    };
    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (error) {
    useAudio.value = false;
    console.error('无法访问麦克风:', error);
    ElMessage.alert('无法访问麦克风', '错误', {
      confirmButtonText: '确定',
      type: 'error',
      callback: action => {
      }
    });
  }
};
const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
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
const handleFileUpload = async (event) => {
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

    /*
    const fileContent = await readFileAsArrayBuffer(file);
    const numBytes = fileContent.byteLength;
    const response = await fetch(
      `/api/ai/uploadPhoto/beta`,
      {
        method: "POST",
        headers: {
          "X-Goog-Upload-Command": "start, upload, finalize",
          "X-Goog-Upload-Header-Content-Length": numBytes.toString(),
          "X-Goog-Upload-Header-Content-Type": file.type,
          "Content-Type": file.type, // 设置文件的 MIME 类型
        },
        body: fileContent, // 直接上传文件内容
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text(); // 获取错误详情
      throw new Error(`Failed to upload file: ${response.statusText} (${errorDetails})`);
    }

    const responseData = await response.json();
    */

    // const fileUri = responseData.file?.uri;
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
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
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

      // 绘制调整后的图片
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
              resolve(new File([blob], file.name, { type: file.type }));
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
          file.type,
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
  // if(!useInternet.value && useAnalysis.value){useInternet.value=true}
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
  html: true,
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
md.renderer.rules.fence = function(tokens, idx, options, env, self) {
  var token = tokens[idx];
  var info = token.info.trim().split(/\s+/);
  var langName = info[0];
  var highlightedCode;
  if (langName.toLowerCase().indexOf('lingben_bash')>-1) {
    highlightedCode = md.render(token.content);
    return `<div class="czig-news-block">
      <div class="language-label sticky bg-slate-200 px-3 py-2">零本智协智能查询</div>
      <div class="bg-slate-100 px-3 py-2">${highlightedCode}</div>
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
    <div class="language-label sticky bg-slate-200 px-3 py-2 flex align-middle justify-between items-center"> 
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
const route = useRoute()
const router = useRouter()
const chatList = ref([]);
const input = ref("");
const placeholder = ref("你好👋");
const loading = ref(true);
const ainput = ref()
const now = ref(0)
const fingerprint = ref("")
const welcome = ref('')
const welcome_loading = ref(true)
const sessionID = ref()
const stopStatus = ref(false)
const useAnalysis = ref(false);
const useInternet = ref(false);
const show_menu = ref(true)
const showStop = ref(false);
const tokensCount = ref(0)
const tokensCount2 = ref(0)
const title = ref('无标题');
const suggestions = ref([])
const model_info = ref({
  img:'/logo_sm.webp',
  name:'默认模型',
  desc:'零本智协AI大模型',
  createUser:{
    nickname:'零本智协团队',
    avatar:'/logo_sm.webp'
  },
  createuser:''
})
const analysis_line = ref('line-1')
const chat_line = ref('line-1')

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
const handleEnter = (event) => {
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
function ask(q){
  document.getElementById('input_chat_ai').value=q;
  suggestions.value=[];
  send();
}
function setInputHeight(){
  const textarea = document.getElementById('input_chat_ai')
  const textareaCssContainer = document.getElementById('input_chat_ai_div')
  textareaCssContainer.style.setProperty('--inputContainerHeight', '32px');
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
const scrollToBottom = () => {
  const scrollElement = document.getElementsByClassName('scroll')[0];
  scrollElement.scrollTo({
    top: scrollElement.scrollHeight,
    behavior: 'smooth'
  });
};

const stop = async (param)=>{
  stopStatus.value=true;
  showStop.value=false;
  loading.value=false;
}
function renderAnalysis(index){
  chatList.value[index].renderedAnalysis
  = md.render(chatList.value[index].analysis)
}
function renderContent(index){
  chatList.value[index].renderedContent
  = md.render(chatList.value[index].content)
}
/* chat */
async function deepMind(targetValue, targetTime, index) {
  const t_phoho = usePhoto.value;
  const p_photo = uploadPhoto.value;
  const t_audio = useAudio.value;
  const p_audio = uploadAudio.value;
  const beforeTime = Date.now();
  const _useAnalysis_ = useAnalysis.value;
  const _useInternet_ = useInternet.value;
  debouncedScrollToBottom();
  showStop.value = true;
  if(useInternet.value) {
    analysis_line.value = 'line-1';
    chatList.value[index - 1].status = 'searching';
    //并行运行
    await Promise.all([
      Auth.deepMind_Analysis({
        ...(createOptions({targetValue,targetTime,index,_useAnalysis_,_useInternet_,photo:t_phoho?p_photo:null,audio:t_audio?p_audio:null})),
        onclose: (source) => {
          chatList.value[index - 1].analysis += source;
          renderAnalysis(index - 1);
          debouncedScrollToBottom();
        }
      }),
    ]);
    debouncedScrollToBottom();
  }
  if (useAnalysis.value){
    let _analysis2;
    Auth.chatTaskThread.add(async () => {
      chatList.value[index - 1].analysis += '\n\n'; 
      renderAnalysis(index - 1);
      let _analysis = chatList.value[index - 1].analysis;
      chatList.value[index - 1].status = 'try';
      await Auth.deepMind_Try(createOptions({targetValue,targetTime,index,_useAnalysis_,_useInternet_,photo:t_phoho?p_photo:null,audio:t_audio?p_audio:null},[_analysis],(e)=>{
        _analysis2 += e;
      }));
      chatList.value[index - 1].analysis += '\n\n'; 
      renderAnalysis(index - 1);
      chatList.value[index - 1].status = 'summary';
      await Auth.deepMind_Summary(createOptions({targetValue,targetTime,index,_useAnalysis_,_useInternet_,photo:t_phoho?p_photo:null,audio:t_audio?p_audio:null},[_analysis,_analysis2]));
      const diffTime = Date.now() - beforeTime;
      chatList.value[index - 1].analysis += '\n\n### 已深度思考 '+parseInt(diffTime/1000)+' 秒'; 
      renderAnalysis(index - 1);
    })
  }
  Auth.chatTaskThread.add(async () => {
    chatList.value[index - 1].status = 'analysising';
    const id1 = setTimeout(() => {
      if(chatList.value[index - 1].status != 'analysised'){
        chatList.value[index - 1].status = 'reply';
      }
    }, 4000);
    const id2 = setTimeout(() => {
      clearTimeout(id1);
      if(chatList.value[index - 1].status != 'analysised'){
        chatList.value[index - 1].status = 'wait';
      }
    }, 8500);
    await initiateChatWithAI({targetValue,targetTime,index,_useAnalysis_,_useInternet_,photo:t_phoho?p_photo:null,audio:t_audio?p_audio:null});
    clearTimeout(id2);
    chatList.value[index - 1].status = 'analysised';
  })
}
function createOptions(opt,analysis,fn=()=>{}) {
  return {
    sessionID: sessionID.value,
    content: opt.targetValue,
    vf: fingerprint.value,
    analysis: analysis,
    useInternet:opt._useInternet_,
    stopStatus,
    line: analysis_line.value,
    photo:opt.photo,
    audio:opt.audio,
    onmessage: async (source, model) => {
      showStop.value = true;
      const decode = JSON.parse(source);
      let tmp = '';
      try{
        switch (model) {
          case 'line-1':
            tmp = decode.candidates[0].content.parts[0].text;
            tokensCount.value = decode.usageMetadata.totalTokenCount;
            break;
          case 'line-2':
            tmp = decode.choices[0].delta?.content;
            break;
          case 'line-3':
            tmp = decode.response;
            break;
        }
        // debouncedScrollToBottom();
        chatList.value[opt.index - 1].analysis += tmp;
        renderAnalysis(opt.index - 1);
        fn(tmp);
      }catch(e){
        await Auth.getPrtoken();
      }
      
    },
    onerror:async ()=>{
      await Auth.getPrtoken();
    },
    onclose: async (source) => {
      if (stopStatus.value == true) {
        stopStatus.value = false;
        placeholder.value = "还有什么想聊的";
        chatList.value[opt.index - 1].status = 'analysised';
        chatList.value[opt.index].content += '[回答已终止]';
      }
    },
  }
}
async function initiateChatWithAI(opt,count) {
  showStop.value = true;
  await Auth.chatWithAI({
    sessionID: sessionID.value,
    content: opt.targetValue,
    vf: fingerprint.value,
    analysis: chatList.value[opt.index - 1].analysis || '',
    stopStatus,
    useAnalysis: opt._useAnalysis_,
    useInternet: opt._useInternet_,
    line: chat_line.value,
    time: opt.targetTime,
    photo: opt.photo,
    audio: opt.audio,
    onerror: (source, model) => {
      window.clarity('event', 'CHAT-AI-ERROR');
      chatList.value[opt.index].content += '\n\n[服务器繁忙]\n\n'+source;
      renderContent(opt.index);
    },
    onmessage: (source, model) => {
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
function handleOnMessage(source, model, opt) {
  const decode = JSON.parse(source);
  let tmp = '';
  try{
    // console.log(decode);
    if (decode.candidates) { model = 'line-1'}
    else if(decode.choices) { model = 'line-2'}
    else if(decode.response || decode.usage) {model = 'line-4'}
    else if(decode.status){
      if(decode.status == 'error'){
        Auth.chatTaskThread.add(async () => {
          await Auth.getPrtoken('force');
          if(opt.counter){
            chatList.value[opt.index].content += '服务器错误，请稍后重试。\n\n可以尝试新开一个对话';
            ElMessage.error('服务器错误，请稍后重试');
            return ;
          }else{
            return await initiateChatWithAI(opt,1);
          }
        })
        return;
      }
    }
    // console.log(model);
    switch (model) {
      case 'line-1':
        if(decode.candidates[0].finishReason == 'STOP'){
          stopStatus.value = true;
        }
        tmp = decode.candidates[0].content.parts[0].text;
        if (tmp) {
          tmp = tmp.replace(/\`\`\`lingben_bash[\s\S]*?\`\`\`/, '');
          tokensCount2.value = decode.usageMetadata.totalTokenCount;
        } else if (decode.candidates[0].content.parts[0].functionCall) {
          Auth.chatTaskThread.add(async () => {
            await Auth.functionCall(decode.candidates[0].content.parts[0].functionCall, {
              alert: (obj) => {
                ElMessageBox.alert(md.render(obj.content), obj.title || '任务执行结果', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  dangerouslyUseHTMLString: true,
                  showClose: false,
                });
              },
              renderHtml: (html) => {
                chatList.value[opt.index].content += html;
              },
            });
          });
          tmp = '\n\n';
        }
        if(!animateMode.value) animateMode.value = true;
        contentRendered.value.push({content:tmp,fresh:true});
        break;
      case 'line-2':
        tmp = decode.choices[0].delta?.content;
        break;
      case 'line-3':
        tmp = decode.choices[0].delta?.content;
        break;
      case 'line-4':
        tmp = decode.response;
        break;
    }
  }catch(e){ }
  chatList.value[opt.index].content += tmp;
  renderContent(opt.index);
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
      if(model == 'line-1'){
        // animateMode.value = false;
        setTimeout(()=>{
          animateMode.value = false;
          contentRendered.value=[]
        },10)
      }
        const res = await Auth.setAIChatResponse({
          sessionID: sessionID.value,
          content: chatList.value[opt.index].content,
          tokens: tokensCount.value + tokensCount2.value,
          title: title.value,
        });
        suggestions.value = res.suggestions;
        title.value = res.title;
        emitter.emit('updateTitle', res.title);
      
    }
  }
}
const send = async (param)=>{
  input.value = document.getElementById('input_chat_ai').value
  if(input.value.trim() == '' && !usePhoto.value && !useAudio.value) {
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
  textareaCssContainer.style.setProperty('--inputContainerHeight', '32px');
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
const loginStatus = ref(false);
const model = ref('')
const throttledSend = throttle(send, 100); // 调整 3000 为所需的毫秒数
const debouncedScrollToBottom = debounce(scrollToBottom, 700); // 调整 300 为所需的毫秒数
const throttledScrollToBottom = throttle(scrollToBottom, 1500); // 调整 300 为所需的毫秒数
onMounted(async ()=>{
  const info = sessionStorage.getItem('userInfo');
  if(info){
    if(JSON.parse(info).avatar){
      loginStatus.value = true;
    }
  }
  let id = route.params.id;
  model.value = route.query.model || ''
    sessionID.value = id
    fingerprint.value = await Auth.getUserFingerprint();
    await Promise.all([
    async ()=>{
      const welcomeOnline = (await Auth.getAIWelcome({sessionID:id}))
      welcome.value = welcomeOnline.content;
      model_info.value = {
        ...model_info.value,
        name:welcomeOnline.model.name,
        desc:welcomeOnline.model.desc,
        createuser:welcomeOnline.model.createuser,
      };
      model_info.value.createUser = (await Auth.getUserInfoByID({id:model_info.value.createuser}));
      welcome_loading.value = false;
      return 0;
    },async ()=>{
      let tmp = 0;
      const getList = (await Auth.getAIChatList({sessionID:id}))
      chatList.value = getList.content.map((e,i)=>{
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
    }].map(async(e)=>{
      return e()
    }))
    loading.value = false;
    document.getElementById('input_chat_ai').focus()
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
</style>