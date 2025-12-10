import express from 'express'

const router = express.Router()

// Placeholder routes for categories
router.get('/', (req, res) => {
  res.json({ message: 'Get all categories - coming soon' })
})

router.post('/', (req, res) => {
  res.json({ message: 'Create category - coming soon' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `Get category ${req.params.id} - coming soon` })
})

router.put('/:id', (req, res) => {
  res.json({ message: `Update category ${req.params.id} - coming soon` })
})

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete category ${req.params.id} - coming soon` })
})

router.get('/:id/children', (req, res) => {
  res.json({ message: `Get children for category ${req.params.id} - coming soon` })
})

export default router
