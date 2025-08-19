import { AddressZero } from '@ethersproject/constants'
import { Currency, Token } from '@sushiswap/core-sdk'
import { AppState } from 'app/state'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

export function useTokenList(): Currency[] {
  return useSelector((state: AppState) => state.token.list)
}

export function useTokenListOnlyToken(): Token[] {
  const list = useSelector((state: AppState) => state.token.list)
  const result: Token[] = []
  list.forEach((token) => {
    if (token.isToken) {
      result.push(token)
    }
  })
  return result
}

export function getTokenAddress(token: Currency): string {
  if (token.isNative) {
    return AddressZero
  } else if ('address' in token) {
    return (token as Token).address
  } else {
    throw new Error('Token does not have an address property')
  }
}

export function useTokenByAddressCallback() {
  const tokenList = useTokenList()
  return useCallback(
    (address: string | undefined | null): Currency | undefined => {
      if (!address) {
        return undefined
      }
      if (address.toLocaleLowerCase() === AddressZero.toLocaleLowerCase()) {
        return tokenList.find((token) => {
          return token.isNative
        })
      }
      return tokenList.find((token) => {
        return !token.isNative &&
          token instanceof Token &&
          token.address.toLocaleLowerCase() === address.toLocaleLowerCase()
      })
    },
    [tokenList]
  )
}
