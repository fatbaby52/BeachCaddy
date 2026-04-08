// Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Date formatting
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// Time slots generation
export const generateTimeSlots = (start, end, intervalMinutes = 30) => {
  const slots = []
  let currentHour = start
  let currentMinute = 0

  while (currentHour < end || (currentHour === end && currentMinute === 0)) {
    const period = currentHour >= 12 ? 'PM' : 'AM'
    const displayHour = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour
    const displayMinute = currentMinute.toString().padStart(2, '0')
    slots.push(`${displayHour}:${displayMinute} ${period}`)

    currentMinute += intervalMinutes
    if (currentMinute >= 60) {
      currentMinute = 0
      currentHour += 1
    }
  }

  return slots
}

// Arrival time slots: 7:00 AM to 3:00 PM
export const getArrivalTimeSlots = () => generateTimeSlots(7, 15)

// End time slots based on arrival (arrival + 2 hours to 8:00 PM)
export const getEndTimeSlots = (arrivalTime) => {
  if (!arrivalTime) return []

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return { hours, minutes }
  }

  const { hours: arrivalHours, minutes: arrivalMinutes } = parseTime(arrivalTime)
  const minEndHour = arrivalHours + 2 + Math.floor(arrivalMinutes / 60)

  return generateTimeSlots(minEndHour, 20)
}

// Validation helpers
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10
}

export const validatePassword = (password) => {
  return password.length >= 8
}

// Class name helper
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

// Generate calendar days
export const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  // Add empty days for alignment
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  return days
}

// Check if date is in the past
export const isPastDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// Check if date is today
export const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// Generate booking reference
export const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'SR-'
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
