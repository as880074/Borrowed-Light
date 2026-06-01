import { useState, useCallback } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { Loader2, RefreshCw } from 'lucide-react'
import type { FormValues } from '@/lib/schema'
import { FormField } from './FormField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FinMindProvider } from '@/lib/data/FinMindProvider'

const provider = new FinMindProvider()

interface Props {
  form: UseFormReturn<FormValues>
}

export function EtfSection({ form }: Props) {
  const { register, setValue, watch, formState: { errors } } = form
  const etfSymbol = watch('etfSymbol')
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const handleAutoFill = useCallback(async () => {
    if (!etfSymbol) return
    setLoading(true)
    setFetchError(null)
    try {
      const info = await provider.fetchEtfInfo(etfSymbol)
      if (info.annualGrowthRateEstimate !== undefined) {
        setValue('annualGrowthRatePct', Number.parseFloat((info.annualGrowthRateEstimate * 100).toFixed(2)), { shouldValidate: true })
      }
      if (info.dividendYieldEstimate !== undefined) {
        setValue('dividendYieldPct', Number.parseFloat((info.dividendYieldEstimate * 100).toFixed(2)), { shouldValidate: true })
      }
    } catch {
      setFetchError('無法自動填入，請手動輸入（API限制或CORS）')
    } finally {
      setLoading(false)
    }
  }, [etfSymbol, setValue])

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 ETF 設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <FormField label="ETF代號（選填）" htmlFor="etfSymbol" className="flex-1" hint="輸入代號後可嘗試自動帶入數據">
            <Input id="etfSymbol" placeholder="例：0050" {...register('etfSymbol')} />
          </FormField>
          <Button type="button" variant="outline" size="sm" onClick={handleAutoFill} disabled={loading || !etfSymbol} className="mb-0.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-1">自動帶入</span>
          </Button>
        </div>
        {fetchError && <p className="text-xs text-amber-600">⚠️ {fetchError}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="年化價格成長率（%）" htmlFor="annualGrowthRatePct" error={errors.annualGrowthRatePct?.message} suffix="%" hint="僅含價差，不含股息">
            <Input id="annualGrowthRatePct" type="number" step={0.5} className="pr-8" {...register('annualGrowthRatePct', { valueAsNumber: true })} />
          </FormField>

          <FormField label="殖利率（%）" htmlFor="dividendYieldPct" error={errors.dividendYieldPct?.message} suffix="%">
            <Input id="dividendYieldPct" type="number" min={0} step={0.1} className="pr-8" {...register('dividendYieldPct', { valueAsNumber: true })} />
          </FormField>
        </div>
      </CardContent>
    </Card>
  )
}
