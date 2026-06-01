import { useState } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { FormValues } from '@/lib/schema'
import { FormField } from './FormField'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
          <Button variant="ghost" className="flex h-auto w-full items-center justify-between p-4" type="button">
            <span className="font-semibold text-gray-700">⚙️ 進階費用設定（選填）</span>
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="grid grid-cols-1 gap-4 pt-0 sm:grid-cols-2">
            <FormField label="股息稅率（%）" htmlFor="dividendTaxRatePct" error={errors.dividendTaxRatePct?.message} suffix="%" hint="台灣居民通常28%">
              <Input id="dividendTaxRatePct" type="number" min={0} max={100} step={1} className="pr-8" {...register('dividendTaxRatePct', { valueAsNumber: true })} />
            </FormField>
            <FormField label="證交稅率（%）" htmlFor="tradingTaxRatePct" error={errors.tradingTaxRatePct?.message} suffix="%" hint="ETF賣出時0.1%">
              <Input id="tradingTaxRatePct" type="number" min={0} max={5} step={0.01} className="pr-8" {...register('tradingTaxRatePct', { valueAsNumber: true })} />
            </FormField>
            <FormField label="手續費率（%）" htmlFor="brokerageRatePct" error={errors.brokerageRatePct?.message} suffix="%" hint="標準0.1425%">
              <Input id="brokerageRatePct" type="number" min={0} max={5} step={0.001} className="pr-8" {...register('brokerageRatePct', { valueAsNumber: true })} />
            </FormField>
            <FormField label="手續費折扣（%）" htmlFor="brokerageDiscountPct" error={errors.brokerageDiscountPct?.message} suffix="%" hint="例如6折輸入60">
              <Input id="brokerageDiscountPct" type="number" min={0} max={100} step={10} className="pr-8" {...register('brokerageDiscountPct', { valueAsNumber: true })} />
            </FormField>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
