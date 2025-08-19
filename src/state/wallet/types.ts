import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'

type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>

export interface BalancesProp {
  balances: CurrencyAmount<Currency>[]
  loading: boolean
}
