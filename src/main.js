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
  status: localStorage.getItem('token') !== null,
  admin: false
})

app.provide('alert', alert);
app.provide('isAuthenticated', isAuthenticated)
app.use(router)
app.mount('#app')
