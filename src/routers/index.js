import { createRouter, createWebHistory } from 'vue-router';
import { emitter } from '../utils/emitter';
// 1️⃣ 仍旧是普通 import 的组件（不变）
import ModelChat from '../views/Model/chat.vue';
import ModelSquare from '../views/Model/square.vue';

// 2️⃣ 其它所有组件改为动态 import
const HomeIndex = () => import('../views/Home/index.vue');
const HomeBlock = () => import('../views/Home/block.vue');
const SettingsIndex = () => import('../views/Settings/index.vue');

const ProjectsCreate          = () => import('../views/Projects/create.vue');
const ProjectsDashboard       = () => import('../views/Projects/dashboard.vue');
const ProjectsList            = () => import('../views/Projects/list.vue');
const ProjectsTodo            = () => import('../views/Projects/todo.vue');
const ProjectsItemCreate      = () => import('../views/Projects/createItem.vue');
const ProjectsItemCreate_workflow = () => import('../views/Projects/create/workflow.vue');
const ProjectsDetail          = () => import('../views/Projects/detail.vue');
const Projects_Workflow       = () => import('../views/Projects/workflow/index.vue');
const Projects_Discussion     = () => import('../views/Projects/discussion/index.vue');

const TeamCreate   = () => import('../views/Team/create.vue');
const TeamList     = () => import('../views/Team/list.vue');
const TeamDetail   = () => import('../views/Team/detail.vue');
const TeamSettings = () => import('../views/Team/settings.vue');
const TeamInvite   = () => import('../views/Team/invite.vue');

const UserIndex      = () => import('../views/User/index.vue');
const UserLogin      = () => import('../views/User/login.vue');
const UserRegister   = () => import('../views/User/register.vue');
const UserSettings   = () => import('../views/User/settings.vue');

const AboutInfo      = () => import('../views/About/info.vue');
const AboutNews      = () => import('../views/About/news.vue');
const AboutProgress  = () => import('../views/About/progress.vue');
const AboutLog       = () => import('../views/About/log.vue');
const AboutValues    = () => import('../views/About/values.vue');

const ModelQuant      = () => import('../views/Model/quant.vue');
const ModelWelcome    = () => import('../views/Model/welcome.vue');
const ModelTest       = () => import('../views/Model/test.vue');
const ModelAnlysis    = () => import('../views/Model/anlysis.vue');
const ModelHistory    = () => import('../views/Model/history.vue');
const ModelStatus     = () => import('../views/Model/status.vue');
const ModelSquare     = () => import('../views/Model/square.vue');   // 这里其实就不是懒加载，保留原样

const Notification = () => import('../views/Notification/index.vue');

const LoginSuccess              = () => import('../views/Status/LoginSuccess.vue');
const LoginNeeded                = () => import('../views/Status/LoginNeeded.vue');
const LoginAlready               = () => import('../views/Status/LoginAlready.vue');
const JoinTeamApplication        = () => import('../views/Status/JoinTeamApplication.vue');
const JoinProcess                = () => import('../views/Status/JoinProcess.vue');

const ToolsQ      = () => import('../views/Tools/q.vue');

const TestIndex   = () => import('../views/Test/index.vue');
const Error404    = () => import('../views/Errors/404.vue');

const backend = () => import('../views/Model/backend.vue');


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
    { path: "/q/", name: "Q", component: ToolsQ,meta:{title:'错误页面',nologin:true,hide:['tabbar','sidebar']} },
    
    { path: "/:catchAll(.*)", name: "NotFound", component: Error404,meta:{title:'404 NOT FOUND',hide:['sidebar'],nologin:true} },
  ]
});

export default router