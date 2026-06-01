import { describe, it, expect } from 'vitest'
import { pmt, computeLoan, computeEtfGrowth, computeNetProfit, compute } from './engine'

describe('pmt', () => {
  it('computes monthly payment for amortized loan', () => {
    const result = pmt(1_000_000, 0.05, 5)
    expect(result).toBeCloseTo(18871, 0)
  })

  it('handles zero rate: P / n months', () => {
    const result = pmt(120_000, 0, 10)
    expect(result).toBeCloseTo(1000, 4)
  })
})

describe('computeLoan – amortized', () => {
  const params = { principal: 1_000_000, annualRate: 0.05, termYears: 5, repaymentMethod: 'amortized' as const }

  it('monthly payment matches pmt()', () => {
    const { monthlyPayment } = computeLoan(params)
    expect(monthlyPayment).toBeCloseTo(pmt(1_000_000, 0.05, 5), 4)
  })

  it('totalPayment = principal + totalInterest', () => {
    const { totalPayment, totalInterest } = computeLoan(params)
    expect(totalPayment).toBeCloseTo(totalInterest + 1_000_000, 0)
  })

  it('final year remaining balance ≈ 0', () => {
    const { yearlySchedule } = computeLoan(params)
    expect(yearlySchedule.at(-1)?.remainingBalance).toBeCloseTo(0, 0)
  })

  it('zero rate returns principal / n per month', () => {
    const { monthlyPayment } = computeLoan({ principal: 600_000, annualRate: 0, termYears: 5, repaymentMethod: 'amortized' })
    expect(monthlyPayment).toBeCloseTo(10_000, 4)
  })
})

describe('computeLoan – equal-principal', () => {
  it('final year remaining balance ≈ 0', () => {
    const { yearlySchedule } = computeLoan({ principal: 1_200_000, annualRate: 0.04, termYears: 5, repaymentMethod: 'equal-principal' })
    expect(yearlySchedule.at(-1)?.remainingBalance).toBeCloseTo(0, 0)
  })

  it('totalPayment = principal + totalInterest', () => {
    const { totalPayment, totalInterest } = computeLoan({ principal: 1_200_000, annualRate: 0.04, termYears: 5, repaymentMethod: 'equal-principal' })
    expect(totalPayment).toBeCloseTo(totalInterest + 1_200_000, 0)
  })
})

describe('computeLoan – interest-only', () => {
  it('monthly payment = P * r', () => {
    const P = 1_000_000
    const r = 0.05
    const { monthlyPayment } = computeLoan({ principal: P, annualRate: r, termYears: 5, repaymentMethod: 'interest-only' })
    expect(monthlyPayment).toBeCloseTo((P * r) / 12, 4)
  })

  it('balance drops to 0 in final year', () => {
    const { yearlySchedule } = computeLoan({ principal: 1_000_000, annualRate: 0.05, termYears: 5, repaymentMethod: 'interest-only' })
    expect(yearlySchedule.at(-1)?.remainingBalance).toBe(0)
    expect(yearlySchedule.at(-2)?.remainingBalance).toBe(1_000_000)
  })
})

describe('computeEtfGrowth', () => {
  it('no dividends → simple compound growth', () => {
    const { finalValue } = computeEtfGrowth({ initialValue: 1_000_000, annualGrowthRate: 0.08, dividendYield: 0, dividendTaxRate: 0, reinvestRatio: 0, termYears: 5 })
    expect(finalValue).toBeCloseTo(1_000_000 * Math.pow(1.08, 5), 0)
  })

  it('full reinvest → no cash dividends', () => {
    const { cumulativeCashDividends } = computeEtfGrowth({ initialValue: 1_000_000, annualGrowthRate: 0.08, dividendYield: 0.03, dividendTaxRate: 0, reinvestRatio: 1, termYears: 5 })
    expect(cumulativeCashDividends).toBeCloseTo(0, 4)
  })

  it('no reinvest year 1: dividend = initialValue * y', () => {
    const { cumulativeCashDividends, finalValue } = computeEtfGrowth({ initialValue: 1_000_000, annualGrowthRate: 0.08, dividendYield: 0.03, dividendTaxRate: 0, reinvestRatio: 0, termYears: 1 })
    expect(cumulativeCashDividends).toBeCloseTo(30_000, 4)
    expect(finalValue).toBeCloseTo(1_080_000, 4)
  })

  it('with dividend tax: cash = gross * (1 - taxRate)', () => {
    const { cumulativeCashDividends } = computeEtfGrowth({ initialValue: 1_000_000, annualGrowthRate: 0, dividendYield: 0.05, dividendTaxRate: 0.28, reinvestRatio: 0, termYears: 1 })
    expect(cumulativeCashDividends).toBeCloseTo(1_000_000 * 0.05 * (1 - 0.28), 4)
  })

  it('year 0 ETF value = initialValue', () => {
    const { yearlyData } = computeEtfGrowth({ initialValue: 500_000, annualGrowthRate: 0.1, dividendYield: 0.03, dividendTaxRate: 0, reinvestRatio: 0, termYears: 3 })
    expect(yearlyData[0]?.etfValue).toBe(500_000)
    expect(yearlyData).toHaveLength(4)
  })
})

describe('computeNetProfit', () => {
  it('formula: final + cashDiv - ownFunds - loan - interest - fees', () => {
    const result = computeNetProfit(1_500_000, 50_000, 500_000, 1_000_000, 200_000, 10_000)
    expect(result).toBeCloseTo(-160_000, 0)
  })

  it('defaults fees to 0', () => {
    const result = computeNetProfit(1_500_000, 50_000, 500_000, 1_000_000, 200_000)
    expect(result).toBeCloseTo(-150_000, 0)
  })
})

describe('compute – integration', () => {
  const baseParams = {
    loanAmount: 1_000_000,
    annualLoanRate: 0.05,
    termYears: 5,
    repaymentMethod: 'amortized' as const,
    annualGrowthRate: 0.08,
    dividendYield: 0.03,
    dividendPolicy: 'none' as const,
    customReinvestRatio: 0,
    ownFunds: 500_000,
    dividendTaxRate: 0.28,
    tradingTaxRate: 0.001,
    brokerageRate: 0.001425,
    brokerageDiscount: 0.6,
  }

  it('roe is null when ownFunds = 0', () => {
    const result = compute({ ...baseParams, ownFunds: 0 })
    expect(result.roe).toBeNull()
  })

  it('netReturn = netProfit / C0', () => {
    const result = compute(baseParams)
    const C0 = 1_000_000 + 500_000
    expect(result.netReturn).toBeCloseTo(result.netProfit / C0, 8)
  })

  it('produces 3 scenarios', () => {
    const result = compute(baseParams)
    expect(result.scenarios).toHaveLength(3)
  })

  it('produces 5 risk rows', () => {
    const result = compute(baseParams)
    expect(result.riskRows).toHaveLength(5)
  })

  it('risk row with 50% drop and high leverage is insolvable', () => {
    const result = compute({ ...baseParams, loanAmount: 900_000, ownFunds: 100_000 })
    const row50 = result.riskRows.find((r) => r.dropPct === 0.5)
    expect(row50?.isInsolvable).toBe(true)
  })

  it('assetGrowthData has termYears+1 points', () => {
    const result = compute(baseParams)
    expect(result.assetGrowthData).toHaveLength(baseParams.termYears + 1)
  })

  it('cashFlowData has termYears points', () => {
    const result = compute(baseParams)
    expect(result.cashFlowData).toHaveLength(baseParams.termYears)
  })
})
