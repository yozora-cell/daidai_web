import { Currency, CurrencyAmount, NATIVE, Token } from '@sushiswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import { useAllTokenBalancesWithLoadingIndicatorV2, useCurrencyBalance } from 'app/state/wallet/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { updateBalances } from './actions'

export default function Updater(): null {
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useDispatch()

  const { data: _balances, loading } = useAllTokenBalancesWithLoadingIndicatorV2()
  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)
  useEffect(() => {
    if (!loading) {
      const res = Object.values(_balances).reduce<CurrencyAmount<Token | Currency>[]>((acc, cur) => {
        acc.push(cur)
        return acc
      }, [])
      if (ethBalance) {
        res.push(ethBalance)
      }
      dispatch(updateBalances({ balances: res, loading: loading }))
    }
  }, [dispatch, _balances, loading, ethBalance])

  return null
}
