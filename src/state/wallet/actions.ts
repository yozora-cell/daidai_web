import { createAction } from '@reduxjs/toolkit'
import { BalancesProp } from 'app/state/wallet/types'

export const updateBalances = createAction<BalancesProp>('wallet/updateBalances')
