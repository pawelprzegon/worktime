import { createRouter, createWebHistory } from 'vue-router';
import Dash from "@/views/DashView.vue";
import DashLayout from "@/layout/DashLayout.vue";
import Login from "@/views/LoginView.vue";
import SignUp from "@/views/SignUpView.vue";
import UserPanel from "@/views/UserPanelView.vue";
import Privileged from "@/views/PrivilegedView.vue";
import ResetPasswordView from "@/views/resetPasswordView.vue";
import ShiftEditor from "@/components/userPanel/modals/ShiftDetails/ShiftEditor.vue";
import ResetPasswordEmailView from "@/views/resetPasswordEmailView.vue";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { useAuthStore } from '@/stores/authStore.js';
import DayView from "@/views/DayView.vue";
import UserView from "@/views/UserView.vue";

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
    {
        path: '/day',
        name: 'Day',
        component: DayView,
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
