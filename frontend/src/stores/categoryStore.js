import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref([])
  const selectedCategory = ref(null)
  const loadingCategories = ref(false)

  const totalCategories = computed(() => categories.value.length)

  function setCategories(cats) {
    categories.value = cats
  }

  function addCategory(category) {
    categories.value.push(category)
  }

  function removeCategory(id) {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  function selectCategory(category) {
    selectedCategory.value = category
  }

  return {
    categories,
    selectedCategory,
    loadingCategories,
    totalCategories,
    setCategories,
    addCategory,
    removeCategory,
    selectCategory
  }
})
