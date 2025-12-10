import express from 'express'

const router = express.Router()

// Placeholder routes for backups
router.get('/', (req, res) => {
  res.json({ message: 'Get backup history - coming soon' })
})

router.post('/', (req, res) => {
  res.json({ message: 'Trigger manual backup - coming soon' })
})

router.get('/:id/restore', (req, res) => {
  res.json({ message: `Restore from backup ${req.params.id} - coming soon` })
})

export default router
