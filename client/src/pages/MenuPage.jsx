import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Plus, Minus, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { BackHeader, MobileNav, PageContainer } from '../components/layout'
import { Button, Card, CardImage, CardBody, Badge } from '../components/common'
import { useCartStore } from '../store/cartStore'
import { formatCurrency, cn } from '../utils/helpers'

// Sample data (will be fetched from API)
const samplePackages = [
  {
    id: 'pkg-1',
    name: 'Basic Beach Day',
    price: 89,
    tag: null,
    description: 'Everything you need for a simple, perfect beach day.',
    imageUrl: null,
    items: [
      { name: 'Umbrella', quantity: 1 },
      { name: 'Beach Chairs', quantity: 2 },
      { name: 'Cooler with Ice', quantity: 1 },
      { name: 'Beach Towels', quantity: 2 },
      { name: 'Sunblock', quantity: 1 },
    ],
  },
  {
    id: 'pkg-2',
    name: 'Couples Relaxation',
    price: 149,
    tag: 'Most Popular',
    description: 'Premium comfort for two with all the extras.',
    imageUrl: null,
    items: [
      { name: 'Canopy', quantity: 1 },
      { name: 'Premium Loungers', quantity: 2 },
      { name: 'Cooler with Ice & Drinks', quantity: 1 },
      { name: 'Beach Towels', quantity: 2 },
      { name: 'Bluetooth Speaker', quantity: 1 },
      { name: 'Sunblock', quantity: 1 },
    ],
  },
  {
    id: 'pkg-3',
    name: 'Family Fun',
    price: 199,
    tag: 'Best Value',
    description: 'Room for the whole family plus games and snacks.',
    imageUrl: null,
    items: [
      { name: 'Large Canopy', quantity: 1 },
      { name: 'Beach Chairs', quantity: 4 },
      { name: 'Large Cooler with Ice & Drinks', quantity: 1 },
      { name: 'Beach Towels', quantity: 4 },
      { name: 'Kids Beach Toy Set', quantity: 1 },
      { name: 'Beach Games', quantity: 1 },
      { name: 'Sunblock', quantity: 1 },
      { name: 'Snack Pack', quantity: 1 },
    ],
  },
  {
    id: 'pkg-4',
    name: 'Luxury Beach Lounge',
    price: 349,
    tag: null,
    description: 'The ultimate premium beach experience.',
    imageUrl: null,
    items: [
      { name: 'Premium Canopy', quantity: 1 },
      { name: 'Premium Loungers', quantity: 4 },
      { name: 'Side Table', quantity: 1 },
      { name: 'Large Cooler with Premium Drinks', quantity: 1 },
      { name: 'Oversized Towels', quantity: 4 },
      { name: 'Bluetooth Speaker', quantity: 1 },
      { name: 'Charcuterie Tray', quantity: 1 },
      { name: 'Sunblock', quantity: 1 },
      { name: 'Blankets', quantity: 2 },
    ],
  },
  {
    id: 'pkg-5',
    name: 'Group Party',
    price: 499,
    tag: null,
    description: 'Perfect for groups of 8+ celebrating together.',
    imageUrl: null,
    items: [
      { name: 'Large Canopies', quantity: 2 },
      { name: 'Beach Chairs', quantity: 10 },
      { name: 'Tables', quantity: 2 },
      { name: 'Large Coolers with Ice & Drinks', quantity: 2 },
      { name: 'Beach Towels', quantity: 10 },
      { name: 'Bluetooth Speaker', quantity: 1 },
      { name: 'Beach Games', quantity: 1 },
      { name: 'Snack Trays', quantity: 2 },
      { name: 'Sunblock', quantity: 2 },
      { name: 'Sunset Lighting Kit', quantity: 1 },
    ],
  },
]

const sampleItems = [
  { id: 'item-1', name: 'Canopy', price: 35, category: 'CANOPY', imageUrl: null },
  { id: 'item-2', name: 'Umbrella', price: 20, category: 'UMBRELLA', imageUrl: null },
  { id: 'item-3', name: 'Beach Chair', price: 12, category: 'SEATING', imageUrl: null },
  { id: 'item-4', name: 'Premium Lounger', price: 25, category: 'SEATING', imageUrl: null },
  { id: 'item-5', name: 'Blanket', price: 10, category: 'COMFORT', imageUrl: null },
  { id: 'item-6', name: 'Beach Towel', price: 8, category: 'COMFORT', imageUrl: null },
  { id: 'item-7', name: 'Oversized Towel', price: 12, category: 'COMFORT', imageUrl: null },
  { id: 'item-8', name: 'Small Cooler', price: 15, category: 'COOLER_ICE', imageUrl: null },
  { id: 'item-9', name: 'Large Cooler', price: 25, category: 'COOLER_ICE', imageUrl: null },
  { id: 'item-10', name: 'Bag of Ice', price: 5, category: 'COOLER_ICE', imageUrl: null },
  { id: 'item-11', name: 'Drink Pack', price: 12, category: 'FOOD_DRINK', imageUrl: null },
  { id: 'item-12', name: 'Premium Drink Pack', price: 25, category: 'FOOD_DRINK', imageUrl: null },
  { id: 'item-13', name: 'Snack Pack', price: 15, category: 'FOOD_DRINK', imageUrl: null },
  { id: 'item-14', name: 'Meal Tray', price: 35, category: 'FOOD_DRINK', imageUrl: null },
  { id: 'item-15', name: 'Charcuterie Tray', price: 45, category: 'FOOD_DRINK', imageUrl: null },
  { id: 'item-16', name: 'Bluetooth Speaker', price: 15, category: 'ENTERTAINMENT', imageUrl: null },
  { id: 'item-17', name: 'Beach Games Set', price: 20, category: 'GAMES', imageUrl: null },
  { id: 'item-18', name: 'Kids Beach Toy Set', price: 18, category: 'KIDS', imageUrl: null },
  { id: 'item-19', name: 'Side Table', price: 15, category: 'ACCESSORIES', imageUrl: null },
  { id: 'item-20', name: 'Sunblock', price: 5, category: 'ACCESSORIES', imageUrl: null },
  { id: 'item-21', name: 'Sunset Lighting Kit', price: 30, category: 'LIGHTING', imageUrl: null },
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'CANOPY', name: 'Shade' },
  { id: 'SEATING', name: 'Seating' },
  { id: 'COMFORT', name: 'Comfort' },
  { id: 'COOLER_ICE', name: 'Coolers' },
  { id: 'FOOD_DRINK', name: 'Food & Drink' },
  { id: 'ENTERTAINMENT', name: 'Entertainment' },
  { id: 'KIDS', name: 'Kids' },
  { id: 'GAMES', name: 'Games' },
]

// Package Card Component
function PackageCard({ pkg, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card elevated className={cn(
      'overflow-hidden transition-all',
      isSelected && 'ring-2 ring-ocean-400'
    )}>
      <CardImage src={pkg.imageUrl} alt={pkg.name} className="h-48" />
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl text-ocean-700">{pkg.name}</h3>
            {pkg.tag && (
              <Badge variant={pkg.tag === 'Most Popular' ? 'coral' : 'ocean'} className="mt-1">
                {pkg.tag}
              </Badge>
            )}
          </div>
          <span className="text-2xl font-bold text-ocean-600">{formatCurrency(pkg.price)}</span>
        </div>

        <p className="text-gray-600">{pkg.description}</p>

        {/* What's Included */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-ocean-500 font-medium"
        >
          What's Included
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <ul className="bg-sand-50 rounded-lg p-3 space-y-1">
            {pkg.items.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                <Check className="w-4 h-4 text-ocean-500" />
                {item.quantity}x {item.name}
              </li>
            ))}
          </ul>
        )}

        <Button
          fullWidth
          variant={isSelected ? 'outline' : 'primary'}
          onClick={() => onSelect(pkg)}
          leftIcon={isSelected ? <Check className="w-5 h-5" /> : null}
        >
          {isSelected ? 'Selected' : 'Add to Order'}
        </Button>
      </CardBody>
    </Card>
  )
}

// Item Card Component
function ItemCard({ item }) {
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
    })
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <CardImage src={item.imageUrl} alt={item.name} className="h-32" />
        {quantity > 0 && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-ocean-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
              className="w-8 h-8 bg-ocean-400 text-white rounded-full flex items-center justify-center hover:bg-ocean-500 transition-colors"
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
                className="w-7 h-7 bg-ocean-400 text-white rounded-full flex items-center justify-center hover:bg-ocean-500 transition-colors"
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
      <div className="bg-ocean-600 text-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <Button
          onClick={() => navigate('/checkout')}
          className="bg-white text-ocean-600 hover:bg-sand-50"
        >
          View Cart
        </Button>
      </div>
    </div>
  )
}

// Main Menu Page
export default function MenuPage() {
  const [tab, setTab] = useState('packages')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { selectedPackage, setPackage, clearPackage } = useCartStore()

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return sampleItems
    return sampleItems.filter(item => item.category === selectedCategory)
  }, [selectedCategory])

  const handleSelectPackage = (pkg) => {
    if (selectedPackage?.id === pkg.id) {
      clearPackage()
    } else {
      setPackage(pkg)
    }
  }

  return (
    <>
      <BackHeader title="Build Your Setup" />

      <div className="pb-36">
        {/* Tab Toggle */}
        <div className="sticky top-14 z-20 bg-white/80 backdrop-blur-md border-b border-sand-100 px-4 py-3">
          <div className="flex bg-sand-100 rounded-full p-1 max-w-md mx-auto">
            <button
              onClick={() => setTab('packages')}
              className={cn(
                'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors',
                tab === 'packages'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-gray-600 hover:text-ocean-500'
              )}
            >
              Packages
            </button>
            <button
              onClick={() => setTab('items')}
              className={cn(
                'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors',
                tab === 'items'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-gray-600 hover:text-ocean-500'
              )}
            >
              Build Your Own
            </button>
          </div>
        </div>

        <PageContainer noPadding className="px-4 pt-6">
          {tab === 'packages' ? (
            <>
              <p className="text-gray-600 mb-6">
                Choose a package or build your own setup below
              </p>

              <div className="space-y-6">
                {samplePackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    isSelected={selectedPackage?.id === pkg.id}
                    onSelect={handleSelectPackage}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Category Filter */}
              <div className="overflow-x-auto no-scrollbar -mx-4 px-4 mb-6">
                <div className="flex gap-2 min-w-max">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                        selectedCategory === cat.id
                          ? 'bg-ocean-400 text-white'
                          : 'bg-sand-100 text-gray-600 hover:bg-sand-200'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </PageContainer>
      </div>

      <FloatingCart />
      <MobileNav />
    </>
  )
}
