import type { RiskRow } from '@/lib/calc/engine'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Props {
  rows: RiskRow[]
}

export function RiskTable({ rows }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-cyber-text">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-red shadow-[0_0_8px_rgba(195,57,47,0.85)]" />
          風險試算：ETF 跌幅情境
        </h3>
        <span className="mono-tabular text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">RISK.MATRIX</span>
      </div>
      <div className="overflow-x-auto rounded-md border border-cyber-border/60">
        <table className="w-full text-sm">
          <thead className="bg-cyber-panel-2/50">
            <tr className="border-b border-cyber-border/70">
              <th className="py-2.5 pl-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-cyber-text-3">ETF跌幅</th>
              <th className="py-2.5 pr-4 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-cyber-text-3">ETF市值</th>
              <th className="py-2.5 pr-4 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-cyber-text-3">未償還貸款</th>
              <th className="py-2.5 pr-3 text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-cyber-text-3">淨資產</th>
            </tr>
          </thead>
          <tbody className="mono-tabular">
            {rows.map((row) => (
              <tr
                key={row.dropPct}
                className={`border-b border-cyber-border/40 last:border-b-0 transition-colors hover:bg-neon-purple/[0.04] ${row.isInsolvable ? 'bg-neon-red/[0.06]' : ''}`}
              >
                <td className="py-2.5 pl-3 pr-4 font-medium">
                  <span className="text-neon-red">▼ {(row.dropPct * 100).toFixed(0)}%</span>
                </td>
                <td className="py-2.5 pr-4 text-right text-cyber-text-2">{formatCurrency(row.etfValue)}</td>
                <td className="py-2.5 pr-4 text-right text-cyber-text-2">{formatCurrency(row.remainingLoan)}</td>
                <td className="py-2.5 pr-3 text-right">
                  <span className={row.netWorth < 0 ? 'font-semibold text-neon-red text-glow-cyan' : 'text-cyber-text'}>
                    {formatCurrency(row.netWorth)}
                  </span>
                  {row.isInsolvable && <Badge variant="destructive" className="ml-2">資不抵債</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 mono-tabular text-[10px] uppercase tracking-[0.15em] text-cyber-text-4">
        // assumes instant drawdown at t=0 to evaluate worst-case leverage exposure
      </p>
    </div>
  )
}
