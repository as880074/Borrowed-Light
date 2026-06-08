import { useState, useEffect, useCallback } from 'react'
import { InputPage } from '@/pages/InputPage'
import { ResultsPage } from '@/pages/ResultsPage'
import { DEFAULT_VALUES, type FormValues } from '@/lib/schema'
import type { CalcResult } from '@/lib/calc/engine'
import { compute } from '@/lib/calc/engine'
import { formValuesToCalcParams } from '@/lib/calc/params'
import { buildResultsUrl, buildInputUrl, hasResultsParam, deserializeFromUrl } from '@/lib/url'

function getFormValuesFromUrl(): FormValues {
  return {
    ...DEFAULT_VALUES,
    ...deserializeFromUrl(window.location.search),
  }
}

export default function App() {
  const [page, setPage] = useState<'input' | 'results'>(() => (hasResultsParam() ? 'results' : 'input'))
  const [formValues, setFormValues] = useState<FormValues>(() => getFormValuesFromUrl())
  const [result, setResult] = useState<CalcResult | null>(() => {
    if (!hasResultsParam()) return null
    const values = getFormValuesFromUrl()
    return compute(formValuesToCalcParams(values))
  })

  const syncFromUrl = useCallback(() => {
    const values = getFormValuesFromUrl()
    setFormValues(values)

    if (hasResultsParam()) {
      setResult(compute(formValuesToCalcParams(values)))
      setPage('results')
    } else {
      setResult(null)
      setPage('input')
    }
  }, [])

  useEffect(() => {
    const onPop = () => {
      syncFromUrl()
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [syncFromUrl])

  const handleCalculate = (values: FormValues) => {
    const calcResult = compute(formValuesToCalcParams(values))
    setResult(calcResult)
    setFormValues(values)
    setPage('results')
    window.history.pushState(null, '', buildResultsUrl(values))
  }

  const handleBack = () => {
    setPage('input')
    setResult(null)
    window.history.pushState(null, '', buildInputUrl(formValues))
  }

  if (page === 'results' && result) {
    return <ResultsPage result={result} formValues={formValues} onBack={handleBack} />
  }

  return <InputPage onCalculate={handleCalculate} initialValues={formValues} />
}
