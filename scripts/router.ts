// router.ts 文件内容示例
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: () => import('./components/About.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
