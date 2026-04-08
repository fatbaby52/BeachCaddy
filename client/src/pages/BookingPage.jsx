import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Clock, Users, Map, Check, ChevronRight, Waves, TreePalm, Car, Sun, Users2 } from 'lucide-react'
import { BackHeader, MobileNav, PageContainer } from '../components/layout'
import { Button, Card, CardImage, CardBody, LoadingSpinner } from '../components/common'
import { useBookingStore } from '../store/bookingStore'
import { formatDate, getCalendarDays, isPastDate, isToday, getArrivalTimeSlots, getEndTimeSlots, cn } from '../utils/helpers'

// Sample data (will be fetched from API)
const sampleLocations = [
  {
    id: '1',
    name: 'Seacliff State Beach',
    description: 'Famous for the concrete ship SS Palo Alto. Great for families.',
    address: 'Seacliff, CA',
    imageUrl: null,
  },
  {
    id: '2',
    name: 'Sunset State Beach',
    description: 'Beautiful sunsets and wide sandy beach. Perfect for groups.',
    address: 'Watsonville, CA',
    imageUrl: null,
  },
  {
    id: '3',
    name: 'Manresa State Beach',
    description: 'Quieter beach with great surfing. Ideal for relaxation.',
    address: 'La Selva Beach, CA',
    imageUrl: null,
  },
]

const sampleZones = [
  { id: '1', name: 'Near Water', description: 'Front row to the waves', icon: Waves },
  { id: '2', name: 'Private Area', description: 'Tucked away for a quieter vibe', icon: TreePalm },
  { id: '3', name: 'Family Zone', description: 'Close to restrooms and calmer water', icon: Users2 },
  { id: '4', name: 'Near Parking', description: 'Easy access, less carrying', icon: Car },
  { id: '5', name: 'Sunset-Facing', description: 'Golden hour views', icon: Sun },
]

// Step Components
function LocationStep() {
  const { selectedLocation, setLocation, nextStep } = useBookingStore()

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-6">Choose your beach location</p>

      {sampleLocations.map((location) => (
        <Card
          key={location.id}
          elevated
          onClick={() => setLocation(location)}
          className={cn(
            'cursor-pointer transition-all',
            selectedLocation?.id === location.id && 'ring-2 ring-ocean-400'
          )}
        >
          <CardImage src={location.imageUrl} alt={location.name} className="h-36" />
          <CardBody>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg text-ocean-700">{location.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{location.address}</p>
                <p className="text-sm text-gray-600">{location.description}</p>
              </div>
              {selectedLocation?.id === location.id && (
                <div className="w-6 h-6 bg-ocean-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}

      <div className="pt-4">
        <Button
          fullWidth
          onClick={nextStep}
          disabled={!selectedLocation}
          rightIcon={<ChevronRight className="w-5 h-5" />}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

function DateStep() {
  const { selectedDate, setDate, nextStep, prevStep } = useBookingStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const days = getCalendarDays(year, month)

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }

  const selectDate = (date) => {
    if (date && !isPastDate(date)) {
      setDate(date.toISOString())
    }
  }

  const isSelected = (date) => {
    if (!date || !selectedDate) return false
    return new Date(selectedDate).toDateString() === date.toDateString()
  }

  return (
    <div>
      <p className="text-gray-600 mb-6">When is your beach day?</p>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-sand-50 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          ←
        </button>
        <span className="font-medium text-ocean-700">{monthName}</span>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-sand-50 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          →
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => selectDate(date)}
            disabled={!date || isPastDate(date)}
            className={cn(
              'aspect-square flex items-center justify-center rounded-full text-sm transition-colors min-h-[44px]',
              !date && 'invisible',
              date && isPastDate(date) && 'text-gray-300 cursor-not-allowed',
              date && !isPastDate(date) && !isSelected(date) && 'hover:bg-sand-100 text-gray-700',
              date && isToday(date) && !isSelected(date) && 'bg-sand-100',
              isSelected(date) && 'bg-ocean-400 text-white font-semibold'
            )}
          >
            {date?.getDate()}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="bg-ocean-50 rounded-lg p-4 mb-6">
          <p className="text-ocean-700 font-medium text-center">
            {formatDate(selectedDate)}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!selectedDate}
          rightIcon={<ChevronRight className="w-5 h-5" />}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

function TimeStep() {
  const { arrivalTime, endTime, setArrivalTime, setEndTime, getDuration, nextStep, prevStep } = useBookingStore()

  const arrivalSlots = getArrivalTimeSlots()
  const endSlots = getEndTimeSlots(arrivalTime)
  const duration = getDuration()

  return (
    <div>
      <p className="text-gray-600 mb-6">What time would you like to arrive and leave?</p>

      <div className="space-y-6">
        {/* Arrival Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arrival Time
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {arrivalSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setArrivalTime(time)
                  // Reset end time if it's before new arrival + 2 hours
                  if (endTime && !endSlots.includes(endTime)) {
                    setEndTime(null)
                  }
                }}
                className={cn(
                  'py-3 px-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
                  arrivalTime === time
                    ? 'bg-ocean-400 text-white'
                    : 'bg-sand-50 text-gray-700 hover:bg-sand-100'
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departure Time
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {endSlots.length > 0 ? (
              endSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setEndTime(time)}
                  className={cn(
                    'py-3 px-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
                    endTime === time
                      ? 'bg-ocean-400 text-white'
                      : 'bg-sand-50 text-gray-700 hover:bg-sand-100'
                  )}
                >
                  {time}
                </button>
              ))
            ) : (
              <p className="col-span-4 text-sm text-gray-500 text-center py-4">
                Select an arrival time first
              </p>
            )}
          </div>
        </div>

        {/* Duration Display */}
        {duration && (
          <div className="bg-ocean-50 rounded-lg p-4">
            <p className="text-ocean-700 font-medium text-center">
              Duration: {duration}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-6">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!arrivalTime || !endTime}
          rightIcon={<ChevronRight className="w-5 h-5" />}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

function GroupStep() {
  const { groupSize, specialRequests, setGroupSize, setSpecialRequests, nextStep, prevStep } = useBookingStore()

  return (
    <div>
      <p className="text-gray-600 mb-6">Tell us about your group</p>

      {/* Group Size */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          How many people?
        </label>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
            className="w-14 h-14 rounded-full bg-sand-100 text-ocean-600 text-2xl font-bold hover:bg-sand-200 transition-colors"
          >
            −
          </button>
          <span className="text-5xl font-bold text-ocean-600 w-24 text-center">
            {groupSize}
          </span>
          <button
            onClick={() => setGroupSize(Math.min(50, groupSize + 1))}
            className="w-14 h-14 rounded-full bg-ocean-400 text-white text-2xl font-bold hover:bg-ocean-500 transition-colors"
          >
            +
          </button>
        </div>

        {groupSize >= 8 && (
          <div className="mt-4 bg-sunset-300/30 border border-sunset-400 rounded-lg p-3">
            <p className="text-sm text-center text-sunset-500">
              Groups of 8+ may want our <strong>Group Party Package</strong>!
            </p>
          </div>
        )}
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (optional)
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Anything we should know? Allergies, birthday setup, accessibility needs..."
          rows={4}
          className="input-field resize-none"
        />
      </div>

      <div className="flex gap-3 pt-6">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          onClick={nextStep}
          rightIcon={<ChevronRight className="w-5 h-5" />}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

function ZoneStep() {
  const { selectedZone, setZone, prevStep } = useBookingStore()
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/menu')
  }

  return (
    <div>
      <p className="text-gray-600 mb-6">Where would you like us to set up?</p>

      <div className="space-y-3">
        {/* No Preference Option */}
        <Card
          onClick={() => setZone(null)}
          className={cn(
            'cursor-pointer p-4 transition-all',
            selectedZone === null && 'ring-2 ring-ocean-400'
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center">
              <Map className="w-6 h-6 text-sand-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-ocean-700">No Preference</h3>
              <p className="text-sm text-gray-500">We'll pick the best available spot</p>
            </div>
            {selectedZone === null && (
              <div className="w-6 h-6 bg-ocean-400 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </Card>

        {/* Zone Options */}
        {sampleZones.map((zone) => (
          <Card
            key={zone.id}
            onClick={() => setZone(zone)}
            className={cn(
              'cursor-pointer p-4 transition-all',
              selectedZone?.id === zone.id && 'ring-2 ring-ocean-400'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center">
                <zone.icon className="w-6 h-6 text-ocean-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-ocean-700">{zone.name}</h3>
                <p className="text-sm text-gray-500">{zone.description}</p>
              </div>
              {selectedZone?.id === zone.id && (
                <div className="w-6 h-6 bg-ocean-400 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Setup area is a request and subject to availability
      </p>

      <div className="flex gap-3 pt-6">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          rightIcon={<ChevronRight className="w-5 h-5" />}
          className="flex-1"
        >
          Continue to Menu
        </Button>
      </div>
    </div>
  )
}

// Main Booking Page
export default function BookingPage() {
  const { currentStep, totalSteps } = useBookingStore()

  const stepTitles = [
    'Select Beach',
    'Choose Date',
    'Select Time',
    'Group Info',
    'Setup Area',
  ]

  const stepIcons = [MapPin, Calendar, Clock, Users, Map]
  const StepIcon = stepIcons[currentStep - 1]

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <LocationStep />
      case 2: return <DateStep />
      case 3: return <TimeStep />
      case 4: return <GroupStep />
      case 5: return <ZoneStep />
      default: return <LocationStep />
    }
  }

  return (
    <>
      <BackHeader title="Book Your Setup" />

      <PageContainer>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StepIcon className="w-5 h-5 text-ocean-500" />
              <span className="font-medium text-ocean-700">{stepTitles[currentStep - 1]}</span>
            </div>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-ocean-400 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}
      </PageContainer>

      <MobileNav />
    </>
  )
}
