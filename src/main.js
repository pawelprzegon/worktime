import './assets/main.css'
import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router';
import {authorizationCheck} from "@/auth.js";

const app = createApp(App)

const alert = reactive({
  status: null,
  message: '',
  show(status, message) {
    this.status = status;
    this.message = message;
  }
});

const isAuthenticated = reactive({
  status: false,
  role: null,
  hasRole(requiredRole) {
    console.log(this.role)
    if (!this.role) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(this.role);
    }
    return this.role === requiredRole;
  }
});

async function initializeAuth() {
  const isAuthorized = await authorizationCheck()
  if (isAuthorized) {
    isAuthenticated.status = true;
    isAuthenticated.role = isAuthorized.role;

  }
}

app.provide('alert', alert);
app.provide('isAuthenticated', isAuthenticated)
app.use(router)

initializeAuth().then(() => {
  router.isAuthenticated = isAuthenticated;
})

app.mount('#app')
