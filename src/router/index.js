// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Dash from "@/components/Dash.vue";
import Login from "@/components/Login.vue";
import User from "@/components/User.vue";
import Register from "@/components/Register.vue";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/',
        name: 'Dash',
        component: Dash
    },
    {
        path: '/user',
        name: 'User',
        component: User,
        meta: { requiresAuth: true },
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});


export default router;
