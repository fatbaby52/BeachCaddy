const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authMiddleware, optionalAuth } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get user's bookings
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        location: true,
        zone: true,
        packages: {
          include: { package: true },
        },
        orderItems: {
          include: { menuItem: true },
        },
      },
      orderBy: { date: 'desc' },
    })

    // Separate upcoming and past
    const now = new Date()
    const upcoming = bookings.filter(b => new Date(b.date) >= now && b.status !== 'CANCELLED')
    const past = bookings.filter(b => new Date(b.date) < now || b.status === 'COMPLETED')

    res.json({ upcoming, past })
  } catch (error) {
    console.error('Fetch bookings error:', error)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// Get single booking
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        userId: user.id,
      },
      include: {
        location: true,
        zone: true,
        packages: {
          include: { package: true },
        },
        orderItems: {
          include: { menuItem: true },
        },
        notifications: true,
      },
    })

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.json(booking)
  } catch (error) {
    console.error('Fetch booking error:', error)
    res.status(500).json({ error: 'Failed to fetch booking' })
  }
})

// Create new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const {
      locationId,
      zoneId,
      date,
      arrivalTime,
      endTime,
      groupSize,
      specialRequests,
      packageId,
      items, // [{ menuItemId, quantity }]
      promoCode,
    } = req.body

    // Calculate totals
    let subtotal = 0

    // Add package price if selected
    if (packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: packageId } })
      if (pkg) subtotal += pkg.price
    }

    // Add item prices
    if (items && items.length > 0) {
      for (const item of items) {
        const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } })
        if (menuItem) subtotal += menuItem.price * item.quantity
      }
    }

    // Apply promo code discount
    let discount = 0
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } })
      if (promo && promo.isActive) {
        if (promo.discountType === 'percentage') {
          discount = subtotal * (promo.discountValue / 100)
        } else {
          discount = Math.min(promo.discountValue, subtotal)
        }

        // Update promo usage
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { currentUses: { increment: 1 } },
        })
      }
    }

    const serviceFee = subtotal * 0.15
    const tax = (subtotal + serviceFee - discount) * 0.0925
    const total = subtotal + serviceFee + tax - discount

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        locationId,
        zoneId,
        date: new Date(date),
        arrivalTime,
        endTime,
        groupSize,
        specialRequests,
        subtotal,
        serviceFee,
        tax,
        total,
        promoCode,
        discount,
        status: 'PENDING',
        packages: packageId ? {
          create: { packageId, quantity: 1 },
        } : undefined,
        orderItems: items && items.length > 0 ? {
          create: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        } : undefined,
      },
      include: {
        location: true,
        zone: true,
        packages: { include: { package: true } },
        orderItems: { include: { menuItem: true } },
      },
    })

    res.status(201).json(booking)
  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// Cancel booking
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    const booking = await prisma.booking.findFirst({
      where: {
        id: req.params.id,
        userId: user.id,
      },
    })

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Check if booking can be cancelled (at least 24 hours before)
    const bookingDate = new Date(booking.date)
    const now = new Date()
    const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60)

    if (hoursUntilBooking < 24) {
      return res.status(400).json({
        error: 'Cannot cancel within 24 hours of booking',
      })
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    })

    res.json(updated)
  } catch (error) {
    console.error('Cancel booking error:', error)
    res.status(500).json({ error: 'Failed to cancel booking' })
  }
})

module.exports = router
