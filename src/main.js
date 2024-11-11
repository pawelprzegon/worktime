import './assets/main.css'
import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router';
import {checkIsAuthorized} from "@/fetchers.js";
import {clearCache} from "@/utils.js";

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
  role: null
});

async function initializeAuth() {
  const token = sessionStorage.getItem('token');
  if (token) {
    const authorized = await checkIsAuthorized(token);
    if (authorized) {
      isAuthenticated.status = true;
      isAuthenticated.role = authorized.role;
    } else {
      clearCache()
    }
  }
}

app.provide('alert', alert);
app.provide('isAuthenticated', isAuthenticated)
app.use(router)

initializeAuth().then(() => {
  router.isAuthenticated = isAuthenticated;
})

app.mount('#app')
