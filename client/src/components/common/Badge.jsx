import { cn } from '../../utils/helpers'

const variants = {
  coral: 'badge-coral',
  ocean: 'badge-ocean',
  sand: 'badge-sand',
  success: 'badge-success',
  warning: 'badge-warning',
}

export default function Badge({
  children,
  variant = 'ocean',
  className = '',
  ...props
}) {
  return (
    <span className={cn('badge', variants[variant], className)} {...props}>
      {children}
    </span>
  )
}
