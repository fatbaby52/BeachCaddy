import { cn } from '../../utils/helpers'

export default function Card({
  children,
  className = '',
  elevated = false,
  onClick,
  ...props
}) {
  return (
    <div
      className={cn(
        elevated ? 'card-elevated' : 'card',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardImage({ src, alt, placeholder = true, className = '' }) {
  return (
    <div className={cn('overflow-hidden rounded-t-xl', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : placeholder ? (
        <div className="w-full h-full img-placeholder flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      ) : null}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={cn('p-4', className)}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('px-4 pb-4 pt-0', className)}>
      {children}
    </div>
  )
}
