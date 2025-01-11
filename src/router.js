import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';

const routes = [
  { path: '/', component: Login },  
  { 
    path: '/dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true }, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (!username || !password) {
      next('/'); 
    } else {
      next(); 
    }
  } else {
    next(); 
  }
});

export default router;
