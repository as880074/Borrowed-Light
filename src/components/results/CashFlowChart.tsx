import type { ReactElement } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { DotProps } from 'recharts'
import type { CashFlowPoint } from '@/lib/calc/engine'

interface Props {
  data: CashFlowPoint[]
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

function NetCashDot(props: DotProps & { payload?: CashFlowPoint }): ReactElement | null {
  const { cx, cy, payload } = props
  if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) {
    return null
  }

  const isNeg = payload.netCashFlow < 0
  const color = isNeg ? '#cf4a37' : '#4ba3b0'
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} fillOpacity={0.18} />
      <circle cx={cx} cy={cy} r={2.5} fill={color} />
    </g>
  )
}

export function CashFlowChart({ data }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-cyber-text">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(75,163,176,0.8)]" />
          年度現金流量
        </h3>
        <span className="mono-tabular text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">CHART.02</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#33453a" />
          <XAxis dataKey="year" tickFormatter={(v) => `Y${v}`} tick={axisTick} stroke="#46604f" />
          <YAxis tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}萬`} tick={axisTick} stroke="#46604f" width={55} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [`${(Number(value ?? 0) / 10000).toFixed(1)}萬`, String(name)]}
            labelFormatter={(v) => `Year ${v}`}
            cursor={{ fill: 'rgba(201, 164, 92, 0.07)' }}
          />
          <Legend wrapperStyle={legendStyle} iconType="square" />
          <Bar dataKey="annualPayment" name="年還款金額" fill="#cf4a37" fillOpacity={0.55} stroke="#cf4a37" strokeOpacity={0.7} strokeWidth={1} />
          <Bar dataKey="cashDividend" name="現金股息" fill="#6aa15f" fillOpacity={0.5} stroke="#6aa15f" strokeOpacity={0.7} strokeWidth={1} />
          <Line type="monotone" dataKey="netCashFlow" name="淨現金流" stroke="#c9a45c" strokeWidth={2} dot={<NetCashDot />} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-2 mono-tabular text-[10px] uppercase tracking-[0.15em] text-cyber-text-4">
        // negative net cash flow (red node) indicates capital injection required
      </p>
    </div>
  )
}
