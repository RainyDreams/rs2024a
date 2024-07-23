import { createRouter, createWebHistory } from 'vue-router';
import { emitter } from '../utils/emitter';
import HomeIndex from '../views/Home/index.vue';
import SettingsIndex from '../views/Settings/index.vue';
import UserIndex from '../views/User/index.vue';
import ProjectsCreate from '../views/Projects/create.vue';
import ProjectsDashboard from '../views/Projects/dashboard.vue';
import ProjectsList from '../views/Projects/list.vue';
import ProjectsTodo from '../views/Projects/todo.vue';
// import { useUserStore } from '../stores/user';
// import LoginIndex from '../views/Login/index.vue';
import Error404 from '../views/Errors/404.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "Home", component: HomeIndex },
    { path: "/settings/", name: "Settings", component: SettingsIndex },
    { path: "/user/", name: "User", component: UserIndex },
    { path: "/projects/", name: "Projects", children: [
      { path: "create", name: "Create", component: ProjectsCreate },
      { path: "dashboard", name: "Dashboard", component: ProjectsDashboard },
      { path: "list", name: "List", component: ProjectsList },
      { path: "todo", name: "Todo", component: ProjectsTodo },
    ]},
    // { path: "/login", name: "Login", component: LoginIndex,meta:{tabbarhide:true} },
    { path: "/:catchAll(.*)", name: "NotFound", component: Error404 },
  ]
});
router.beforeEach(async (to, from, next) => {
  next();
  // emitter.emit('router-change', to.name);
});
router.afterEach((to) => {
  
})

export default router