import './assets/main.css'
import VueJwtDecode from 'vue-jwt-decode'
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

const token = localStorage.getItem('token');

const isAuthenticated = reactive({
  status: token !== null,
  role: token ? VueJwtDecode.decode(token).role : null
});

if (VueJwtDecode.decode(token)) {
  localStorage.setItem('userId', VueJwtDecode.decode(token).id);
}

app.provide('alert', alert);
app.provide('isAuthenticated', isAuthenticated)
app.use(router)
app.mount('#app')
