import { type UseFormReturn } from 'react-hook-form'
import { Wallet } from 'lucide-react'
import type { FormValues } from '@/lib/schema'
import { FormField } from './FormField'
import { MoneyInput } from './MoneyInput'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Props {
  form: UseFormReturn<FormValues>
}

const OWN_FUNDS_CHIPS = [
  { label: '0', value: 0 },
  { label: '10 萬', value: 100_000 },
  { label: '30 萬', value: 300_000 },
  { label: '50 萬', value: 500_000 },
  { label: '100 萬', value: 1_000_000 },
]

export function OwnFundsSection({ form }: Props) {
  const { control, formState: { errors } } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Wallet className="h-3.5 w-3.5 text-neon-purple" />
          <span>04 · 自有資金</span>
        </CardTitle>
        <span className="mono-tabular text-[10px] text-cyber-text-3">CAPITAL.EQ</span>
      </CardHeader>
      <CardContent>
        <FormField
          label="自有資金（元）"
          htmlFor="ownFunds"
          error={errors.ownFunds?.message}
          hint="設為 0 代表全額信貸投資（ROE 將顯示「全額槓桿」）"
        >
          <MoneyInput control={control} name="ownFunds" id="ownFunds" chips={OWN_FUNDS_CHIPS} placeholder="例：300,000" />
        </FormField>
      </CardContent>
    </Card>
  )
}
