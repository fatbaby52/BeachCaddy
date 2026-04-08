const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get user's notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const notifications = await prisma.notification.findMany({
      where: {
        booking: {
          userId: user.id,
        },
      },
      orderBy: { sentAt: 'desc' },
      take: 20,
    })

    res.json(notifications)
  } catch (error) {
    console.error('Fetch notifications error:', error)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
})

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    })

    res.json(notification)
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ error: 'Failed to update notification' })
  }
})

// Mark all as read
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    await prisma.notification.updateMany({
      where: {
        booking: {
          userId: user.id,
        },
        read: false,
      },
      data: { read: true },
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Mark all read error:', error)
    res.status(500).json({ error: 'Failed to update notifications' })
  }
})

module.exports = router
