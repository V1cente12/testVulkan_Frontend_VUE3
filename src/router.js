import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import Statistics from './components/Statistics.vue'; 
import Courses from './components/Courses.vue';
import Students from './components/Students.vue';

const routes = [
  { path: '/', component: Login },
  { 
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'statistics', 
        name: 'statistics',
        component: Statistics,
      },
      {
        path: 'courses', 
        name: 'courses',
        component: Courses,
      },
      {
        path: 'students', 
        name: 'students',
        component: Students,
      },
    ]
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
