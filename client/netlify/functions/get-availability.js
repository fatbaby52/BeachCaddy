const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Database not configured' }),
    }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Get query params
    const params = event.queryStringParameters || {}
    const startDate = params.start || new Date().toISOString().split('T')[0]

    // Default to 60 days from start
    const endDate = params.end || (() => {
      const d = new Date(startDate)
      d.setDate(d.getDate() + 60)
      return d.toISOString().split('T')[0]
    })()

    // Call the availability function
    const { data, error } = await supabase.rpc('get_availability', {
      start_date: startDate,
      end_date: endDate,
    })

    if (error) {
      console.error('Supabase error:', error)

      // If function doesn't exist, fall back to direct query
      if (error.message.includes('function') || error.code === '42883') {
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('booking_date')
          .gte('booking_date', startDate)
          .lte('booking_date', endDate)
          .neq('status', 'cancelled')

        if (bookingsError) throw bookingsError

        // Count bookings per date
        const counts = {}
        bookings.forEach(b => {
          counts[b.booking_date] = (counts[b.booking_date] || 0) + 1
        })

        // Generate date range with availability
        const result = []
        const current = new Date(startDate)
        const end = new Date(endDate)

        while (current <= end) {
          const dateStr = current.toISOString().split('T')[0]
          const booked = counts[dateStr] || 0
          result.push({
            booking_date: dateStr,
            slots_booked: booked,
            slots_available: 2 - booked,
          })
          current.setDate(current.getDate() + 1)
        }

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ availability: result }),
        }
      }

      throw error
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability: data }),
    }

  } catch (error) {
    console.error('Availability error:', error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch availability' }),
    }
  }
}
