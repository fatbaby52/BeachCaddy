-- ShoreReady Bookings Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL, -- Human-readable ID like "SR-ABC123"

  -- Customer info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Booking details
  beach TEXT NOT NULL,
  booking_date DATE NOT NULL,
  arrival_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  group_size INTEGER NOT NULL DEFAULT 1,
  zone_preference TEXT,

  -- Order details
  package_name TEXT,
  package_price DECIMAL(10,2),
  items JSONB DEFAULT '[]', -- Array of {name, quantity, price}
  subtotal DECIMAL(10,2) NOT NULL,
  service_fee DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  promo_code TEXT,
  total DECIMAL(10,2) NOT NULL,

  -- Special requests
  special_requests TEXT,

  -- Payment
  stripe_payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded, failed

  -- Status
  status TEXT DEFAULT 'confirmed', -- confirmed, completed, cancelled

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast availability lookups
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Function to count bookings per date (for availability check)
CREATE OR REPLACE FUNCTION get_availability(start_date DATE, end_date DATE)
RETURNS TABLE(booking_date DATE, slots_booked BIGINT, slots_available INTEGER) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(start_date, end_date, '1 day'::interval)::date AS date
  ),
  booking_counts AS (
    SELECT
      b.booking_date,
      COUNT(*) AS booked
    FROM bookings b
    WHERE b.booking_date BETWEEN start_date AND end_date
      AND b.status != 'cancelled'
    GROUP BY b.booking_date
  )
  SELECT
    ds.date AS booking_date,
    COALESCE(bc.booked, 0) AS slots_booked,
    (2 - COALESCE(bc.booked, 0))::integer AS slots_available
  FROM date_series ds
  LEFT JOIN booking_counts bc ON ds.date = bc.booking_date
  ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read availability (we'll use a function for this)
-- Policy: Only authenticated users can insert (we'll handle via Netlify Function with service key)
CREATE POLICY "Enable read access for all users" ON bookings
  FOR SELECT USING (true);

-- Policy: Allow inserts from service role (Netlify Functions)
CREATE POLICY "Enable insert for service role" ON bookings
  FOR INSERT WITH CHECK (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
