const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// Get all active menu items
router.get('/', async (req, res) => {
  try {
    const { category, isAddOn } = req.query

    const where = { isActive: true }

    if (category) {
      where.category = category
    }

    if (isAddOn !== undefined) {
      where.isAddOn = isAddOn === 'true'
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    })

    res.json(items)
  } catch (error) {
    console.error('Fetch menu error:', error)
    res.status(500).json({ error: 'Failed to fetch menu items' })
  }
})

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.menuItem.findUnique({
      where: { id: req.params.id },
    })

    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.json(item)
  } catch (error) {
    console.error('Fetch item error:', error)
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await prisma.menuItem.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    })

    res.json(categories.map(c => c.category))
  } catch (error) {
    console.error('Fetch categories error:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// Get add-ons only
router.get('/addons/all', async (req, res) => {
  try {
    const addons = await prisma.menuItem.findMany({
      where: {
        isActive: true,
        isAddOn: true,
      },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
    })

    res.json(addons)
  } catch (error) {
    console.error('Fetch addons error:', error)
    res.status(500).json({ error: 'Failed to fetch add-ons' })
  }
})

module.exports = router
