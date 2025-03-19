<template >
  <div :class="'page '+(isDarkMode?'dark':'light')" :data-theme="isDarkMode?'dark':'light'" >
    <div class="mainpage">
      <div class="header" v-if="!TabBarHide">
        <div :class="{navlist:1,show:showMenu}" :style="showMenu?'':'transition-delay: 0.20s;'">
          <router-link class="logo pc" to="/home" v-if="SideBarHide" style="margin-left:24px;height:28px;padding:0 8px;">
            <img src="/logo.webp" style="color:#3c3e55" alt="零本智协">
          </router-link>
          <a v-for="(item,i) in configList" :class="`nav ${activeName==item.name?'router-link-active':''} animate__animated ${M(showMenu?'animate__fadeInTopLeft':'animate__fadeOutTopLeft')}`" :style="(showMenu?`animation-duration:0.5s;`:'')+`animation-delay:${0.08*(i)}s`" :key="item.name" @click="isM(item.to,item.name)">
            <div class="icon" ><component :is="getIcon(item.icon)" theme="outline" size="22"/></div>
            <p>{{ item.title }}</p>
          </a>
          <div v-if="!TabBarHide" class="m tabbar" >
            <ul class="tablist">
              <li :class="`tab ${(item.type=='primary')?'primary':''} animate__animated ${showMenu?'animate__fadeInLeft':'animate__fadeOutLeft'}`" :style="(showMenu?`animation-duration:0.6s;`:'')+`animation-delay:${0+0.12*(i)}s`" v-for="(item,i) in tabbarList" :key="i">
                <router-link class="" @click="toM(item.to)" :to="item.to" >
                  <div class="icon">
                    <component :is="getIcon(item.icon)" theme="outline" size="22"/>
                  </div>
                  <p>{{ item.title }}</p>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="m navMenu">
          <router-link to="/home">
            <img src="/logo.webp" style="color:#3c3e55" alt="零本智协">
          </router-link>
          <MenuFoldOne @click="bindShowMenu()" theme="outline" size="22" fill="#5F6388" v-if="!showMenu"/>
          <MenuUnfoldOne @click="bindShowMenu()" theme="outline" size="22" fill="#5F6388" v-if="showMenu"/>
        </div>
        <div class="btns" v-show="basicInfo.visitInfo">
          <router-link v-if="basicInfo.isLogined" class="btn" to="/notification">
            <el-badge :value="basicInfo.Notification?basicInfo.Notification:undefined" :max="99" class="item">
              <remind theme="outline" size="20" fill="#5F6388" :strokewidth="5"  strokeLinejoin="bevel"/>
            </el-badge>
          </router-link>
          <a v-if="!basicInfo.isLogined" class="login_tab " @click="login">登录</a>
          <a v-if="basicInfo.isLogined" :class="`btn _user ${activeName=='User'?'router-link-active':''}`" @click="clickUser()">
            <el-avatar
              alt="头像"
              :size="35"
              :src="basicInfo.avatar"
            />
          </a>
        </div>
        <div class="btns" v-show="!basicInfo.visitInfo" style="width:60px;">
          <el-progress
            style="width:100%"
            :percentage="100"
            :show-text="false"
            :indeterminate="true"
            :duration="1"
            :color="[{ color: '#904df5', percentage: 100 }]"
          ></el-progress>
        </div>
      </div>
      <div class="routerpage">
        <el-config-provider :locale="zhCn">
          <router-view v-slot="{ Component }">
            <!-- <transition :duration="{ enter: 400000, leave:0 }" enter-active-class="animate__animated animate__fadeInRight"> -->
              <keep-alive :max="1">
                <component :is="Component" />
              </keep-alive>
            <!-- </transition> -->
          </router-view>
        </el-config-provider>
      </div>
    </div>
    <div v-if="!SideBarHide" :class="`tabbar pc flex-col `+(sideCollapsed?'sideCollapsed':'')" >
      <router-link class="logo" to="/home">
        <img src="/logo.webp" class="mb-3 bg" style="color:#3c3e55" alt="零本智协">
        <img src="/logo_sm.webp" class="mb-3 sm" style="color:#3c3e55" alt="零本智协">
      </router-link>
      <div class="flex-1">
        <ul class="tablist">
          <li :class="{primary:item.type=='primary',tab:1}" v-for="(item,i) in tabbarList" :key="i">
            <router-link class="" :to="item.to" >
              <div class="icon">
                <component :is="getIcon(item.icon)" theme="outline" size="22"/>
              </div>
              <p>{{ item.title }}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <div style="padding: 16px 28px;">
        <button class="collapse-btn" @click="toggleSidebar">
          <component :is="sideCollapsed ?MenuFoldOne: MenuUnfoldOne " theme="outline" size="22" fill="#5F6388"/>
        </button>
      </div>
    </div>
  </div>

  <div :class="['fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 px-2 py-10 transition-all duration-200 ease-out',showLoginModel?'opacity-100 visible ':' opacity-0 invisible pointer-events-none']">
    <div :class="['bg-white p-8 rounded-3xl relative shadow-md w-96 transition duration-300 ease-out timefn',showLoginModel?'scale-100':'scale-95']">
      <button 
        @click="close"
        class="absolute text-gray-400 transition right-2 top-2 hover:bg-slate-200 bg-slate-50 hover:bg-opacity-50 rounded-full flex items-center justify-center w-10 h-10 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 class="text-3xl font-bold text-blue-600 mb-6">欢迎！</h1>
      <el-skeleton  v-show="loginLoading" animated :rows="5" />
      <form @submit.prevent="submitForm" v-show="!loginLoading">
        <label for="username" class="block text-gray-600 text-sm mb-1">邮箱</label>
        <input type="text" id="username" v-model="form.username" placeholder="请输入邮箱" class="border-2 outline-none transition focus:border-blue-500 border-slate-100 rounded-lg px-3 py-2 w-full mb-4 bg-slate-100">
        <label for="password" class="block text-gray-600 text-sm mb-1">密码</label>
        <input type="password" id="password" v-model="form.password" placeholder="请输入密码" class="outline-none border-2 focus:border-blue-500 transition border-slate-100 rounded-lg px-3 py-2 w-full mb-6 bg-slate-100">
        <div id="turnstile-box"></div>
        <button type="submit" class="bg-blue-400 hover:bg-blue-500 text-white transition py-2 px-4 rounded-lg text-center text-base/relaxed mb-2 cursor-default w-full">登 录</button>
        <button type="button" @click="reg" class="block border border-slate-200 transition text-slate-600 py-2 text-center text-base/relaxed px-4 rounded-lg w-full hover:bg-slate-50" to="/reg">注 册</button>
        <p class="text-gray-400 text-xs mb-1 mt-4">登录即代表同意<a href="https://oh.chiziingiin.top/license/auth" target="_blank">《零本智协统一身份验证用户协议》</a></p>
      </form>
      <p class="text-gray-400 text-xs mt-1">© 2025 零本智协 保留所有权利.</p>
    </div>
  </div>
</template>


<script setup>



console.log('%c零本智协 LinkBrain AI%c\n%c赤峰二中2023级12班2024年研究性学习项目\r%c\n2024-07-25雨窗',
'font-size: 20px; background: #3b82f6; color: #fff; font-family: Arial; padding: 5px 10px; box-shadow: 0 4px 8px rgba(59, 130, 246, 0.5);',
'',
'font-size: 16px; background: #dc2626; color: #fff; font-family: Arial; padding: 4px 8px; box-shadow: 0 3px 6px rgba(220, 38, 38, 0.5);',
'font-size: 18px; font-family: Arial;');
console.log('%cDANGER%c请不要粘贴任何未知代码！！！\n防止XSS攻击',
'font-size: 22px; padding: 6px; color: #fff; background: #dc2626; font-family: Arial; box-shadow: 0 5px 10px rgba(220, 38, 38, 0.5);',
'font-size: 22px; padding: 6px; color: #020617; background: #fde047; font-family: Arial; box-shadow: 0 5px 10px rgba(253, 224, 71, 0.5);');
import { ref,markRaw, reactive, onMounted, onActivated } from 'vue';
import { RouterLink, RouterView,useRoute,useRouter } from 'vue-router'
import { MenuFoldOne,MenuUnfoldOne,AllApplication,DashboardOne,FormOne,AlignTextLeftOne,AddressBook,EditName,Communication, EveryUser,Plus,Info, DocDetail, SettingConfig, Tool, SmartOptimization, ApplicationOne, MessageEmoji, Log, CooperativeHandshake,History, Server, NewspaperFolding } from '@icon-park/vue-next';
import { Remind } from "@icon-park/vue-next";
import { ElConfigProvider,ElAvatar,ElProgress,ElBadge, ElMessage, ElSkeleton, ElMessageBox } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import Auth from './utils/auth';
import { emitter } from './utils/emitter';
import NProgress from 'nprogress';
import Cookies from 'js-cookie';
import { configList,rightList } from './utils/config';
import CryptoJS from 'crypto-js';
const router = useRouter();
Auth.router = useRouter();
const route = useRoute();
const TabBarHide = ref(false);
const SideBarHide = ref(false);
const isDarkMode = ref(0);
const activeName = ref(0);
const showMenu = ref(false);
const sideCollapsed = ref(false);
const showLoginModel = ref(false);
const loginLoading = ref(false);
const verifyToken = ref();
const form = reactive({
  username:'',
  password:'',
});
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  if(!sessionStorage.getItem('darkMode') || sessionStorage.getItem('darkMode')=='dark'){
    // isDarkMode.value=1;
  }
}
let tmpFn ;
class LoginScheduler {
  constructor(max) {
    this.max = max;
    this.count = 0;
    this.queue = [];
  }
  async add(promiseCreator) {
    if (this.count >= this.max) {
      await new Promise((resolve, reject) => {
        this.queue.push({ resolve, reject });
      });
    }
    this.count++;
    try {
      const res = await promiseCreator();
      return res;
    } finally {
      
    }
  }
  async solve(){
    this.count--;
    if (this.queue.length > 0) {
      const { resolve } = this.queue.shift();
      resolve();
    }
  }
  clear() {
    while (this.queue.length > 0) {
      const { reject } = this.queue.shift();
      reject(new Error('Task cancelled'));
    }
    this.count = 0;
  }
}
const LoginThread = new LoginScheduler(1);
emitter.on('toggleSidebar',()=>{
  sideCollapsed.value = true;
})
emitter.on('applyForLogin',(fn=async()=>{})=>{
  LoginThread.add(async ()=>{
    let prStatus = await Auth.getPrtoken();
    if(prStatus.status == 'sus'){
      await fn();
      LoginThread.solve();
    } else if (prStatus.status == 'notExist'){
      showLoginModel.value = true;
      tmpFn = fn;
    } else {
      prStatus = await Auth.getPrtoken('force');
      if(prStatus.status == 'exist' || prStatus.status == 'sus'){
        await fn();
        LoginThread.solve();
      } else {
        showLoginModel.value = true;
        tmpFn = fn;
      }
    }
  })
});
async function login(){
  emitter.emit('applyForLogin',async()=>{
    LoginThread.solve();
    update()
  })
  
  // let prStatus = await Auth.getPrtoken();
  // if(prStatus.status == 'exist' || prStatus.status == 'sus'){

  // } else {
  // }
}
function reg(){
  LoginThread.solve();
  showLoginModel.value = false;
  router.push('/reg');
}
async function submitForm(){
  if(!verifyToken.value){
    ElMessage.error('请完成验证');
    return ;
  }
  if(!form.username || !form.password){
    ElMessage.error('请输入账号和密码');
    return ;
  }
  ElMessage.info('正在登录')
  const encode = CryptoJS.MD5(form.username+form.password).toString().toUpperCase();
  loginLoading.value=true;
  const createTeam = await Auth.userLogin({
    username:form.username,
    password:encode,
    token:verifyToken.value,
    force:'ewbiuwudsaef66f'
  })
  try{
    if(createTeam.status == 'sus'){
      window.clarity("identify", createTeam.content.id, createTeam.content.sessionID,'login',createTeam.content.id)
      form.username = '';
      form.password = '';
      Cookies.set("czigauth", "NeedPrtoken", {
        expires: new Date(createTeam.content.expires),
        path: "/",
        secure: true,
        domain:'.chiziingiin.top'
      });
      await Auth.getPrtoken('force')
      sessionStorage.removeItem('userInfo')
      ElMessage.success('登录成功');
      emitter.emit('updateLoginInfo');
      if(tmpFn){
        await tmpFn();
      }
      update();
      tmpFn = null;
      showLoginModel.value = false;
      LoginThread.solve();
    } else {
      Cookies.remove("czigauth");
      ElMessage.error('登录失败');
    }
  } finally {
    loginLoading.value=false;
  }
  
}
function close(){
  if(LoginThread.count <= 1){
    LoginThread.clear();
    showLoginModel.value = false;
    return;
  }
  ElMessageBox.alert(`当前有 ${LoginThread.count} 个任务需3+1+N鉴权，放弃登录会取消任务，是否确认放弃？`, '提示', {
    confirmButtonText: '确定',
    showClose:true,
    showCancelButton:true,
    callback: action => {
      if(action === 'confirm'){
        LoginThread.clear();
        showLoginModel.value = false;
      }
    },
  });
}
emitter.on('login',login)
const toggleSidebar = () => {
  sideCollapsed.value = !sideCollapsed.value;
}
const basicInfo = ref({
  isLogined:false,
  avatar:'',
  Notification:0,
  NotificationList:[]
})
onMounted(async ()=>{
  setTimeout(()=>{
    if(document.querySelector('#loading-container')){
      document.querySelector('#loading-container').classList.add('animate__fadeOut');
      document.querySelector('#loading-container').classList.add('pointer-events-none');
      // document.querySelector('#loading-container div').classList.add('animate__fadeOut');
      setTimeout(()=>{
        document.querySelector('#loading-container').remove()
      },2000)
    }
  },10);
  Auth.getRecaptchaToken({
    action:'login',
    id:'#turnstile-box',
    success:(token)=>{
      verifyToken.value = token;
    },
    failed:()=>{
      verifyToken.value = false;
    }
  })
});
function bindShowMenu(){
  showMenu.value=!showMenu.value;
}
const update = () => {
  (Auth.getBasicInfo({task:async function(re){
    basicInfo.value = re;
    emitter.emit('basicInfo',re);
    emitter.emit('updateLoginInfo')
  }}));
}
emitter.on('updateBasicAuth',update)
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200, 
  parent: 'html',
});
emitter.on('updateTitle',(e)=>{
  document.title = e + ' - 零本智协';
})
router.beforeEach((to, from, next) => {
  NProgress.start();
  if(to.meta.title){
    document.title = to.meta.title + ' - 零本智协';
  }
  next()
});
Auth.basicInfoTaskThread.add(async ()=>{
  update();
  await new Promise(resolve=>{
    setTimeout(()=>{
      resolve()
    },10000)
  });
})
router.afterEach(async (to, from) => {
  const item = configList.find(i=>to.path.indexOf(i.to.split('/')[1])>-1) || 
  rightList.find(i=>to.path.indexOf(i.to.split('/')[1])>-1);
  if(item){
    activeName.value = item.name;
    if(window.innerWidth <= 992){
      tabbarList.value = [];
      setTimeout(()=>{
        tabbarList.value = item.tabs;
      },1)
    } else {
      tabbarList.value = item.tabs;
    }
  } else {
    activeName.value = '';
  }
  TabBarHide.value = false;
  SideBarHide.value = false;
  if(to.meta.hide){
    to.meta.hide.find(e=>{
      if(e=='tabbar') TabBarHide.value = true;
      else if (e=='sidebar') SideBarHide.value = true;
    })
  }
  NProgress.done();
  // Auth.mainTaskThread.add(async ()=>{
  // })
});
function M(str){
  return window.innerWidth <= 1000?str:'';
}
function isM(to,name){
  if(window.innerWidth > 1000){
    router.push(to)
  } else {
    activeName.value = name;
    const item = configList.find(i=>to.indexOf(i.to.split('/')[1])>-1) || 
    rightList.find(i=>to.indexOf(i.to.split('/')[1])>-1);
    if(item){
      activeName.value = item.name;
      tabbarList.value = [];
      // if(window.innerWidth <= 1000){
      tabbarList.value = [];
      setTimeout(()=>{
        tabbarList.value = item.tabs;
      },5)
    } else {
      activeName.value = '';
    }
  }
}
function toM(path) {
  showMenu.value=false
}
function clickUser(){
  router.push('/user/profile');
  activeName.value="User";
  tabbarList.value = rightList[1].tabs;
}
const iconList = {
  AllApplication,
  DashboardOne,
  FormOne,
  AlignTextLeftOne,
  AddressBook,
  EditName,
  Communication,
  EveryUser,
  Plus,
  Info,
  Remind,
  DocDetail,
  SettingConfig,
  Tool,
  SmartOptimization,
  ApplicationOne,
  MessageEmoji,
  Log,
  History,
  Server,
  NewspaperFolding
}
function getIcon(name){
  return iconList[name];
}

const tabbarList = ref(configList[0].tabs);

</script>


<style lang="scss" scoped>
.logo .sm{
  display:none;
}
.sideCollapsed {
  .logo .bg{
    display:none;
  }
  .logo .sm{
    display:block;
  }
  li a p{
    display:none;
  }
  width:auto !important;
}
.timefn{
  transition-timing-function: cubic-bezier(0.33, 0.85, 0.41, 1.4) !important;
}
</style>