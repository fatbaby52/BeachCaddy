import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../services/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      signUp: async (email, password, firstName, lastName, phone) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
              }
            }
          })

          if (error) throw error

          set({ user: data.user, isLoading: false })
          return { success: true, data }
        } catch (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          set({ user: data.user, isLoading: false })
          return { success: true, data }
        } catch (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          set({ user: null, profile: null, isLoading: false })
          return { success: true }
        } catch (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
      },

      fetchProfile: async () => {
        const { user } = get()
        if (!user) return

        try {
          const response = await fetch(`/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            }
          })

          if (response.ok) {
            const profile = await response.json()
            set({ profile })
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      },

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          set({ user: session.user })
          get().fetchProfile()
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user || null })
          if (session?.user) {
            get().fetchProfile()
          } else {
            set({ profile: null })
          }
        })
      },

      isAdmin: () => {
        const { profile } = get()
        return profile?.role === 'ADMIN'
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
