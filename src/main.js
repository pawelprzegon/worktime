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

app.provide('alert', alert);
app.use(router)
app.mount('#app')
