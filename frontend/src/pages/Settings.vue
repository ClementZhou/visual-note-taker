<template>
  <div class="settings">
    <h2>Settings</h2>
    <div class="card">
      <h3>Sizing Weights</h3>
      <form>
        <div class="form-group">
          <label>Note Count Weight:</label>
          <input type="number" min="0" max="1" step="0.1" value="0.4" />
        </div>
        <div class="form-group">
          <label>Edit Frequency Weight:</label>
          <input type="number" min="0" max="1" step="0.1" value="0.35" />
        </div>
        <div class="form-group">
          <label>Manual Adjustment Weight:</label>
          <input type="number" min="0" max="1" step="0.1" value="0.25" />
        </div>
        <button type="submit" class="btn-primary">Save Settings</button>
      </form>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.settings {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
}
</style>
