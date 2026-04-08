const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// Get all active beach locations
router.get('/', async (req, res) => {
  try {
    const locations = await prisma.beachLocation.findMany({
      where: { isActive: true },
      include: {
        zones: true,
      },
      orderBy: { name: 'asc' },
    })

    res.json(locations)
  } catch (error) {
    console.error('Fetch locations error:', error)
    res.status(500).json({ error: 'Failed to fetch locations' })
  }
})

// Get single location with zones
router.get('/:id', async (req, res) => {
  try {
    const location = await prisma.beachLocation.findUnique({
      where: { id: req.params.id },
      include: {
        zones: true,
      },
    })

    if (!location) {
      return res.status(404).json({ error: 'Location not found' })
    }

    res.json(location)
  } catch (error) {
    console.error('Fetch location error:', error)
    res.status(500).json({ error: 'Failed to fetch location' })
  }
})

// Get unavailable dates for a location
router.get('/:id/unavailable-dates', async (req, res) => {
  try {
    const dates = await prisma.unavailableDate.findMany({
      where: {
        OR: [
          { locationId: req.params.id },
          { locationId: null }, // Global unavailable dates
        ],
      },
    })

    res.json(dates.map(d => d.date))
  } catch (error) {
    console.error('Fetch unavailable dates error:', error)
    res.status(500).json({ error: 'Failed to fetch unavailable dates' })
  }
})

module.exports = router
