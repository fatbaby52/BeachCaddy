const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Check if user has admin role in our database
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: req.user.id },
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    req.dbUser = dbUser
    next()
  } catch (error) {
    console.error('Admin middleware error:', error)
    res.status(500).json({ error: 'Authorization check failed' })
  }
}

module.exports = { adminMiddleware }
