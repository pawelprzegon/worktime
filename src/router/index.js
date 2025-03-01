import { createRouter, createWebHistory } from 'vue-router';
import Dash from "@/components/pages/dash/DashView.vue";
import Login from "@/components/pages/login/LoginView.vue";
import SignUp from "@/components/pages/signup/SignUpView.vue";
import UserPanel from "@/components/pages/userPanel/UserPanelView.vue";
import Privileged from "@/components/pages/privileged/PrivilegedView.vue";
import ResetPasswordView from "@/components/pages/resetPassword/resetPasswordView.vue";
import ShiftEditor from "@/components/pages/userPanel/modals/ShiftDetails/ShiftEditor.vue";
import ResetPasswordEmailView from "@/components/pages/resetPassword/resetPasswordEmailView.vue";
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
        path: '/edit',
        name: 'Edit',
        component: ShiftEditor,
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
