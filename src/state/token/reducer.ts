import { AddressZero } from '@ethersproject/constants'
import { createReducer } from '@reduxjs/toolkit'
import { Currency, NATIVE, Token } from '@sushiswap/core-sdk'
import { TokenSys } from 'app/types/daidai'

import { loadTokenList } from './actions'

export interface TokenState {
  list: Currency[]
}

const initialState: TokenState = {
  list: [],
}

const getToken = (tokenSys: TokenSys): Currency => {
  if (tokenSys.address.toLocaleLowerCase() === AddressZero.toLocaleLowerCase()) {
    const chainId = Number(tokenSys.chainId)
    if (chainId in NATIVE) {
      return NATIVE[chainId]
    } else {
      return new Token(
        Number(tokenSys.chainId),
        tokenSys.address,
        Number(tokenSys.decimals),
        tokenSys.symbol,
        tokenSys.name
      )
    }
  } else {
    return new Token(
      Number(tokenSys.chainId),
      tokenSys.address,
      Number(tokenSys.decimals),
      tokenSys.symbol,
      tokenSys.name
    )
  }
}

export default createReducer(initialState, (builder) =>
  builder.addCase(loadTokenList, (state, action) => {
    const list: Currency[] = []
    action.payload.list.map((item) => {
      list.push(getToken(item))
    })
    state.list = list
  })
)
