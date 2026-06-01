import { type UseFormReturn } from 'react-hook-form'
import type { FormValues } from '@/lib/schema'
import { FormField } from './FormField'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Props {
  form: UseFormReturn<FormValues>
}

export function DividendSection({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form
  const policy = watch('dividendPolicy')

  return (
    <Card>
      <CardHeader>
        <CardTitle>💰 股息處理方式</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="股息政策" error={errors.dividendPolicy?.message}>
          <Select value={policy} onValueChange={(v) => setValue('dividendPolicy', v as FormValues['dividendPolicy'], { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">不再投入（全部領現金）</SelectItem>
              <SelectItem value="full">全數再投入（DRIP）</SelectItem>
              <SelectItem value="custom">自訂比例</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {policy === 'custom' && (
          <FormField label="再投入比例（%）" htmlFor="customReinvestRatioPct" error={errors.customReinvestRatioPct?.message} suffix="%">
            <Input id="customReinvestRatioPct" type="number" min={0} max={100} step={5} className="pr-8" {...register('customReinvestRatioPct', { valueAsNumber: true })} />
          </FormField>
        )}
      </CardContent>
    </Card>
  )
}
