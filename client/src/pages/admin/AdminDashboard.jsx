import { Link } from 'react-router-dom'
import { Calendar, DollarSign, Umbrella, Clock, ChevronRight, Users, MapPin } from 'lucide-react'
import { Header, PageContainer } from '../../components/layout'
import { Card, Badge } from '../../components/common'
import { formatCurrency } from '../../utils/helpers'

// Sample data (will be fetched from API)
const stats = {
  todayBookings: 8,
  weekRevenue: 2847,
  activeSetups: 3,
  pendingConfirmations: 2,
}

const todaySchedule = [
  {
    id: 'SR-001',
    time: '9:00 AM',
    customer: 'Sarah M.',
    location: 'Seacliff State Beach',
    package: 'Family Fun',
    status: 'SETUP_COMPLETE',
  },
  {
    id: 'SR-002',
    time: '10:30 AM',
    customer: 'Mike & Lisa',
    location: 'Sunset State Beach',
    package: 'Couples Relaxation',
    status: 'IN_PROGRESS',
  },
  {
    id: 'SR-003',
    time: '11:00 AM',
    customer: 'Johnson Party',
    location: 'Manresa State Beach',
    package: 'Group Party',
    status: 'CONFIRMED',
  },
]

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'ocean',
  IN_PROGRESS: 'ocean',
  SETUP_COMPLETE: 'success',
  COMPLETED: 'success',
}

function StatCard({ icon: Icon, label, value, subtext, color = 'ocean' }) {
  const colorClasses = {
    ocean: 'bg-ocean-100 text-ocean-500',
    coral: 'bg-coral-400/20 text-coral-500',
    sand: 'bg-sand-200 text-sand-500',
    green: 'bg-green-100 text-green-600',
  }

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-ocean-700">{value}</p>
          {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
        </div>
      </div>
    </Card>
  )
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
            <Link to="/admin/bookings" className="hover:text-ocean-200">Bookings</Link>
            <Link to="/admin/menu" className="hover:text-ocean-200">Menu</Link>
            <Link to="/admin/inventory" className="hover:text-ocean-200">Inventory</Link>
            <Link to="/admin/settings" className="hover:text-ocean-200">Settings</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-sand-50">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-ocean-700 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Calendar}
            label="Today's Bookings"
            value={stats.todayBookings}
            color="ocean"
          />
          <StatCard
            icon={DollarSign}
            label="This Week"
            value={formatCurrency(stats.weekRevenue)}
            color="green"
          />
          <StatCard
            icon={Umbrella}
            label="Active Setups"
            value={stats.activeSetups}
            color="coral"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pendingConfirmations}
            color="sand"
          />
        </div>

        {/* Today's Schedule */}
        <Card className="mb-8">
          <div className="p-4 border-b border-sand-100 flex items-center justify-between">
            <h2 className="font-display text-xl text-ocean-700">Today's Schedule</h2>
            <Link to="/admin/bookings" className="text-ocean-500 text-sm flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-sand-50">
            {todaySchedule.map((booking) => (
              <div key={booking.id} className="p-4 flex items-center gap-4">
                <div className="text-center min-w-[60px]">
                  <p className="font-bold text-ocean-600">{booking.time}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-ocean-700">{booking.customer}</p>
                    <Badge variant={statusColors[booking.status]} className="text-xs">
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {booking.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Umbrella className="w-3 h-3" /> {booking.package}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/admin/bookings?id=${booking.id}`}
                  className="text-ocean-500 hover:text-ocean-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/bookings">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <Calendar className="w-8 h-8 text-ocean-500 mb-3" />
              <h3 className="font-medium text-ocean-700 mb-1">View All Bookings</h3>
              <p className="text-sm text-gray-500">Manage reservations and status</p>
            </Card>
          </Link>
          <Link to="/admin/menu">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <Umbrella className="w-8 h-8 text-coral-500 mb-3" />
              <h3 className="font-medium text-ocean-700 mb-1">Manage Menu</h3>
              <p className="text-sm text-gray-500">Edit items and packages</p>
            </Card>
          </Link>
          <Link to="/admin/inventory">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <Users className="w-8 h-8 text-sand-400 mb-3" />
              <h3 className="font-medium text-ocean-700 mb-1">Update Inventory</h3>
              <p className="text-sm text-gray-500">Track stock levels</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
