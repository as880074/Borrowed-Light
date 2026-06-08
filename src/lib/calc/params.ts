import type { CalcParams } from './engine'
import type { FormValues } from '@/lib/schema'

export function formValuesToCalcParams(values: FormValues): CalcParams {
  return {
    loanAmount: values.loanAmount,
    annualLoanRate: values.annualLoanRatePct / 100,
    termYears: values.termYears,
    repaymentMethod: values.repaymentMethod,
    annualGrowthRate: values.annualGrowthRatePct / 100,
    dividendYield: values.dividendYieldPct / 100,
    dividendPolicy: values.dividendPolicy,
    customReinvestRatio: values.customReinvestRatioPct / 100,
    ownFunds: values.ownFunds,
    dividendTaxRate: values.dividendTaxRatePct / 100,
    tradingTaxRate: values.tradingTaxRatePct / 100,
    brokerageRate: values.brokerageRatePct / 100,
    brokerageDiscount: values.brokerageDiscountPct / 100,
  }
}
