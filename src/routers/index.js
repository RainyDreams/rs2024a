import { createRouter, createWebHistory } from 'vue-router';
import { emitter } from '../utils/emitter';
import HomeIndex from '../views/Home/index.vue';
import SettingsIndex from '../views/Settings/index.vue';
import ProjectsCreate from '../views/Projects/create.vue';
import ProjectsDashboard from '../views/Projects/dashboard.vue';
import ProjectsList from '../views/Projects/list.vue';
import ProjectsTodo from '../views/Projects/todo.vue';
import ProjectsItemCreate from '../views/Projects/createItem.vue';
import ProjectsDetail from '../views/Projects/detail.vue';
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
import AboutProgress from '../views/About/progress.vue';
import AboutLog from '../views/About/log.vue';
import Notification from '../views/Notification/index.vue';
import LoginSuccess from '../views/Status/LoginSuccess.vue';
import LoginNeeded from '../views/Status/LoginNeeded.vue';
import JoinTeamApplication from '../views/Status/JoinTeamApplication.vue';

import DangerView from '../views/Tests/admin.vue'
import Test from '../views/Tests/test.vue';
import Error404 from '../views/Errors/404.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "Home", component: HomeIndex, meta:{hide:['sidebar']} },
    { path: "/projects/", name: "Projects", children: [
      { path: "create", name: "ProjectsCreate", component: ProjectsCreate },
      { path: "dashboard", name: "ProjectsDashboard", component: ProjectsDashboard },
      { path: "list", name: "ProjectsList", component: ProjectsList },
      { path: "todo", name: "ProjectsTodo", component: ProjectsTodo },
      { path: "detail-create/:type/:projectId", name: "ProjectsItemCreate", component: ProjectsItemCreate },
      { path: "detail/:projectId", name: "ProjectsDetail", component: ProjectsDetail },
    ]},
    { path: "/team/", name: "Team", children: [
      { path: "create", name: "TeamCreate", component: TeamCreate },
      { path: "list", name: "TeamList", component: TeamList },
      { path: "settings", name: "TeamSettins", component: TeamSettings },
      { path: "invite", name: "TeamInvite", component: TeamInvite,meta:{hide:['tabbar','sidebar']}},
      { path: "detail/:teamId", name: "TeamDetail", component: TeamDetail },
    ]},
    { path: "/user/", name: "User", children:[
      { path: "profile", name: "UserProfile", component: UserIndex},
      { path: "login", name: "UserLogin", component: UserLogin },
      { path: "settings", name: "UserSettings", component: UserSettings },
    ]},
    { path: "/about/", name: "About", children: [
      { path: "info", name: "AboutInfo", component: AboutInfo },
      { path: "progress", name: "AboutProgress", component: AboutProgress },
      { path: "log", name: "AboutLog", component: AboutLog }
    ] },
    {path: "/status/", name:"Status", children:[
      { path: "jta", name:"JoinTeamApplication", component:JoinTeamApplication,meta:{hide:['tabbar','sidebar'] }},
    ]},
    { path: "/notification", name: "Notification", component: Notification,meta:{hide:['sidebar']}},
    { path: "/reg", name: "UserRegister", component: UserRegister,meta:{hide:['tabbar','sidebar']}},
    { path: "/login-success", name: "LoginSuccess", component: LoginSuccess,meta:{hide:['sidebar']}},
    { path: "/login-needed", name: "LoginNeeded", component: LoginNeeded,meta:{hide:['sidebar']}},
    { path: "/settings/", name: "Settings", component: SettingsIndex },
    { path: "/test/ai", name: "Tests", component: Test },
    { path: "/danger/view", name: "DangerView", component: DangerView },
    
    { path: "/:catchAll(.*)", name: "NotFound", component: Error404 },
  ]
});

router.beforeEach(async (to, from, next) => {
  next();
});

router.afterEach((to) => {
  
})

export default router