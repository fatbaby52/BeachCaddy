const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, supabase } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    let user = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    // Create user in our DB if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          supabaseId: req.user.id,
          email: req.user.email,
          firstName: req.user.user_metadata?.first_name || 'User',
          lastName: req.user.user_metadata?.last_name || '',
          phone: req.user.user_metadata?.phone || null,
        },
      })
    }

    res.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body

    const user = await prisma.user.update({
      where: { supabaseId: req.user.id },
      data: {
        firstName,
        lastName,
        phone,
      },
    })

    res.json(user)
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Sync user after signup (called from frontend after Supabase auth)
router.post('/sync', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body

    let user = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          supabaseId: req.user.id,
          email: req.user.email,
          firstName: firstName || req.user.user_metadata?.first_name || 'User',
          lastName: lastName || req.user.user_metadata?.last_name || '',
          phone: phone || req.user.user_metadata?.phone || null,
        },
      })
    }

    res.json(user)
  } catch (error) {
    console.error('User sync error:', error)
    res.status(500).json({ error: 'Failed to sync user' })
  }
})

module.exports = router
