export const AUTH_ERROR = '__AUTH_EXPIRED__'

export interface SavingsHistoryInput {
  id: string
  type: 'add' | 'subtract'
  amount: number
  balanceAfter: number
  date: string
}

export interface CustomSeserahanInput {
  id: string
  label: string
}

export interface VendorPaymentInput {
  id: string
  name: string
  category: string
  totalAmount: number
  paidAmount: number
  dueDate: string
  installments?: {
    id: string
    amount: number
    date: string
  }[]
}
