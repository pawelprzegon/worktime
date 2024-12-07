import './assets/main.css'
import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);

const alert = reactive({
  status: null,
  message: '',
  show(status, message) {
    this.status = status;
    this.message = message;
  }
});

const pinia = createPinia();

app.provide('alert', alert);
app.use(pinia);
app.use(router);

app.mount('#app');
