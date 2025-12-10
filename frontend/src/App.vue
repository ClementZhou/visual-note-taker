<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <h1>Visual Note Taker</h1>
      <nav class="app-nav">
        <router-link to="/">Dashboard</router-link>
        <router-link to="/settings">Settings</router-link>
      </nav>
    </header>
    
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.app-nav {
  display: flex;
  gap: 2rem;
}

.app-nav a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.app-nav a:hover {
  opacity: 0.8;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}
</style>
