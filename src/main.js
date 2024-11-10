import './assets/main.css'
import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router';

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

app.provide('alert', alert);
app.provide('isAuthenticated', isAuthenticated)
app.use(router)
router.isAuthenticated = isAuthenticated;
app.mount('#app')
