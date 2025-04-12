import { createRouter, createWebHistory } from 'vue-router';
import { emitter } from '../utils/emitter';
import HomeIndex from '../views/Home/index.vue';
import HomeBlock from '../views/Home/block.vue';
import SettingsIndex from '../views/Settings/index.vue';
import ProjectsCreate from '../views/Projects/create.vue';
import ProjectsDashboard from '../views/Projects/dashboard.vue';
import ProjectsList from '../views/Projects/list.vue';
import ProjectsTodo from '../views/Projects/todo.vue';
import ProjectsItemCreate from '../views/Projects/createItem.vue';
import ProjectsItemCreate_workflow from '../views/Projects/create/workflow.vue';
import ProjectsDetail from '../views/Projects/detail.vue';
import Projects_Workflow from '../views/Projects/workflow/index.vue';
import Projects_Discussion from '../views/Projects/discussion/index.vue';
import TeamCreate from '../views/Team/create.vue';
import TeamList from '../views/Team/list.vue';
import TeamDetail from '../views/Team/detail.vue';
import TeamSettings from '../views/Team/settings.vue';
import TeamInvite from '../views/Team/invite.vue';
import UserIndex from '../views/User/index.vue';
import UserLogin from '../views/User/login.vue';
import UserRegister from '../views/User/register.vue';
import UserSettings from '../views/User/settings.vue';
import AboutInfo from '../views/About/info.vue';
import AboutNews from '../views/About/news.vue';
import AboutProgress from '../views/About/progress.vue';
import AboutLog from '../views/About/log.vue';
import AboutValues from '../views/About/values.vue';
import ModelSquare from '../views/Model/square.vue';
// import Model from '../views/Model/model.vue';
import ModelChat from '../views/Model/chat.vue';
import ModelQuant from '../views/Model/quant.vue';
import ModelWelcome from '../views/Model/welcome.vue';
import ModelTest from '../views/Model/test.vue';
import ModelAnlysis from '../views/Model/anlysis.vue';
import ModelHistory from '../views/Model/history.vue';
import ModelStatus from '../views/Model/status.vue';
import Notification from '../views/Notification/index.vue';
import LoginSuccess from '../views/Status/LoginSuccess.vue';
import LoginNeeded from '../views/Status/LoginNeeded.vue';
import LoginAlready from '../views/Status/LoginAlready.vue';
import JoinTeamApplication from '../views/Status/JoinTeamApplication.vue';
import JoinProcess from '../views/Status/JoinProcess.vue';

import TestIndex from '../views/Test/index.vue';
import Error404 from '../views/Errors/404.vue';

import backend from '../views/Model/backend.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "ModelWelcome", component: ModelWelcome,meta:{title:'LinkBrain AI',hide:['sidebar','tabbar']} },
    { path: "/quant", name: "ModelQuant", component: ModelQuant,meta:{title:'LinkBrain AI 自然语言量化交易策略',hide:['sidebar','tabbar']} },
    { path: "/backend", name: "ModelBackEnd", component: backend,meta:{title:'LinkBrain AI 后台',hide:['sidebar','tabbar']} },
    { path: "/chat/", name: "ModelChat", component: ModelChat,meta:{title:'LinkBrain AI',hide:['tabbar','sidebar']}},
    { path: "/model/", name: "Model", children:[
      { path: "square", name: "ModelSquare", component: ModelSquare,meta:{title:'LinkBrain AI 智能体广场'} },
      // { path: "m/:id", name: "ModelType", component: Model,meta:{title:'LinkBrain AI'}},
      { path: "test/:id", name: "ModelTest", component: ModelTest,meta:{title:'LinkBrain AI 聊天 专用测试版'}},
      { path: "anlysis", name: "ModelAnlysis", component: ModelAnlysis,meta:{title:'LinkBrain AI 分析'}},
      { path: "history", name: "ModelHistory", component: ModelHistory,meta:{title:'LinkBrain AI 历史'}},
      { path: "status", name: "ModelStatus", component: ModelStatus,meta:{title:'LinkBrain AI服务器状态'}},
    ]},
    { path: "/home", name: "Home", component: HomeIndex, meta:{title:'首页',hide:['sidebar'],nologin:true} },
    { path: "/block", name: "Block", component: HomeBlock, meta:{title:'该请求被拦截',hide:['sidebar'],nologin:true} },
    { path: "/projects/", name: "Projects", children: [
      { path: "create", name: "ProjectsCreate", component: ProjectsCreate,meta:{title:'创建项目'} },
      { path: "dashboard", name: "ProjectsDashboard", component: ProjectsDashboard,meta:{title:'仪表盘'} },
      { path: "list", name: "ProjectsList", component: ProjectsList,meta:{title:'项目列表'} },
      { path: "todo", name: "ProjectsTodo", component: ProjectsTodo,meta:{title:'待办列表'} },
      { path: "detail-create/workflow/:projectId", name: "ProjectsItemCreate_wkfl", component: ProjectsItemCreate_workflow,meta:{title:'创建工作流'} },
      { path: "detail-create/issue/:projectId", name: "ProjectsItemCreate", component: ProjectsItemCreate,meta:{type:'issue',title:'创建问题'} },
      { path: "detail-create/task/:projectId", name: "ProjectsItemCreate", component: ProjectsItemCreate,meta:{type:'task',title:'创建任务'}},
      { path: "detail-create/discussion/:projectId", name: "ProjectsItemCreate", component: ProjectsItemCreate,meta:{type:'discussion',title:'创建讨论'} },
      { path: "workflow/:id", name: "ProjectsWorkflow", component: Projects_Workflow,meta:{hide:['tabbar','sidebar'],title:'工作流详情'} },
      { path: "discussion/:id", name: "ProjectsDiscussion", component: Projects_Discussion,meta:{hide:['tabbar','sidebar'],title:'讨论详情'} },
      { path: "detail/:projectId", name: "ProjectsDetail", component: ProjectsDetail,meta:{title:'项目详情'} },
    ]},
    { path: "/team/", name: "Team", children: [
      { path: "create", name: "TeamCreate", component: TeamCreate,meta:{title:'创建团队'} },
      { path: "list", name: "TeamList", component: TeamList,meta:{title:'团队列表'} },
      { path: "settings", name: "TeamSettins", component: TeamSettings,meta:{title:'团队设置'} },
      { path: "invite", name: "TeamInvite", component: TeamInvite,meta:{hide:['tabbar','sidebar'],title:'邀请成员'}},
      { path: "detail/:teamId", name: "TeamDetail", component: TeamDetail,meta:{title:'团队详情'} },
    ]},
    { path: "/user/", name: "User", children:[
      { path: "profile", name: "UserProfile", component: UserIndex,meta:{title:'用户详情'}},
      { path: "settings", name: "UserSettings", component: UserSettings,meta:{title:'用户设置'} },
    ]},
    
    { path: "/about/", name: "About", children: [
      { path: "info", name: "AboutInfo", component: AboutInfo,meta:{title:'软件信息',nologin:true} },
      { path: "news", name: "AboutNews", component: AboutNews,meta:{title:'新闻',nologin:true} },
      { path: "progress", name: "AboutProgress", component: AboutProgress,meta:{title:'创作历程',nologin:true} },
      { path: "log", name: "AboutLog", component: AboutLog,meta:{title:'更新日志',nologin:true,hide:['tabbar','sidebar'] } },
      { path: "values", name: "AboutValues", component: AboutValues,meta:{title:'价值观',nologin:true,hide:['tabbar','sidebar']} }
    ] },
    {path: "/status/", name:"Status", children:[
      { path: "jta", name:"JoinTeamApplication", component:JoinTeamApplication,meta:{hide:['sidebar'],title:'加入团队申请'}},
      { path: "joining", name:"JoinProcess", component:JoinProcess,meta:{hide:['sidebar'] ,title:'加入团队中'}},
    ]},
    { path: "/notification", name: "Notification", component: Notification,meta:{hide:['sidebar'],title:'通知'}},
    { path: "/reg", name: "UserRegister", component: UserRegister,meta:{hide:['tabbar','sidebar'],title:'注册',nologin:true}},
    { path: "/login", name: "UserLogin", component: UserLogin,meta:{hide:['tabbar','sidebar'],title:'登录',nologin:true}},
    { path: "/login-success", name: "LoginSuccess", component: LoginSuccess,meta:{hide:['sidebar'],'title':'登录成功'}},
    { path: "/login-needed", name: "LoginNeeded", component: LoginNeeded,meta:{hide:['sidebar'],title:'登录已失效',nologin:true}},
    { path: "/login-already", name: "LoginAlready", component: LoginAlready,meta:{hide:['sidebar'],title:'已登录'}},
    { path: "/settings/", name: "Settings", component: SettingsIndex,meta:{title:'创建项目'},title:'设置'},
    { path: "/test/", name: "Test", component: TestIndex,meta:{title:'测试页面',nologin:true} },
    
    { path: "/:catchAll(.*)", name: "NotFound", component: Error404,meta:{title:'404 NOT FOUND',hide:['sidebar'],nologin:true} },
  ]
});

export default router