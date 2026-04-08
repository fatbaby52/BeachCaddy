import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Edit2, LogOut, Calendar, MapPin, Clock, ChevronRight, Star, RefreshCw } from 'lucide-react'
import { Header, MobileNav, PageContainer } from '../components/layout'
import { Button, Card, Badge, Modal } from '../components/common'
import { useAuthStore } from '../store/authStore'
import { formatDate, formatCurrency } from '../utils/helpers'

// Sample bookings data (will be fetched from API)
const sampleBookings = {
  upcoming: [
    {
      id: 'SR-ABC123',
      date: '2024-08-15',
      location: 'Seacliff State Beach',
      arrivalTime: '10:00 AM',
      endTime: '4:00 PM',
      status: 'CONFIRMED',
      package: 'Couples Relaxation',
      total: 149,
    },
  ],
  past: [
    {
      id: 'SR-XYZ789',
      date: '2024-07-20',
      location: 'Sunset State Beach',
      arrivalTime: '11:00 AM',
      endTime: '5:00 PM',
      status: 'COMPLETED',
      package: 'Family Fun',
      total: 199,
    },
    {
      id: 'SR-DEF456',
      date: '2024-06-10',
      location: 'Manresa State Beach',
      arrivalTime: '9:00 AM',
      endTime: '3:00 PM',
      status: 'COMPLETED',
      package: 'Basic Beach Day',
      total: 89,
    },
  ],
}

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'ocean',
  IN_PROGRESS: 'ocean',
  SETUP_COMPLETE: 'success',
  COMPLETED: 'success',
  CANCELLED: 'sand',
}

function BookingCard({ booking, isPast = false }) {
  const navigate = useNavigate()

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-sm text-gray-500">{booking.id}</p>
          <h4 className="font-display text-lg text-ocean-700">{booking.package}</h4>
        </div>
        <Badge variant={statusColors[booking.status]}>
          {booking.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ocean-400" />
          <span>{booking.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-ocean-400" />
          <span>{formatDate(booking.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean-400" />
          <span>{booking.arrivalTime} - {booking.endTime}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-sand-100">
        <span className="font-bold text-ocean-600">{formatCurrency(booking.total)}</span>

        {isPast ? (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" leftIcon={<Star className="w-4 h-4" />}>
              Save
            </Button>
            <Button size="sm" variant="outline" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Rebook
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            View Details
          </Button>
        )}
      </div>
    </Card>
  )
}

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuthStore()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  // Mock user data
  const userData = {
    firstName: user?.user_metadata?.first_name || 'John',
    lastName: user?.user_metadata?.last_name || 'Doe',
    email: user?.email || 'john@example.com',
    phone: user?.user_metadata?.phone || '(555) 123-4567',
  }

  return (
    <>
      <Header title="My Account" />

      <PageContainer>
        {/* Profile Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-ocean-500" />
              </div>
              <div>
                <h2 className="font-display text-xl text-ocean-700">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-gray-500">Member since 2024</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-ocean-500 hover:text-ocean-600"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-4 h-4 text-ocean-400" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-4 h-4 text-ocean-400" />
              <span>{userData.phone}</span>
            </div>
          </div>
        </Card>

        {/* Reservations Tabs */}
        <div className="mb-6">
          <div className="flex bg-sand-100 rounded-full p-1 mb-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-gray-600 hover:text-ocean-500'
              }`}
            >
              Upcoming ({sampleBookings.upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-gray-600 hover:text-ocean-500'
              }`}
            >
              Past ({sampleBookings.past.length})
            </button>
          </div>

          {activeTab === 'upcoming' ? (
            <div className="space-y-4">
              {sampleBookings.upcoming.length > 0 ? (
                sampleBookings.upcoming.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-sand-300 mx-auto mb-4" />
                  <h3 className="font-display text-lg text-ocean-700 mb-2">
                    No upcoming reservations
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Ready for your next beach day?
                  </p>
                  <Button onClick={() => navigate('/book')}>
                    Book a Setup
                  </Button>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sampleBookings.past.length > 0 ? (
                sampleBookings.past.map(booking => (
                  <BookingCard key={booking.id} booking={booking} isPast />
                ))
              ) : (
                <Card className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-sand-300 mx-auto mb-4" />
                  <h3 className="font-display text-lg text-ocean-700 mb-2">
                    No past reservations
                  </h3>
                  <p className="text-gray-600">
                    Your booking history will appear here
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-sunset-400" />
              <span className="font-medium text-ocean-700">Saved Favorites</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          fullWidth
          variant="outline"
          onClick={() => setShowLogoutModal(true)}
          leftIcon={<LogOut className="w-5 h-5" />}
          className="text-red-500 border-red-200 hover:bg-red-50"
        >
          Sign Out
        </Button>
      </PageContainer>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out?"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to sign out of your account?
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowLogoutModal(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            className="flex-1 bg-red-500 hover:bg-red-600"
          >
            Sign Out
          </Button>
        </div>
      </Modal>

      <MobileNav />
    </>
  )
}
