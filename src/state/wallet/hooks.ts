import { Interface } from '@ethersproject/abi'
import { Currency, CurrencyAmount, JSBI, NATIVE, Token, ZERO } from '@sushiswap/core-sdk'
import ERC20_ABI from 'app/constants/abis/erc20.json'
import { isAddress } from 'app/functions/validate'
import { useAllTokens } from 'app/hooks/Tokens'
import { useMulticall2Contract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { AppState } from 'app/state'
import { useAppSelector } from 'app/state/hooks'
import { useMultipleContractSingleData, useSingleContractMultipleData } from 'app/state/multicall/hooks'
import { useTokenListOnlyToken } from 'app/state/token/hooks'
import { useMemo } from 'react'

import { TokenBalancesMap } from './types'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Currency> | undefined
} {
  const { chainId } = useActiveWeb3React()
  const multicallContract = useMulticall2Contract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map((address) => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount<Currency> }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value && chainId)
          // @ts-ignore TYPE NEEDS FIXING
          memo[address] = CurrencyAmount.fromRawAmount(NATIVE[chainId], JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, chainId, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): { data: TokenBalancesMap; loading: boolean } {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])
  const ERC20Interface = new Interface(ERC20_ABI)
  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20Interface,
    'balanceOf',
    [address],
    undefined,
    100_000
  )

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances])

  return useMemo(
    () => ({
      data:
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<TokenBalancesMap>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      loading: anyLoading,
    }),
    [address, validatedTokens, anyLoading, balances]
  )
}

export const serializeBalancesMap = (mapping: Record<string, CurrencyAmount<Token>>): string => {
  return Object.entries(mapping)
    .map(([address, currencyAmount]) => currencyAmount.serialize())
    .join()
}

export function useTokenBalances(address?: string, tokens?: (Token | undefined)[]): TokenBalancesMap {
  return useTokenBalancesWithLoadingIndicator(address, tokens).data
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        if (currency.isNative) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): TokenBalancesMap {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  return useTokenBalances(account ?? undefined, allTokensArray)
}

export function useAllTokenBalancesWithLoadingIndicator() {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  return useTokenBalancesWithLoadingIndicator(account ?? undefined, allTokensArray)
}

// 这里直接是根据config/routing.WALLET_ASSETS进行配置的，但是没有图标，好像只有bsc test network没有
export function useAllTokenBalancesWithLoadingIndicatorV2() {
  const { account } = useActiveWeb3React()
  const allTokens = useTokenListOnlyToken()
  return useTokenBalancesWithLoadingIndicator(account ?? undefined, allTokens)
}

export function useAllTokenBalancesWithLoadingIndicatorV2Account(account: string | null | undefined) {
  const allTokens = useTokenListOnlyToken()
  return useTokenBalancesWithLoadingIndicator(account ?? undefined, allTokens)
}

// 通过全局变量来管理用户的balances
export function useBalances(): AppState['wallet'] {
  return useAppSelector((state) => state.wallet)
}

export function useBalancesNoZero(): AppState['wallet'] {
  const balancesObj = useAppSelector((state) => state.wallet)
  if (balancesObj.loading) {
    return {
      balances: [],
      loading: true,
    }
  }
  if (balancesObj.balances) {
    const res = Object.values(balancesObj.balances).reduce<CurrencyAmount<Token | Currency>[]>((acc, cur) => {
      if (cur.greaterThan(ZERO)) acc.push(cur)
      return acc
    }, [])
    return {
      balances: res,
      loading: false,
    }
  } else {
    return {
      balances: [],
      loading: true,
    }
  }
}

// TODO: Replace
// get the total owned, unclaimed, and unharvested UNI for account
// export function useAggregateUniBalance(): CurrencyAmount<Token> | undefined {
//   const { account, chainId } = useActiveWeb3React();

//   const uni = chainId ? UNI[chainId] : undefined;

//   const uniBalance: CurrencyAmount<Token> | undefined = useTokenBalance(
//     account ?? undefined,
//     uni
//   );
//   const uniUnclaimed: CurrencyAmount<Token> | undefined =
//     useUserUnclaimedAmount(account);
//   const uniUnHarvested: CurrencyAmount<Token> | undefined = useTotalUniEarned();

//   if (!uni) return undefined;

//   return CurrencyAmount.fromRawAmount(
//     uni,
//     JSBI.add(
//       JSBI.add(
//         uniBalance?.quotient ?? JSBI.BigInt(0),
//         uniUnclaimed?.quotient ?? JSBI.BigInt(0)
//       ),
//       uniUnHarvested?.quotient ?? JSBI.BigInt(0)
//     )
//   );
// }
