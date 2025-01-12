import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

axios.interceptors.request.use((config) => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (username && password) {
    config.headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`; 
  }

  return config;
});

const app = createApp(App);
app.use(router);
app.use(Toast);
app.mount('#app');