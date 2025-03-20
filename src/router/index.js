import { createRouter, createWebHistory } from 'vue-router';
import DashLayout from "@/layout/DashLayout.vue";
import Login from "@/views/LoginView.vue";
import SignUp from "@/views/SignUpView.vue";
import RecordView from "@/views/RecordView.vue";
import Privileged from "@/views/PrivilegedView.vue";
import ResetPasswordView from "@/views/resetPasswordView.vue";
import ResetPasswordEmailView from "@/views/resetPasswordEmailView.vue";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { useAuthStore } from '@/stores/authStore.js';
import DayView from "@/views/DayView.vue";
import UserView from "@/views/UserView.vue";
import test from "@/views/test.vue"

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp,
    },
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/dash',
        name: 'Dash',
        component: DashLayout
    },
    {
        path: '/privileged',
        name: 'Privileged',
        component: Privileged,
        meta: { requiresAuth: true },
    },
    {
        path: '/request-password-reset',
        name: 'Request password reset',
        component: ResetPasswordEmailView,
    },
    {
        path: '/reset-password',
        name: 'Reset Password',
        component: ResetPasswordView,
    },
    {
        path: '/day',
        name: 'Day',
        component: DayView,
    },
    {
        path: '/record',
        name: 'record',
        component: RecordView,
        meta: { requiresAuth: true },
    },
    {
        path: '/overtime',
        name: 'overtime',
        component: test,
        meta: { requiresAuth: true },
    },
    {
        path: '/user',
        name: 'User',
        component: UserView,
    },
    {
        path: '/:catchAll(.*)',
        name: 'not-found',
        component: NotFoundView,
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const protectedRoutes = ['/user-panel', '/privileged', '/day', '/user', '/dash'];
const publicRoutes = ['/', '/login', '/signup', 'request-password-reset', '/reset-password'];

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const auth = await authStore.authorizationCheck();

    if (!auth && protectedRoutes.includes(to.path)) {

        next('/login');
        return;
    }

    if (!auth && publicRoutes.includes(to.path)) {
        next();
        return;
    }

    next();
});

export default router;
