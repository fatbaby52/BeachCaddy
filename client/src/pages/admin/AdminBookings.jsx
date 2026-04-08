import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ChevronDown, MapPin, Calendar, Clock, User, Phone, Mail } from 'lucide-react'
import { Card, Badge, Button, Modal } from '../../components/common'
import { formatDate, formatCurrency } from '../../utils/helpers'

// Sample data
const sampleBookings = [
  {
    id: 'SR-001',
    customer: { name: 'Sarah Miller', email: 'sarah@email.com', phone: '(555) 123-4567' },
    date: '2024-08-15',
    arrivalTime: '9:00 AM',
    endTime: '4:00 PM',
    location: 'Seacliff State Beach',
    zone: 'Near Water',
    package: 'Family Fun',
    items: [{ name: 'Extra Towels', quantity: 4 }],
    groupSize: 6,
    specialRequests: 'Birthday setup for a 10-year-old',
    status: 'SETUP_COMPLETE',
    total: 219,
    crewNotes: '',
  },
  {
    id: 'SR-002',
    customer: { name: 'Mike & Lisa Johnson', email: 'mike@email.com', phone: '(555) 234-5678' },
    date: '2024-08-15',
    arrivalTime: '10:30 AM',
    endTime: '5:00 PM',
    location: 'Sunset State Beach',
    zone: 'Sunset-Facing',
    package: 'Couples Relaxation',
    items: [{ name: 'Charcuterie Tray', quantity: 1 }],
    groupSize: 2,
    specialRequests: 'Anniversary celebration',
    status: 'IN_PROGRESS',
    total: 194,
    crewNotes: 'Champagne in cooler',
  },
  {
    id: 'SR-003',
    customer: { name: 'Corporate Group', email: 'events@company.com', phone: '(555) 345-6789' },
    date: '2024-08-15',
    arrivalTime: '11:00 AM',
    endTime: '6:00 PM',
    location: 'Manresa State Beach',
    zone: 'Private Area',
    package: 'Group Party',
    items: [],
    groupSize: 15,
    specialRequests: 'Team building event, need extra games',
    status: 'CONFIRMED',
    total: 499,
    crewNotes: '',
  },
]

const statusOptions = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'SETUP_COMPLETE', 'BREAKDOWN', 'COMPLETED', 'CANCELLED']

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'ocean',
  IN_PROGRESS: 'ocean',
  SETUP_COMPLETE: 'success',
  BREAKDOWN: 'sand',
  COMPLETED: 'success',
  CANCELLED: 'sand',
}

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
            <Link to="/admin/bookings" className="text-white font-medium">Bookings</Link>
            <Link to="/admin/menu" className="hover:text-ocean-200">Menu</Link>
            <Link to="/admin/inventory" className="hover:text-ocean-200">Inventory</Link>
            <Link to="/admin/settings" className="hover:text-ocean-200">Settings</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function AdminBookings() {
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredBookings = sampleBookings.filter(booking => {
    const matchesSearch = booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-ocean-700 mb-8">Bookings</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Bookings Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sand-100">
                  <th className="text-left p-4 font-medium text-gray-600">Booking</th>
                  <th className="text-left p-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date/Time</th>
                  <th className="text-left p-4 font-medium text-gray-600">Location</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-50">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-sand-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <td className="p-4">
                      <p className="font-mono text-sm text-ocean-600">{booking.id}</p>
                      <p className="text-sm text-gray-500">{booking.package}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{booking.customer.name}</p>
                      <p className="text-sm text-gray-500">{booking.groupSize} people</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-800">{formatDate(booking.date, { month: 'short', day: 'numeric' })}</p>
                      <p className="text-sm text-gray-500">{booking.arrivalTime}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-800">{booking.location}</p>
                      <p className="text-sm text-gray-500">{booking.zone}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusColors[booking.status]}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-ocean-600">
                      {formatCurrency(booking.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Booking Detail Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Booking ${selectedBooking?.id}`}
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div>
              <h4 className="font-medium text-ocean-700 mb-3">Customer</h4>
              <div className="bg-sand-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-ocean-400" />
                  <span>{selectedBooking.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-ocean-400" />
                  <span>{selectedBooking.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-ocean-400" />
                  <span>{selectedBooking.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h4 className="font-medium text-ocean-700 mb-3">Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-sand-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedBooking.location}</p>
                  <p className="text-sm text-ocean-500">{selectedBooking.zone}</p>
                </div>
                <div className="bg-sand-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">{formatDate(selectedBooking.date, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <p className="text-sm">{selectedBooking.arrivalTime} - {selectedBooking.endTime}</p>
                </div>
                <div className="bg-sand-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Package</p>
                  <p className="font-medium">{selectedBooking.package}</p>
                </div>
                <div className="bg-sand-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Group Size</p>
                  <p className="font-medium">{selectedBooking.groupSize} people</p>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {selectedBooking.specialRequests && (
              <div>
                <h4 className="font-medium text-ocean-700 mb-3">Special Requests</h4>
                <div className="bg-sunset-300/20 border border-sunset-400/30 rounded-lg p-4">
                  <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                </div>
              </div>
            )}

            {/* Status Update */}
            <div>
              <h4 className="font-medium text-ocean-700 mb-3">Update Status</h4>
              <select className="input-field" defaultValue={selectedBooking.status}>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Crew Notes */}
            <div>
              <h4 className="font-medium text-ocean-700 mb-3">Crew Notes</h4>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Add notes for the crew..."
                defaultValue={selectedBooking.crewNotes}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-sand-100">
              <Button variant="outline" onClick={() => setSelectedBooking(null)} className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
