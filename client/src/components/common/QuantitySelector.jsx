import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className = '',
}) {
  const decrease = () => {
    if (value > min) onChange(value - 1)
  }

  const increase = () => {
    if (value < max) onChange(value + 1)
  }

  const sizes = {
    sm: {
      button: 'w-8 h-8',
      text: 'text-sm w-8',
      icon: 'w-4 h-4',
    },
    md: {
      button: 'w-10 h-10',
      text: 'text-base w-10',
      icon: 'w-5 h-5',
    },
    lg: {
      button: 'w-12 h-12',
      text: 'text-lg w-12',
      icon: 'w-6 h-6',
    },
  }

  const sizeClasses = sizes[size]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-sand-100 text-ocean-600 hover:bg-sand-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          sizeClasses.button
        )}
      >
        <Minus className={sizeClasses.icon} />
      </button>

      <span className={cn(
        'font-medium text-center text-ocean-700',
        sizeClasses.text
      )}>
        {value}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-ocean-400 text-white hover:bg-ocean-500',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          sizeClasses.button
        )}
      >
        <Plus className={sizeClasses.icon} />
      </button>
    </div>
  )
}
