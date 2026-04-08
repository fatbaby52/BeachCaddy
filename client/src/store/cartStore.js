import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      selectedPackage: null,
      items: [], // { id, name, price, quantity, imageUrl, category }
      promoCode: null,
      discount: 0,

      setPackage: (pkg) => set({ selectedPackage: pkg }),

      clearPackage: () => set({ selectedPackage: null }),

      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(i => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },

      removeItem: (itemId) => {
        const { items } = get()
        set({ items: items.filter(i => i.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get()
        if (quantity <= 0) {
          set({ items: items.filter(i => i.id !== itemId) })
        } else {
          set({
            items: items.map(i =>
              i.id === itemId ? { ...i, quantity } : i
            )
          })
        }
      },

      applyPromoCode: (code, discountType, discountValue) => {
        set({ promoCode: code })
        const subtotal = get().getSubtotal()

        if (discountType === 'percentage') {
          set({ discount: subtotal * (discountValue / 100) })
        } else {
          set({ discount: Math.min(discountValue, subtotal) })
        }
      },

      removePromoCode: () => set({ promoCode: null, discount: 0 }),

      getSubtotal: () => {
        const { selectedPackage, items } = get()
        let total = 0

        if (selectedPackage) {
          total += selectedPackage.price
        }

        items.forEach(item => {
          total += item.price * item.quantity
        })

        return total
      },

      getServiceFee: () => {
        return get().getSubtotal() * 0.15
      },

      getTax: () => {
        const subtotal = get().getSubtotal()
        const serviceFee = get().getServiceFee()
        const discount = get().discount
        return (subtotal + serviceFee - discount) * 0.0925
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const serviceFee = get().getServiceFee()
        const tax = get().getTax()
        const discount = get().discount
        return subtotal + serviceFee + tax - discount
      },

      getItemCount: () => {
        const { selectedPackage, items } = get()
        let count = selectedPackage ? 1 : 0
        items.forEach(item => {
          count += item.quantity
        })
        return count
      },

      clearCart: () => set({
        selectedPackage: null,
        items: [],
        promoCode: null,
        discount: 0,
      }),
    }),
    {
      name: 'cart-storage',
    }
  )
)
