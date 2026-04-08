import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-warm-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// Lazy load pages - code split by route
const HomePage = lazy(() => import('./pages/HomePage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const MenuPage = lazy(() => import('./pages/MenuPage'))
const PackagesPage = lazy(() => import('./pages/PackagesPage'))
const AddOnsPage = lazy(() => import('./pages/AddOnsPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))

// Admin pages - separate chunk
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'))
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Admin Route wrapper
function AdminRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <div className="font-body">
        {/* Skip link for keyboard accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Live region for screen reader announcements */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="live-region"
          id="live-announcer"
        />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/add-ons" element={<AddOnsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Protected Routes */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <AdminRoute>
                  <AdminInventory />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/menu"
              element={
                <AdminRoute>
                  <AdminMenu />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
