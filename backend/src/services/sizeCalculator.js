/**
 * Size Calculator Service
 * Calculates category size based on hybrid algorithm:
 * size = (note_count × weight_1) + (edit_frequency × weight_2) + (user_manual × weight_3)
 */

export class SizeCalculator {
  constructor(weights = {}) {
    // Default weights
    this.weights = {
      noteCount: weights.noteCount ?? 0.4,
      editFrequency: weights.editFrequency ?? 0.35,
      userManual: weights.userManual ?? 0.25
    }
    
    // Validate weights sum to approximately 1.0
    const sum = Object.values(this.weights).reduce((a, b) => a + b, 0)
    if (Math.abs(sum - 1.0) > 0.01) {
      console.warn(`Warning: Weight sum is ${sum}, expected 1.0. Normalizing...`)
      this.normalizeWeights()
    }
  }

  normalizeWeights() {
    const sum = Object.values(this.weights).reduce((a, b) => a + b, 0)
    Object.keys(this.weights).forEach(key => {
      this.weights[key] = this.weights[key] / sum
    })
  }

  setWeights(noteCount, editFrequency, userManual) {
    this.weights = { noteCount, editFrequency, userManual }
    this.normalizeWeights()
  }

  calculateSize(noteCount, editFrequency, userManualFactor = 1.0) {
    // Normalize inputs (assume max values for scaling)
    const maxNotes = 1000
    const maxFrequency = 100
    
    const normalizedNoteCount = Math.min(noteCount / maxNotes, 1.0)
    const normalizedFrequency = Math.min(editFrequency / maxFrequency, 1.0)
    
    const size = 
      (normalizedNoteCount * this.weights.noteCount) +
      (normalizedFrequency * this.weights.editFrequency) +
      (userManualFactor * this.weights.userManual)
    
    return Math.min(Math.max(size, 0), 1.0)
  }

  getWeights() {
    return { ...this.weights }
  }
}

export default SizeCalculator
