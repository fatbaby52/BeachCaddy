import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, AlertTriangle } from 'lucide-react'
import { Card, Badge, Button } from '../../components/common'

// Sample inventory data
const inventoryItems = [
  { id: 1, name: 'Beach Umbrella', category: 'Shade', stock: 25, minStock: 10 },
  { id: 2, name: 'Canopy (Standard)', category: 'Shade', stock: 15, minStock: 8 },
  { id: 3, name: 'Canopy (Large)', category: 'Shade', stock: 8, minStock: 5 },
  { id: 4, name: 'Beach Chair', category: 'Seating', stock: 50, minStock: 20 },
  { id: 5, name: 'Premium Lounger', category: 'Seating', stock: 20, minStock: 10 },
  { id: 6, name: 'Beach Towel', category: 'Comfort', stock: 100, minStock: 40 },
  { id: 7, name: 'Oversized Towel', category: 'Comfort', stock: 30, minStock: 15 },
  { id: 8, name: 'Blanket', category: 'Comfort', stock: 25, minStock: 10 },
  { id: 9, name: 'Small Cooler', category: 'Coolers', stock: 20, minStock: 10 },
  { id: 10, name: 'Large Cooler', category: 'Coolers', stock: 15, minStock: 8 },
  { id: 11, name: 'Bluetooth Speaker', category: 'Entertainment', stock: 12, minStock: 6 },
  { id: 12, name: 'Beach Games Set', category: 'Games', stock: 10, minStock: 5 },
  { id: 13, name: 'Kids Toy Set', category: 'Kids', stock: 8, minStock: 4 },
  { id: 14, name: 'Side Table', category: 'Accessories', stock: 10, minStock: 5 },
  { id: 15, name: 'Sunset Lighting Kit', category: 'Lighting', stock: 5, minStock: 3 },
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
            <Link to="/admin/menu" className="hover:text-ocean-200">Menu</Link>
            <Link to="/admin/inventory" className="text-white font-medium">Inventory</Link>
            <Link to="/admin/settings" className="hover:text-ocean-200">Settings</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function AdminInventory() {
  const [inventory, setInventory] = useState(inventoryItems)

  const updateStock = (id, delta) => {
    setInventory(items =>
      items.map(item =>
        item.id === id
          ? { ...item, stock: Math.max(0, item.stock + delta) }
          : item
      )
    )
  }

  const lowStockItems = inventory.filter(item => item.stock <= item.minStock)

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-ocean-700 mb-8">Inventory</h1>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="mb-6 p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Low Stock Alert</p>
                <p className="text-sm text-yellow-700">
                  {lowStockItems.length} item(s) are running low:{' '}
                  {lowStockItems.map(item => item.name).join(', ')}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand-100">
                  <th className="text-left p-4 font-medium text-gray-600">Item</th>
                  <th className="text-left p-4 font-medium text-gray-600">Category</th>
                  <th className="text-center p-4 font-medium text-gray-600">Current Stock</th>
                  <th className="text-center p-4 font-medium text-gray-600">Min. Required</th>
                  <th className="text-center p-4 font-medium text-gray-600">Status</th>
                  <th className="text-center p-4 font-medium text-gray-600">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-50">
                {inventory.map((item) => {
                  const isLow = item.stock <= item.minStock
                  return (
                    <tr key={item.id} className={isLow ? 'bg-yellow-50' : ''}>
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{item.name}</p>
                      </td>
                      <td className="p-4 text-gray-600">{item.category}</td>
                      <td className="p-4 text-center">
                        <span className={`font-bold ${isLow ? 'text-yellow-600' : 'text-ocean-600'}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center text-gray-500">{item.minStock}</td>
                      <td className="p-4 text-center">
                        <Badge variant={isLow ? 'warning' : 'success'}>
                          {isLow ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateStock(item.id, -1)}
                            className="w-8 h-8 bg-sand-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-sand-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStock(item.id, 1)}
                            className="w-8 h-8 bg-ocean-400 text-white rounded-full flex items-center justify-center hover:bg-ocean-500 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
