const nodemailer = require('nodemailer')

// Create transporter - will use console logging if SMTP not configured
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return null
}

const transporter = createTransporter()

const sendEmail = async ({ to, subject, html, text }) => {
  if (!transporter) {
    console.log('📧 Email (not sent - SMTP not configured):')
    console.log(`  To: ${to}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Body: ${text || html}`)
    return { mock: true }
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"ShoreReady" <noreply@shoreready.com>',
      to,
      subject,
      html,
      text,
    })
    return result
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

const sendBookingConfirmation = async (booking, user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #219EBC, #F4A261); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
        .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .total { font-size: 24px; color: #219EBC; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .btn { display: inline-block; background: #219EBC; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏖️ You're All Set!</h1>
        </div>
        <div class="content">
          <p>Hi ${user.firstName},</p>
          <p>Your beach setup is confirmed! Here's everything you need to know:</p>

          <div class="booking-details">
            <div class="detail-row">
              <span><strong>Booking Reference</strong></span>
              <span>${booking.id}</span>
            </div>
            <div class="detail-row">
              <span><strong>Location</strong></span>
              <span>${booking.location?.name || 'Beach Location'}</span>
            </div>
            <div class="detail-row">
              <span><strong>Date</strong></span>
              <span>${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div class="detail-row">
              <span><strong>Time</strong></span>
              <span>${booking.arrivalTime} - ${booking.endTime}</span>
            </div>
            <div class="detail-row">
              <span><strong>Group Size</strong></span>
              <span>${booking.groupSize} people</span>
            </div>
            <div class="detail-row">
              <span><strong>Total Paid</strong></span>
              <span class="total">$${booking.total.toFixed(2)}</span>
            </div>
          </div>

          <h3>What Happens Next</h3>
          <ol>
            <li>We'll confirm your setup area 24 hours before your beach day</li>
            <li>Your setup will be ready and waiting when you arrive</li>
            <li>Just show up and enjoy!</li>
          </ol>

          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/confirmation/${booking.id}" class="btn">View Booking Details</a>
          </p>

          <p>Questions? Reply to this email or text us at (555) 123-4567.</p>

          <p>See you at the beach! 🌊</p>
          <p><strong>The ShoreReady Team</strong></p>
        </div>
        <div class="footer">
          <p>ShoreReady - Beach setups made effortless</p>
          <p>Monterey Bay, California</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Your beach setup is confirmed!

    Booking Reference: ${booking.id}
    Location: ${booking.location?.name || 'Beach Location'}
    Date: ${new Date(booking.date).toLocaleDateString()}
    Time: ${booking.arrivalTime} - ${booking.endTime}
    Group Size: ${booking.groupSize} people
    Total: $${booking.total.toFixed(2)}

    See you at the beach!
    - The ShoreReady Team
  `

  return sendEmail({
    to: user.email,
    subject: `🏖️ Beach Day Confirmed - ${new Date(booking.date).toLocaleDateString()}`,
    html,
    text,
  })
}

const sendReminder = async (booking, user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #219EBC, #F4A261); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #eee; }
        .btn { display: inline-block; background: #219EBC; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌅 Your Beach Day is Tomorrow!</h1>
        </div>
        <div class="content">
          <p>Hi ${user.firstName},</p>
          <p>Get ready for an amazing beach day! Your setup at <strong>${booking.location?.name}</strong> will be ready at <strong>${booking.arrivalTime}</strong>.</p>

          <h3>What to Bring</h3>
          <ul>
            <li>Sunscreen (we provide some, but bring your favorite!)</li>
            <li>Swimsuit</li>
            <li>Good vibes ✨</li>
          </ul>

          <p>We'll send you another message when your setup is ready!</p>

          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/confirmation/${booking.id}" class="btn">View Booking</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: user.email,
    subject: `🌅 Tomorrow: Beach Day at ${booking.location?.name}!`,
    html,
    text: `Your beach day is tomorrow! See you at ${booking.location?.name} at ${booking.arrivalTime}.`,
  })
}

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendReminder,
}
