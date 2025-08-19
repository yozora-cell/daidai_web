import { BadgeCheckIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CopyHelper from 'app/components/AccountDetails/Copy'
import AutoLink from 'app/components/AutoLink'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import Share from 'app/features/collection/detail/Share'
import Image from 'app/features/common/Image'
import { formatNumber, formatNumberScale, getExplorerLink, isAddress, shortenAddress } from 'app/functions'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { useActiveWeb3React } from 'app/services/web3'
import { Collection } from 'app/types/daidai'
import Link from 'next/link'
import { Fragment, useMemo } from 'react'

import Socials from './detail/Socials'

const Header = ({ address, data }: { address: string; data: Collection }) => {
  const { i18n } = useLingui()
  const { library, chainId } = useActiveWeb3React()
  const breakpoint = useBreakPointMediaQuery()
  const isSm = useMemo(() => {
    if (breakpoint == BreakPoint.DEFAULT || breakpoint == BreakPoint.SM) {
      return true
    }
    return false
  }, [breakpoint])

  return (
    <>
      <div className="w-full bg-base-300 max-h-[320px] overflow-hidden relative">
        <div className="pb-[25%] h-0">
          <Image
            src={data.banner ? data.banner : defaultImg}
            alt="collection banner"
            layout="fill"
            className="object-cover"
            quality={100}
          />
        </div>
      </div>
      <div className="w-full px-4 lg:px-8">
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="border-base-100 border-[6px] border-solid rounded-2xl h-[90px] w-[90px] sm:h-[120px] sm:w-[120px] lg:h-[180px] lg:w-[180px] overflow-hidden shadow-lg mt-[-36px] sm:mt-[-86px] lg:mt-[-156px] z-10">
              <div className="relative w-full h-full">
                <Image src={data.avatar ? data.avatar : defaultImg} alt="avatar" layout="fill" />
              </div>
            </div>
            {isSm ? (
              <>
                <div className="flex flex-row items-center justify-end gap-4">
                  <Socials data={data} isExtend={false}></Socials>
                  <Share
                    className="w-5 h-5 cursor-pointer"
                    title={data.name ?? ''}
                    classNameButton="h-[52px]"
                    isRound={true}
                  ></Share>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2 mt-4">
              <Typography variant="h2" weight={700}>
                {data.name}
              </Typography>
              {data.is_verified == 1 && (
                <>
                  <BadgeCheckIcon className="w-6 h-6 text-info" />
                </>
              )}
            </div>
            {!isSm ? (
              <>
                <div className="flex flex-row items-center justify-end gap-4">
                  <Socials data={data} isExtend={true}></Socials>
                  <Share
                    className="w-5 h-5 cursor-pointer"
                    title={data.name ?? ''}
                    classNameButton="h-[52px]"
                    isRound={true}
                  ></Share>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-row items-center mt-4">
            <CopyHelper toCopy={address} className="opacity-100 text-primary">
              {isAddress(address) ? shortenAddress(address) : 'Unknown'}
            </CopyHelper>
            <Link href={getExplorerLink(chainId, address, 'address')} passHref={true}>
              <a target="_blank">
                <ExternalLinkIcon className="inline-flex w-4 ml-2" />
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 md:gap-12 md:grid-cols-4 w-fit mt-9">
            <div className="flex flex-col items-start gap-2">
              <Typography weight={700} className="text-xl">
                {formatNumberScale(data.totalSupply)}
              </Typography>
              <Typography className="text-base text-primary/50">{i18n._(t`Items`)}</Typography>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Typography weight={700} className="text-xl">
                {formatNumberScale(data.listed)}
              </Typography>
              <Typography className="text-base text-primary/50">{i18n._(t`Items listed`)}</Typography>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Typography weight={700} className="text-xl">
                {formatNumber(data.floorPrice)}
              </Typography>
              <Typography className="text-base text-primary/50">{i18n._(t`Floor Price`)}(ETH)</Typography>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Typography weight={700} className="text-xl">
                {formatNumber(data.totalVolumeETH)}
              </Typography>
              <Typography className="text-base text-primary/50">{i18n._(t`Total Volume`)}(ETH)</Typography>
            </div>
          </div>
          <div className="mt-9">
            <Typography variant="base" className="leading-normal whitespace-pre-line text-base-content text-opacity-60">
              {/* {data.description} */}
              {AutoLink({
                text: data.description ?? '',
              })}
            </Typography>
          </div>
        </div>
      </div>
    </>
  )
}
export default Header
