<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-logo">
        <img src="@/assets/vulkan.png" alt="Logo">
      </div>
      <h1>Iniciar sesión</h1>
      <form @submit.prevent="login">
        <input 
          v-model="username" 
          type="text" 
          placeholder="Usuario" 
          required
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="Contraseña" 
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const apiUrl = process.env.VUE_APP_API_URL;
import { useToast } from 'vue-toastification'; 

export default {
  data() {
    return {
      username: '',  
      password: '', 
    };
  },
  methods: {
    login() {
      axios
        .post(`${apiUrl}/login`, {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          localStorage.setItem('username', this.username);
          localStorage.setItem('password', this.password);

          this.$router.push('/dashboard/statistics');
        })
        .catch(() => {
          const toast = useToast();
          toast.error('Credenciales incorrectas.');
        });
    },
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.login-page {
  background-color: #2B2B2B;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  text-align: center;
}

.login-logo {
  text-align: center;
  margin-bottom: 20px;
}

.login-logo img {
  max-width: 180px;
  height: 100%;
}

.login-container h1 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.login-container form {
  display: flex;
  flex-direction: column;
}

.login-container form input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.login-container form button {
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-container form button:hover {
  background-color: #c82333;
}
</style>