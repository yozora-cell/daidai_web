import { GACHA_GRAPH } from 'app/config/graph'
import { getUserDrawByTxQuery, getUserDrawCountsQuery, getUserDrawQuery } from 'app/services/graph/queries/gacha'
import { request } from 'graphql-request'

// @ts-ignore TYPE NEEDS FIXING
const fetcher = async (chainId: number, query, variables = undefined) => {
  return request(GACHA_GRAPH[chainId], query, variables)
}

export const getUserDrawCounts = async (chainId: number, variables = undefined) => {
  const data = await fetcher(chainId, getUserDrawCountsQuery, variables)
  return data
}

export const getUserDrawByTx = async (chainId: number, variables = undefined) => {
  const data = await fetcher(chainId, getUserDrawByTxQuery, variables)
  return data
}

export const getUserDraw = async (chainId: number, variables = undefined) => {
  const data = await fetcher(chainId, getUserDrawQuery, variables)
  return data
}
