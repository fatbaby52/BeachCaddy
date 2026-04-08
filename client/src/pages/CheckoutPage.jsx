import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, MapPin, Calendar, Clock, Users, Edit2, Tag } from 'lucide-react'
import { BackHeader, MobileNav, PageContainer } from '../components/layout'
import { Button, Card, LoadingSpinner } from '../components/common'
import { useCartStore } from '../store/cartStore'
import { useBookingStore } from '../store/bookingStore'
import { formatCurrency, formatDate, cn } from '../utils/helpers'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const {
    selectedPackage,
    items,
    promoCode,
    discount,
    getSubtotal,
    getServiceFee,
    getTax,
    getTotal,
    updateQuantity,
    removeItem,
    clearPackage,
    applyPromoCode,
    removePromoCode,
  } = useCartStore()

  const {
    selectedLocation,
    selectedDate,
    arrivalTime,
    endTime,
    groupSize,
    selectedZone,
    specialRequests,
    setSpecialRequests,
  } = useBookingStore()

  const subtotal = getSubtotal()
  const serviceFee = getServiceFee()
  const tax = getTax()
  const total = getTotal()

  const hasBookingDetails = selectedLocation && selectedDate && arrivalTime

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return

    setPromoLoading(true)
    setPromoError('')

    // Simulate API call
    setTimeout(() => {
      const validCodes = {
        'FIRSTBEACH': { type: 'percentage', value: 20 },
        'SUMMER10': { type: 'fixed', value: 10 },
        'WELCOME': { type: 'percentage', value: 15 },
      }

      const code = promoInput.toUpperCase()
      if (validCodes[code]) {
        applyPromoCode(code, validCodes[code].type, validCodes[code].value)
        setPromoInput('')
      } else {
        setPromoError('Invalid promo code')
      }
      setPromoLoading(false)
    }, 1000)
  }

  const handlePlaceOrder = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return
    }

    setIsProcessing(true)

    // Prepare booking data for API
    const bookingData = {
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      beach: selectedLocation?.name || '',
      booking_date: selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '',
      arrival_time: arrivalTime || '',
      end_time: endTime || '',
      group_size: groupSize,
      zone_preference: selectedZone?.name || null,
      package_name: selectedPackage?.name || null,
      package_price: selectedPackage?.price || null,
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      subtotal: subtotal,
      service_fee: serviceFee,
      tax: tax,
      discount: discount,
      promo_code: promoCode || null,
      total: total,
      special_requests: specialRequests || null,
      payment_status: 'pending', // Will update when Stripe is integrated
    }

    try {
      // Submit to booking API (saves to Supabase)
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Booking failed')
      }

      // Also submit to Netlify Forms as backup notification
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': 'booking',
            bookingId: result.bookingId,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            beach: selectedLocation?.name || '',
            date: selectedDate ? formatDate(selectedDate) : '',
            total: formatCurrency(total),
          }).toString(),
        })
      } catch (formError) {
        // Netlify form is backup, don't fail if it errors
        console.warn('Netlify form backup failed:', formError)
      }

      // Navigate to confirmation
      navigate(`/confirmation/${result.bookingId}`)
    } catch (error) {
      console.error('Booking submission error:', error)
      alert(error.message || 'Failed to create booking. Please try again.')
      setIsProcessing(false)
    }
  }

  const isCustomerInfoValid = customerInfo.name && customerInfo.email && customerInfo.phone

  const isEmpty = !selectedPackage && items.length === 0

  if (isEmpty) {
    return (
      <>
        <BackHeader title="Checkout" />
        <PageContainer className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-10 h-10 text-sand-400" />
            </div>
            <h2 className="font-display text-2xl text-ocean-700 mb-2">Your cart is empty</h2>
            <p className="text-warm-600 mb-6">Add a package or items to get started</p>
            <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
          </div>
        </PageContainer>
        <MobileNav />
      </>
    )
  }

  return (
    <>
      <BackHeader title="Checkout" />

      <PageContainer className="pb-40">
        {/* Booking Details Summary */}
        {hasBookingDetails && (
          <Card className="mb-6 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-ocean-700">Booking Details</h3>
              <button
                onClick={() => navigate('/book')}
                className="text-ocean-500 text-sm flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            </div>
            <div className="space-y-2 text-sm text-warm-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ocean-400" />
                <span>{selectedLocation.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ocean-400" />
                <span>{formatDate(selectedDate, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-ocean-400" />
                <span>{arrivalTime} - {endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-ocean-400" />
                <span>{groupSize} {groupSize === 1 ? 'person' : 'people'}</span>
              </div>
              {selectedZone && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-ocean-400" />
                  <span>Preferred: {selectedZone.name}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Order Items */}
        <Card className="mb-6">
          <div className="p-4 border-b border-sand-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-ocean-700">Your Order</h3>
              <button
                onClick={() => navigate('/menu')}
                className="text-ocean-500 text-sm flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            </div>
          </div>

          <div className="divide-y divide-sand-50">
            {/* Selected Package */}
            {selectedPackage && (
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-ocean-700">{selectedPackage.name}</h4>
                  <p className="text-sm text-warm-500">Package</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-ocean-600">
                    {formatCurrency(selectedPackage.price)}
                  </span>
                  <button
                    onClick={clearPackage}
                    className="text-warm-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Individual Items */}
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-ocean-700">{item.name}</h4>
                  <p className="text-sm text-warm-500">
                    {formatCurrency(item.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-sand-100 text-ocean-600 rounded-full flex items-center justify-center hover:bg-sand-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-ocean-400 text-white rounded-full flex items-center justify-center hover:bg-ocean-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="font-bold text-ocean-600 w-20 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Special Requests */}
        <Card className="mb-6 p-4">
          <h3 className="font-medium text-ocean-700 mb-3">Special Requests</h3>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Anything we should know? Birthday setup, accessibility needs..."
            rows={3}
            className="input-field resize-none"
          />
        </Card>

        {/* Promo Code */}
        <Card className="mb-6 p-4">
          <h3 className="font-medium text-ocean-700 mb-3">Promo Code</h3>
          {promoCode ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">{promoCode}</span>
                <span className="text-green-600">(-{formatCurrency(discount)})</span>
              </div>
              <button
                onClick={removePromoCode}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter code"
                className="input-field flex-1"
              />
              <Button
                onClick={handleApplyPromo}
                loading={promoLoading}
                variant="outline"
              >
                Apply
              </Button>
            </div>
          )}
          {promoError && (
            <p className="text-red-500 text-sm mt-2">{promoError}</p>
          )}
        </Card>

        {/* Order Summary */}
        <Card className="mb-6 p-4">
          <h3 className="font-medium text-ocean-700 mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-warm-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-600">Setup & Delivery Fee (15%)</span>
              <span className="font-medium">{formatCurrency(serviceFee)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Promo Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-warm-600">Tax (9.25%)</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-sand-100 pt-3 flex justify-between">
              <span className="font-semibold text-ocean-700">Total</span>
              <span className="font-bold text-xl text-ocean-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </Card>

        {/* Customer Information */}
        <Card className="mb-6 p-4">
          <h3 className="font-medium text-ocean-700 mb-4">Your Information</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-ocean-800 mb-2">
                Name <span className="text-coral-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="Your full name"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-ocean-800 mb-2">
                Email <span className="text-coral-500">*</span>
              </label>
              <input
                type="email"
                id="customerEmail"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="your@email.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-ocean-800 mb-2">
                Phone <span className="text-coral-500">*</span>
              </label>
              <input
                type="tel"
                id="customerPhone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="(555) 555-5555"
                className="input-field"
                required
              />
              <p className="text-xs text-warm-500 mt-1">We'll text you the setup location</p>
            </div>
          </div>
        </Card>

        {/* Payment Section (Placeholder) */}
        <Card className="mb-6 p-4">
          <h3 className="font-medium text-ocean-700 mb-4">Payment</h3>
          <div className="bg-sand-50 rounded-lg p-4 text-center text-warm-500">
            <p className="mb-2">Stripe Payment Form</p>
            <p className="text-sm">(Payment integration placeholder)</p>
          </div>
        </Card>
      </PageContainer>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-sand-100 p-4 z-30">
        <div className="max-w-lg mx-auto">
          <Button
            fullWidth
            size="lg"
            onClick={handlePlaceOrder}
            loading={isProcessing}
            disabled={!hasBookingDetails || !isCustomerInfoValid}
          >
            Place Order — {formatCurrency(total)}
          </Button>
          {!hasBookingDetails && (
            <p className="text-center text-sm text-red-500 mt-2">
              Please complete booking details first
            </p>
          )}
          {hasBookingDetails && !isCustomerInfoValid && (
            <p className="text-center text-sm text-red-500 mt-2">
              Please fill in your contact information
            </p>
          )}
        </div>
      </div>

      <MobileNav />
    </>
  )
}
