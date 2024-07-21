import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  ]
});
router.beforeEach(async (to, from, next) => {
  // NProgress.start()
  next();
});

router.afterEach((to) => {
  // if(to.path == '')
  // NProgress.done()
})

export default router