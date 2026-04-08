import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Image, ChevronDown } from 'lucide-react'
import { Card, Badge, Button, Modal } from '../../components/common'
import { formatCurrency } from '../../utils/helpers'

// Sample data
const menuItems = [
  { id: 1, name: 'Beach Umbrella', price: 20, category: 'UMBRELLA', isActive: true, isAddOn: false },
  { id: 2, name: 'Canopy', price: 35, category: 'CANOPY', isActive: true, isAddOn: false },
  { id: 3, name: 'Beach Chair', price: 12, category: 'SEATING', isActive: true, isAddOn: false },
  { id: 4, name: 'Premium Lounger', price: 25, category: 'SEATING', isActive: true, isAddOn: false },
  { id: 5, name: 'Beach Towel', price: 8, category: 'COMFORT', isActive: true, isAddOn: true },
  { id: 6, name: 'Bluetooth Speaker', price: 15, category: 'ENTERTAINMENT', isActive: true, isAddOn: true },
  { id: 7, name: 'Small Cooler', price: 15, category: 'COOLER_ICE', isActive: true, isAddOn: false },
]

const packages = [
  { id: 1, name: 'Basic Beach Day', price: 89, tag: null, isActive: true },
  { id: 2, name: 'Couples Relaxation', price: 149, tag: 'Most Popular', isActive: true },
  { id: 3, name: 'Family Fun', price: 199, tag: 'Best Value', isActive: true },
  { id: 4, name: 'Luxury Beach Lounge', price: 349, tag: null, isActive: true },
  { id: 5, name: 'Group Party', price: 499, tag: null, isActive: true },
]

const categories = [
  'UMBRELLA', 'CANOPY', 'SEATING', 'COMFORT', 'COOLER_ICE',
  'FOOD_DRINK', 'ENTERTAINMENT', 'KIDS', 'GAMES', 'ACCESSORIES', 'LIGHTING'
]

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
            <Link to="/admin/menu" className="text-white font-medium">Menu</Link>
            <Link to="/admin/inventory" className="hover:text-ocean-200">Inventory</Link>
            <Link to="/admin/settings" className="hover:text-ocean-200">Settings</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function AdminMenu() {
  const [tab, setTab] = useState('items')
  const [showItemModal, setShowItemModal] = useState(false)
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-ocean-700">Menu Manager</h1>
          <Button
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => tab === 'items' ? setShowItemModal(true) : setShowPackageModal(true)}
          >
            Add {tab === 'items' ? 'Item' : 'Package'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex bg-sand-100 rounded-full p-1 mb-6 w-fit">
          <button
            onClick={() => setTab('items')}
            className={`py-2 px-6 rounded-full text-sm font-medium transition-colors ${
              tab === 'items'
                ? 'bg-white text-ocean-600 shadow-sm'
                : 'text-gray-600 hover:text-ocean-500'
            }`}
          >
            Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setTab('packages')}
            className={`py-2 px-6 rounded-full text-sm font-medium transition-colors ${
              tab === 'packages'
                ? 'bg-white text-ocean-600 shadow-sm'
                : 'text-gray-600 hover:text-ocean-500'
            }`}
          >
            Packages ({packages.length})
          </button>
        </div>

        {tab === 'items' ? (
          /* Menu Items Table */
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand-100">
                    <th className="text-left p-4 font-medium text-gray-600">Image</th>
                    <th className="text-left p-4 font-medium text-gray-600">Name</th>
                    <th className="text-left p-4 font-medium text-gray-600">Category</th>
                    <th className="text-left p-4 font-medium text-gray-600">Price</th>
                    <th className="text-center p-4 font-medium text-gray-600">Type</th>
                    <th className="text-center p-4 font-medium text-gray-600">Status</th>
                    <th className="text-center p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-50">
                  {menuItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-4">
                        <div className="w-12 h-12 bg-sand-100 rounded-lg flex items-center justify-center">
                          <Image className="w-5 h-5 text-sand-400" />
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-800">{item.name}</td>
                      <td className="p-4 text-gray-600">{item.category}</td>
                      <td className="p-4 font-medium text-ocean-600">{formatCurrency(item.price)}</td>
                      <td className="p-4 text-center">
                        <Badge variant={item.isAddOn ? 'coral' : 'sand'}>
                          {item.isAddOn ? 'Add-On' : 'Standard'}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={item.isActive ? 'success' : 'sand'}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-ocean-500 hover:bg-ocean-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Packages Table */
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-sand-100">
                    <th className="text-left p-4 font-medium text-gray-600">Image</th>
                    <th className="text-left p-4 font-medium text-gray-600">Name</th>
                    <th className="text-left p-4 font-medium text-gray-600">Price</th>
                    <th className="text-left p-4 font-medium text-gray-600">Tag</th>
                    <th className="text-center p-4 font-medium text-gray-600">Status</th>
                    <th className="text-center p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-50">
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="p-4">
                        <div className="w-12 h-12 bg-sand-100 rounded-lg flex items-center justify-center">
                          <Image className="w-5 h-5 text-sand-400" />
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-800">{pkg.name}</td>
                      <td className="p-4 font-medium text-ocean-600">{formatCurrency(pkg.price)}</td>
                      <td className="p-4">
                        {pkg.tag ? (
                          <Badge variant={pkg.tag === 'Most Popular' ? 'coral' : 'ocean'}>
                            {pkg.tag}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={pkg.isActive ? 'success' : 'sand'}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-ocean-500 hover:bg-ocean-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        title="Add Menu Item"
        size="lg"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" className="input-field" placeholder="Item name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field resize-none" rows={3} placeholder="Item description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="input-field">
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="border-2 border-dashed border-sand-200 rounded-lg p-8 text-center cursor-pointer hover:border-ocean-300 transition-colors">
              <Image className="w-8 h-8 text-sand-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload image</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-ocean-500 border-gray-300 rounded" />
              <span className="text-sm text-gray-700">Add-On Item</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-ocean-500 border-gray-300 rounded" defaultChecked />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowItemModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Save Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
