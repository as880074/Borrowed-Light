import { useMemo } from 'react'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import { compute, type CalcResult } from '@/lib/calc/engine'
import { formValuesToCalcParams } from '@/lib/calc/params'
import type { FormValues } from '@/lib/schema'

export interface LivePreview {
  ready: boolean
  values: FormValues
  result: CalcResult | null
  totalCapital: number
  leverage: number | null
}

export function useLivePreview(form: UseFormReturn<FormValues>): LivePreview {
  const values = useWatch({ control: form.control }) as FormValues
  const isValid = form.formState.isValid
  const valuesKey = JSON.stringify(values)

  return useMemo(() => {
    const safe = values ?? form.getValues()
    const totalCapital = (safe.ownFunds ?? 0) + (safe.loanAmount ?? 0)
    const leverage = safe.ownFunds && safe.ownFunds > 0 ? totalCapital / safe.ownFunds : null

    if (!isValid) {
      return { ready: false, values: safe, result: null, totalCapital, leverage }
    }

    try {
      const result = compute(formValuesToCalcParams(safe))
      return { ready: true, values: safe, result, totalCapital, leverage }
    } catch {
      return { ready: false, values: safe, result: null, totalCapital, leverage }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesKey, isValid])
}
