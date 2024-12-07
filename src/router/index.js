import { createRouter, createWebHistory } from 'vue-router';
import Dash from "@/components/Dash.vue";
import Login from "@/components/Login.vue";
import UserPanel from "@/components/panel/UserPanel.vue";
import SignUp from "@/components/SignUp.vue";
import Privileged from "@/components/Privileged.vue";
import { useAuthStore } from '@/stores/auth.js';

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
    if (protectedRoutes.includes(to.path)) {
        if (!await authStore.authorizationCheck()) {
            return next('/login');
        }

        else {

            if (!authStore.hasAccess(to.path)) {
                return next('/login');
            }
        }
    }

    next();
});


export default router;
