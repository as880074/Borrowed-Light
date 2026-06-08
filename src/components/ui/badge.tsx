import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// eslint-disable-next-line react-refresh/only-export-components
export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors mono-tabular',
  {
    variants: {
      variant: {
        default:
          'border-gold/45 bg-neon-purple/10 text-gold-bright shadow-[inset_0_0_0_1px_rgba(201,164,92,0.18)]',
        secondary:
          'border-cyber-border bg-cyber-panel-2 text-cyber-text-2',
        destructive:
          'border-neon-red/50 bg-neon-red/15 text-neon-purple-bright shadow-[inset_0_0_0_1px_rgba(195,57,47,0.22)]',
        success:
          'border-neon-green/40 bg-neon-green/10 text-neon-green',
        outline: 'border-cyber-border text-cyber-text-2',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
