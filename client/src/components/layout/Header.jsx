import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, Bell, ChevronLeft } from 'lucide-react'
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
          'sticky top-0 z-30 px-4 py-3 flex items-center justify-between',
          transparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md border-b border-sand-100'
        )}
      >
        {/* Left side */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-sand-50 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-ocean-600" />
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 hover:bg-sand-50 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Menu className="w-6 h-6 text-ocean-600" />
            </button>
          )}

          {title ? (
            <h1 className="font-display text-xl text-ocean-700">{title}</h1>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-xl text-ocean-600">ShoreReady</span>
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user && (
            <button className="p-2 hover:bg-sand-50 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-ocean-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-coral-500 rounded-full"></span>
            </button>
          )}

          <Link
            to="/checkout"
            className="p-2 hover:bg-sand-50 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative"
          >
            <ShoppingBag className="w-5 h-5 text-ocean-600" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-coral-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-right">
            <div className="p-4 border-b border-sand-100 flex items-center justify-between">
              <span className="font-display text-xl text-ocean-600">ShoreReady</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-sand-50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/book', label: 'Book a Setup' },
                { to: '/menu', label: 'Browse Menu' },
                { to: '/packages', label: 'View Packages' },
                { to: '/add-ons', label: 'Add-Ons' },
                { to: '/account', label: 'My Account' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-4 text-ocean-700 hover:bg-sand-50 rounded-lg transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {!user && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sand-100">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <style>{`
            @keyframes slide-right {
              from {
                transform: translateX(-100%);
              }
              to {
                transform: translateX(0);
              }
            }

            .animate-slide-right {
              animation: slide-right 0.3s ease-out;
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export function BackHeader({ title, rightContent }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-sand-100">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-sand-50 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 text-ocean-600" />
        </button>
        {title && <h1 className="font-display text-xl text-ocean-700">{title}</h1>}
      </div>
      {rightContent && <div>{rightContent}</div>}
    </header>
  )
}
