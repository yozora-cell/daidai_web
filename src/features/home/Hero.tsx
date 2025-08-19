import Davatar from '@davatar/react'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
import Button from 'app/components/Button'
import { DiscordIcon, MediumIcon, TelegramIcon, TwitterIcon } from 'app/components/Icon'
import Typography from 'app/components/Typography'
import { defaultChainId } from 'app/config/default_chainid'
import defaultImg from 'app/config/default_img'
import { NETWORK_ICON } from 'app/config/networks'
import ShareUrl from 'app/config/share_url'
import SUPPORTED_NETWORKS from 'app/config/support_networks'
import Image from 'app/features/common/Image'
import { classNames, formatNumber } from 'app/functions'
import { shortenAddress } from 'app/functions'
import useENSName from 'app/hooks/useENSName'
import { useActiveWeb3React } from 'app/services/web3'
import { BASE_INO_OR_COLLECTION } from 'app/types/daidai'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Identicon from 'react-blockies'

import Event from './Event'

const Hero = ({ data, loading }: { data?: BASE_INO_OR_COLLECTION; loading: boolean }) => {
  const router = useRouter()
  const { i18n } = useLingui()
  const { ENSName } = useENSName(data?.owner ?? undefined)
  const { chainId, library, account } = useActiveWeb3React()

  async function addNetwork(chainId: ChainId) {
    if (account) {
      const params = SUPPORTED_NETWORKS[chainId]
      // console.log('params', params)
      await library?.send('wallet_addEthereumChain', [params, account])
    }
  }

  async function addNetworkBscTestNet() {
    addNetwork(ChainId.BSC_TESTNET)
  }

  async function addNetworkBscNet() {
    addNetwork(ChainId.BSC)
  }

  async function addNetworkPolygonNet() {
    addNetwork(ChainId.MATIC)
  }

  return (
    <section className="relative w-full">
      <div
        className="absolute inset-0 bg-center bg-cover bg-base-100 opacity-30 filter webkit-mask -z-10"
        style={{
          backgroundImage: `url(${data?.banner ? data.banner : ''})`,
          filter: 'blur(8px)',
        }}
      ></div>
      <div className="container flex flex-col items-center px-6 py-24 mx-auto lg:flex-row">
        <div className="flex flex-col items-center w-full mb-16 text-center xl:flex-grow lg:w-1/2 xl:pr-24 lg:pr-16 lg:items-start lg:text-left lg:mb-0">
          <div className="flex flex-col">
            <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl text-primary">
              {i18n._(t`Discover INOs and Collect Rare NFTs`)}
              {/* <div className="hidden lg:inline-block">{i18n._(t`extraordinary NFTs`)}</div> */}
            </h1>
            {/* <p className="max-w-xs mb-8 text-lg leading-relaxed text-base-content">
            {i18n._(t`You can buy DAIDAI INO card and the Lucky guys will earn a big reward!`)}
          </p> */}
            <div className="flex flex-row flex-wrap justify-start gap-4 mt-8">
              <Button
                className=""
                onClick={() => {
                  router.push('/explore')
                }}
              >
                {i18n._(t`Start Trading`)}
              </Button>
              {chainId != ChainId.BSC ? (
                <>
                  <button
                    className="gap-2 btn btn-primary btn-outline"
                    onClick={() => {
                      addNetworkBscNet()
                    }}
                  >
                    <Image
                      // @ts-ignore TYPE NEEDS FIXING
                      src={NETWORK_ICON[ChainId.BSC]}
                      alt="Switch Network"
                      className="rounded-full"
                      width="24px"
                      height="24px"
                    />
                    {i18n._(t`Add BSC Network`)}
                  </button>
                </>
              ) : (
                <></>
              )}
              {chainId != ChainId.BSC_TESTNET && defaultChainId == ChainId.BSC_TESTNET ? (
                <>
                  <button
                    className="gap-2 btn btn-primary btn-outline"
                    onClick={() => {
                      addNetworkBscTestNet()
                    }}
                  >
                    <Image
                      // @ts-ignore TYPE NEEDS FIXING
                      src={NETWORK_ICON[ChainId.BSC_TESTNET]}
                      alt="Switch Network"
                      className="rounded-full"
                      width="24px"
                      height="24px"
                    />
                    {i18n._(t`Add BSC Test Network`)}
                  </button>
                </>
              ) : (
                <></>
              )}
              {chainId != ChainId.MATIC ? (
                <>
                  <button
                    className="gap-2 btn btn-primary btn-outline"
                    onClick={() => {
                      addNetworkPolygonNet()
                    }}
                  >
                    <Image
                      // @ts-ignore TYPE NEEDS FIXING
                      src={NETWORK_ICON[ChainId.MATIC]}
                      alt="Switch Network"
                      className="rounded-full"
                      width="24px"
                      height="24px"
                    />
                    {i18n._(t`Add Polygon Network`)}
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-row items-center gap-4 mt-8">
              <a href={ShareUrl.twitter} target="_blank" rel="noreferrer">
                <TwitterIcon width={20} className="" />
              </a>
              <a href={ShareUrl.telegram} target="_blank" rel="noreferrer">
                <TelegramIcon width={20} className="" />
              </a>
              <a href={ShareUrl.medium} target="_blank" rel="noreferrer">
                <MediumIcon width={20} className="" />
              </a>
              <a href={ShareUrl.discord} target="_blank" rel="noreferrer">
                <DiscordIcon width={20} className="" />
              </a>
            </div>
            {/* <div>
            <Link href={'ino'}>
              <a className="inline-flex items-center font-bold text-base-content">
                {i18n._(t`Know More About INO`)}
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </Link>
          </div> */}
          </div>
          <Event />
        </div>
        <div className="w-full xl:max-w-lg xl:w-full lg:w-1/2">
          {!loading && data ? (
            <>
              <div className="p-4 transition border rounded-sm shadow-xl hover:shadow-2xl">
                <div>
                  <Link href={`/ino/${data.chainId}/${data.address}`}>
                    <a className="w-full">
                      <Image
                        className="object-cover object-center rounded"
                        alt="hero"
                        src={data.cover ? data.cover : defaultImg}
                        width={600}
                        height={600}
                        layout="responsive"
                      />
                    </a>
                  </Link>
                </div>
                <div className="w-full mt-4">
                  <Link href={`/ino/${data.chainId}/${data.address}`}>
                    <a className="w-full">
                      <Typography variant="sm" weight={700} className="truncate">
                        {data.name}
                      </Typography>
                    </a>
                  </Link>
                </div>
                <div className="flex flex-row items-center justify-between mt-2">
                  <div className="flex flex-col w-6/12">
                    <div className="flex flex-row items-center">
                      <div className="tooltip" data-tip={ENSName ? ENSName : shortenAddress(data.owner)}>
                        <div className="indicator">
                          <div className="avatar">
                            <div className="w-8 h-8 rounded-full">
                              <Link href={`/account/${data.owner}`}>
                                <a className="w-full">
                                  {data.avatar ? (
                                    <Image
                                      src={data.avatar}
                                      alt="avatar"
                                      // className="rounded-xl"
                                      layout="responsive"
                                      width={32}
                                      height={32}
                                    />
                                  ) : (
                                    <Davatar
                                      size={32}
                                      address={data.owner}
                                      defaultComponent={
                                        <Identicon seed={data.owner} className="!w-8 !h-8 rounded-full" />
                                      }
                                      provider={library}
                                    />
                                  )}
                                </a>
                              </Link>
                            </div>
                          </div>
                          {data.is_verified == 1 && (
                            <>
                              <span className="indicator-item indicator-bottom indicator-end bottom-1 right-1">
                                <BadgeCheckIcon className="w-4 text-info" />
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link href={`/account/${data.owner}`}>
                          <a className="w-full">
                            <Typography variant="sm">{shortenAddress(data.owner)}</Typography>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end w-6/12">
                    <div className="text-right">
                      <Typography variant="sm" weight={700}>
                        {i18n._(t`Amount`)}
                      </Typography>
                      <Typography variant="sm">
                        {Number(data.totalCount) - Number(data.totalSupply)}/{data.totalCount}
                      </Typography>
                    </div>
                    <div className={classNames('ml-4', 'text-right')}>
                      <Typography variant="sm" weight={700}>
                        {i18n._(t`Volume`)}
                      </Typography>
                      <Typography variant="sm">
                        {formatNumber(data.totalVolumeETH)}{' '}
                        <Typography variant="sm" weight={700} className="inline-flex">
                          {/* {data.symbol} */}ETH
                        </Typography>
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {loading ? (
                <>
                  <div className="p-4 border rounded-sm shadow-xl animate-pulse">
                    <div className="rounded bg-base-300 h-[400px] w-full"></div>
                    <div className="flex flex-row items-center justify-between mt-4">
                      <div className="flex flex-col w-6/12">
                        <div className="w-full h-4 rounded bg-base-300"></div>
                        <div className="w-full h-10 mt-1 rounded bg-base-300"></div>
                      </div>
                      <div className="flex flex-row justify-end w-6/12">
                        <div className="h-10 rounded bg-base-300 w-52"></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src={'/images/daidai/nodata.png'}
                    alt="no data"
                    layout="responsive"
                    width={700}
                    height={700}
                  ></Image>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
export default Hero
