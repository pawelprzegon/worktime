import { createRouter, createWebHistory } from 'vue-router';
import Dash from "@/pages/dash/DashView.vue";
import Login from "@/pages/login/LoginView.vue";
import UserPanel from "@/pages/userPanel/UserPanelView.vue";
import SignUp from "@/pages/signup/SignUpView.vue";
import Privileged from "@/pages/privileged/PrivilegedView.vue";
import { useAuthStore } from '@/stores/authStore.js';

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
        name: 'Dash',
        component: Dash
    },
    {
        path: '/user-panel',
        name: 'User-Panel',
        component: UserPanel,
        meta: { requiresAuth: true },
    },
    {
        path: '/privileged',
        name: 'Privileged',
        component: Privileged,
        meta: { requiresAuth: true },
    },


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const protectedRoutes = ['/user-panel', '/privileged'];

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const aut = await authStore.authorizationCheck()
    if (aut) {
        await authStore.getUserMetadata()
    }
    if (protectedRoutes.includes(to.path)) {
        if (!aut || !authStore.hasAccess(to.path)) {
            next('/login');
            return
        }
    }

    next();
});


export default router;
