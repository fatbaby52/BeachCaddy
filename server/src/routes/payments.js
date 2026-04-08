const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authMiddleware } = require('../middleware/auth')

// Only initialize Stripe if key is provided and valid
const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeKey && !stripeKey.startsWith('sk_test_placeholder')
  ? require('stripe')(stripeKey)
  : null

const router = express.Router()
const prisma = new PrismaClient()

// Create payment intent
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    const { amount, bookingId } = req.body

    // If Stripe is not configured, return mock response
    if (!stripe) {
      return res.json({
        clientSecret: 'mock_client_secret',
        mock: true,
      })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId,
      },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    res.status(500).json({ error: 'Failed to create payment intent' })
  }
})

// Confirm payment and update booking
router.post('/confirm', authMiddleware, async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body

    // Update booking status
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        stripePaymentId: paymentIntentId,
      },
      include: {
        location: true,
        user: true,
      },
    })

    // Create confirmation notification
    await prisma.notification.create({
      data: {
        bookingId: booking.id,
        type: 'BOOKING_CONFIRMED',
        message: `Your beach setup at ${booking.location.name} is confirmed!`,
      },
    })

    res.json(booking)
  } catch (error) {
    console.error('Confirm payment error:', error)
    res.status(500).json({ error: 'Failed to confirm payment' })
  }
})

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe not configured' })
  }

  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('PaymentIntent succeeded:', paymentIntent.id)
      break
    case 'payment_intent.payment_failed':
      console.log('PaymentIntent failed:', event.data.object.id)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

module.exports = router
