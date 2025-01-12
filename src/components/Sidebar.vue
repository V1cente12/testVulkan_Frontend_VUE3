<template>
    <div :class="['sidebar', { open: isSidebarOpen }]">
      <div class="sidebar-logo">
        <img src="@/assets/vulkan.png" alt="Logo">
      </div>
      <ul>
        <li>
          <router-link to="/dashboard/statistics" class="sidebar-link" :class="{ active: isActive('statistics') }">
            <i class="fas fa-chart-bar"></i> Estadísticas
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/courses" class="sidebar-link" :class="{ active: isActive('courses') }">
            <i class="fas fa-book"></i> Cursos
          </router-link>
        </li>
        <li>
          <router-link to="/dashboard/students" class="sidebar-link" :class="{ active: isActive('students') }">
            <i class="fas fa-user-graduate"></i> Alumnos
          </router-link>
        </li>
      </ul>
      <button class="logout-button" @click="logout">
        <i class="fas fa-sign-out-alt"></i> Cerrar sesión
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isSidebarOpen: {
        type: Boolean,
        default: true 
      }
    },
    data() {
      return {
        currentRoute: this.$route.name, 
      };
    },
    methods: {
      isActive(routeName) {
        return this.$route.name === routeName;
      },
      logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
    background-color: white;
    color: black;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translateX(0); 
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%); 
    }
  
    .sidebar.open {
      transform: translateX(0);
    }
  }
  
  .sidebar-logo {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .sidebar-logo img {
    max-width: 100%;
    height: auto;
  }
  
  .sidebar ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    flex-grow: 1;
  }
  
  .sidebar-link {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    color: #333;
    text-decoration: none;
    margin-bottom: 10px;
    border-radius: 4px;
    transition: color 0.3s;
  }
  
  .sidebar-link i {
    margin-right: 10px;
  }
  
  .sidebar-link:hover {
    color: black;
  }
  
  .sidebar-link.active {
    color: black;
    font-weight: bold;
  }
  
  .logout-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
    margin-top: auto;
    margin-bottom: 30px;
  }
  
  .logout-button i {
    margin-right: 10px;
  }
  
  .logout-button:hover {
    background-color: #c82333;
  }
  
 
  @media (max-width: 768px) {
    .sidebar {
      width: 200px;
    }
  
    .sidebar-link {
      padding: 8px 12px;
    }
  }
  
  @media (max-width: 480px) {
    .sidebar {
      width: 150px;
    }
  
    .sidebar-link {
      padding: 6px 10px;
    }
  }
  </style>