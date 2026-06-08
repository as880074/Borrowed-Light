import { type UseFormReturn } from 'react-hook-form'
import { Banknote } from 'lucide-react'
import type { FormValues } from '@/lib/schema'
import { FormField } from './FormField'
import { MoneyInput } from './MoneyInput'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Props {
  form: UseFormReturn<FormValues>
}

const LOAN_CHIPS = [
  { label: '50 萬', value: 500_000 },
  { label: '100 萬', value: 1_000_000 },
  { label: '200 萬', value: 2_000_000 },
  { label: '500 萬', value: 5_000_000 },
]

export function LoanSection({ form }: Props) {
  const { register, setValue, watch, control, formState: { errors } } = form
  const repaymentMethod = watch('repaymentMethod')

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Banknote className="h-3.5 w-3.5 text-neon-purple" />
          <span>01 · 信貸設定</span>
        </CardTitle>
        <span className="mono-tabular text-[10px] text-cyber-text-3">LOAN.CFG</span>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="貸款金額（元）" htmlFor="loanAmount" error={errors.loanAmount?.message}>
          <MoneyInput control={control} name="loanAmount" id="loanAmount" chips={LOAN_CHIPS} placeholder="例：1,000,000" />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="年利率（%）" htmlFor="annualLoanRatePct" error={errors.annualLoanRatePct?.message} suffix="%">
            <Input
              id="annualLoanRatePct"
              type="number"
              inputMode="decimal"
              min={0}
              max={50}
              step={0.1}
              className="pr-8"
              {...register('annualLoanRatePct', { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="貸款年期（年）" htmlFor="termYears" error={errors.termYears?.message}>
            <Input
              id="termYears"
              type="number"
              inputMode="numeric"
              min={1}
              max={40}
              step={1}
              {...register('termYears', { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <FormField label="還款方式" error={errors.repaymentMethod?.message}>
          <Select value={repaymentMethod} onValueChange={(v) => setValue('repaymentMethod', v as FormValues['repaymentMethod'], { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="選擇還款方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amortized">本息均攤（等額還款）</SelectItem>
              <SelectItem value="equal-principal">本金均攤（等額本金）</SelectItem>
              <SelectItem value="interest-only">只還利息（氣球型）</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </CardContent>
    </Card>
  )
}
