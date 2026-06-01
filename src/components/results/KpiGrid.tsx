import type { CalcResult } from '@/lib/calc/engine'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface KpiCardProps {
  label: string
  value: string
  subLabel?: string
  highlight?: 'positive' | 'negative' | 'neutral'
}

function KpiCard({ label, value, subLabel, highlight = 'neutral' }: KpiCardProps) {
  const colorMap = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-900',
  }

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <p className={`mt-1 text-xl font-bold ${colorMap[highlight]}`}>{value}</p>
        {subLabel && <p className="mt-0.5 text-xs text-gray-400">{subLabel}</p>}
      </CardContent>
    </Card>
  )
}

interface Props {
  result: CalcResult
}

export function KpiGrid({ result }: Props) {
  const { monthlyPayment, totalInterest, etfFinalValue, cumulativeDividends, netProfit, netReturn, roe } = result

  const roeStr = roe === null ? '全額槓桿' : formatPercent(roe)
  const roeHighlight: 'positive' | 'negative' | 'neutral' = roe === null ? 'neutral' : roe >= 0 ? 'positive' : 'negative'
  const netHighlight: 'positive' | 'negative' | 'neutral' = netProfit >= 0 ? 'positive' : 'negative'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <KpiCard label="每月還款" value={formatCurrency(monthlyPayment)} subLabel="首期（本金均攤方式）" />
      <KpiCard label="總利息支出" value={formatCurrency(totalInterest)} highlight={totalInterest > 0 ? 'negative' : 'neutral'} />
      <KpiCard label="ETF 最終市值" value={formatCurrency(etfFinalValue)} highlight="positive" />
      <KpiCard label="累計現金股息" value={formatCurrency(cumulativeDividends)} highlight="positive" />
      <KpiCard label="淨利潤" value={formatCurrency(netProfit)} highlight={netHighlight} />
      <KpiCard label="淨報酬率" value={formatPercent(netReturn)} highlight={netReturn >= 0 ? 'positive' : 'negative'} />
      <KpiCard label="ROE（自有資金報酬）" value={roeStr} highlight={roeHighlight} />
    </div>
  )
}
