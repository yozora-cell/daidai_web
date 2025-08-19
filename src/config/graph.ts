import { AddressMap, ChainId } from '@sushiswap/core-sdk'
import { THE_GRAPH } from 'app/services/graph/constants'

export const GACHA_GRAPH: AddressMap = {
  [ChainId.BSC_TESTNET]: `${THE_GRAPH}/subgraphs/name/ungigdu/bsc-gacha`,
  [ChainId.BSC]: `${THE_GRAPH}/subgraphs/name/ungigdu/bsc-mainnet-gacha`,
}
