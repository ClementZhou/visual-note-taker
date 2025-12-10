import express from 'express'

const router = express.Router()

// Placeholder routes for collaboration
router.post('/invite', (req, res) => {
  res.json({ message: 'Send friend invitation - coming soon' })
})

router.get('/friends', (req, res) => {
  res.json({ message: 'Get friend list - coming soon' })
})

router.get('/friends/:id/categories', (req, res) => {
  res.json({ message: `Get shared categories from friend ${req.params.id} - coming soon` })
})

router.post('/share', (req, res) => {
  res.json({ message: 'Share category with friend - coming soon' })
})

export default router
