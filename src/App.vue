<template >
  <div class="page" :data-theme="isDarkMode?'dark':'light'" >
    <!-- <Loading mode="screen"></Loading> -->
    <div class="mainpage">
      <div class="header" v-if="!TabBarHide">
        <div class="navlist">
          <router-link :class="`nav ${activeName==item.name?'router-link-active':''}`"  v-for="(item,i) in configList" :key="i" :to="item.to">
            <div class="icon" ><component :is="getIcon(item.icon)" theme="outline" size="22"/></div>
            <p>{{ item.title }}</p>
          </router-link>
        </div>
        <div class="btns">
          <div class="btn"></div>
          <div class="btn _user">
            <remind theme="outline" size="20" fill="#5F6388" :strokewidth="5"  strokeLinejoin="bevel"/>
          </div>
        </div>
      </div>
      <div class="routerpage">
        <el-config-provider :locale="locale">
          <router-view></router-view>
        </el-config-provider>
      </div>
    </div>
    <div v-if="!TabBarHide" class="tabbar" >
      <div class="logo"></div>
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
import { ref,markRaw } from 'vue';
import { RouterLink, RouterView,useRouter } from 'vue-router'
import { AllApplication,DashboardOne,FormOne,AlignTextLeftOne,AddressBook,EditName,Communication, EveryUser,Plus } from '@icon-park/vue-next';
import { Remind } from "@icon-park/vue-next";
import { ElConfigProvider } from 'element-plus'
const router = useRouter();
const TabBarHide = ref(false);
const isDarkMode = ref(0);
const activeName = ref(0);
router.beforeEach((to, from) => {
  // console.log(to)
  const item = configList.find(i=>to.path.indexOf(i.to.split('/')[1])>-1);
  // console.log(to,from)
  if(item){
    activeName.value = item.name;
    tabbarList.value = item.tabs;
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
  Plus
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
    title:'我的团队',
    icon:'EveryUser',
    to:"/team/list",
    tabs:[
      {
        title:'成员列表',
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
  }
];
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