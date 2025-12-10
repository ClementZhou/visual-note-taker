<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <div class="dashboard-grid">
      <div class="card">
        <h3>Categories</h3>
        <p>Total: 0</p>
        <router-link to="/analytics" class="btn-primary">View Analytics</router-link>
      </div>
      <div class="card">
        <h3>Recent Notes</h3>
        <p>No notes yet</p>
        <button class="btn-primary">Add Note</button>
      </div>
      <div class="card">
        <h3>Comparison</h3>
        <p>Compare categories across time</p>
        <router-link to="/compare" class="btn-primary">Compare</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
}

.card button,
.card a {
  align-self: flex-start;
  margin-top: 1rem;
}
</style>
