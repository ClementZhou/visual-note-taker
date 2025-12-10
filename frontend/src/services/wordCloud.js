/**
 * Word Cloud Service
 * Handles D3-based word cloud layout and sizing calculations
 */

import * as d3 from 'd3'

export class WordCloudService {
  constructor(width = 1000, height = 600, weights = {}) {
    this.width = width
    this.height = height
    
    // Default sizing weights
    this.weights = {
      noteCount: weights.noteCount ?? 0.4,
      editFrequency: weights.editFrequency ?? 0.35,
      userManual: weights.userManual ?? 0.25
    }
    
    this.normalizeWeights()
  }

  /**
   * Normalize weights to sum to 1.0
   */
  normalizeWeights() {
    const sum = Object.values(this.weights).reduce((a, b) => a + b, 0)
    Object.keys(this.weights).forEach(key => {
      this.weights[key] = this.weights[key] / sum
    })
  }

  /**
   * Calculate category size (0-1 scale)
   */
  calculateSize(category, maxNotes = 1000, maxFrequency = 100) {
    const metrics = category.metrics || {}
    const noteCount = Math.min((metrics.edit_count || 0) / maxNotes, 1.0)
    const editFrequency = Math.min((metrics.content_volume || 0) / maxFrequency, 1.0)
    const manualFactor = category.manual_size_factor || 1.0

    const size =
      noteCount * this.weights.noteCount +
      editFrequency * this.weights.editFrequency +
      manualFactor * this.weights.userManual

    return Math.min(Math.max(size, 0), 1.0)
  }

  /**
   * Calculate box dimensions based on size and aspect ratio
   */
  calculateBoxDimensions(size, aspectRatio = 1.5) {
    // Area-based sizing: larger size = larger area
    const area = size * 15000 // Base area multiplier
    const width = Math.sqrt(area * aspectRatio)
    const height = area / width

    return {
      width: Math.max(width, 80),
      height: Math.max(height, 60),
      fontSize: Math.max(12, size * 24)
    }
  }

  /**
   * Generate D3 force simulation layout
   */
  generateLayout(categories) {
    if (!categories || categories.length === 0) {
      return []
    }

    // Calculate sizes for all categories
    const categoriesWithSize = categories.map(cat => ({
      ...cat,
      size: this.calculateSize(cat),
      ...this.calculateBoxDimensions(this.calculateSize(cat))
    }))

    // Create force simulation
    const simulation = d3
      .forceSimulation(categoriesWithSize)
      .force(
        'x',
        d3
          .forceX(this.width / 2)
          .strength(0.05)
      )
      .force(
        'y',
        d3
          .forceY(this.height / 2)
          .strength(0.05)
      )
      .force(
        'collide',
        d3
          .forceCollide()
          .radius(d => Math.sqrt(d.width * d.width + d.height * d.height) / 2 + 10)
          .strength(0.8)
      )
      .alpha(1)
      .alphaDecay(0.02)

    // Run simulation for multiple ticks to stabilize layout
    for (let i = 0; i < 300; i++) {
      simulation.tick()
    }

    simulation.stop()

    return categoriesWithSize.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      color: d.color || this.getDefaultColor(),
      size: d.size,
      x: d.x,
      y: d.y,
      width: d.width,
      height: d.height,
      fontSize: d.fontSize,
      manual_size_factor: d.manual_size_factor,
      metrics: d.metrics,
      children: d.children
    }))
  }

  /**
   * Get default color based on hash of name
   */
  getDefaultColor() {
    const colors = [
      '#3498db', // blue
      '#e74c3c', // red
      '#2ecc71', // green
      '#f39c12', // orange
      '#9b59b6', // purple
      '#1abc9c', // turquoise
      '#34495e', // dark blue
      '#e67e22'  // carrot
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  /**
   * Update weights for sizing algorithm
   */
  setWeights(noteCount, editFrequency, userManual) {
    this.weights = { noteCount, editFrequency, userManual }
    this.normalizeWeights()
  }

  /**
   * Get current weights
   */
  getWeights() {
    return { ...this.weights }
  }

  /**
   * Update container dimensions
   */
  setDimensions(width, height) {
    this.width = width
    this.height = height
  }

  /**
   * Recalculate layout when category data changes
   */
  updateLayout(categories) {
    return this.generateLayout(categories)
  }

  /**
   * Adjust manual size factor for a specific category
   */
  adjustCategorySize(categoryId, factor, categories) {
    const updated = categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, manual_size_factor: Math.max(0.5, Math.min(factor, 2.0)) }
        : cat
    )
    return this.generateLayout(updated)
  }
}

export default WordCloudService
