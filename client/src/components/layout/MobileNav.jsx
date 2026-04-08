import { NavLink } from 'react-router-dom'
import { Home, UmbrellaOff, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { cn } from '../../utils/helpers'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/menu', icon: UmbrellaOff, label: 'Browse' },
  { to: '/checkout', icon: ShoppingBag, label: 'Cart' },
  { to: '/account', icon: User, label: 'Account' },
]

export default function MobileNav() {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-sand-100 safe-bottom z-40">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex flex-col items-center justify-center py-3 px-4 min-w-[64px] min-h-[56px]',
              'transition-colors duration-200',
              isActive ? 'text-ocean-500' : 'text-gray-400 hover:text-ocean-400'
            )}
          >
            <div className="relative">
              <Icon className="w-6 h-6" />
              {label === 'Cart' && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
