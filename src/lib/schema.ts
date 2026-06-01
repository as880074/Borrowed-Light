import { z } from 'zod'

export const formSchema = z.object({
  loanAmount: z.number({ error: '請輸入金額' }).min(0, '金額不得為負'),
  annualLoanRatePct: z.number({ error: '請輸入利率' }).min(0, '利率不得為負').max(50, '利率過高'),
  termYears: z.number({ error: '請輸入年期' }).int('年期需為整數').min(1, '最少1年').max(40, '最多40年'),
  repaymentMethod: z.enum(['amortized', 'equal-principal', 'interest-only']),
  etfSymbol: z.string().optional(),
  annualGrowthRatePct: z.number({ error: '請輸入報酬率' }).min(-50).max(100),
  dividendYieldPct: z.number({ error: '請輸入殖利率' }).min(0).max(50),
  dividendPolicy: z.enum(['none', 'full', 'custom']),
  customReinvestRatioPct: z.number({ error: '請輸入比例' }).min(0).max(100),
  ownFunds: z.number({ error: '請輸入自有資金' }).min(0, '金額不得為負'),
  dividendTaxRatePct: z.number({ error: '請輸入股息稅率' }).min(0).max(100),
  tradingTaxRatePct: z.number({ error: '請輸入證交稅率' }).min(0).max(5),
  brokerageRatePct: z.number({ error: '請輸入手續費率' }).min(0).max(5),
  brokerageDiscountPct: z.number({ error: '請輸入手續費折扣' }).min(0).max(100),
}).refine(
  (data) => data.loanAmount + data.ownFunds > 0,
  { message: '貸款金額與自有資金不可同時為零', path: ['loanAmount'] },
)

export type FormValues = z.infer<typeof formSchema>

export const DEFAULT_VALUES: FormValues = {
  loanAmount: 1_000_000,
  annualLoanRatePct: 3.5,
  termYears: 7,
  repaymentMethod: 'amortized',
  etfSymbol: '0050',
  annualGrowthRatePct: 8,
  dividendYieldPct: 3,
  dividendPolicy: 'none',
  customReinvestRatioPct: 50,
  ownFunds: 300_000,
  dividendTaxRatePct: 28,
  tradingTaxRatePct: 0.1,
  brokerageRatePct: 0.1425,
  brokerageDiscountPct: 60,
}
