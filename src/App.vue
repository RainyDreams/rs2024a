<template >
  <div class="page" :data-theme="isDarkMode?'dark':'light'" >
    <div class="mainpage">
      <div class="header" v-if="!TabBarHide">
        <div class="navlist">
          <router-link v-for="(item,i) in configList" :class="{nav:1,'router-link-active':activeName==item.name}"  :key="item.name" :to="item.to">
            <div class="icon" ><component :is="getIcon(item.icon)" theme="outline" size="22"/></div>
            <p>{{ item.title }}</p>
          </router-link>
        </div>
        <div class="btns">
          <div class="btn">
            <remind theme="outline" size="20" fill="#5F6388" :strokewidth="5"  strokeLinejoin="bevel"/>
          </div>
          <router-link class="btn _user" :to="`/user/profile`">
            <el-avatar
              :size="35"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </router-link>
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
    <div v-if="!TabBarHide" class="tabbar" >
      <div class="logo">
        <img src="/logo.svg" alt="赤子英金协作系统">
      </div>
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
{console.log('%cRS2024-A%c\n%c赤峰二中2023级12班2024年研究性学习项目\r%c\n2024-07-25雨窗',
'font-size:14px;background:#2262fb;color:#fff;font-family:Arial;padding:2px 4px;border-radius:4px;','','font-size:14px;background:#f00;color:#fff;font-family:Arial;padding:2px 4px;border-radius:4px;','font-size:16px;font-family:Arial;');
console.log('%cNOTICE%c\n%c你好，当你看到这段文本代表你可能已经掌握一定的技术能力，我很高兴我的软件能被你们所了解。\n但有以下几点需要注意：%c\n%c1. 我们是学生初创项目，请不要尝试攻击、毁坏或者以任何方式使它停止工作，我们感谢你的善举\n2. 如果你想要研究它的源码和创作历程，请关注“赤子英金”', 
'font-size:18px;padding:4px;color:#fff;background:#f00;','','font-size:12px;line-height:16px;padding:2px;', '','padding:2px;line-height:16px;font-size:12px;'); 
console.log('%cDANGER%c请不要粘贴任何未知代码！！！\n防止XSS攻击','font-size:18px;padding:4px;color:#fff;background:#f00;','font-size:18px;padding:4px;color:#000;background:#ff0;');}
import { ref,markRaw, reactive } from 'vue';
import { RouterLink, RouterView,useRouter } from 'vue-router'
import { AllApplication,DashboardOne,FormOne,AlignTextLeftOne,AddressBook,EditName,Communication, EveryUser,Plus,Info, DocDetail, SettingConfig } from '@icon-park/vue-next';
import { Remind } from "@icon-park/vue-next";
import { ElConfigProvider } from 'element-plus'
// import { zhCn } from 'element-plus/es/locale';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
const router = useRouter();
const TabBarHide = ref(false);
const isDarkMode = ref(0);
const activeName = ref(0);
router.beforeEach((to, from) => {
  // console.log(to)
  const item = configList.find(i=>to.path.indexOf(i.to.split('/')[1])>-1) || 
  rightList.find(i=>to.path.indexOf(i.to.split('/')[1])>-1);
  // console.log(to,from)
  if(item){
    activeName.value = item.name;
    tabbarList.value = item.tabs;
  } else {
    activeName.value = '';
  }
  if(to.meta.tabbarhide){
    TabBarHide.value = true;
  }else{
    TabBarHide.value = false;
  }
});
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
  SettingConfig
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

// function switchTab(i){
//   tabbarList.value = configList[i].tabs;
//   router.push(configList[i].tabs[0].to);
//   activeIndex.value=i
// }
</script>

<style lang="scss" scoped>
@import "./styles/tabbar.scss";
</style>