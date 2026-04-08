import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Clock, Users, Map, Check, ChevronRight, Waves, TreePalm, Car, Sun, Users2 } from 'lucide-react'
import { BackHeader, MobileNav, PageContainer } from '../components/layout'
import { Button, Card, CardBody, LoadingSpinner } from '../components/common'
import { useBookingStore } from '../store/bookingStore'
import { formatDate, getCalendarDays, isPastDate, isToday, getArrivalTimeSlots, getEndTimeSlots, cn } from '../utils/helpers'

// Real beach images
const BEACH_IMAGES = {
  seacliff: 'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=800&q=80',
  sunset: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&q=80',
  manresa: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80',
}

const sampleLocations = [
  {
    id: '1',
    name: 'Seacliff State Beach',
    description: 'Famous for the concrete ship SS Palo Alto. Great for families.',
    address: 'Seacliff, CA',
    imageUrl: BEACH_IMAGES.seacliff,
  },
  {
    id: '2',
    name: 'Sunset State Beach',
    description: 'Beautiful sunsets and wide sandy beach. Perfect for groups.',
    address: 'Watsonville, CA',
    imageUrl: BEACH_IMAGES.sunset,
  },
  {
    id: '3',
    name: 'Manresa State Beach',
    description: 'Quieter beach with great surfing. Ideal for relaxation.',
    address: 'La Selva Beach, CA',
    imageUrl: BEACH_IMAGES.manresa,
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
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl text-ocean-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Choose your beach
        </h2>
        <p className="text-warm-600">Select where you'd like us to set up</p>
      </div>

      {sampleLocations.map((location) => (
        <button
          key={location.id}
          onClick={() => setLocation(location)}
          className={cn(
            'w-full text-left transition-all duration-300',
            'border-2 overflow-hidden bg-white',
            selectedLocation?.id === location.id
              ? 'border-ocean-500 shadow-lg'
              : 'border-sand-200 hover:border-sand-300'
          )}
        >
          <div className="flex">
            <img
              src={location.imageUrl}
              alt={location.name}
              className="w-32 h-32 object-cover flex-shrink-0"
            />
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-ocean-800 text-lg">{location.name}</h3>
                  <p className="text-sm text-warm-500 mb-2">{location.address}</p>
                  <p className="text-sm text-warm-600">{location.description}</p>
                </div>
                {selectedLocation?.id === location.id && (
                  <div className="w-6 h-6 bg-ocean-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}

      <div className="pt-6">
        <Button
          fullWidth
          onClick={nextStep}
          disabled={!selectedLocation}
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
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
      <div className="mb-8">
        <h2 className="text-2xl text-ocean-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Pick your date
        </h2>
        <p className="text-warm-600">When's your beach day?</p>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 bg-white border border-sand-200 p-4">
        <button
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="p-2 hover:bg-sand-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-ocean-600" />
        </button>
        <span className="font-medium text-ocean-800 text-lg">{monthName}</span>
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          className="p-2 hover:bg-sand-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 text-ocean-600" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-sm text-warm-500 py-2 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-8">
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => selectDate(date)}
            disabled={!date || isPastDate(date)}
            className={cn(
              'aspect-square flex items-center justify-center text-sm transition-all min-h-[44px]',
              !date && 'invisible',
              date && isPastDate(date) && 'text-sand-300 cursor-not-allowed',
              date && !isPastDate(date) && !isSelected(date) && 'hover:bg-ocean-50 text-warm-700',
              date && isToday(date) && !isSelected(date) && 'bg-sand-100 font-medium',
              isSelected(date) && 'bg-ocean-600 text-white font-semibold'
            )}
          >
            {date?.getDate()}
          </button>
        ))}
      </div>

      {selectedDate && (
        <div className="bg-ocean-50 border border-ocean-200 p-4 mb-8">
          <p className="text-ocean-800 font-medium text-center">
            {formatDate(selectedDate)}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!selectedDate}
          className="flex-1"
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
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
      <div className="mb-8">
        <h2 className="text-2xl text-ocean-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Select your time
        </h2>
        <p className="text-warm-600">When should we have everything ready?</p>
      </div>

      <div className="space-y-8">
        {/* Arrival Time */}
        <div>
          <label className="block text-sm font-medium text-ocean-800 mb-3">
            Arrival Time
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {arrivalSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setArrivalTime(time)
                  if (endTime && !endSlots.includes(endTime)) {
                    setEndTime(null)
                  }
                }}
                className={cn(
                  'py-3 px-2 text-sm font-medium transition-all min-h-[44px] border',
                  arrivalTime === time
                    ? 'bg-ocean-600 text-white border-ocean-600'
                    : 'bg-white text-warm-700 border-sand-200 hover:border-ocean-300'
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-ocean-800 mb-3">
            Departure Time
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {endSlots.length > 0 ? (
              endSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setEndTime(time)}
                  className={cn(
                    'py-3 px-2 text-sm font-medium transition-all min-h-[44px] border',
                    endTime === time
                      ? 'bg-ocean-600 text-white border-ocean-600'
                      : 'bg-white text-warm-700 border-sand-200 hover:border-ocean-300'
                  )}
                >
                  {time}
                </button>
              ))
            ) : (
              <p className="col-span-4 text-sm text-warm-500 text-center py-4">
                Select an arrival time first
              </p>
            )}
          </div>
        </div>

        {/* Duration Display */}
        {duration && (
          <div className="bg-ocean-50 border border-ocean-200 p-4">
            <p className="text-ocean-800 font-medium text-center">
              Duration: {duration}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-8">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!arrivalTime || !endTime}
          className="flex-1"
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function GroupStep() {
  const { groupSize, specialRequests, setGroupSize, setSpecialRequests, nextStep, prevStep } = useBookingStore()

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-ocean-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Your group
        </h2>
        <p className="text-warm-600">Tell us who's coming</p>
      </div>

      {/* Group Size */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-ocean-800 mb-6">
          How many people?
        </label>
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
            className="w-14 h-14 border-2 border-sand-300 text-ocean-600 text-2xl font-medium hover:border-ocean-400 transition-colors flex items-center justify-center"
            aria-label="Decrease group size"
          >
            −
          </button>
          <span className="text-6xl font-light text-ocean-700 w-24 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            {groupSize}
          </span>
          <button
            onClick={() => setGroupSize(Math.min(50, groupSize + 1))}
            className="w-14 h-14 bg-ocean-600 text-white text-2xl font-medium hover:bg-ocean-700 transition-colors flex items-center justify-center"
            aria-label="Increase group size"
          >
            +
          </button>
        </div>

        {groupSize >= 8 && (
          <div className="mt-6 bg-sunset-200 border border-sunset-300 p-4">
            <p className="text-sm text-center text-sunset-500 font-medium">
              Groups of 8+ may want our Group Party Package!
            </p>
          </div>
        )}
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-ocean-800 mb-3">
          Special Requests <span className="text-warm-500 font-normal">(optional)</span>
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Anything we should know? Allergies, birthday setup, accessibility needs..."
          rows={4}
          className="input-field resize-none"
        />
      </div>

      <div className="flex gap-4 pt-8">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
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
      <div className="mb-8">
        <h2 className="text-2xl text-ocean-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Setup location
        </h2>
        <p className="text-warm-600">Where on the beach should we set up?</p>
      </div>

      <div className="space-y-3">
        {/* No Preference Option */}
        <button
          onClick={() => setZone(null)}
          className={cn(
            'w-full p-4 transition-all border-2 bg-white text-left',
            selectedZone === null ? 'border-ocean-500' : 'border-sand-200 hover:border-sand-300'
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sand-100 flex items-center justify-center flex-shrink-0">
              <Map className="w-6 h-6 text-sand-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-ocean-800">No Preference</h3>
              <p className="text-sm text-warm-600">We'll pick the best available spot</p>
            </div>
            {selectedZone === null && (
              <div className="w-6 h-6 bg-ocean-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </button>

        {/* Zone Options */}
        {sampleZones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setZone(zone)}
            className={cn(
              'w-full p-4 transition-all border-2 bg-white text-left',
              selectedZone?.id === zone.id ? 'border-ocean-500' : 'border-sand-200 hover:border-sand-300'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ocean-50 flex items-center justify-center flex-shrink-0">
                <zone.icon className="w-6 h-6 text-ocean-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-ocean-800">{zone.name}</h3>
                <p className="text-sm text-warm-600">{zone.description}</p>
              </div>
              {selectedZone?.id === zone.id && (
                <div className="w-6 h-6 bg-ocean-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-warm-500 text-center mt-6">
        Setup area is a request and subject to availability
      </p>

      <div className="flex gap-4 pt-8">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinue} className="flex-1">
          Continue to Menu
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}

// Main Booking Page
export default function BookingPage() {
  const { currentStep, totalSteps } = useBookingStore()

  const stepTitles = ['Beach', 'Date', 'Time', 'Group', 'Zone']
  const stepIcons = [MapPin, Calendar, Clock, Users, Map]

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

      <main id="main-content">
        <PageContainer>
          {/* Progress Steps - with ARIA for screen readers */}
          <nav aria-label="Booking progress" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {stepTitles.map((title, i) => {
              const StepIcon = stepIcons[i]
              const isActive = currentStep === i + 1
              const isComplete = currentStep > i + 1

              return (
                <div key={title} className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      'w-10 h-10 flex items-center justify-center mb-2 transition-all',
                      isActive && 'bg-ocean-600 text-white',
                      isComplete && 'bg-ocean-100 text-ocean-600',
                      !isActive && !isComplete && 'bg-sand-100 text-sand-400'
                    )}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-ocean-700' : 'text-warm-500'
                  )}>
                    {title}
                  </span>
                </div>
              )
            })}
          </div>

            {/* Progress Bar */}
            <div
              className="h-1 bg-sand-200"
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Step ${currentStep} of ${totalSteps}: ${stepTitles[currentStep - 1]}`}
            >
              <div
                className="h-full bg-ocean-500 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
          </nav>

          {/* Step Content */}
          <section aria-live="polite">
            {renderStep()}
          </section>
        </PageContainer>
      </main>

      <MobileNav />
    </>
  )
}
