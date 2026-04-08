const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY // Use service key for inserts

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Database not configured' }),
    }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const booking = JSON.parse(event.body)

    // Validate required fields
    const required = ['customer_name', 'customer_email', 'customer_phone', 'beach', 'booking_date', 'arrival_time', 'end_time']
    for (const field of required) {
      if (!booking[field]) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: `Missing required field: ${field}` }),
        }
      }
    }

    // Check availability first
    const { data: existing, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_date', booking.booking_date)
      .neq('status', 'cancelled')

    if (checkError) throw checkError

    if (existing && existing.length >= 2) {
      return {
        statusCode: 409,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Date fully booked',
          message: 'Sorry, this date is no longer available. Please choose another date.',
        }),
      }
    }

    // Generate booking ID
    const bookingId = 'SR-' + Math.random().toString(36).substring(2, 8).toUpperCase()

    // Create the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        booking_id: bookingId,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        beach: booking.beach,
        booking_date: booking.booking_date,
        arrival_time: booking.arrival_time,
        end_time: booking.end_time,
        group_size: booking.group_size || 1,
        zone_preference: booking.zone_preference,
        package_name: booking.package_name,
        package_price: booking.package_price,
        items: booking.items || [],
        subtotal: booking.subtotal,
        service_fee: booking.service_fee,
        tax: booking.tax,
        discount: booking.discount || 0,
        promo_code: booking.promo_code,
        total: booking.total,
        special_requests: booking.special_requests,
        stripe_payment_intent_id: booking.stripe_payment_intent_id,
        payment_status: booking.payment_status || 'pending',
        status: 'confirmed',
      })
      .select()
      .single()

    if (error) throw error

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        booking: data,
        bookingId: bookingId,
      }),
    }

  } catch (error) {
    console.error('Booking error:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to create booking' }),
    }
  }
}
