import express from 'express'

const router = express.Router()

// Placeholder routes for export/import
router.post('/csv', (req, res) => {
  res.json({ message: 'Export as CSV - coming soon' })
})

router.post('/excel', (req, res) => {
  res.json({ message: 'Export as Excel - coming soon' })
})

router.post('/import', (req, res) => {
  res.json({ message: 'Import data - coming soon' })
})

export default router
