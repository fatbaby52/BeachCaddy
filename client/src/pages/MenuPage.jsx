import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Plus, Minus, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { BackHeader, MobileNav, PageContainer } from '../components/layout'
import { Button, Badge } from '../components/common'
import { useCartStore } from '../store/cartStore'
import { formatCurrency, cn } from '../utils/helpers'

// Real images for packages and items
const IMAGES = {
  // Packages
  essential: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
  couples: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&q=80',
  family: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80',
  luxury: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=600&q=80',
  party: 'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=600&q=80',
  // Items
  canopy: 'https://images.unsplash.com/photo-1531722569936-825d3dd91b15?w=400&q=80',
  umbrella: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  chair: 'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=400&q=80',
  lounger: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80',
  blanket: 'https://images.unsplash.com/photo-1515876305430-f06edab8282a?w=400&q=80',
  towel: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80',
  cooler: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  snacks: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
  speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
  games: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80',
  toys: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=400&q=80',
  table: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&q=80',
  sunblock: 'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=400&q=80',
  lighting: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80',
}

const samplePackages = [
  {
    id: 'pkg-1',
    name: 'Essential',
    price: 89,
    tag: null,
    description: 'Everything you need for a simple, perfect beach day.',
    imageUrl: IMAGES.essential,
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
    name: 'Couples Retreat',
    price: 149,
    tag: 'Popular',
    description: 'Premium comfort for two with all the extras.',
    imageUrl: IMAGES.couples,
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
    name: 'Family Day',
    price: 199,
    tag: 'Best Value',
    description: 'Room for the whole family plus games and snacks.',
    imageUrl: IMAGES.family,
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
    name: 'Luxury Lounge',
    price: 349,
    tag: null,
    description: 'The ultimate premium beach experience.',
    imageUrl: IMAGES.luxury,
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
    imageUrl: IMAGES.party,
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
  { id: 'item-1', name: 'Canopy', price: 35, category: 'CANOPY', imageUrl: IMAGES.canopy },
  { id: 'item-2', name: 'Umbrella', price: 20, category: 'UMBRELLA', imageUrl: IMAGES.umbrella },
  { id: 'item-3', name: 'Beach Chair', price: 12, category: 'SEATING', imageUrl: IMAGES.chair },
  { id: 'item-4', name: 'Premium Lounger', price: 25, category: 'SEATING', imageUrl: IMAGES.lounger },
  { id: 'item-5', name: 'Blanket', price: 10, category: 'COMFORT', imageUrl: IMAGES.blanket },
  { id: 'item-6', name: 'Beach Towel', price: 8, category: 'COMFORT', imageUrl: IMAGES.towel },
  { id: 'item-7', name: 'Oversized Towel', price: 12, category: 'COMFORT', imageUrl: IMAGES.towel },
  { id: 'item-8', name: 'Small Cooler', price: 15, category: 'COOLER_ICE', imageUrl: IMAGES.cooler },
  { id: 'item-9', name: 'Large Cooler', price: 25, category: 'COOLER_ICE', imageUrl: IMAGES.cooler },
  { id: 'item-10', name: 'Bag of Ice', price: 5, category: 'COOLER_ICE', imageUrl: IMAGES.cooler },
  { id: 'item-11', name: 'Drink Pack', price: 12, category: 'FOOD_DRINK', imageUrl: IMAGES.drinks },
  { id: 'item-12', name: 'Premium Drinks', price: 25, category: 'FOOD_DRINK', imageUrl: IMAGES.drinks },
  { id: 'item-13', name: 'Snack Pack', price: 15, category: 'FOOD_DRINK', imageUrl: IMAGES.snacks },
  { id: 'item-14', name: 'Meal Tray', price: 35, category: 'FOOD_DRINK', imageUrl: IMAGES.snacks },
  { id: 'item-15', name: 'Charcuterie', price: 45, category: 'FOOD_DRINK', imageUrl: IMAGES.snacks },
  { id: 'item-16', name: 'Bluetooth Speaker', price: 15, category: 'ENTERTAINMENT', imageUrl: IMAGES.speaker },
  { id: 'item-17', name: 'Beach Games Set', price: 20, category: 'GAMES', imageUrl: IMAGES.games },
  { id: 'item-18', name: 'Kids Toy Set', price: 18, category: 'KIDS', imageUrl: IMAGES.toys },
  { id: 'item-19', name: 'Side Table', price: 15, category: 'ACCESSORIES', imageUrl: IMAGES.table },
  { id: 'item-20', name: 'Sunblock', price: 5, category: 'ACCESSORIES', imageUrl: IMAGES.sunblock },
  { id: 'item-21', name: 'Sunset Lights', price: 30, category: 'LIGHTING', imageUrl: IMAGES.lighting },
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'CANOPY', name: 'Shade' },
  { id: 'SEATING', name: 'Seating' },
  { id: 'COMFORT', name: 'Comfort' },
  { id: 'COOLER_ICE', name: 'Coolers' },
  { id: 'FOOD_DRINK', name: 'Food & Drink' },
  { id: 'ENTERTAINMENT', name: 'Fun' },
]

// Package Card Component
function PackageCard({ pkg, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn(
      'overflow-hidden transition-all border-2 bg-white',
      isSelected ? 'border-ocean-500 shadow-lg' : 'border-sand-200'
    )}>
      <div className="relative">
        <img
          src={pkg.imageUrl}
          alt={pkg.name}
          className="w-full h-48 object-cover"
        />
        {pkg.tag && (
          <span className="absolute top-3 left-3 badge badge-coral">
            {pkg.tag}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl text-ocean-800" style={{ fontFamily: 'var(--font-display)' }}>
              {pkg.name}
            </h3>
            <p className="text-warm-600 text-sm mt-1">{pkg.description}</p>
          </div>
          <span className="text-2xl font-medium text-ocean-700 ml-4">
            {formatCurrency(pkg.price)}
          </span>
        </div>

        {/* What's Included */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-ocean-600 font-medium mb-4"
        >
          What's Included
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <ul className="bg-sand-50 p-4 mb-4 space-y-2">
            {pkg.items.map((item, idx) => (
              <li key={idx} className="text-sm text-warm-700 flex items-center gap-2">
                <Check className="w-4 h-4 text-ocean-500 flex-shrink-0" />
                {item.quantity}x {item.name}
              </li>
            ))}
          </ul>
        )}

        <Button
          fullWidth
          variant={isSelected ? 'outline' : 'primary'}
          onClick={() => onSelect(pkg)}
        >
          {isSelected ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Selected
            </>
          ) : (
            'Select Package'
          )}
        </Button>
      </div>
    </div>
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
    <div className="overflow-hidden border border-sand-200 bg-white">
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-28 object-cover"
        />
        {quantity > 0 && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-ocean-600 text-white text-xs font-bold flex items-center justify-center">
            {quantity}
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-medium text-ocean-800 text-sm truncate">{item.name}</h4>
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-ocean-700">{formatCurrency(item.price)}</span>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-8 h-8 bg-ocean-600 text-white flex items-center justify-center hover:bg-ocean-700 transition-colors"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="w-7 h-7 bg-sand-200 text-ocean-700 flex items-center justify-center hover:bg-sand-300 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="w-7 h-7 bg-ocean-600 text-white flex items-center justify-center hover:bg-ocean-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
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
    <div className="fixed bottom-20 left-4 right-4 max-w-xl mx-auto z-30">
      <div className="bg-ocean-800 text-white p-4 flex items-center justify-between shadow-dramatic">
        <div className="flex items-center gap-4">
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-coral-500 text-white text-xs font-bold flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="font-medium text-lg">{formatCurrency(subtotal)}</span>
        </div>
        <Button
          onClick={() => navigate('/checkout')}
          className="bg-white text-ocean-800 hover:bg-sand-100"
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

      <main id="main-content" className="pb-36">
        {/* Tab Toggle - with proper ARIA roles */}
        <div className="sticky top-14 z-20 bg-sand-50 border-b border-sand-200 px-5 py-4">
          <div
            className="flex border border-sand-300 max-w-md mx-auto"
            role="tablist"
            aria-label="Menu options"
          >
            <button
              onClick={() => setTab('packages')}
              role="tab"
              aria-selected={tab === 'packages'}
              aria-controls="packages-panel"
              id="packages-tab"
              className={cn(
                'flex-1 py-3 px-4 text-sm font-medium transition-all',
                tab === 'packages'
                  ? 'bg-ocean-700 text-white'
                  : 'bg-white text-warm-700 hover:bg-sand-50'
              )}
            >
              Packages
            </button>
            <button
              onClick={() => setTab('items')}
              role="tab"
              aria-selected={tab === 'items'}
              aria-controls="items-panel"
              id="items-tab"
              className={cn(
                'flex-1 py-3 px-4 text-sm font-medium transition-all',
                tab === 'items'
                  ? 'bg-ocean-700 text-white'
                  : 'bg-white text-warm-700 hover:bg-sand-50'
              )}
            >
              Build Your Own
            </button>
          </div>
        </div>

        {/* Tab Panels */}
        <div className="px-5 pt-6 max-w-xl mx-auto">
          {tab === 'packages' ? (
            <section
              role="tabpanel"
              id="packages-panel"
              aria-labelledby="packages-tab"
            >
              <p className="text-warm-600 mb-6">
                Choose a curated package or build your own setup
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
            </section>
          ) : (
            <section
              role="tabpanel"
              id="items-panel"
              aria-labelledby="items-tab"
            >
              {/* Category Filter */}
              <nav aria-label="Item categories" className="overflow-x-auto no-scrollbar -mx-5 px-5 mb-6">
                <div className="flex gap-2 min-w-max">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      aria-pressed={selectedCategory === cat.id}
                      className={cn(
                        'px-4 py-2 text-sm font-medium transition-all whitespace-nowrap border',
                        selectedCategory === cat.id
                          ? 'bg-ocean-700 text-white border-ocean-700'
                          : 'bg-white text-warm-700 border-sand-300 hover:border-ocean-400'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Items Grid */}
              <div className="grid grid-cols-2 gap-4" role="list" aria-label="Available items">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <FloatingCart />
      <MobileNav />
    </>
  )
}
