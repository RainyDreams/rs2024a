import { createRouter, createWebHistory } from 'vue-router';

const HomeIndex = () => import('../views/Home/index.vue');
const SettingsIndex = () => import('../views/Settings/index.vue');
const ProjectsCreate = () => import('../views/Projects/create.vue');
const ProjectsDashboard = () => import('../views/Projects/dashboard.vue');
const ProjectsList = () => import('../views/Projects/list.vue');
const ProjectsTodo = () => import('../views/Projects/todo.vue');
const ProjectsItemCreate = () => import('../views/Projects/createItem.vue');
const ProjectsDetail = () => import('../views/Projects/detail.vue');
const TeamCreate = () => import('../views/Team/create.vue');
const TeamList = () => import('../views/Team/list.vue');
const TeamSettings = () => import('../views/Team/settings.vue');
const TeamInvite = () => import('../views/Team/invite.vue');
const UserIndex = () => import('../views/User/index.vue');
const UserLogin = () => import('../views/User/login.vue');
const UserRegister = () => import('../views/User/register.vue');
const UserSettings = () => import('../views/User/settings.vue');
const AboutInfo = () => import('../views/About/info.vue');
const AboutProgress = () => import('../views/About/progress.vue');
const AboutLog = () => import('../views/About/log.vue');
const DangerView = () => import('../views/Tests/admin.vue');
const Test = () => import('../views/Tests/test.vue');
const Error404 = () => import('../views/Errors/404.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "Home", component: HomeIndex, meta: { hide: ['sidebar', 'tabbar'] } },
    {
      path: "/projects/", name: "Projects", children: [
        { path: "create", name: "ProjectsCreate", component: ProjectsCreate },
        { path: "dashboard", name: "ProjectsDashboard", component: ProjectsDashboard },
        { path: "list", name: "ProjectsList", component: ProjectsList },
        { path: "todo", name: "ProjectsTodo", component: ProjectsTodo },
        { path: "detail-create/:type/:projectId", name: "ProjectsItemCreate", component: ProjectsItemCreate },
        { path: "detail/:projectId", name: "ProjectsDetail", component: ProjectsDetail },
      ]
    },
    {
      path: "/team/", name: "Team", children: [
        { path: "create", name: "TeamCreate", component: TeamCreate },
        { path: "list", name: "TeamList", component: TeamList },
        { path: "settings", name: "TeamSettings", component: TeamSettings },
        { path: "invite", name: "TeamInvite", component: TeamInvite, meta: { hide: ['tabbar', 'sidebar'] } },
      ]
    },
    {
      path: "/user/", name: "User", children: [
        { path: "profile", name: "UserProfile", component: UserIndex },
        { path: "login", name: "UserLogin", component: UserLogin },
        { path: "settings", name: "UserSettings", component: UserSettings },
      ]
    },
    {
      path: "/about/", name: "About", children: [
        { path: "info", name: "AboutInfo", component: AboutInfo },
        { path: "progress", name: "AboutProgress", component: AboutProgress },
        { path: "log", name: "AboutLog", component: AboutLog }
      ]
    },
    { path: "/reg", name: "UserRegister", component: UserRegister },
    { path: "/settings/", name: "Settings", component: SettingsIndex },
    { path: "/test/ai", name: "Tests", component: Test },
    { path: "/danger/view", name: "DangerView", component: DangerView },
    { path: "/:catchAll(.*)", name: "NotFound", component: Error404 },
  ]
});

router.beforeEach(async (to, from, next) => {
  next();
  // emitter.emit('router-change', to.name);
});

router.afterEach((to) => {
  // Add any after navigation logic here
});

export default router;
