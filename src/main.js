import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';
import {breakEmail} from "@/composables/directives.js";
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import de from './locales/de.json';
import pl from './locales/pl.json';

const app = createApp(App);

const pinia = createPinia();
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    de,
    pl
  }
});

app.use(router);
app.use(pinia);
app.use(i18n);
app.directive('break-email', breakEmail)
app.mount('#app');
