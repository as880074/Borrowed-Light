import { type UseFormReturn } from 'react-hook-form'
import type { FormValues } from '@/lib/schema'
import { FormField } from './FormField'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'

interface Props {
  form: UseFormReturn<FormValues>
}

export function OwnFundsSection({ form }: Props) {
  const { register, watch, formState: { errors } } = form
  const ownFunds = watch('ownFunds')
  const loanAmount = watch('loanAmount')
  const total = (ownFunds || 0) + (loanAmount || 0)
  const leverageRatio = total > 0 && ownFunds > 0 ? (total / ownFunds).toFixed(1) : '∞'

  return (
    <Card>
      <CardHeader>
        <CardTitle>🏦 自有資金</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="自有資金（元）" htmlFor="ownFunds" error={errors.ownFunds?.message}>
          <Input id="ownFunds" type="number" min={0} step={10000} {...register('ownFunds', { valueAsNumber: true })} />
        </FormField>
        <div className="space-y-1 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          <div>總投入本金：<strong>{formatNumber(total)}</strong> 元</div>
          <div>槓桿倍數：<strong>{leverageRatio}x</strong></div>
        </div>
      </CardContent>
    </Card>
  )
}
