import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, Bell, ChevronLeft, ArrowRight } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../utils/helpers'

export default function Header({ title, showBack = false, transparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const itemCount = useCartStore((state) => state.getItemCount())
  const user = useAuthStore((state) => state.user)

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 px-5 py-4 flex items-center justify-between transition-colors',
          transparent ? 'bg-transparent' : 'bg-sand-50/95 backdrop-blur-sm border-b border-sand-200'
        )}
      >
        {/* Left side */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-sand-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-ring"
              aria-label="Go back"
            >
              <ChevronLeft className={cn('w-6 h-6', transparent ? 'text-white' : 'text-ocean-700')} />
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 hover:bg-sand-100/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-ring"
              aria-label="Open menu"
            >
              <Menu className={cn('w-6 h-6', transparent ? 'text-white' : 'text-ocean-700')} />
            </button>
          )}

          {title ? (
            <h1 className={cn('text-lg font-medium', transparent ? 'text-white' : 'text-ocean-800')}>
              {title}
            </h1>
          ) : (
            <Link to="/" className="flex items-center">
              <span
                className={cn('text-xl', transparent ? 'text-white' : 'text-ocean-800')}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ShoreReady
              </span>
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {user && (
            <button
              className="p-2 hover:bg-sand-100/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative focus-ring"
              aria-label="Notifications"
            >
              <Bell className={cn('w-5 h-5', transparent ? 'text-white' : 'text-ocean-700')} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-coral-500 rounded-full" />
            </button>
          )}

          <Link
            to="/checkout"
            className="p-2 hover:bg-sand-100/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative focus-ring"
            aria-label={`Cart with ${itemCount} items`}
          >
            <ShoppingBag className={cn('w-5 h-5', transparent ? 'text-white' : 'text-ocean-700')} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-coral-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ocean-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-sand-50 shadow-dramatic animate-slide-in-left">
            {/* Header */}
            <div className="p-6 border-b border-sand-200 flex items-center justify-between">
              <span className="text-xl text-ocean-800" style={{ fontFamily: 'var(--font-display)' }}>
                ShoreReady
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-sand-100 transition-colors focus-ring"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-ocean-700" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              {[
                { to: '/', label: 'Home' },
                { to: '/book', label: 'Book a Setup' },
                { to: '/menu', label: 'Browse Menu' },
                { to: '/packages', label: 'View Packages' },
                { to: '/account', label: 'My Account' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-4 px-2 text-ocean-800 hover:text-ocean-600 border-b border-sand-100 transition-colors group"
                >
                  <span className="font-medium">{label}</span>
                  <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-ocean-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </nav>

            {/* Footer */}
            {!user && (
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sand-200 bg-white">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full text-center block"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export function BackHeader({ title, rightContent }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 px-5 py-4 flex items-center justify-between bg-sand-50/95 backdrop-blur-sm border-b border-sand-200">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-sand-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-ring"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-ocean-700" />
        </button>
        {title && <h1 className="text-lg font-medium text-ocean-800">{title}</h1>}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </header>
  )
}
