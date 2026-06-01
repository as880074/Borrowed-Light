export type RepaymentMethod = 'amortized' | 'equal-principal' | 'interest-only'
export type DividendPolicy = 'none' | 'full' | 'custom'

export interface LoanParams {
  principal: number
  annualRate: number
  termYears: number
  repaymentMethod: RepaymentMethod
}

export interface LoanScheduleYear {
  year: number
  remainingBalance: number
  annualPayment: number
  annualPrincipal: number
  annualInterest: number
}

export interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  yearlySchedule: LoanScheduleYear[]
}

export interface EtfParams {
  initialValue: number
  annualGrowthRate: number
  dividendYield: number
  dividendTaxRate: number
  reinvestRatio: number
  termYears: number
}

export interface EtfYearResult {
  year: number
  etfValue: number
  dividendGross: number
  dividendNet: number
  dividendReinvested: number
  dividendCash: number
  cumulativeCash: number
}

export interface EtfResult {
  finalValue: number
  cumulativeCashDividends: number
  yearlyData: EtfYearResult[]
}

export interface CalcParams {
  loanAmount: number
  annualLoanRate: number
  termYears: number
  repaymentMethod: RepaymentMethod
  annualGrowthRate: number
  dividendYield: number
  dividendPolicy: DividendPolicy
  customReinvestRatio: number
  ownFunds: number
  dividendTaxRate: number
  tradingTaxRate: number
  brokerageRate: number
  brokerageDiscount: number
}

export interface ScenarioResult {
  label: string
  growthRate: number
  netProfit: number
  netReturn: number
  roe: number | null
}

export interface AssetGrowthPoint {
  year: number
  etfValue: number
  remainingLoan: number
  netWorth: number
}

export interface CashFlowPoint {
  year: number
  annualPayment: number
  cashDividend: number
  netCashFlow: number
}

export interface RiskRow {
  dropPct: number
  etfValue: number
  remainingLoan: number
  netWorth: number
  isInsolvable: boolean
}

export interface CalcResult {
  loanResult: LoanResult
  etfResult: EtfResult
  monthlyPayment: number
  totalInterest: number
  etfFinalValue: number
  cumulativeDividends: number
  netProfit: number
  netReturn: number
  roe: number | null
  assetGrowthData: AssetGrowthPoint[]
  cashFlowData: CashFlowPoint[]
  scenarios: ScenarioResult[]
  riskRows: RiskRow[]
}

export function pmt(principal: number, annualRate: number, termYears: number): number {
  const n = termYears * 12
  if (n === 0) return 0
  if (annualRate === 0) return principal / n
  const r = annualRate / 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function computeLoan(params: LoanParams): LoanResult {
  const { principal: P, annualRate, termYears, repaymentMethod } = params
  const r = annualRate / 12
  const n = termYears * 12

  if (repaymentMethod === 'amortized') {
    const monthlyPayment = pmt(P, annualRate, termYears)
    const totalInterest = monthlyPayment * n - P
    const totalPayment = P + totalInterest
    const yearlySchedule: LoanScheduleYear[] = []
    let balance = P

    for (let year = 1; year <= termYears; year++) {
      let annualPrincipal = 0
      let annualInterest = 0
      for (let m = 0; m < 12; m++) {
        const interest = balance * r
        const principal = monthlyPayment - interest
        annualInterest += interest
        annualPrincipal += principal
        balance = Math.max(0, balance - principal)
      }
      yearlySchedule.push({
        year,
        remainingBalance: balance,
        annualPayment: monthlyPayment * 12,
        annualPrincipal,
        annualInterest,
      })
    }

    return { monthlyPayment, totalPayment, totalInterest, yearlySchedule }
  }

  if (repaymentMethod === 'equal-principal') {
    const monthlyPrincipal = n === 0 ? 0 : P / n
    const monthlyPaymentFirst = monthlyPrincipal + P * r
    const yearlySchedule: LoanScheduleYear[] = []
    let balance = P
    let totalInterest = 0

    for (let year = 1; year <= termYears; year++) {
      let annualPrincipal = 0
      let annualInterest = 0
      let annualPayment = 0
      for (let m = 0; m < 12; m++) {
        const interest = balance * r
        annualInterest += interest
        annualPrincipal += monthlyPrincipal
        annualPayment += monthlyPrincipal + interest
        totalInterest += interest
        balance = Math.max(0, balance - monthlyPrincipal)
      }
      yearlySchedule.push({
        year,
        remainingBalance: balance,
        annualPayment,
        annualPrincipal,
        annualInterest,
      })
    }

    return {
      monthlyPayment: monthlyPaymentFirst,
      totalPayment: P + totalInterest,
      totalInterest,
      yearlySchedule,
    }
  }

  const monthlyPayment = annualRate === 0 ? 0 : P * r
  const totalInterest = monthlyPayment * n
  const yearlySchedule: LoanScheduleYear[] = []

  for (let year = 1; year <= termYears; year++) {
    const isLast = year === termYears
    yearlySchedule.push({
      year,
      remainingBalance: isLast ? 0 : P,
      annualPayment: isLast ? monthlyPayment * 12 + P : monthlyPayment * 12,
      annualPrincipal: isLast ? P : 0,
      annualInterest: monthlyPayment * 12,
    })
  }

  return { monthlyPayment, totalPayment: P + totalInterest, totalInterest, yearlySchedule }
}

export function computeEtfGrowth(params: EtfParams): EtfResult {
  const {
    initialValue,
    annualGrowthRate: g,
    dividendYield: y,
    dividendTaxRate,
    reinvestRatio,
    termYears,
  } = params

  let value = initialValue
  let cumulativeCash = 0
  const yearlyData: EtfYearResult[] = [
    {
      year: 0,
      etfValue: initialValue,
      dividendGross: 0,
      dividendNet: 0,
      dividendReinvested: 0,
      dividendCash: 0,
      cumulativeCash: 0,
    },
  ]

  for (let year = 1; year <= termYears; year++) {
    const startValue = value
    const dividendGross = startValue * y
    const dividendNet = dividendGross * (1 - dividendTaxRate)
    const dividendReinvested = dividendNet * reinvestRatio
    const dividendCash = dividendNet * (1 - reinvestRatio)
    value = startValue * (1 + g) + dividendReinvested
    cumulativeCash += dividendCash

    yearlyData.push({
      year,
      etfValue: value,
      dividendGross,
      dividendNet,
      dividendReinvested,
      dividendCash,
      cumulativeCash,
    })
  }

  return { finalValue: value, cumulativeCashDividends: cumulativeCash, yearlyData }
}

function getReinvestRatio(policy: DividendPolicy, customRatio: number): number {
  if (policy === 'none') return 0
  if (policy === 'full') return 1
  return customRatio
}

export function computeNetProfit(
  etfFinalValue: number,
  cumulativeCashDividends: number,
  ownFunds: number,
  loanPrincipal: number,
  totalInterest: number,
  fees = 0,
): number {
  return etfFinalValue + cumulativeCashDividends - ownFunds - loanPrincipal - totalInterest - fees
}

export function compute(params: CalcParams): CalcResult {
  const {
    loanAmount,
    annualLoanRate,
    termYears,
    repaymentMethod,
    annualGrowthRate,
    dividendYield,
    dividendPolicy,
    customReinvestRatio,
    ownFunds,
    dividendTaxRate,
    tradingTaxRate,
    brokerageRate,
    brokerageDiscount,
  } = params

  const C0 = ownFunds + loanAmount
  const reinvestRatio = getReinvestRatio(dividendPolicy, customReinvestRatio)
  const effectiveBrokerage = brokerageRate * (1 - brokerageDiscount)

  const loanResult = computeLoan({ principal: loanAmount, annualRate: annualLoanRate, termYears, repaymentMethod })
  const etfResult = computeEtfGrowth({ initialValue: C0, annualGrowthRate, dividendYield, dividendTaxRate, reinvestRatio, termYears })

  const { finalValue: etfFinalValue, cumulativeCashDividends, yearlyData } = etfResult
  const { totalInterest, yearlySchedule, monthlyPayment } = loanResult

  const buyFee = C0 * effectiveBrokerage
  const sellFee = etfFinalValue * (tradingTaxRate + effectiveBrokerage)
  const fees = buyFee + sellFee

  const netProfit = computeNetProfit(etfFinalValue, cumulativeCashDividends, ownFunds, loanAmount, totalInterest, fees)
  const netReturn = C0 > 0 ? netProfit / C0 : 0
  const roe = ownFunds === 0 ? null : netProfit / ownFunds

  const assetGrowthData: AssetGrowthPoint[] = yearlyData.map((d, i) => {
    const remainingLoan = i === 0 ? loanAmount : (yearlySchedule[i - 1]?.remainingBalance ?? 0)
    return { year: d.year, etfValue: d.etfValue, remainingLoan, netWorth: d.etfValue - remainingLoan }
  })

  const cashFlowData: CashFlowPoint[] = yearlySchedule.map((ls, i) => {
    const cashDividend = yearlyData[i + 1]?.dividendCash ?? 0
    return { year: ls.year, annualPayment: ls.annualPayment, cashDividend, netCashFlow: cashDividend - ls.annualPayment }
  })

  const baseLabel = `基準 ${(annualGrowthRate * 100).toFixed(0)}%`
  const scenarioRates = [
    { label: '悲觀 3%', rate: 0.03 },
    { label: baseLabel, rate: annualGrowthRate },
    { label: '樂觀 12%', rate: 0.12 },
  ]

  const scenarios: ScenarioResult[] = scenarioRates.map(({ label, rate }) => {
    const scenarioEtf = computeEtfGrowth({ initialValue: C0, annualGrowthRate: rate, dividendYield, dividendTaxRate, reinvestRatio, termYears })
    const scenarioFees = buyFee + scenarioEtf.finalValue * (tradingTaxRate + effectiveBrokerage)
    const scenarioProfit = computeNetProfit(scenarioEtf.finalValue, scenarioEtf.cumulativeCashDividends, ownFunds, loanAmount, totalInterest, scenarioFees)
    return {
      label,
      growthRate: rate,
      netProfit: scenarioProfit,
      netReturn: C0 > 0 ? scenarioProfit / C0 : 0,
      roe: ownFunds === 0 ? null : scenarioProfit / ownFunds,
    }
  })

  const riskRows: RiskRow[] = [0.1, 0.2, 0.3, 0.4, 0.5].map((drop) => {
    const etfValue = C0 * (1 - drop)
    const remainingLoan = loanAmount
    const netWorth = etfValue - remainingLoan
    return { dropPct: drop, etfValue, remainingLoan, netWorth, isInsolvable: netWorth < 0 }
  })

  return {
    loanResult,
    etfResult,
    monthlyPayment,
    totalInterest,
    etfFinalValue,
    cumulativeDividends: cumulativeCashDividends,
    netProfit,
    netReturn,
    roe,
    assetGrowthData,
    cashFlowData,
    scenarios,
    riskRows,
  }
}
