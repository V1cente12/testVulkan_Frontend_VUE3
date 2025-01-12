<template>
  <div class="dashboard">
    <button class="toggle-sidebar" @click="toggleSidebar">☰</button>
    <Sidebar :isSidebarOpen="isSidebarOpen" />
    <div class="dashboard-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      isSidebarOpen: JSON.parse(localStorage.getItem('isSidebarOpen')) || true, 
    };
  },
  watch: {
    isSidebarOpen(newValue) {
      localStorage.setItem('isSidebarOpen', JSON.stringify(newValue));
    }
  },
  mounted() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    handleResize() {
      if (window.innerWidth <= 768) {
        this.isSidebarOpen = false;
      } else {
        this.isSidebarOpen = true;
      }
    },
  },
};
</script>

<style scoped>
html, body {
  background-color: #2B2B2B;
  margin: 0;
  padding: 0;
  height: 100%;
}

.dashboard {
  display: flex;
}

.toggle-sidebar {
  display: none;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.dashboard-content {
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);
}

@media (max-width: 768px) {
  .toggle-sidebar {
    display: block;
  }

  .dashboard-content {
    margin-left: 0;
    width: 100%;
  }
}
</style>