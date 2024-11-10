import { createRouter, createWebHistory } from 'vue-router';
import Dash from "@/components/Dash.vue";
import Login from "@/components/Login.vue";
import UserPanel from "@/components/panel/UserPanel.vue";
import SignUp from "@/components/SignUp.vue";
import {checkIsAuthorized} from "@/fetchers.js";
import Privileged from "@/components/Privileged.vue";


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

router.beforeEach(async (to, from, next) => {

    const token = localStorage.getItem('token');
    const authorized = await checkIsAuthorized(token)

    if (!authorized) {
        router.isAuthenticated.status = false
        router.isAuthenticated.role = null

        localStorage.removeItem('token')
        if (to.path === '/user-panel') {
            return next('/login')
        }
    }

    next();
});


export default router;
