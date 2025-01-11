<template>
  <div class="login-container">
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
</template>

<script>
import axios from 'axios';

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
        .post('http://localhost:8080/login', {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          localStorage.setItem('username', this.username);
          localStorage.setItem('password', this.password);

          this.$router.push('/dashboard');
        })
        .catch((error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Credenciales incorrectas.');
        });
    },
  },
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

input {
  width: 100%;
  max-width: 300px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

button {
  width: 100%;
  max-width: 300px;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.register-link {
  margin-top: 10px;
  font-size: 14px;
}

.register-link a {
  color: #007bff;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
