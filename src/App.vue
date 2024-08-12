<template >
  <div class="page" :data-theme="isDarkMode?'dark':'light'" >
    <div class="mainpage">
      <div class="header" v-if="!TabBarHide">
        <div :class="{navlist:1,show:showMenu}" :style="showMenu?'':'transition-delay: 0.20s;'">
          <router-link class="logo pc" to="/" v-if="SideBarHide" style="margin-left:24px;height:28px;padding:0 8px;">
            <img src="/logo.webp" alt="零本创智">
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
            <img src="/logo.webp" alt="零本创智">
          </router-link>
          <MenuFoldOne @click="bindShowMenu()" theme="outline" size="22" fill="#5F6388" v-if="!showMenu"/>
          <MenuUnfoldOne @click="bindShowMenu()" theme="outline" size="22" fill="#5F6388" v-if="showMenu"/>
        </div>
        <div class="btns">
          <router-link class="btn" to="/notification">
            <remind theme="outline" size="20" fill="#5F6388" :strokewidth="5"  strokeLinejoin="bevel"/>
          </router-link>
          <a :class="`btn _user ${activeName=='User'?'router-link-active':''}`" @click="clickUser()">
            <el-avatar
              alt="头像"
              :size="35"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </a>
        </div>
      </div>
      <div class="routerpage">
        <el-config-provider :locale="zhCn">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-config-provider>
      </div>
    </div>
    <div v-if="!SideBarHide" class="tabbar pc" >
      <router-link class="logo" to="/">
        <img src="/logo.webp" alt="零本创智">
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



{console.log('%c零本创智%c\n%c赤峰二中2023级12班2024年研究性学习项目\r%c\n2024-07-25雨窗',
'font-size:14px;background:#2262fb;color:#fff;font-family:Arial;padding:2px 4px;border-radius:4px;','','font-size:14px;background:#f00;color:#fff;font-family:Arial;padding:2px 4px;border-radius:4px;','font-size:16px;font-family:Arial;');
console.log('%cNOTICE%c\n%c你好，当你看到这段文本代表你可能已经掌握一定的技术能力，我很高兴我的软件能被你们所了解。\n但有以下几点需要注意：%c\n%c1. 我们是学生初创项目，请不要尝试攻击、毁坏或者以任何方式使它停止工作，我们感谢你的善举\n2. 如果你想要研究它的源码和创作历程，请关注“赤子英金”', 
'font-size:18px;padding:4px;color:#fff;background:#f00;','','font-size:12px;line-height:16px;padding:2px;', '','padding:2px;line-height:16px;font-size:12px;'); 
console.log('%cDANGER%c请不要粘贴任何未知代码！！！\n防止XSS攻击','font-size:18px;padding:4px;color:#fff;background:#f00;','font-size:18px;padding:4px;color:#000;background:#ff0;');}
import { ref,markRaw, reactive, onMounted } from 'vue';
import { RouterLink, RouterView,useRouter } from 'vue-router'
import { MenuFoldOne,MenuUnfoldOne,AllApplication,DashboardOne,FormOne,AlignTextLeftOne,AddressBook,EditName,Communication, EveryUser,Plus,Info, DocDetail, SettingConfig, Tool } from '@icon-park/vue-next';
import { Remind } from "@icon-park/vue-next";
import { ElConfigProvider,ElAvatar,ElNotification } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import Auth from './utils/auth';
const router = useRouter();
const TabBarHide = ref(false);
const SideBarHide = ref(false);
const isDarkMode = ref(0);
const activeName = ref(0);
const showMenu = ref(false)
function bindShowMenu(){
  showMenu.value=!showMenu.value;
}
router.afterEach((to, from) => {
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
  if(to.meta.hide)
  to.meta.hide.find(e=>{
    if(e=='tabbar') TabBarHide.value = true;
    else if (e=='sidebar') SideBarHide.value = true;
  })
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
  Tool
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
      {
        title:'待办事项',
        icon:'AlignTextLeftOne',
        to:'/projects/todo'
      },
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
    name:'Communication',
    title:'协作沟通',
    icon:'Communication',
    to:"/communication/chat",
    tabs:[
      {
        title:'沟通',
        icon:'AllApplication',
        to:'/communication/chat'
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
  {
    name:'Test',
    title:'实验性功能',
    icon:'Tool',
    to:"/test/ai",
    tabs:[
      {
        title:'AI公测',
        icon:'Tool',
        to:'/test/ai'
      },
    ]
  },
  
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