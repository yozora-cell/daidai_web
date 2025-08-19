import { ChainId } from '@sushiswap/core-sdk'
import { Feature } from 'app/enums'

import { defaultChainId } from './default_chainid'

type FeatureMap = { readonly [chainId in ChainId]?: Feature[] }

const featureList = [
  Feature.HOME,
  Feature.EXPLORE,
  Feature.INO,
  Feature.RANKINGS,
  Feature.METAVERSE,
  Feature.CREATE,
  Feature.ACCOUNT,
  Feature.COLLECTION,
  Feature.AFFILIATE,
  Feature.LIMIT_ORDERS,
  Feature.TRIDENT,
  Feature.GACHA,
]

const featureListNoGacha = [
  Feature.HOME,
  Feature.EXPLORE,
  Feature.INO,
  Feature.RANKINGS,
  Feature.METAVERSE,
  Feature.CREATE,
  Feature.ACCOUNT,
  Feature.COLLECTION,
  Feature.AFFILIATE,
  Feature.LIMIT_ORDERS,
  Feature.TRIDENT,
]

const features: FeatureMap = {
  [ChainId.ETHEREUM]: featureListNoGacha,
  [ChainId.ROPSTEN]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI, Feature.MISO
  ],
  [ChainId.RINKEBY]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI, Feature.MISO
  ],
  [ChainId.GÖRLI]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.BENTOBOX, Feature.KASHI, Feature.MISO
  ],
  [ChainId.KOVAN]: [
    // Feature.AMM,
    // Feature.LIQUIDITY_MINING,
    // Feature.BENTOBOX,
    // Feature.KASHI,
    // Feature.MISO,
    // Feature.TRIDENT,
  ],
  [ChainId.BSC]: featureList,
  [ChainId.BSC_TESTNET]: defaultChainId == ChainId.BSC_TESTNET ? featureList : [],
  [ChainId.FANTOM]: [
    //   Feature.AMM,
    //   Feature.ANALYTICS,
    //   Feature.LIMIT_ORDERS,
    //   Feature.LIQUIDITY_MINING,
    //   Feature.ANALYTICS,
    //   Feature.BENTOBOX,
  ],
  [ChainId.FANTOM_TESTNET]: [
    // Feature.AMM
  ],
  [ChainId.MATIC]: featureListNoGacha,
  [ChainId.MATIC_TESTNET]: [
    //   // Feature.AMM
    //   Feature.HOME,
    //   Feature.EXPLORE,
    //   Feature.INO,
    //   Feature.RANKINGS,
    //   Feature.METAVERSE,
    //   Feature.CREATE,
    //   Feature.ACCOUNT,
    //   Feature.COLLECTION,
    //   Feature.AFFILIATE,
  ],
  [ChainId.RINKEBY]: [
    //   Feature.HOME,
    //   Feature.EXPLORE,
    //   Feature.INO,
    //   Feature.RANKINGS,
    //   Feature.METAVERSE,
    //   Feature.CREATE,
    //   Feature.ACCOUNT,
    //   Feature.COLLECTION,
    //   Feature.AFFILIATE,
  ],
  [ChainId.HECO]: [
    //   Feature.HOME,
    //   Feature.EXPLORE,
    //   Feature.INO,
    //   Feature.RANKINGS,
    //   Feature.METAVERSE,
    //   Feature.CREATE,
    //   Feature.ACCOUNT,
    //   Feature.COLLECTION,
    //   Feature.AFFILIATE,
  ],
  [ChainId.HECO_TESTNET]: [
    //   Feature.HOME,
    //   Feature.EXPLORE,
    //   Feature.INO,
    //   Feature.RANKINGS,
    //   Feature.METAVERSE,
    //   Feature.CREATE,
    //   Feature.ACCOUNT,
    //   Feature.COLLECTION,
    //   Feature.AFFILIATE,
  ],
  [ChainId.HARMONY]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.MISO
  ],
  [ChainId.HARMONY_TESTNET]: [
    // Feature.AMM
  ],
  [ChainId.AVALANCHE]: [
    // Feature.AMM, Feature.BENTOBOX, Feature.KASHI, Feature.LIMIT_ORDERS, Feature.ANALYTICS
  ],
  [ChainId.AVALANCHE_TESTNET]: [
    // Feature.AMM
  ],
  [ChainId.OKEX]: [
    // Feature.AMM
  ],
  [ChainId.OKEX_TESTNET]: [
    // Feature.AMM
  ],
  [ChainId.XDAI]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.BENTOBOX, Feature.KASHI
  ],
  [ChainId.MOONRIVER]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.MISO
  ],
  [ChainId.CELO]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS
  ],
  [ChainId.ARBITRUM]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS, Feature.BENTOBOX, Feature.KASHI
  ],
  [ChainId.FUSE]: [
    // Feature.AMM, Feature.LIQUIDITY_MINING, Feature.ANALYTICS
  ],
  [ChainId.MOONBEAM]: [
    // Feature.AMM, Feature.MISO, Feature.LIQUIDITY_MINING
  ],
}

export default features
