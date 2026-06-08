import { useState } from 'react'
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { LivePreview } from './useLivePreview'

interface Props {
  preview: LivePreview
  onSubmit: () => void
  isValid: boolean
}

interface MetricProps {
  label: string
  value: string
  tone?: 'neutral' | 'accent' | 'positive' | 'negative' | 'amber'
}

function Metric({ label, value, tone = 'neutral' }: MetricProps) {
  const toneClass = {
    neutral: 'text-cyber-text',
    accent: 'text-neon-purple-bright',
    positive: 'text-neon-green',
    negative: 'text-neon-red',
    amber: 'text-neon-amber',
  }[tone]
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.12em] text-cyber-text-3">{label}</span>
      <span className={`mono-tabular text-[15px] font-semibold leading-tight ${toneClass}`}>{value}</span>
    </div>
  )
}

export function LivePreviewDock({ preview, onSubmit, isValid }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { result, totalCapital, leverage, ready } = preview
  const leverageHot = leverage !== null && leverage >= 3
  const netReturn = result?.netReturn ?? 0
  const profitTone = netReturn >= 0 ? 'positive' : 'negative'

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <div
        className="border-t border-gold/30 bg-cyber-bg/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-xl"
        style={{ boxShadow: '0 -8px 32px -8px rgba(201, 164, 92, 0.28)' }}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mb-2 flex w-full items-center justify-between"
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(201,164,92,0.85)] pulse-dot" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyber-text-2">
              即時試算
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-cyber-text-3">
            <span>{expanded ? '收起' : '展開更多'}</span>
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </div>
        </button>

        <div className="flex items-end justify-between gap-3">
          <Metric
            label="月付金"
            value={ready && result ? formatCurrency(result.monthlyPayment) : '—'}
          />
          <Metric
            label="槓桿"
            value={leverage === null ? '∞' : `${leverage.toFixed(1)}x`}
            tone={leverageHot ? 'amber' : 'accent'}
          />
          <Metric
            label="淨報酬"
            value={ready && result ? formatPercent(result.netReturn) : '—'}
            tone={ready && result ? profitTone : 'neutral'}
          />
        </div>

        {expanded && (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-cyber-border/50 pt-3">
            <Metric label="總投入" value={formatCurrency(totalCapital)} />
            <Metric
              label="總利息"
              value={ready && result ? formatCurrency(result.totalInterest) : '—'}
              tone={ready && result && result.totalInterest > 0 ? 'negative' : 'neutral'}
            />
            <Metric
              label="期末市值"
              value={ready && result ? formatCurrency(result.etfFinalValue) : '—'}
              tone="accent"
            />
            <Metric
              label="ROE"
              value={ready && result ? (result.roe === null ? '全額槓桿' : formatPercent(result.roe)) : '—'}
              tone={ready && result && result.roe !== null && result.roe >= 0 ? 'positive' : ready && result && result.roe !== null ? 'negative' : 'accent'}
            />
          </div>
        )}

        <Button size="default" type="button" onClick={onSubmit} disabled={!isValid} className="mt-3 w-full">
          {netReturn >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>立即試算詳細結果</span>
        </Button>
      </div>
    </div>
  )
}
