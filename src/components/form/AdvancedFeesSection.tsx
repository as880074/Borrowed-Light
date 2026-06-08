import { useState } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import type { FormValues } from '@/lib/schema'
import { FormField } from './FormField'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface Props {
  form: UseFormReturn<FormValues>
}

export function AdvancedFeesSection({ form }: Props) {
  const [open, setOpen] = useState(false)
  const { register, formState: { errors } } = form

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-cyber-panel-2/50"
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-cyber-text">
              <SlidersHorizontal className="h-3.5 w-3.5 text-neon-purple" />
              05 · 進階費用
              <span className="ml-2 mono-tabular text-[10px] text-cyber-text-3 normal-case tracking-normal">選填</span>
            </span>
            {open ? <ChevronUp className="h-4 w-4 text-cyber-text-3" /> : <ChevronDown className="h-4 w-4 text-cyber-text-3" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-cyber-border/70">
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="股息稅率（%）" htmlFor="dividendTaxRatePct" error={errors.dividendTaxRatePct?.message} suffix="%" hint="台灣居民通常28%">
                <Input id="dividendTaxRatePct" type="number" inputMode="decimal" min={0} max={100} step={1} className="pr-8" {...register('dividendTaxRatePct', { valueAsNumber: true })} />
              </FormField>
              <FormField label="證交稅率（%）" htmlFor="tradingTaxRatePct" error={errors.tradingTaxRatePct?.message} suffix="%" hint="ETF賣出時0.1%">
                <Input id="tradingTaxRatePct" type="number" inputMode="decimal" min={0} max={5} step={0.01} className="pr-8" {...register('tradingTaxRatePct', { valueAsNumber: true })} />
              </FormField>
              <FormField label="手續費率（%）" htmlFor="brokerageRatePct" error={errors.brokerageRatePct?.message} suffix="%" hint="標準0.1425%">
                <Input id="brokerageRatePct" type="number" inputMode="decimal" min={0} max={5} step={0.001} className="pr-8" {...register('brokerageRatePct', { valueAsNumber: true })} />
              </FormField>
              <FormField label="手續費折扣（%）" htmlFor="brokerageDiscountPct" error={errors.brokerageDiscountPct?.message} suffix="%" hint="例如6折輸入60">
                <Input id="brokerageDiscountPct" type="number" inputMode="decimal" min={0} max={100} step={10} className="pr-8" {...register('brokerageDiscountPct', { valueAsNumber: true })} />
              </FormField>
            </CardContent>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
