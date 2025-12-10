import express from 'express'

const router = express.Router()

// Placeholder routes for metrics and analytics
router.get('/category/:categoryId', (req, res) => {
  res.json({ message: `Get metrics for category ${req.params.categoryId} - coming soon` })
})

router.get('/report', (req, res) => {
  res.json({ message: 'Generate analytics report - coming soon' })
})

export default router
