import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/70 focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-neon-purple to-neon-purple-dim text-[#fff7ec] shadow-[0_0_0_1px_rgba(201,164,92,0.45),0_4px_18px_-4px_rgba(207,74,55,0.6),inset_0_1px_0_rgba(255,247,236,0.2)] hover:shadow-[0_0_0_1px_rgba(231,200,115,0.7),0_6px_24px_-2px_rgba(207,74,55,0.75),inset_0_1px_0_rgba(255,247,236,0.24)] hover:from-neon-purple-bright hover:to-neon-purple',
        outline:
          'border border-cyber-border-strong bg-cyber-panel/60 text-cyber-text hover:border-gold/60 hover:bg-cyber-panel-2 hover:text-gold-bright',
        ghost:
          'text-cyber-text-2 hover:bg-cyber-panel-2/70 hover:text-cyber-text',
        destructive:
          'bg-gradient-to-b from-neon-red to-neon-purple-deep text-[#fff7ec] shadow-[0_0_0_1px_rgba(195,57,47,0.5),0_4px_16px_-4px_rgba(195,57,47,0.55)] hover:shadow-[0_0_0_1px_rgba(195,57,47,0.7),0_6px_22px_-2px_rgba(195,57,47,0.7)]',
        secondary:
          'bg-cyber-panel-2 text-cyber-text border border-cyber-border hover:bg-cyber-panel-3 hover:border-cyber-border-strong',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-[15px] uppercase tracking-[0.18em] font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button }
