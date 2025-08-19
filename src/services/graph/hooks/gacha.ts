import { getUserDraw, getUserDrawByTx, getUserDrawCounts } from 'app/services/graph/fetchers/gacha'
import { useChainId } from 'app/state/application/hooks'
import stringify from 'fast-json-stable-stringify'
import useSWR, { SWRConfiguration } from 'swr'

interface useGachaProps {
  variables?: { [key: string]: any }
  shouldFetch?: boolean
  swrConfig?: SWRConfiguration
}

export function useUserDrawCounts({ variables, shouldFetch = true, swrConfig = undefined }: useGachaProps = {}) {
  const chainId = useChainId()
  const { data } = useSWR(
    shouldFetch ? ['getUserDrawCounts', stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getUserDrawCounts(chainId, variables),
    swrConfig
  )
  return data
}

export function useUserDrawByTx({ variables, shouldFetch = true, swrConfig = undefined }: useGachaProps = {}) {
  const chainId = useChainId()
  const { data } = useSWR(
    shouldFetch ? ['getUserDrawByTx', stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getUserDrawByTx(chainId, variables),
    swrConfig
  )
  return data
}

export function useUserDraw({ variables, shouldFetch = true, swrConfig = undefined }: useGachaProps = {}) {
  const chainId = useChainId()
  const { data } = useSWR(
    shouldFetch ? ['getUserDraw', stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getUserDraw(chainId, variables),
    swrConfig
  )
  return data
}
