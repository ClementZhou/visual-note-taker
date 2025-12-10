import express from 'express'

const router = express.Router()

// Placeholder routes for notes
router.get('/category/:categoryId', (req, res) => {
  res.json({ message: `Get notes for category ${req.params.categoryId} - coming soon` })
})

router.post('/', (req, res) => {
  res.json({ message: 'Create note - coming soon' })
})

router.put('/:id', (req, res) => {
  res.json({ message: `Update note ${req.params.id} - coming soon` })
})

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete note ${req.params.id} - coming soon` })
})

export default router
