// import { ChainSubdomain } from 'app/enums'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// const SUBDOMAIN_CHAIN_ID: { [subdomain: string]: string } = {
//   [ChainSubdomain.ETHEREUM]: '1',
//   [ChainSubdomain.ROPSTEN]: '3',
//   [ChainSubdomain.RINKEBY]: '4',
//   [ChainSubdomain.GÖRLI]: '5',
//   [ChainSubdomain.KOVAN]: '42',
//   [ChainSubdomain.POLYGON]: '137',
//   [ChainSubdomain.BSC]: '56',
//   [ChainSubdomain.FANTOM]: '250',
//   [ChainSubdomain.GNOSIS]: '100',
//   [ChainSubdomain.ARBITRUM]: '42161',
//   [ChainSubdomain.AVALANCHE]: '43114',
//   [ChainSubdomain.HECO]: '128',
//   [ChainSubdomain.HARMONY]: '1666600000',
//   [ChainSubdomain.OKEX]: '66',
//   [ChainSubdomain.CELO]: '42220',
//   [ChainSubdomain.PALM]: '11297108109',
//   [ChainSubdomain.MOONRIVER]: '1285',
//   [ChainSubdomain.FUSE]: '122',
//   [ChainSubdomain.TELOS]: '40',
//   [ChainSubdomain.MOONBEAM]: '1284',
// }

// 这里后面要读取env文件
const DEFAULT_CHAIN_ID = String(process.env.NEXT_PUBLIC_DEFAULT_CHAINID)
// console.log('DEFAULT_CHAIN_ID', DEFAULT_CHAIN_ID)

export function middleware(req: NextRequest) {
  // const response = NextResponse.next()
  // console.log('middleware url', req.url)
  // const chainId = req.cookies['chain-id']

  // const subdomain = req.headers.get('host')?.split('.')[0]

  const res = NextResponse.next()

  // res.headers.set("Access-Control-Allow-Origin", "http://192.168.101.137:3000/");
  // res.headers.set("Access-Control-Allow-Credentials", "true");
  res.cookie('chain-id', DEFAULT_CHAIN_ID)
  return res
}
