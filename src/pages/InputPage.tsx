import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCcw } from 'lucide-react'
import { formSchema, DEFAULT_VALUES, type FormValues } from '@/lib/schema'
import { deserializeFromUrl, buildInputUrl } from '@/lib/url'
import { LoanSection } from '@/components/form/LoanSection'
import { EtfSection } from '@/components/form/EtfSection'
import { DividendSection } from '@/components/form/DividendSection'
import { OwnFundsSection } from '@/components/form/OwnFundsSection'
import { AdvancedFeesSection } from '@/components/form/AdvancedFeesSection'
import { LivePreviewSidebar } from '@/components/form/LivePreviewSidebar'
import { LivePreviewDock } from '@/components/form/LivePreviewDock'
import { useLivePreview } from '@/components/form/useLivePreview'
import { Button } from '@/components/ui/button'
import { asset } from '@/lib/asset'

interface Props {
  onCalculate: (values: FormValues) => void
  initialValues?: FormValues
}

export function InputPage({ onCalculate, initialValues }: Props) {
  const resolvedDefaults = useMemo(
    () => initialValues ?? { ...DEFAULT_VALUES, ...deserializeFromUrl(window.location.search) },
    [initialValues],
  )

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

  const preview = useLivePreview(form)

  const onSubmit = (data: FormValues) => {
    onCalculate(data)
  }

  const triggerSubmit = () => {
    handleSubmit(onSubmit)()
  }

  const handleReset = () => {
    reset(DEFAULT_VALUES)
  }

  return (
    <div className="min-h-screen pb-[200px] lg:pb-6">
      <header className="sticky top-0 z-20 border-b border-cyber-border/60 bg-cyber-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10">
              <img
                src={asset('seal.svg')}
                alt="借物之光 落款印"
                className="h-full w-full drop-shadow-[0_0_10px_rgba(207,74,55,0.35)]"
              />
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(106,161,95,0.85)] pulse-dot" />
            </div>
            <div className="leading-tight">
              <h1 className="font-display text-[16px] font-bold tracking-wide text-cyber-text sm:text-[18px]">
                借物之光{' '}
                <span className="text-cyber-text-4">・</span>{' '}
                <span className="font-vintage text-glow-gold text-gold-bright">Borrowed Light</span>
              </h1>
              <p className="font-vintage mt-0.5 hidden text-[10px] uppercase tracking-[0.28em] text-cyber-text-3 sm:block">
                槓桿試算所 ・ 大正版
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={handleReset} title="還原預設值">
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">重置</span>
            </Button>
            <span className="hidden items-center gap-1.5 text-[10px] tracking-[0.2em] text-neon-green text-glow-cyan md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-green pulse-dot" />
              稼働中
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-border to-transparent" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-cyber-text-3">
            填寫參數
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-border to-transparent" />
        </div>

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4 lg:col-span-7"
          >
            <LoanSection form={form} />
            <EtfSection form={form} />
            <DividendSection form={form} />
            <OwnFundsSection form={form} />
            <AdvancedFeesSection form={form} />

            {errors.root && (
              <p className="text-center text-sm text-neon-red">{errors.root.message}</p>
            )}

            <p className="hidden text-center text-[11px] text-cyber-text-4 lg:block">
              右側面板會即時更新預估數字
            </p>
            <button type="submit" className="sr-only" aria-hidden>
              submit
            </button>
          </form>

          <LivePreviewSidebar preview={preview} onSubmit={triggerSubmit} isValid={isValid} />
        </div>
      </main>

      <LivePreviewDock preview={preview} onSubmit={triggerSubmit} isValid={isValid} />
    </div>
  )
}
