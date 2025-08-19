import { createReducer } from '@reduxjs/toolkit'

import { updateBalances } from './actions'
import { BalancesProp } from './types'

const initialState: BalancesProp = {
  balances: [],
  loading: true,
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateBalances, (state, action) => {
    state.balances = action.payload.balances
    state.loading = action.payload.loading
  })
)
