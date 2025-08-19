import { ChainId } from '@sushiswap/core-sdk'

const RPC = {
  [ChainId.ETHEREUM]: 'https://ethrpc.daidai.io',
  [ChainId.RINKEBY]: 'https://rinkebyrpc.daidai.io/',
  [ChainId.BSC]: 'https://bscrpc.daidai.io/',
  [ChainId.BSC_TESTNET]: 'https://bsctestrpc.daidai.io',
  [ChainId.MATIC]: 'https://polygonrpc.daidai.io/',
  [ChainId.MATIC_TESTNET]: 'https://mumbairpc.daidai.io/',

  [ChainId.ROPSTEN]: 'https://eth-ropsten.alchemyapi.io/v2/cidKix2Xr-snU3f6f6Zjq_rYdalKKHmW',
  [ChainId.GÖRLI]: 'https://eth-goerli.alchemyapi.io/v2/Dkk5d02QjttYEoGmhZnJG37rKt8Yl3Im',
  [ChainId.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/wnW2uNdwqMPes-BCf9lTWb9UHL9QP2dp',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.MOONBEAM_TESTNET]: 'https://rpc.testnet.moonbeam.network',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.AVALANCHE_TESTNET]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com',
  [ChainId.HARMONY]: 'https://api.harmony.one',
  [ChainId.HARMONY_TESTNET]: 'https://api.s0.b.hmny.io',
  [ChainId.OKEX]: 'https://exchainrpc.okex.org',
  [ChainId.OKEX_TESTNET]: 'https://exchaintestrpc.okex.org',
  [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
  [ChainId.PALM]: 'https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267',
  [ChainId.FUSE]: 'https://rpc.fuse.io',
  [ChainId.CELO]: 'https://forno.celo.org',
  [ChainId.MOONRIVER]: 'https://rpc.moonriver.moonbeam.network',
  [ChainId.TELOS]: 'https://mainnet.telos.net/evm',
  [ChainId.MOONBEAM]: 'https://rpc.api.moonbeam.network',
}

export default RPC
