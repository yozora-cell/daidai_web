import { createReducer } from '@reduxjs/toolkit'

import { updateIsSigning } from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // 标记是否正在签名
  isSigning: boolean
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  isSigning: false,
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateIsSigning, (state, action) => {
    state.isSigning = action.payload.isSigning
  })
)
