import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Save, Plus, Trash2, MapPin, Calendar } from 'lucide-react'
import { Card, Badge, Button, Modal } from '../../components/common'

function AdminNav() {
  return (
    <nav className="bg-ocean-700 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin" className="font-display text-xl">
            ShoreReady Admin
          </Link>
          <div className="flex gap-6">
            <Link to="/admin" className="hover:text-ocean-200">Dashboard</Link>
            <Link to="/admin/bookings" className="hover:text-ocean-200">Bookings</Link>
            <Link to="/admin/menu" className="hover:text-ocean-200">Menu</Link>
            <Link to="/admin/inventory" className="hover:text-ocean-200">Inventory</Link>
            <Link to="/admin/settings" className="text-white font-medium">Settings</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Sample data
const promoCodes = [
  { id: 1, code: 'FIRSTBEACH', type: 'percentage', value: 20, isActive: true, uses: 45 },
  { id: 2, code: 'SUMMER10', type: 'fixed', value: 10, isActive: true, uses: 123 },
  { id: 3, code: 'WELCOME', type: 'percentage', value: 15, isActive: true, uses: 89 },
]

const beachLocations = [
  { id: 1, name: 'Seacliff State Beach', address: 'Seacliff, CA', isActive: true },
  { id: 2, name: 'Sunset State Beach', address: 'Watsonville, CA', isActive: true },
  { id: 3, name: 'Manresa State Beach', address: 'La Selva Beach, CA', isActive: true },
]

export default function AdminSettings() {
  const [serviceFee, setServiceFee] = useState(15)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-ocean-700 mb-8">Settings</h1>

        {/* General Settings */}
        <Card className="mb-6">
          <div className="p-4 border-b border-sand-100">
            <h2 className="font-display text-xl text-ocean-700">General Settings</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Fee Percentage
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="input-field w-24"
                  min="0"
                  max="100"
                />
                <span className="text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Applied to all orders for setup & delivery
              </p>
            </div>

            <div className="pt-4">
              <Button leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

        {/* Promo Codes */}
        <Card className="mb-6">
          <div className="p-4 border-b border-sand-100 flex items-center justify-between">
            <h2 className="font-display text-xl text-ocean-700">Promo Codes</h2>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowPromoModal(true)}
            >
              Add Code
            </Button>
          </div>
          <div className="divide-y divide-sand-50">
            {promoCodes.map((promo) => (
              <div key={promo.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-mono font-bold text-ocean-600">{promo.code}</p>
                  <p className="text-sm text-gray-500">
                    {promo.type === 'percentage' ? `${promo.value}% off` : `$${promo.value} off`}
                    {' · '}{promo.uses} uses
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={promo.isActive ? 'success' : 'sand'}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Beach Locations */}
        <Card className="mb-6">
          <div className="p-4 border-b border-sand-100 flex items-center justify-between">
            <h2 className="font-display text-xl text-ocean-700">Beach Locations</h2>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowLocationModal(true)}
            >
              Add Location
            </Button>
          </div>
          <div className="divide-y divide-sand-50">
            {beachLocations.map((location) => (
              <div key={location.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ocean-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-ocean-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={location.isActive ? 'success' : 'sand'}>
                    {location.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <button className="p-2 text-ocean-500 hover:bg-ocean-50 rounded-lg transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Unavailable Dates */}
        <Card>
          <div className="p-4 border-b border-sand-100 flex items-center justify-between">
            <h2 className="font-display text-xl text-ocean-700">Unavailable Dates</h2>
            <Button size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
              Block Date
            </Button>
          </div>
          <div className="p-4">
            <p className="text-gray-500 text-center py-8">
              No blocked dates. Click "Block Date" to mark dates as unavailable.
            </p>
          </div>
        </Card>
      </div>

      {/* Add Promo Code Modal */}
      <Modal
        isOpen={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        title="Add Promo Code"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input type="text" className="input-field font-mono uppercase" placeholder="SUMMERSALE" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="input-field">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input type="number" className="input-field" placeholder="20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (optional)</label>
              <input type="number" className="input-field" placeholder="Unlimited" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires (optional)</label>
              <input type="date" className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowPromoModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Create Code</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
