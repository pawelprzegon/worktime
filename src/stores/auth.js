import {checkIsAuthorized, getMe, getOvertime} from "@/fetchers.js";
import {defineStore} from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('authToken') || null,
    user: {
      id: null,
      firstName: null,
      lastNane: null,
      email: null,
      role: null,
      avatar: null,
    }
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user.role === 'admin',
    isUser: (state) => state.user.role === 'user',
  },
  actions: {
    setToken(token) {
      this.token = token;
      sessionStorage.setItem('authToken', token);
    },
    async getUserMetadata() {
      try{
        const response =  await getMe()
        console.log(response)
        this.user.id = response.id
        this.user.firstName = response.first_name
        this.user.lastName = response.last_name
        this.user.email = response.email
        this.user.role = response.role
        this.user.avatar = response.avatar

        sessionStorage.setItem('user', JSON.stringify(response))

      } catch (error) {
        alert.show('error', error)
      }


    },
    clearToken() {
      this.token = null;
      this.user = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        role: null,
        avatar: null,
      }
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
    },
    hasAccess(toPath) {
      const routeRoles = {
          '/privileged': 'admin',
          '/user-panel': ['user', 'admin'],
      };
      const requiredRole = routeRoles[toPath]

      if (!this.user.role || !requiredRole) return false;

      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(this.user.role);
      }
      return requiredRole === this.user.role;
    },

    async authorizationCheck() {
      if (this.token) {
        try {
          const authorized = await checkIsAuthorized();
          if (authorized) {
            return true;
          }
        } catch (error) {
          console.error('Authorization error:', error);
        }
      }
      this.clearToken();
      return false;
    },
  },
});

