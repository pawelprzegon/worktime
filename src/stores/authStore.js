import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { checkIsAuthorized, getMe } from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";

export const useAuthStore = defineStore('auth', () => {
  const alert = useAlertStore()
  const token = ref(sessionStorage.getItem('authToken') || null);
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
  };

  const getUserMetadata = async () => {
    try {
      const response = await getMe();
      user.id = response.id;
      user.firstName = response.first_name;
      user.lastName = response.last_name;
      user.email = response.email;
      user.role = response.role;
      user.avatar = response.avatar;
      user.disabled = response.disabled;

      sessionStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      console.error('Error fetching user metadata:', error);
    }
  };

  const clearToken = () => {
    token.value = null;
    Object.assign(user, {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      role: null,
      avatar: null,
      disabled: null,
    });
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  };

  const hasAccess = (toPath) => {
    const routeRoles = {
      '/privileged': 'admin',
      '/user-panel': ['user', 'admin'],
    };

    const requiredRole = routeRoles[toPath];
    if (!user.role || !requiredRole) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return requiredRole === user.role;
  };

  const authorizationCheck = async () => {
    if (token.value) {
      try {
        const authorized = await checkIsAuthorized();
        if (authorized) {
          return true;
        }
      } catch (error) {
        alert.show("error", error.message)
        return false;
      }
    }
    clearToken();
    return false;
  };

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    setToken,
    getUserMetadata,
    clearToken,
    hasAccess,
    authorizationCheck,
  };
});