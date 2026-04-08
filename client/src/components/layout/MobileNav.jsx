import { NavLink } from 'react-router-dom'
import { Home, Grid, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { cn } from '../../utils/helpers'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/menu', icon: Grid, label: 'Menu' },
  { to: '/checkout', icon: ShoppingBag, label: 'Cart' },
  { to: '/account', icon: User, label: 'Account' },
]

export default function MobileNav() {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-sand-200 safe-bottom z-40">
      <div className="flex items-center justify-around max-w-xl mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex flex-col items-center justify-center py-3 px-5 min-w-[72px] min-h-[60px]',
              'transition-colors duration-200 focus-ring',
              isActive ? 'text-ocean-700' : 'text-warm-500 hover:text-ocean-600'
            )}
          >
            <div className="relative">
              <Icon className="w-6 h-6" strokeWidth={1.5} />
              {label === 'Cart' && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1.5 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
