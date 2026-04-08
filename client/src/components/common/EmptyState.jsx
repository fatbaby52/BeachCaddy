import { Package, Search, ShoppingBag, Calendar, AlertCircle } from 'lucide-react'
import Button from './Button'

const icons = {
  package: Package,
  search: Search,
  cart: ShoppingBag,
  calendar: Calendar,
  error: AlertCircle,
}

/**
 * Empty state component for when there's no data to display
 */
export default function EmptyState({
  icon = 'package',
  title,
  description,
  action,
  onAction,
  className = '',
}) {
  const Icon = icons[icon] || Package

  return (
    <div className={`empty-state ${className}`} role="status">
      <Icon className="empty-state-icon" aria-hidden="true" />

      {title && (
        <h3 className="empty-state-title">{title}</h3>
      )}

      {description && (
        <p className="empty-state-description">{description}</p>
      )}

      {action && onAction && (
        <Button onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  )
}

/**
 * Error state with retry option
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\'t load this content. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`} role="alert">
      <AlertCircle className="empty-state-icon text-coral-400" aria-hidden="true" />

      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try again
        </Button>
      )}
    </div>
  )
}

/**
 * Loading skeleton for lists
 */
export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading content">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white border border-sand-200">
          <div className="skeleton w-20 h-20 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text w-full" />
            <div className="skeleton skeleton-text w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Loading skeleton for cards
 */
export function CardSkeleton() {
  return (
    <div className="bg-white border border-sand-200" aria-busy="true" aria-label="Loading">
      <div className="skeleton skeleton-image" />
      <div className="p-4 space-y-2">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text w-1/2" />
      </div>
    </div>
  )
}
