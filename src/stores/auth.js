import {checkIsAuthorized} from "@/fetchers.js";
import VueJwtDecode from 'vue-jwt-decode';
import {defineStore} from "pinia";
import {jwtDecode} from "jwt-decode";

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
    setMe(meData) {
      this.user.id = meData.id
      this.user.firstName = meData.firstName
      this.user.lastName = meData.lastName
      this.user.email = meData.email
      this.user.role = meData.role
      this.user.avatar = meData.avatar

    },
    clearToken() {
      this.token = null;
      this.userRole = null;
      sessionStorage.removeItem('authToken');
    },
    hasAccess(toPath) {
      const routeRoles = {
          '/privileged': 'admin',
          '/user-panel': ['user', 'admin'],
      };
      const requiredRole = routeRoles[toPath]
      if (!this.userRole || !requiredRole) return false;

      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(this.userRole);
      }
      return requiredRole === this.userRole;
    },
    async authorizationCheck() {
      if (this.token) {
        try {
          const authorized = await checkIsAuthorized(this.token);
          if (authorized) {
            this.userRole = authorized.role;
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
