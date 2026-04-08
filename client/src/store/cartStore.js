import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Service fee rate and tax rate as constants
const SERVICE_FEE_RATE = 0.15
const TAX_RATE = 0.0925

export const useCartStore = create(
  persist(
    (set, get) => ({
      selectedPackage: null,
      items: [], // { id, name, price, quantity, imageUrl, category }
      promoCode: null,
      discount: 0,

      // Cached computed values - updated when relevant state changes
      _cachedSubtotal: 0,
      _cachedServiceFee: 0,
      _cachedTax: 0,
      _cachedTotal: 0,
      _cachedItemCount: 0,

      // Internal method to recalculate all derived values at once
      _recalculate: () => {
        const { selectedPackage, items, discount } = get()

        // Calculate subtotal
        let subtotal = selectedPackage ? selectedPackage.price : 0
        let itemCount = selectedPackage ? 1 : 0

        for (let i = 0; i < items.length; i++) {
          subtotal += items[i].price * items[i].quantity
          itemCount += items[i].quantity
        }

        // Calculate derived values
        const serviceFee = subtotal * SERVICE_FEE_RATE
        const tax = (subtotal + serviceFee - discount) * TAX_RATE
        const total = subtotal + serviceFee + tax - discount

        set({
          _cachedSubtotal: subtotal,
          _cachedServiceFee: serviceFee,
          _cachedTax: tax,
          _cachedTotal: total,
          _cachedItemCount: itemCount,
        })
      },

      setPackage: (pkg) => {
        set({ selectedPackage: pkg })
        get()._recalculate()
      },

      clearPackage: () => {
        set({ selectedPackage: null })
        get()._recalculate()
      },

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
        get()._recalculate()
      },

      removeItem: (itemId) => {
        const { items } = get()
        set({ items: items.filter(i => i.id !== itemId) })
        get()._recalculate()
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
        get()._recalculate()
      },

      applyPromoCode: (code, discountType, discountValue) => {
        const subtotal = get()._cachedSubtotal || get().getSubtotal()
        let discount = 0

        if (discountType === 'percentage') {
          discount = subtotal * (discountValue / 100)
        } else {
          discount = Math.min(discountValue, subtotal)
        }

        set({ promoCode: code, discount })
        get()._recalculate()
      },

      removePromoCode: () => {
        set({ promoCode: null, discount: 0 })
        get()._recalculate()
      },

      // Optimized getters - return cached values when available
      getSubtotal: () => {
        const cached = get()._cachedSubtotal
        if (cached !== undefined && cached !== 0) return cached

        const { selectedPackage, items } = get()
        let total = selectedPackage ? selectedPackage.price : 0
        for (let i = 0; i < items.length; i++) {
          total += items[i].price * items[i].quantity
        }
        return total
      },

      getServiceFee: () => {
        const cached = get()._cachedServiceFee
        if (cached !== undefined) return cached
        return get().getSubtotal() * SERVICE_FEE_RATE
      },

      getTax: () => {
        const cached = get()._cachedTax
        if (cached !== undefined) return cached
        const subtotal = get().getSubtotal()
        const serviceFee = get().getServiceFee()
        const discount = get().discount
        return (subtotal + serviceFee - discount) * TAX_RATE
      },

      getTotal: () => {
        const cached = get()._cachedTotal
        if (cached !== undefined) return cached
        const subtotal = get().getSubtotal()
        const serviceFee = get().getServiceFee()
        const tax = get().getTax()
        const discount = get().discount
        return subtotal + serviceFee + tax - discount
      },

      getItemCount: () => {
        const cached = get()._cachedItemCount
        if (cached !== undefined) return cached

        const { selectedPackage, items } = get()
        let count = selectedPackage ? 1 : 0
        for (let i = 0; i < items.length; i++) {
          count += items[i].quantity
        }
        return count
      },

      clearCart: () => set({
        selectedPackage: null,
        items: [],
        promoCode: null,
        discount: 0,
        _cachedSubtotal: 0,
        _cachedServiceFee: 0,
        _cachedTax: 0,
        _cachedTotal: 0,
        _cachedItemCount: 0,
      }),
    }),
    {
      name: 'cart-storage',
      // Don't persist cached values
      partialize: (state) => ({
        selectedPackage: state.selectedPackage,
        items: state.items,
        promoCode: state.promoCode,
        discount: state.discount,
      }),
    }
  )
)
