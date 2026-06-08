import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { AssetGrowthPoint } from '@/lib/calc/engine'
import { formatCurrency } from '@/lib/utils'

interface Props {
  data: AssetGrowthPoint[]
}

const currencyFormatter = (value: number | string | ReadonlyArray<string | number> | undefined) => {
  const resolved = Array.isArray(value) ? value[0] : value
  return formatCurrency(Number(resolved ?? 0))
}

const tooltipStyle = {
  background: 'rgba(24, 34, 27, 0.96)',
  border: '1px solid rgba(201, 164, 92, 0.4)',
  borderRadius: 8,
  fontSize: 12,
  color: '#efe5cf',
  boxShadow: '0 10px 34px -8px rgba(0, 0, 0, 0.6)',
}

const axisTick = { fontSize: 10, fill: '#8e9182', fontFamily: 'JetBrains Mono, monospace' }
const legendStyle = { fontSize: 11, color: '#c7c1a8', paddingTop: 8 }

export function AssetGrowthChart({ data }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-cyber-text">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(201,164,92,0.85)]" />
          資產成長走勢
        </h3>
        <span className="mono-tabular text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">CHART.01</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="purpleLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c9a45c" />
              <stop offset="100%" stopColor="#e7c873" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#33453a" />
          <XAxis dataKey="year" tickFormatter={(v) => `Y${v}`} tick={axisTick} stroke="#46604f" />
          <YAxis tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}萬`} tick={axisTick} stroke="#46604f" width={55} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => currencyFormatter(value)} labelFormatter={(v) => `Year ${v}`} cursor={{ stroke: '#c9a45c', strokeWidth: 1, strokeOpacity: 0.35 }} />
          <Legend wrapperStyle={legendStyle} iconType="plainline" />
          <Line type="monotone" dataKey="etfValue" name="ETF市值" stroke="url(#purpleLine)" strokeWidth={2.2} dot={false} />
          <Line type="monotone" dataKey="remainingLoan" name="未償還貸款" stroke="#cf4a37" strokeWidth={1.8} dot={false} strokeDasharray="5 4" />
          <Line type="monotone" dataKey="netWorth" name="淨資產" stroke="#4ba3b0" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
