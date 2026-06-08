import * as React from 'react'
import { cn } from '@/lib/utils'
import { asset } from '@/lib/asset'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('cyber-panel rounded-xl relative overflow-hidden', className)} {...props}>
      {/* 金箔唐草角飾(透明 SVG,免混合模式 → 零合成成本) */}
      <img
        src={asset('corner.svg')}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1.5 top-1.5 z-0 h-10 w-10 opacity-80 select-none"
      />
      <img
        src={asset('corner.svg')}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-1.5 right-1.5 z-0 h-10 w-10 rotate-180 opacity-80 select-none"
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  ),
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between gap-3 border-b border-cyber-border/70 px-5 py-3.5',
      className,
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-cyber-text',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-cyber-text-3', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export { Card, CardHeader, CardTitle, CardContent, CardDescription }
