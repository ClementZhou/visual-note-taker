import express from 'express'

const router = express.Router()

// Placeholder routes for versions
router.get('/:categoryId', (req, res) => {
  res.json({ message: `Get version history for category ${req.params.categoryId} - coming soon` })
})

router.post('/:id/restore', (req, res) => {
  res.json({ message: `Restore to version ${req.params.id} - coming soon` })
})

export default router
