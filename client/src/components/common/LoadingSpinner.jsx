import { cn } from '../../utils/helpers'

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

export default function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div className={cn('wave-loader text-ocean-400', sizes[size], className)}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-ocean-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="bg-sand-100 rounded-lg h-40 mb-4"></div>
      <div className="bg-sand-100 rounded h-4 w-3/4 mb-2"></div>
      <div className="bg-sand-100 rounded h-4 w-1/2"></div>
    </div>
  )
}
