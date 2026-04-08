import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Minus, ShoppingBag } from 'lucide-react'
import { BackHeader, MobileNav, PageContainer } from '../components/layout'
import { Button, Card, CardImage, CardBody } from '../components/common'
import { useCartStore } from '../store/cartStore'
import { formatCurrency, cn } from '../utils/helpers'

// Sample add-ons (will be fetched from API)
const addOnItems = [
  { id: 'addon-1', name: 'Extra Chair', price: 12, category: 'SEATING', imageUrl: null },
  { id: 'addon-2', name: 'Extra Lounger', price: 25, category: 'SEATING', imageUrl: null },
  { id: 'addon-3', name: 'Extra Cooler', price: 15, category: 'COOLER', imageUrl: null },
  { id: 'addon-4', name: 'Food Package Upgrade', price: 25, category: 'FOOD', imageUrl: null },
  { id: 'addon-5', name: 'Charcuterie Tray', price: 45, category: 'FOOD', imageUrl: null },
  { id: 'addon-6', name: 'Fruit Platter', price: 30, category: 'FOOD', imageUrl: null },
  { id: 'addon-7', name: 'Extra Towels (4 pack)', price: 20, category: 'COMFORT', imageUrl: null },
  { id: 'addon-8', name: 'Extra Blanket', price: 10, category: 'COMFORT', imageUrl: null },
  { id: 'addon-9', name: 'Bluetooth Speaker', price: 15, category: 'ENTERTAINMENT', imageUrl: null },
  { id: 'addon-10', name: 'Beach Games Set', price: 20, category: 'ENTERTAINMENT', imageUrl: null },
  { id: 'addon-11', name: 'Sunset Lighting Kit', price: 30, category: 'ATMOSPHERE', imageUrl: null },
  { id: 'addon-12', name: 'Kids Beach Toy Set', price: 18, category: 'KIDS', imageUrl: null },
  { id: 'addon-13', name: 'Sand Castle Kit', price: 12, category: 'KIDS', imageUrl: null },
  { id: 'addon-14', name: 'Extra Ice', price: 5, category: 'COOLER', imageUrl: null },
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'COMFORT', name: 'Extra Comfort' },
  { id: 'FOOD', name: 'Food & Drink' },
  { id: 'ENTERTAINMENT', name: 'Entertainment' },
  { id: 'KIDS', name: 'Kids' },
  { id: 'ATMOSPHERE', name: 'Atmosphere' },
]

// Add-on Card Component
function AddOnCard({ item }) {
  const { items, addItem, updateQuantity } = useCartStore()
  const cartItem = items.find(i => i.id === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      category: item.category,
      isAddOn: true,
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <CardImage src={item.imageUrl} alt={item.name} className="h-32" />
        {quantity > 0 && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-coral-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {quantity}
          </div>
        )}
      </div>
      <CardBody className="p-3">
        <h4 className="font-medium text-ocean-700 truncate">{item.name}</h4>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-ocean-600">{formatCurrency(item.price)}</span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-8 h-8 bg-coral-500 text-white rounded-full flex items-center justify-center hover:bg-coral-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="w-7 h-7 bg-sand-100 text-ocean-600 rounded-full flex items-center justify-center hover:bg-sand-200 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="w-7 h-7 bg-coral-500 text-white rounded-full flex items-center justify-center hover:bg-coral-400 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

// Floating Cart Bar
function FloatingCart() {
  const navigate = useNavigate()
  const { getItemCount, getSubtotal, selectedPackage } = useCartStore()

  const itemCount = getItemCount()
  const subtotal = getSubtotal()

  if (itemCount === 0 && !selectedPackage) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-30">
      <div className="bg-coral-500 text-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-coral-500 text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <Button
          onClick={() => navigate('/checkout')}
          className="bg-white text-coral-500 hover:bg-sand-50"
        >
          View Cart
        </Button>
      </div>
    </div>
  )
}

// Main Add-Ons Page
export default function AddOnsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return addOnItems
    return addOnItems.filter(item => item.category === selectedCategory)
  }, [selectedCategory])

  return (
    <>
      <BackHeader title="Add-Ons" />

      <div className="pb-36">
        {/* Category Filter */}
        <div className="sticky top-14 z-20 bg-white/80 backdrop-blur-md border-b border-sand-100 px-4 py-3">
          <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                    selectedCategory === cat.id
                      ? 'bg-coral-500 text-white'
                      : 'bg-sand-100 text-gray-600 hover:bg-sand-200'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <PageContainer noPadding className="px-4 pt-6">
          <h2 className="font-display text-2xl text-ocean-700 mb-2">
            Make It Even Better
          </h2>
          <p className="text-gray-600 mb-6">Add a little something extra</p>

          {/* Items Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <AddOnCard key={item.id} item={item} />
            ))}
          </div>
        </PageContainer>
      </div>

      <FloatingCart />
      <MobileNav />
    </>
  )
}
