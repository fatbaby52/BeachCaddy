import { AlertCircle } from 'lucide-react'
import { cn } from '../../utils/helpers'

/**
 * Accessible form field wrapper with label, hint, and error support
 */
export default function FormField({
  label,
  hint,
  error,
  required = false,
  children,
  className = '',
  id,
}) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('field-group', className)}>
      {label && (
        <label htmlFor={fieldId} className="field-label">
          {label}
          {required && <span className="text-coral-500 ml-1" aria-hidden="true">*</span>}
          {required && <span className="sr-only">(required)</span>}
        </label>
      )}

      {/* Clone child and add accessibility props */}
      {children && typeof children === 'object' &&
        { ...children, props: {
          ...children.props,
          id: fieldId,
          'aria-describedby': describedBy,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required ? 'true' : undefined,
          className: cn(
            children.props?.className,
            error && 'input-error'
          )
        }}
      }

      {hint && !error && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="field-error" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

/**
 * Simple input with built-in error styling
 */
export function Input({
  error,
  className = '',
  ...props
}) {
  return (
    <input
      className={cn(
        'input-field',
        error && 'input-error',
        className
      )}
      aria-invalid={error ? 'true' : undefined}
      {...props}
    />
  )
}

/**
 * Textarea with built-in error styling
 */
export function Textarea({
  error,
  className = '',
  ...props
}) {
  return (
    <textarea
      className={cn(
        'input-field resize-none',
        error && 'input-error',
        className
      )}
      aria-invalid={error ? 'true' : undefined}
      {...props}
    />
  )
}
