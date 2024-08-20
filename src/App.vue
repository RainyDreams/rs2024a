<template >
  <div class="page" :data-theme="isDarkMode?'dark':'light'" >
    <div class="mainpage">
      <div class="header" v-if="!TabBarHide">
        <div :class="{navlist:1,show:showMenu}" :style="showMenu?'':'transition-delay: 0.20s;'">
          <router-link class="logo pc" to="/" v-if="SideBarHide" style="margin-left:24px;height:28px;padding:0 8px;">
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
          <router-link to="/">
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
          <router-link v-if="!basicInfo.isLogined" class="login_tab" to="/login">登录</router-link>
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
              <keep-alive :exclude="[/reg/,]" :max="1">
                <component :is="Component" />
              </keep-alive>
            <!-- </transition> -->
          </router-view>
        </el-config-provider>
      </div>
    </div>
    <div v-if="!SideBarHide" class="tabbar pc" >
      <router-link class="logo" to="/">
        <img src="/logo.webp" class="mb-3" style="color:#3c3e55" alt="零本智协">
      </router-link>
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
  </div>
</template>


<script setup>



{console.log('%c零本智协%c\n%c赤峰二中2023级12班2024年研究性学习项目\r%c\n2024-07-25雨窗',
'font-size:14px;background:#2262fb;color:#fff;font-family:Arial;padding:2px 4px;border-radius:4px;','','font-size:14px;background:#f00;color:#fff;font-family:Arial;padding:2px 4px;border-radius:4px;','font-size:16px;font-family:Arial;');
console.log('%cNOTICE%c\n%c你好，当你看到这段文本代表你可能已经掌握一定的技术能力，我很高兴我的软件能被你们所了解。\n但有以下几点需要注意：%c\n%c1. 我们是学生初创项目，请不要尝试攻击、毁坏或者以任何方式使它停止工作，我们感谢你的善举\n2. 如果你想要研究它的源码和创作历程，请关注“赤子英金”', 
'font-size:18px;padding:4px;color:#fff;background:#f00;','','font-size:12px;line-height:16px;padding:2px;', '','padding:2px;line-height:16px;font-size:12px;'); 
console.log('%cDANGER%c请不要粘贴任何未知代码！！！\n防止XSS攻击','font-size:18px;padding:4px;color:#fff;background:#f00;','font-size:18px;padding:4px;color:#000;background:#ff0;');}
import { ref,markRaw, reactive, onMounted, onActivated } from 'vue';
import { RouterLink, RouterView,useRoute,useRouter } from 'vue-router'
import { MenuFoldOne,MenuUnfoldOne,AllApplication,DashboardOne,FormOne,AlignTextLeftOne,AddressBook,EditName,Communication, EveryUser,Plus,Info, DocDetail, SettingConfig, Tool, SmartOptimization, ApplicationOne, MessageEmoji } from '@icon-park/vue-next';
import { Remind } from "@icon-park/vue-next";
import { ElConfigProvider,ElAvatar,ElProgress,ElBadge } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import Auth from './utils/auth';
import { emitter } from './utils/emitter';
const router = useRouter();
const route = useRoute();
const TabBarHide = ref(false);
const SideBarHide = ref(false);
const isDarkMode = ref(0);
const activeName = ref(0);
const showMenu = ref(false)
const basicInfo = ref({
  isLogined:false,
  avatar:'',
  Notification:0,
  NotificationList:[]
})
onMounted(async ()=>{
  // console.log(1)
  setTimeout(()=>{
    if(document.querySelector('#loading-container')){
      document.querySelector('#loading-container').classList.add('animate__fadeOut');
      setTimeout(()=>{
        document.querySelector('#loading-container').remove()
      },2000)
    }
  },100)
})
function bindShowMenu(){
  showMenu.value=!showMenu.value;
}

const update = () => {
  (Auth.getBasicInfo({router,route,task:async function(re){
    basicInfo.value = re;
    emitter.emit('basicInfo',re)
    const ps = new Promise((resolve,reject)=>{
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          resolve()
        } else if (Notification.permission!== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              resolve()
            } else {
              reject()
            }
          });
        } else {
          reject()
        }
      }
    })
    ps.then(()=>{
      re.NotificationList.forEach(e=>{
        let nl = localStorage.getItem('notificationList')
        if(!nl) {
          localStorage.setItem('notificationList',JSON.stringify([]))
        }
        nl = localStorage.getItem('notificationList')
        let decode = JSON.parse(nl)
        if(!decode.includes(e.id)){
          const notification = new Notification(
            e.title, {
            body: e.body,
          });
          notification.addEventListener('click', function() {
            router.push('/notification')
          });
          decode.push(e.id)
          localStorage.setItem('notificationList',JSON.stringify(decode))
        } 
      })
    })
  }}));
}

setInterval(update, 100000);

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
  update()
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
  MessageEmoji
}
function getIcon(name){
  return iconList[name];
}
const configList = [
  {
    name:'Projects',
    title:'项目管理',
    icon:'AllApplication',
    to:"/projects/dashboard",
    tabs:[
      {
        title:'创建项目',
        icon:'Plus',
        to:'/projects/create',
        type:'primary'
      },
      {
        title:'仪表盘',
        icon:'DashboardOne',
        to:'/projects/dashboard'
      },
      {
        title:'项目列表',
        icon:'FormOne',
        to:'/projects/list'
      },
      // {
      //   title:'待办事项',
      //   icon:'AlignTextLeftOne',
      //   to:'/projects/todo'
      // },
    ]
  },
  {
    name:'Team',
    title:'团队管理',
    icon:'EveryUser',
    to:"/team/list",
    tabs:[
      {
        title:'创建团队',
        icon:'Plus',
        to:'/team/create',
        type:'primary'
      },
      {
        title:'我的团队',
        icon:'AddressBook',
        to:'/team/list'
      },
      {
        title:'团队设置',
        icon:'EditName',
        to:'/team/settings'
      },

    ]
  },
  {
    name:'Model',
    title:'零本AI',
    icon:'SmartOptimization',
    to:"/model/chat",
    tabs:[
      {
        title:'聊天',
        icon:'MessageEmoji',
        to:'/model/chat'
      },
      {
        title:'分析',
        icon:'ApplicationOne',
        to:'/model/anlysis'
      },
      
    ]
  },
  {
    name:'About',
    title:'关于软件',
    icon:'Info',
    to:"/about/info",
    tabs:[
      {
        title:'软件信息',
        icon:'Info',
        to:'/about/info'
      },
      {
        title:'创作历程',
        icon:'Info',
        to:'/about/progress'
      },
      {
        title:'更新日志',
        icon:'Info',
        to:'/about/log'
      },
    ]
  },
  // {
  //   name:'Test',
  //   title:'实验性功能',
  //   icon:'Tool',
  //   to:"/test/ai",
  //   tabs:[
  //     {
  //       title:'AI公测',
  //       icon:'Tool',
  //       to:'/test/ai'
  //     },
  //     {
  //       title:'新功能测试区',
  //       icon:'Tool',
  //       to:'/test/new-feature'
  //     },
  //   ]
  // },
  
];
const rightList = [
  {
    name:'Notification',
    icon:"Notification",
    to:"/notification",
    tabs:[

    ]
  },
  {
    name:'User',
    to:"/user/profile",
    tabs:[
      {
        title:"个人资料",
        icon:"DocDetail",
        to:"/user/profile"
      },
      {
        title:"账户设置",
        icon:"SettingConfig",
        to:"/user/settings"
      }
    ]
  }
]
const tabbarList = ref(configList[0].tabs);

</script>