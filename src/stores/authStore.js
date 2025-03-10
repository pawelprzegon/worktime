import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { defineStore } from 'pinia';
import { checkIsAuthorized, getMe } from "@/composables/fetchers.js";
import { useAlertStore } from "@/stores/alertStore.js";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('auth', () => {
  const alert = useAlertStore();
  const token = ref(sessionStorage.getItem('authToken') || null);
  const tokenExp = ref(null);
  const interval = ref(null);

  const user = reactive({
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    role: null,
    avatar: null,
    disabled: null
  });

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.role === 'admin');
  const isUser = computed(() => user.role === 'user');

  const setToken = (newToken) => {
    token.value = newToken;
    sessionStorage.setItem('authToken', newToken);
    startTokenTimer();
  };

  const startTokenTimer = () => {
    if (!token.value) return;

    if (interval.value) clearInterval(interval.value);

    interval.value = setInterval(() => {
      if (!token.value) {
        clearInterval(interval.value);
        tokenExp.value = null;
        return;
      }

      const decoded = jwtDecode(token.value);
      const expTime = decoded.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = expTime - currentTime;

      if (timeLeft <= 0) {
        clearInterval(interval.value);
        tokenExp.value = null;
        clearToken();
      } else {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        tokenExp.value = `${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  };

  const getUserMetadata = async () => {
    try {
      const response = await getMe();
      Object.assign(user, {
        id: response.id,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        role: response.role,
        avatar: response.avatar,
        disabled: response.disabled
      });

      sessionStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      console.error('Error fetching user metadata:', error);
    }
  };

  const clearToken = () => {
    token.value = null;
    tokenExp.value = null;
    clearInterval(interval.value);
    interval.value = null;
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    Object.assign(user, {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      role: null,
      avatar: null,
      disabled: null
    });
  };

  const hasAccess = (toPath) => {
    const routeRoles = {
      '/privileged': 'admin',
      '/user-panel': ['user', 'admin']
    };

    const requiredRole = routeRoles[toPath];
    if (!user.role || !requiredRole) return false;
    return Array.isArray(requiredRole) ? requiredRole.includes(user.role) : requiredRole === user.role;
  };

  const authorizationCheck = async () => {
    if (token.value) {
      try {
        const authorized = await checkIsAuthorized();
        return !!authorized;
      } catch (error) {
        console.error(error.message);
        alert.show("error", error.message);
        return false;
      }
    }
    clearToken();
    return false;
  };

  onMounted(() => {
    if (token.value) {
      startTokenTimer();
    }
  });

  onUnmounted(() => {
    clearInterval(interval.value);
  });

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    tokenExp,
    setToken,
    getUserMetadata,
    clearToken,
    hasAccess,
    authorizationCheck
  };
});
