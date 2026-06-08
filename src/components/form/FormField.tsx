import { type ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
  suffix?: string
}

export function FormField({ label, htmlFor, error, hint, children, className, suffix }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="relative">
        {children}
        {suffix && (
          <span className="mono-tabular pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-cyber-text-3">{suffix}</span>
        )}
      </div>
      {hint && !error && <p className="text-xs text-cyber-text-3">{hint}</p>}
      {error && <p className="text-xs font-medium text-neon-red">{error}</p>}
    </div>
  )
}
