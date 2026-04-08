import { cn } from '../../utils/helpers'

export default function PageContainer({
  children,
  className = '',
  noPadding = false,
  fullWidth = false,
}) {
  return (
    <div
      className={cn(
        'min-h-screen pb-24',
        !noPadding && 'px-4 py-6',
        !fullWidth && 'max-w-lg mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}
