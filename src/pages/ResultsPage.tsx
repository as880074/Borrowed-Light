import type { CalcResult } from '@/lib/calc/engine'
import type { FormValues } from '@/lib/schema'
import { KpiGrid } from '@/components/results/KpiGrid'
import { AssetGrowthChart } from '@/components/results/AssetGrowthChart'
import { CashFlowChart } from '@/components/results/CashFlowChart'
import { ScenarioChart } from '@/components/results/ScenarioChart'
import { RiskTable } from '@/components/results/RiskTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Share2, BarChart3, ShieldAlert } from 'lucide-react'
import { buildResultsUrl } from '@/lib/url'
import { formatNumber } from '@/lib/utils'
import { asset } from '@/lib/asset'

interface Props {
  result: CalcResult
  formValues: FormValues
  onBack: () => void
}

interface MetaCellProps {
  label: string
  value: string
  unit?: string
  accent?: boolean
}

function MetaCell({ label, value, unit, accent }: MetaCellProps) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3">
      <span className="text-[11px] tracking-wide text-cyber-text-3">{label}</span>
      <span className={`mono-tabular text-[15px] font-semibold ${accent ? 'text-neon-purple-bright' : 'text-cyber-text'}`}>
        {value}
        {unit && <span className="ml-1 text-[10px] font-normal text-cyber-text-3">{unit}</span>}
      </span>
    </div>
  )
}

export function ResultsPage({ result, formValues, onBack }: Props) {
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}${buildResultsUrl(formValues)}`
    try {
      await navigator.clipboard.writeText(url)
      window.alert('連結已複製到剪貼簿！')
    } catch {
      window.prompt('複製以下連結分享：', url)
    }
  }

  const { loanResult } = result
  // 由輸入參數推導的確定性執行代號(純函式,render 安全)
  const runId = Math.abs(
    formValues.loanAmount + formValues.termYears * 31 + Math.round(formValues.annualLoanRatePct * 100),
  )
    .toString(36)
    .slice(-4)
    .toUpperCase()
    .padStart(4, '0')
  const repayMethodLabels: Record<FormValues['repaymentMethod'], string> = {
    amortized: '本息均攤',
    'equal-principal': '本金均攤',
    'interest-only': '只還利息',
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-cyber-border/60 bg-cyber-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              <span>返回</span>
            </Button>
            <div className="hidden h-6 w-px bg-cyber-border sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <img src={asset('seal.svg')} alt="借物之光 落款印" className="h-5 w-5" />
              <h1 className="font-display text-sm font-semibold tracking-tight text-cyber-text">
                Simulation Result
                <span className="mono-tabular ml-2 text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">/ RUN.{runId}</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="mono-tabular hidden items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-neon-green text-glow-cyan md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-green pulse-dot" />
              ENGINE READY
            </span>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-3.5 w-3.5" />
              <span>分享</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-5 py-6">
        {/* Run Parameters — 乾淨和紙面板(無角飾/木框,以可讀性優先) */}
        <div className="cyber-panel relative overflow-hidden rounded-xl">
          <div className="flex items-center justify-between gap-3 border-b border-cyber-border/70 px-5 py-3.5">
            <h3 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-cyber-text">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(75,163,176,0.8)]" />
              Run Parameters
            </h3>
            <span className="mono-tabular text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">META</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-cyber-border/50 sm:grid-cols-4">
            <MetaCell label="貸款" value={formatNumber(formValues.loanAmount)} unit="TWD" />
            <MetaCell label="利率" value={formValues.annualLoanRatePct.toString()} unit="%" accent />
            <MetaCell label="年期" value={formValues.termYears.toString()} unit="YR" />
            <MetaCell label="還款" value={repayMethodLabels[formValues.repaymentMethod]} />
            <MetaCell label="年化成長" value={formValues.annualGrowthRatePct.toString()} unit="%" accent />
            <MetaCell label="殖利率" value={formValues.dividendYieldPct.toString()} unit="%" />
            <MetaCell label="自有資金" value={formatNumber(formValues.ownFunds)} unit="TWD" />
            <MetaCell label="總利息" value={formatNumber(loanResult.totalInterest)} unit="TWD" />
          </div>
        </div>

        <KpiGrid result={result} />

        <Card>
          <CardHeader>
            <CardTitle>
              <BarChart3 className="h-3.5 w-3.5 text-neon-purple-bright" />
              Visualization
            </CardTitle>
            <span className="mono-tabular text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">CHARTS</span>
          </CardHeader>
          <CardContent className="space-y-9">
            <AssetGrowthChart data={result.assetGrowthData} />
            <div className="relative h-10 overflow-hidden" aria-hidden>
              <img
                src={asset('ornaments/katana-meter.png')}
                alt=""
                className="pointer-events-none absolute left-1/2 top-1/2 w-[min(100%,520px)] -translate-x-1/2 -translate-y-1/2 select-none opacity-90 [mask-image:radial-gradient(ellipse_58%_62%_at_center,#000_26%,transparent_76%)]"
              />
            </div>
            <CashFlowChart data={result.cashFlowData} />
            <div className="relative h-10 overflow-hidden" aria-hidden>
              <img
                src={asset('ornaments/katana-meter.png')}
                alt=""
                className="pointer-events-none absolute left-1/2 top-1/2 w-[min(100%,520px)] -translate-x-1/2 -translate-y-1/2 select-none opacity-90 [mask-image:radial-gradient(ellipse_58%_62%_at_center,#000_26%,transparent_76%)]"
              />
            </div>
            <ScenarioChart scenarios={result.scenarios} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <ShieldAlert className="h-3.5 w-3.5 text-neon-red" />
              Stress Matrix
            </CardTitle>
            <span className="mono-tabular text-[10px] uppercase tracking-[0.2em] text-cyber-text-3">RISK</span>
          </CardHeader>
          <CardContent>
            <RiskTable rows={result.riskRows} />
          </CardContent>
        </Card>

        <div className="rounded-md border border-cyber-border/50 bg-cyber-panel/40 p-3">
          <p className="mono-tabular text-center text-[10px] uppercase tracking-[0.18em] text-cyber-text-4">
            // disclaimer · 本試算工具僅供參考，不構成投資建議 · leverage carries material risk
          </p>
        </div>
      </main>
    </div>
  )
}
