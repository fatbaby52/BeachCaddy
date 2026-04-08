const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/bookings', require('./routes/bookings'))
app.use('/api/menu', require('./routes/menu'))
app.use('/api/packages', require('./routes/packages'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/locations', require('./routes/locations'))
app.use('/api/promo', require('./routes/promo'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/ai', require('./routes/ai'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
