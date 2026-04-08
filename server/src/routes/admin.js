const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')
const { adminMiddleware } = require('../middleware/admin')
const { upload } = require('../middleware/upload')

const router = express.Router()
const prisma = new PrismaClient()

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware)

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    const [todayBookings, weekRevenue, activeSetups, pendingConfirmations] = await Promise.all([
      prisma.booking.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
          status: { not: 'CANCELLED' },
        },
      }),
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: weekAgo },
          status: { in: ['CONFIRMED', 'COMPLETED', 'SETUP_COMPLETE'] },
        },
        _sum: { total: true },
      }),
      prisma.booking.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
          status: { in: ['IN_PROGRESS', 'SETUP_COMPLETE'] },
        },
      }),
      prisma.booking.count({
        where: { status: 'PENDING' },
      }),
    ])

    res.json({
      todayBookings,
      weekRevenue: weekRevenue._sum.total || 0,
      activeSetups,
      pendingConfirmations,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

// Get all bookings with filters
router.get('/bookings', async (req, res) => {
  try {
    const { status, locationId, startDate, endDate, search } = req.query

    const where = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (locationId) {
      where.locationId = locationId
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: true,
        location: true,
        zone: true,
        packages: { include: { package: true } },
        orderItems: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(bookings)
  } catch (error) {
    console.error('Fetch admin bookings error:', error)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

// Update booking status
router.put('/bookings/:id', async (req, res) => {
  try {
    const { status, crewNotes, assignedCrewId } = req.body

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        status,
        crewNotes,
        assignedCrewId,
      },
      include: {
        user: true,
        location: true,
      },
    })

    // Create notification for status change
    if (status === 'SETUP_COMPLETE') {
      await prisma.notification.create({
        data: {
          bookingId: booking.id,
          type: 'SETUP_READY',
          message: `Your beach setup at ${booking.location.name} is ready!`,
        },
      })
    }

    res.json(booking)
  } catch (error) {
    console.error('Update booking error:', error)
    res.status(500).json({ error: 'Failed to update booking' })
  }
})

// Menu Items CRUD
router.get('/menu-items', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    })
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' })
  }
})

router.post('/menu-items', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, isAddOn, sortOrder } = req.body

    const item = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        isAddOn: isAddOn === 'true',
        sortOrder: parseInt(sortOrder) || 0,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      },
    })

    res.status(201).json(item)
  } catch (error) {
    console.error('Create menu item error:', error)
    res.status(500).json({ error: 'Failed to create menu item' })
  }
})

router.put('/menu-items/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, isAddOn, isActive, sortOrder } = req.body

    const data = {
      name,
      description,
      price: parseFloat(price),
      category,
      isAddOn: isAddOn === 'true',
      isActive: isActive !== 'false',
      sortOrder: parseInt(sortOrder) || 0,
    }

    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`
    }

    const item = await prisma.menuItem.update({
      where: { id: req.params.id },
      data,
    })

    res.json(item)
  } catch (error) {
    console.error('Update menu item error:', error)
    res.status(500).json({ error: 'Failed to update menu item' })
  }
})

router.delete('/menu-items/:id', async (req, res) => {
  try {
    await prisma.menuItem.update({
      where: { id: req.params.id },
      data: { isActive: false },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' })
  }
})

// Packages CRUD
router.get('/packages', async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      include: { items: { include: { menuItem: true } } },
      orderBy: { sortOrder: 'asc' },
    })
    res.json(packages)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages' })
  }
})

router.post('/packages', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, tag, items } = req.body

    const pkg = await prisma.package.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        tag,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        items: items ? {
          create: JSON.parse(items).map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        } : undefined,
      },
      include: { items: { include: { menuItem: true } } },
    })

    res.status(201).json(pkg)
  } catch (error) {
    console.error('Create package error:', error)
    res.status(500).json({ error: 'Failed to create package' })
  }
})

// Locations CRUD
router.get('/locations', async (req, res) => {
  try {
    const locations = await prisma.beachLocation.findMany({
      include: { zones: true },
    })
    res.json(locations)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' })
  }
})

router.post('/locations', async (req, res) => {
  try {
    const { name, description, address, latitude, longitude, zones } = req.body

    const location = await prisma.beachLocation.create({
      data: {
        name,
        description,
        address,
        latitude,
        longitude,
        zones: zones ? {
          create: zones.map(zone => ({
            name: zone.name,
            description: zone.description,
            icon: zone.icon,
          })),
        } : undefined,
      },
      include: { zones: true },
    })

    res.status(201).json(location)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create location' })
  }
})

// Promo Codes CRUD
router.get('/promo-codes', async (req, res) => {
  try {
    const codes = await prisma.promoCode.findMany({
      orderBy: { code: 'asc' },
    })
    res.json(codes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promo codes' })
  }
})

router.post('/promo-codes', async (req, res) => {
  try {
    const { code, discountType, discountValue, maxUses, expiresAt } = req.body

    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    res.status(201).json(promo)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create promo code' })
  }
})

router.delete('/promo-codes/:id', async (req, res) => {
  try {
    await prisma.promoCode.update({
      where: { id: req.params.id },
      data: { isActive: false },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete promo code' })
  }
})

// Unavailable dates
router.post('/unavailable-dates', async (req, res) => {
  try {
    const { locationId, date, reason } = req.body

    const unavailable = await prisma.unavailableDate.create({
      data: {
        locationId,
        date: new Date(date),
        reason,
      },
    })

    res.status(201).json(unavailable)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create unavailable date' })
  }
})

module.exports = router
