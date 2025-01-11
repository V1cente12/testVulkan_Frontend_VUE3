// Archivo: src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

// Configurar el interceptor global de Axios
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
app.mount('#app');
