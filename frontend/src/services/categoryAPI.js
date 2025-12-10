/**
 * Category API Service
 * Handles all category CRUD operations and hierarchy management
 */

import apiClient from './api'

export class CategoryAPI {
  /**
   * Get all user's categories (top-level)
   */
  static async getCategories(options = {}) {
    const params = new URLSearchParams()
    if (options.depth) params.append('depth', options.depth)
    if (options.sort) params.append('sort', options.sort)

    const { data } = await apiClient.get(`/categories?${params}`)
    return data
  }

  /**
   * Get specific category with details
   */
  static async getCategory(categoryId) {
    const { data } = await apiClient.get(`/categories/${categoryId}`)
    return data
  }

  /**
   * Get child categories (for lazy-loading beyond depth 10)
   */
  static async getChildren(categoryId, options = {}) {
    const params = new URLSearchParams()
    if (options.limit) params.append('limit', options.limit)
    if (options.offset) params.append('offset', options.offset)

    const { data } = await apiClient.get(
      `/categories/${categoryId}/children?${params}`
    )
    return data
  }

  /**
   * Create new category
   */
  static async createCategory(name, options = {}) {
    const payload = {
      name,
      parent_id: options.parentId || null,
      description: options.description || '',
      color: options.color || null
    }

    const { data } = await apiClient.post('/categories', payload)
    return data
  }

  /**
   * Update category
   */
  static async updateCategory(categoryId, updates = {}) {
    const { data } = await apiClient.put(
      `/categories/${categoryId}`,
      updates
    )
    return data
  }

  /**
   * Delete category (cascades to children)
   */
  static async deleteCategory(categoryId) {
    const { data } = await apiClient.delete(`/categories/${categoryId}`)
    return data
  }

  /**
   * Move category to new parent
   */
  static async moveCategory(categoryId, newParentId) {
    return this.updateCategory(categoryId, {
      parent_id: newParentId
    })
  }

  /**
   * Update category sizing
   */
  static async updateCategorySize(categoryId, manualFactor) {
    return this.updateCategory(categoryId, {
      manual_size_factor: Math.max(0.5, Math.min(manualFactor, 2.0))
    })
  }

  /**
   * Batch update categories
   */
  static async batchUpdateCategories(updates = []) {
    return Promise.all(
      updates.map(({ id, ...fields }) =>
        this.updateCategory(id, fields)
      )
    )
  }

  /**
   * Get category metrics
   */
  static async getCategoryMetrics(categoryId) {
    const { data } = await apiClient.get(`/metrics/category/${categoryId}`)
    return data
  }

  /**
   * Get category hierarchy (recursive)
   */
  static async getCategoryHierarchy(categoryId, options = {}) {
    const maxDepth = options.maxDepth || 10
    const category = await this.getCategory(categoryId)

    // Recursively fetch children up to maxDepth
    const fetchWithDepth = async (cat, currentDepth) => {
      if (currentDepth >= maxDepth) {
        return cat
      }

      try {
        const childrenData = await this.getChildren(cat.id, {
          limit: 50
        })
        const childCategories = childrenData.children || []

        return {
          ...cat,
          children: await Promise.all(
            childCategories.map(child =>
              fetchWithDepth(child, currentDepth + 1)
            )
          )
        }
      } catch (error) {
        console.error(`Error fetching children for ${cat.id}:`, error)
        return cat
      }
    }

    return fetchWithDepth(category, 0)
  }

  /**
   * Get flat list of all categories for category limit validation
   */
  static async getAllCategoriesFlat() {
    try {
      const { data } = await apiClient.get('/categories?limit=150&offset=0')
      return data.categories || []
    } catch (error) {
      console.error('Error fetching all categories:', error)
      return []
    }
  }

  /**
   * Check if category limit (150) is reached
   */
  static async isCategoryLimitReached() {
    const categories = await this.getAllCategoriesFlat()
    return categories.length >= 150
  }

  /**
   * Search categories by name
   */
  static async searchCategories(query) {
    const allCategories = await this.getAllCategoriesFlat()
    const lowerQuery = query.toLowerCase()
    return allCategories.filter(cat =>
      cat.name.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get category statistics
   */
  static async getCategoryStats() {
    const categories = await this.getAllCategoriesFlat()
    const stats = {
      total: categories.length,
      maxDepth: 0,
      averageChildrenPerCategory: 0
    }

    if (categories.length === 0) {
      return stats
    }

    // Calculate stats
    let totalChildren = 0
    categories.forEach(cat => {
      if (cat.children) {
        totalChildren += cat.children.length
      }
    })

    stats.averageChildrenPerCategory = totalChildren / categories.length

    return stats
  }
}

export default CategoryAPI
