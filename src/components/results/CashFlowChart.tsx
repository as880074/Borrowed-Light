import type { ReactElement } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import type { DotProps } from 'recharts'
import type { CashFlowPoint } from '@/lib/calc/engine'

interface Props {
  data: CashFlowPoint[]
}

function NetCashDot(props: DotProps & { payload?: CashFlowPoint }): ReactElement | null {
  const { cx, cy, payload } = props
  if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) {
    return null
  }

  const isNeg = payload.netCashFlow < 0
  return <circle cx={cx} cy={cy} r={3} fill={isNeg ? '#dc2626' : '#2563eb'} />
}

export function CashFlowChart({ data }: Props) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-gray-800">年度現金流量</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tickFormatter={(v) => `第${v}年`} tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}萬`} tick={{ fontSize: 11 }} width={55} />
          <Tooltip
            formatter={(value, name) => [`${(Number(value ?? 0) / 10000).toFixed(1)}萬`, String(name)]}
            labelFormatter={(v) => `第 ${v} 年`}
          />
          <Legend />
          <Bar dataKey="annualPayment" name="年還款金額" fill="#fca5a5">
            {data.map((_, index) => (
              <Cell key={`pay-${index}`} fill="#fca5a5" />
            ))}
          </Bar>
          <Bar dataKey="cashDividend" name="現金股息" fill="#86efac" />
          <Line type="monotone" dataKey="netCashFlow" name="淨現金流" stroke="#2563eb" strokeWidth={2} dot={<NetCashDot />} />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-1 text-xs text-gray-400">淨現金流為負（藍點顯示為紅色）表示該年度需額外補貼利差</p>
    </div>
  )
}
