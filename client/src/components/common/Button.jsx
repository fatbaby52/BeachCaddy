import { cn } from '../../utils/helpers'
import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  coral: 'btn-coral',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
}

const sizes = {
  sm: 'px-4 py-2.5 text-sm',
  md: 'px-6 py-3.5 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) {
  return (
    <button
      className={cn(
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        'focus-ring',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
