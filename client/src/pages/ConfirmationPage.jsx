import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Check, MapPin, Calendar, Clock, Users, Navigation, CalendarPlus, Share2, Home } from 'lucide-react'
import { MobileNav, PageContainer } from '../components/layout'
import { Button, Card } from '../components/common'
import { useBookingStore } from '../store/bookingStore'
import { useCartStore } from '../store/cartStore'
import { formatDate, formatCurrency } from '../utils/helpers'

export default function ConfirmationPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [showCheck, setShowCheck] = useState(false)

  const {
    selectedLocation,
    selectedDate,
    arrivalTime,
    endTime,
    groupSize,
    selectedZone,
    resetBooking,
  } = useBookingStore()

  const {
    selectedPackage,
    items,
    getTotal,
    clearCart,
  } = useCartStore()

  const total = getTotal()

  useEffect(() => {
    // Animate checkmark on mount
    setTimeout(() => setShowCheck(true), 100)
  }, [])

  const handleGetDirections = () => {
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      window.open(`https://maps.google.com/?q=${selectedLocation.latitude},${selectedLocation.longitude}`, '_blank')
    } else {
      // Fallback to address search
      window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedLocation?.address || 'Monterey Bay Beach')}`, '_blank')
    }
  }

  const handleAddToCalendar = () => {
    // Generate ICS file
    const startDate = new Date(selectedDate)
    const [startTime, startPeriod] = arrivalTime?.split(' ') || ['10:00', 'AM']
    const [startHour, startMin] = startTime.split(':').map(Number)
    let hour = startHour
    if (startPeriod === 'PM' && hour !== 12) hour += 12
    if (startPeriod === 'AM' && hour === 12) hour = 0
    startDate.setHours(hour, startMin)

    const endDate = new Date(selectedDate)
    const [endTimeStr, endPeriod] = endTime?.split(' ') || ['4:00', 'PM']
    const [endHour, endMin] = endTimeStr.split(':').map(Number)
    let eHour = endHour
    if (endPeriod === 'PM' && eHour !== 12) eHour += 12
    if (endPeriod === 'AM' && eHour === 12) eHour = 0
    endDate.setHours(eHour, endMin)

    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ShoreReady//Beach Setup//EN
BEGIN:VEVENT
UID:${bookingId}@shoreready.com
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:Beach Day at ${selectedLocation?.name || 'Beach'}
DESCRIPTION:Your ShoreReady beach setup. Booking reference: ${bookingId}
LOCATION:${selectedLocation?.address || 'Monterey Bay'}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `shoreready-${bookingId}.ics`
    link.click()
  }

  const handleShare = async () => {
    const shareData = {
      title: 'ShoreReady Beach Day',
      text: `Join me for a beach day at ${selectedLocation?.name || 'the beach'}! ${formatDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric' })} from ${arrivalTime} to ${endTime}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      alert('Link copied to clipboard!')
    }
  }

  const handleBackToHome = () => {
    // Clear everything and go home
    resetBooking()
    clearCart()
    navigate('/')
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white">
        <PageContainer className="pt-12 text-center">
          {/* Animated Checkmark */}
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-ocean-500"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className={showCheck ? 'checkmark-circle' : 'opacity-0'}
              />
              <path
                d="M30 50 L45 65 L70 35"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={showCheck ? 'checkmark-check' : 'opacity-0'}
              />
            </svg>
          </div>

          <h1 className="font-display text-3xl text-ocean-700 mb-2">
            You're All Set!
          </h1>
          <p className="text-gray-600 mb-2">
            Booking Reference
          </p>
          <p className="text-2xl font-bold text-ocean-600 mb-8">
            {bookingId}
          </p>

          {/* Booking Summary Card */}
          <Card className="text-left mb-8 p-4">
            <h3 className="font-medium text-ocean-700 mb-4">Booking Summary</h3>
            <div className="space-y-3 text-sm">
              {selectedLocation && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-ocean-400 flex-shrink-0" />
                  <span>{selectedLocation.name}</span>
                </div>
              )}
              {selectedDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-ocean-400 flex-shrink-0" />
                  <span>{formatDate(selectedDate)}</span>
                </div>
              )}
              {arrivalTime && endTime && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-ocean-400 flex-shrink-0" />
                  <span>{arrivalTime} - {endTime}</span>
                </div>
              )}
              {groupSize && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-ocean-400 flex-shrink-0" />
                  <span>{groupSize} {groupSize === 1 ? 'person' : 'people'}</span>
                </div>
              )}

              <div className="border-t border-sand-100 pt-3 mt-3">
                {selectedPackage && (
                  <div className="flex justify-between mb-2">
                    <span>{selectedPackage.name}</span>
                    <span className="font-medium">{formatCurrency(selectedPackage.price)}</span>
                  </div>
                )}
                {items.map(item => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand-100 pt-3 flex justify-between font-semibold">
                <span>Total Paid</span>
                <span className="text-ocean-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </Card>

          {/* What Happens Next */}
          <Card className="text-left mb-8 p-4">
            <h3 className="font-medium text-ocean-700 mb-4">What Happens Next</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-ocean-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Confirmation Email</p>
                  <p className="text-sm text-gray-600">Check your inbox for booking details</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-ocean-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Setup Area Confirmation</p>
                  <p className="text-sm text-gray-600">We'll confirm your spot 24 hours before</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-ocean-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Arrive & Enjoy</p>
                  <p className="text-sm text-gray-600">Your setup will be ready when you get there!</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <Button
              fullWidth
              onClick={handleGetDirections}
              leftIcon={<Navigation className="w-5 h-5" />}
            >
              Get Directions
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={handleAddToCalendar}
              leftIcon={<CalendarPlus className="w-5 h-5" />}
            >
              Add to Calendar
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={handleShare}
              leftIcon={<Share2 className="w-5 h-5" />}
            >
              Share with Friends
            </Button>
          </div>

          {/* Bottom Links */}
          <div className="space-y-3">
            <Button
              fullWidth
              variant="secondary"
              onClick={handleBackToHome}
              leftIcon={<Home className="w-5 h-5" />}
            >
              Back to Home
            </Button>
            <Link to="/account" className="block">
              <Button fullWidth variant="ghost">
                View My Reservations
              </Button>
            </Link>
          </div>
        </PageContainer>
      </div>

      <MobileNav />
    </>
  )
}
