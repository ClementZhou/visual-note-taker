<template>
  <div class="word-cloud-container">
    <div class="word-cloud-header">
      <h2>Categories</h2>
      <div class="controls">
        <button @click="toggleWeightEditor" class="btn-primary">
          {{ showWeightEditor ? 'Hide' : 'Adjust' }} Weights
        </button>
        <button @click="refreshLayout" class="btn-secondary">Refresh Layout</button>
      </div>
    </div>

    <div v-if="showWeightEditor" class="weight-editor">
      <div class="weight-control">
        <label>Note Count ({{ weights.noteCount.toFixed(2) }}):</label>
        <input
          v-model.number="weights.noteCount"
          type="range"
          min="0"
          max="1"
          step="0.05"
          @change="applyWeights"
        />
      </div>
      <div class="weight-control">
        <label>Edit Frequency ({{ weights.editFrequency.toFixed(2) }}):</label>
        <input
          v-model.number="weights.editFrequency"
          type="range"
          min="0"
          max="1"
          step="0.05"
          @change="applyWeights"
        />
      </div>
      <div class="weight-control">
        <label>Manual Adjustment ({{ weights.userManual.toFixed(2) }}):</label>
        <input
          v-model.number="weights.userManual"
          type="range"
          min="0"
          max="1"
          step="0.05"
          @change="applyWeights"
        />
      </div>
      <p class="weight-sum">Sum: {{ (weights.noteCount + weights.editFrequency + weights.userManual).toFixed(2) }}</p>
    </div>

    <div class="word-cloud-wrapper">
      <svg
        ref="svgContainer"
        :width="containerWidth"
        :height="containerHeight"
        class="word-cloud"
        @mousemove="handleMouseMove"
      >
        <g class="boxes-group">
          <g
            v-for="category in layoutData"
            :key="category.id"
            :class="['category-box', { selected: selectedCategory?.id === category.id }]"
            :data-id="category.id"
            @mouseenter="selectCategory(category)"
            @mouseleave="deselectCategory"
            @click="openCategory(category)"
          >
            <!-- Box -->
            <rect
              :x="category.x - category.width / 2"
              :y="category.y - category.height / 2"
              :width="category.width"
              :height="category.height"
              :fill="category.color"
              class="category-rect"
              rx="8"
            />

            <!-- Text -->
            <text
              :x="category.x"
              :y="category.y"
              :font-size="`${category.fontSize}px`"
              text-anchor="middle"
              dominant-baseline="middle"
              class="category-text"
            >
              {{ category.name }}
            </text>

            <!-- Metric indicator -->
            <circle
              :cx="category.x + category.width / 2 - 15"
              :cy="category.y - category.height / 2 + 15"
              r="8"
              :fill="getIntensityColor(category.size)"
              class="intensity-indicator"
            />
          </g>
        </g>

        <!-- Resize handles (shown on hover) -->
        <g v-if="selectedCategory" class="resize-handles">
          <circle
            :cx="selectedCategory.x + selectedCategory.width / 2"
            :cy="selectedCategory.y + selectedCategory.height / 2"
            r="10"
            class="resize-handle"
            @mousedown="startResize"
          />
        </g>
      </svg>

      <!-- Info panel -->
      <div v-if="selectedCategory" class="info-panel">
        <h3>{{ selectedCategory.name }}</h3>
        <p v-if="selectedCategory.description" class="description">
          {{ selectedCategory.description }}
        </p>
        <div class="metrics">
          <div class="metric">
            <span class="label">Size:</span>
            <span class="value">{{ (selectedCategory.size * 100).toFixed(0) }}%</span>
          </div>
          <div class="metric">
            <span class="label">Manual Factor:</span>
            <input
              v-model.number="selectedCategory.manual_size_factor"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              @change="adjustCategorySize"
              class="factor-slider"
            />
            <span class="value">{{ selectedCategory.manual_size_factor.toFixed(1) }}x</span>
          </div>
        </div>
        <div class="actions">
          <button @click="editCategory" class="btn-primary">Edit</button>
          <button @click="deleteCategory" class="btn-danger">Delete</button>
        </div>
      </div>
    </div>

    <!-- Create new category -->
    <div class="create-category-form">
      <input
        v-model="newCategoryName"
        type="text"
        placeholder="New category name..."
        @keyup.enter="createCategory"
      />
      <button @click="createCategory" class="btn-success">+ Add Category</button>
    </div>

    <p v-if="categories.length === 0" class="empty-state">
      No categories yet. Create one to get started!
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import WordCloudService from '@/services/wordCloud'
import apiClient from '@/services/api'

const categoryStore = useCategoryStore()

// Data
const containerWidth = ref(1200)
const containerHeight = ref(600)
const layoutData = ref([])
const categories = computed(() => categoryStore.categories)
const selectedCategory = ref(null)
const showWeightEditor = ref(false)
const newCategoryName = ref('')
const svgContainer = ref(null)

// State
const wordCloudService = ref(null)
const weights = ref({
  noteCount: 0.4,
  editFrequency: 0.35,
  userManual: 0.25
})
const isResizing = ref(false)
const resizeStartX = ref(0)
const resizeStartY = ref(0)

// Initialize
onMounted(() => {
  wordCloudService.value = new WordCloudService(containerWidth.value, containerHeight.value, weights.value)
  loadCategories()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', stopResize)
})

// Watchers
watch(categories, () => {
  refreshLayout()
}, { deep: true })

// Methods
const loadCategories = async () => {
  try {
    const { data } = await apiClient.get('/categories')
    categoryStore.setCategories(data.categories || [])
    refreshLayout()
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const refreshLayout = () => {
  if (wordCloudService.value && categories.value.length > 0) {
    layoutData.value = wordCloudService.value.generateLayout(categories.value)
  }
}

const toggleWeightEditor = () => {
  showWeightEditor.value = !showWeightEditor.value
}

const applyWeights = () => {
  wordCloudService.value.setWeights(
    weights.value.noteCount,
    weights.value.editFrequency,
    weights.value.userManual
  )
  refreshLayout()
}

const selectCategory = (category) => {
  selectedCategory.value = category
}

const deselectCategory = () => {
  if (!isResizing.value) {
    selectedCategory.value = null
  }
}

const openCategory = (category) => {
  categoryStore.selectCategory(category)
  // Navigate to category view
  // router.push(`/category/${category.id}`)
}

const editCategory = () => {
  console.log('Edit category:', selectedCategory.value)
}

const deleteCategory = async () => {
  if (!selectedCategory.value) return
  if (!confirm(`Delete "${selectedCategory.value.name}"?`)) return

  try {
    await apiClient.delete(`/categories/${selectedCategory.value.id}`)
    categoryStore.removeCategory(selectedCategory.value.id)
    selectedCategory.value = null
  } catch (error) {
    console.error('Failed to delete category:', error)
  }
}

const createCategory = async () => {
  if (!newCategoryName.value.trim()) return

  try {
    const { data } = await apiClient.post('/categories', {
      name: newCategoryName.value,
      parent_id: null
    })
    categoryStore.addCategory(data.category)
    newCategoryName.value = ''
  } catch (error) {
    console.error('Failed to create category:', error)
  }
}

const adjustCategorySize = async () => {
  if (!selectedCategory.value) return

  try {
    await apiClient.put(`/categories/${selectedCategory.value.id}`, {
      manual_size_factor: selectedCategory.value.manual_size_factor
    })
    refreshLayout()
  } catch (error) {
    console.error('Failed to adjust category size:', error)
  }
}

const startResize = (e) => {
  isResizing.value = true
  resizeStartX.value = e.clientX
  resizeStartY.value = e.clientY
}

const stopResize = () => {
  isResizing.value = false
}

const handleMouseMove = (e) => {
  if (!isResizing.value || !selectedCategory.value) return

  // Handle resize logic here if needed
}

const getIntensityColor = (size) => {
  if (size < 0.33) return '#95a5a6' // gray
  if (size < 0.66) return '#f39c12' // orange
  return '#e74c3c' // red
}
</script>

<style scoped>
.word-cloud-container {
  padding: 2rem;
  max-width: 100%;
}

.word-cloud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
}

.word-cloud-header h2 {
  margin: 0;
}

.controls {
  display: flex;
  gap: 1rem;
}

.controls button {
  padding: 0.5rem 1rem;
}

.weight-editor {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.weight-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.weight-control label {
  font-weight: 600;
  font-size: 0.9rem;
}

.weight-control input[type="range"] {
  width: 100%;
}

.weight-sum {
  grid-column: 1 / -1;
  text-align: right;
  margin: 0;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.word-cloud-wrapper {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  margin-bottom: 2rem;
}

.word-cloud {
  background: #ffffff;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  cursor: grab;
}

.word-cloud:active {
  cursor: grabbing;
}

.category-box {
  cursor: pointer;
  transition: opacity 0.2s;
}

.category-box:hover .category-rect {
  filter: brightness(1.1);
}

.category-box.selected .category-rect {
  stroke: #3498db;
  stroke-width: 3;
}

.category-rect {
  opacity: 0.85;
  transition: all 0.2s;
}

.category-text {
  fill: white;
  font-weight: 600;
  pointer-events: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.intensity-indicator {
  opacity: 0.8;
  transition: all 0.2s;
}

.resize-handle {
  fill: #3498db;
  cursor: nwse-resize;
  opacity: 0.7;
}

.resize-handle:hover {
  opacity: 1;
  r: 13px;
}

.info-panel {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ecf0f1;
  max-height: 600px;
  overflow-y: auto;
}

.info-panel h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.description {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 1px solid #ecf0f1;
  border-bottom: 1px solid #ecf0f1;
}

.metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metric .label {
  font-weight: 600;
  color: #2c3e50;
  flex: 0 0 150px;
}

.metric .value {
  color: #3498db;
  font-weight: 600;
  text-align: right;
  flex: 0 0 50px;
}

.factor-slider {
  flex: 1;
  margin: 0 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions button {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.create-category-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.create-category-form input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-success {
  background-color: #27ae60;
  color: white;
  padding: 0.75rem 1.5rem;
}

.btn-success:hover {
  background-color: #229954;
}

.empty-state {
  text-align: center;
  color: #95a5a6;
  padding: 2rem;
  font-size: 1.1rem;
}

@media (max-width: 1024px) {
  .word-cloud-wrapper {
    grid-template-columns: 1fr;
  }

  .weight-editor {
    grid-template-columns: 1fr;
  }
}
</style>
