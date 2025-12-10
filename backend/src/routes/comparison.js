import express from 'express'

const router = express.Router()

// Placeholder routes for comparison views
router.get('/', (req, res) => {
  res.json({ message: 'Get comparison data - coming soon' })
})

router.get('/tree/:ids', (req, res) => {
  res.json({ message: `Get tree view data for ${req.params.ids} - coming soon` })
})

router.get('/tunnel/:ids', (req, res) => {
  res.json({ message: `Get tunnel view data for ${req.params.ids} - coming soon` })
})

export default router
