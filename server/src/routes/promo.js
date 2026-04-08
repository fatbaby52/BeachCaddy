const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// Validate promo code
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' })
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!promo) {
      return res.status(404).json({ error: 'Invalid promo code' })
    }

    if (!promo.isActive) {
      return res.status(400).json({ error: 'This promo code is no longer active' })
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'This promo code has expired' })
    }

    if (promo.maxUses && promo.currentUses >= promo.maxUses) {
      return res.status(400).json({ error: 'This promo code has reached its usage limit' })
    }

    res.json({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    })
  } catch (error) {
    console.error('Validate promo error:', error)
    res.status(500).json({ error: 'Failed to validate promo code' })
  }
})

module.exports = router
