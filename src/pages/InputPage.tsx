import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calculator } from 'lucide-react'
import { formSchema, DEFAULT_VALUES, type FormValues } from '@/lib/schema'
import { deserializeFromUrl, buildInputUrl } from '@/lib/url'
import { LoanSection } from '@/components/form/LoanSection'
import { EtfSection } from '@/components/form/EtfSection'
import { DividendSection } from '@/components/form/DividendSection'
import { OwnFundsSection } from '@/components/form/OwnFundsSection'
import { AdvancedFeesSection } from '@/components/form/AdvancedFeesSection'
import { Button } from '@/components/ui/button'

interface Props {
  onCalculate: (values: FormValues) => void
  initialValues?: FormValues
}

export function InputPage({ onCalculate, initialValues }: Props) {
  const resolvedDefaults = useMemo(() => initialValues ?? { ...DEFAULT_VALUES, ...deserializeFromUrl(window.location.search) }, [initialValues])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: resolvedDefaults,
    mode: 'onChange',
  })

  const { handleSubmit, formState: { isValid, errors }, watch, reset } = form

  useEffect(() => {
    reset(resolvedDefaults)
  }, [reset, resolvedDefaults])

  const values = watch()
  useEffect(() => {
    window.history.replaceState(null, '', buildInputUrl(values))
  }, [values])

  const onSubmit = (data: FormValues) => {
    onCalculate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900">借來的光 <span className="text-blue-600">Borrowed Light</span></h1>
          <p className="mt-1 text-sm text-gray-500">ETF 信貸槓桿投資報酬試算機</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <LoanSection form={form} />
          <EtfSection form={form} />
          <DividendSection form={form} />
          <OwnFundsSection form={form} />
          <AdvancedFeesSection form={form} />

          {errors.root && <p className="text-center text-sm text-red-600">{errors.root.message}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={!isValid}>
            <Calculator className="mr-2 h-5 w-5" />
            開始試算
          </Button>
        </form>
      </main>
    </div>
  )
}
