const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// Get all active packages
router.get('/', async (req, res) => {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { price: 'asc' },
      ],
    })

    res.json(packages)
  } catch (error) {
    console.error('Fetch packages error:', error)
    res.status(500).json({ error: 'Failed to fetch packages' })
  }
})

// Get single package with items
router.get('/:id', async (req, res) => {
  try {
    const pkg = await prisma.package.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' })
    }

    res.json(pkg)
  } catch (error) {
    console.error('Fetch package error:', error)
    res.status(500).json({ error: 'Failed to fetch package' })
  }
})

module.exports = router
