export const configList = [
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
    to:"/model/square",
    tabs:[
      {
        title:'模型库',
        icon:'SmartOptimization',
        to:'/model/square'
      },
      {
        title:'聊天历史',
        icon:'History',
        to:'/model/history'
      },
      {
        title:'新建聊天',
        icon:'MessageEmoji',
        to:'/model/chat/new'
      },
      {
        title:'新建分析',
        icon:'ApplicationOne',
        to:'/model/anlysis'
      },
      {
        title:'服务器状态',
        icon:'Server',
        to:'/model/status'
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
export const rightList = [
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