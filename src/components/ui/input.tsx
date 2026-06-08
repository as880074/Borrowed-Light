import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'mono-tabular flex h-10 w-full rounded-md border border-cyber-border bg-cyber-bg/60 px-3 py-2 text-sm text-cyber-text placeholder:text-cyber-text-4 transition-all duration-150',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.02),inset_0_0_0_1px_rgba(0,0,0,0.3)]',
        'hover:border-cyber-border-strong',
        'focus-visible:outline-none focus-visible:border-gold/70 focus-visible:bg-cyber-panel focus-visible:shadow-[0_0_0_3px_rgba(201,164,92,0.18),inset_0_0_0_1px_rgba(201,164,92,0.4)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
