<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Visual Note Taker</h1>
      <div class="header-stats" v-if="!loadingCategories">
        <div class="stat">
          <span class="stat-label">Categories:</span>
          <span class="stat-value">{{ categories.length }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Max Depth:</span>
          <span class="stat-value">{{ maxDepth }}</span>
        </div>
      </div>
    </div>

    <!-- Word Cloud Visualization -->
    <div class="word-cloud-section">
      <WordCloud 
        v-if="categories.length > 0"
        :categories="categories"
        @category-selected="handleCategorySelected"
        @category-created="handleCategoryCreated"
        @category-deleted="handleCategoryDeleted"
        @category-updated="handleCategoryUpdated"
      />
      <div v-else class="empty-state">
        <p>No categories yet. Create one to get started!</p>
        <button class="btn-primary" @click="showCreateModal = true">
          Create First Category
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats" v-if="categories.length > 0">
      <div class="stat-card">
        <h3>Total Categories</h3>
        <p class="stat-number">{{ categories.length }}/150</p>
      </div>
      <div class="stat-card">
        <h3>Selected Category</h3>
        <p class="stat-name">{{ selectedCategory?.name || 'None' }}</p>
      </div>
      <div class="stat-card">
        <h3>Recent Activity</h3>
        <p class="stat-number">{{ recentActivityCount }}</p>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="quick-links">
      <router-link to="/analytics" class="quick-link">
        <span class="icon">📊</span>
        <span>Analytics</span>
      </router-link>
      <router-link to="/compare" class="quick-link">
        <span class="icon">🔄</span>
        <span>Compare</span>
      </router-link>
      <router-link to="/settings" class="quick-link">
        <span class="icon">⚙️</span>
        <span>Settings</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCategoryStore } from '../stores/categoryStore'
import WordCloud from '../components/WordCloud.vue'
import CategoryAPI from '../services/categoryAPI'

const categoryStore = useCategoryStore()

const loadingCategories = ref(true)
const showCreateModal = ref(false)
const selectedCategory = computed(() => categoryStore.selectedCategory)

const categories = computed({
  get: () => categoryStore.categories,
  set: (value) => categoryStore.setCategories(value)
})

const maxDepth = computed(() => {
  const calculateDepth = (cats, current = 0) => {
    if (!cats || cats.length === 0) return current
    return Math.max(
      current,
      ...cats.map(cat => calculateDepth(cat.children, current + 1))
    )
  }
  return calculateDepth(categories.value)
})

const recentActivityCount = computed(() => {
  let count = 0
  const countRecent = (cats) => {
    if (!cats) return
    cats.forEach(cat => {
      if (cat.metrics?.last_edited) {
        const lastEdited = new Date(cat.metrics.last_edited)
        const daysSince = (new Date() - lastEdited) / (1000 * 60 * 60 * 24)
        if (daysSince < 7) count++
      }
      countRecent(cat.children)
    })
  }
  countRecent(categories.value)
  return count
})

onMounted(async () => {
  try {
    loadingCategories.value = true
    const result = await CategoryAPI.getCategories({ depth: 3 })
    categoryStore.setCategories(result.categories || [])
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    loadingCategories.value = false
  }
})

const handleCategorySelected = (category) => {
  categoryStore.selectCategory(category)
}

const handleCategoryCreated = async (newCategory) => {
  // Reload categories to get updated hierarchy
  try {
    const result = await CategoryAPI.getCategories({ depth: 3 })
    categoryStore.setCategories(result.categories || [])
  } catch (error) {
    console.error('Error reloading categories:', error)
  }
}

const handleCategoryDeleted = async (categoryId) => {
  try {
    const result = await CategoryAPI.getCategories({ depth: 3 })
    categoryStore.setCategories(result.categories || [])
  } catch (error) {
    console.error('Error reloading categories:', error)
  }
}

const handleCategoryUpdated = async (categoryId) => {
  try {
    const result = await CategoryAPI.getCategories({ depth: 3 })
    categoryStore.setCategories(result.categories || [])
  } catch (error) {
    console.error('Error reloading categories:', error)
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1rem;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #1f2937;
}

.header-stats {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.stat {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.word-cloud-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  color: #6b7280;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #1f2937;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quick-link:hover {
  background: #f3f4f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.quick-link .icon {
  font-size: 2rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #2563eb;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-header h1 {
    font-size: 1.8rem;
  }

  .header-stats {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
