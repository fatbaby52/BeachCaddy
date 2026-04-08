import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBookingStore = create(
  persist(
    (set, get) => ({
      currentStep: 1,
      totalSteps: 5,

      // Step 1: Location
      selectedLocation: null,

      // Step 2: Date
      selectedDate: null,

      // Step 3: Time
      arrivalTime: null,
      endTime: null,

      // Step 4: Group & Notes
      groupSize: 2,
      specialRequests: '',

      // Step 5: Zone
      selectedZone: null,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set(state => ({
        currentStep: Math.min(state.currentStep + 1, state.totalSteps)
      })),
      prevStep: () => set(state => ({
        currentStep: Math.max(state.currentStep - 1, 1)
      })),

      setLocation: (location) => set({ selectedLocation: location }),
      setDate: (date) => set({ selectedDate: date }),
      setArrivalTime: (time) => set({ arrivalTime: time }),
      setEndTime: (time) => set({ endTime: time }),
      setGroupSize: (size) => set({ groupSize: size }),
      setSpecialRequests: (requests) => set({ specialRequests: requests }),
      setZone: (zone) => set({ selectedZone: zone }),

      getDuration: () => {
        const { arrivalTime, endTime } = get()
        if (!arrivalTime || !endTime) return null

        const parseTime = (timeStr) => {
          const [time, period] = timeStr.split(' ')
          let [hours, minutes] = time.split(':').map(Number)
          if (period === 'PM' && hours !== 12) hours += 12
          if (period === 'AM' && hours === 12) hours = 0
          return hours * 60 + minutes
        }

        const arrivalMinutes = parseTime(arrivalTime)
        const endMinutes = parseTime(endTime)
        const durationMinutes = endMinutes - arrivalMinutes

        const hours = Math.floor(durationMinutes / 60)
        const minutes = durationMinutes % 60

        if (minutes === 0) return `${hours} hours`
        return `${hours}h ${minutes}m`
      },

      isStepComplete: (step) => {
        const state = get()
        switch (step) {
          case 1: return !!state.selectedLocation
          case 2: return !!state.selectedDate
          case 3: return !!state.arrivalTime && !!state.endTime
          case 4: return state.groupSize > 0
          case 5: return true // Zone is optional
          default: return false
        }
      },

      canProceed: () => {
        const { currentStep, isStepComplete } = get()
        return isStepComplete(currentStep)
      },

      getBookingSummary: () => {
        const state = get()
        return {
          location: state.selectedLocation,
          date: state.selectedDate,
          arrivalTime: state.arrivalTime,
          endTime: state.endTime,
          groupSize: state.groupSize,
          specialRequests: state.specialRequests,
          zone: state.selectedZone,
        }
      },

      resetBooking: () => set({
        currentStep: 1,
        selectedLocation: null,
        selectedDate: null,
        arrivalTime: null,
        endTime: null,
        groupSize: 2,
        specialRequests: '',
        selectedZone: null,
      }),
    }),
    {
      name: 'booking-storage',
    }
  )
)
