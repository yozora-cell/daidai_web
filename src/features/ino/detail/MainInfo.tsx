import { BadgeCheckIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import { useLingui } from '@lingui/react'
import CopyHelper from 'app/components/AccountDetails/Copy'
import AutoLink from 'app/components/AutoLink'
import Typography from 'app/components/Typography'
import Share from 'app/features/collection/detail/Share'
import Socials from 'app/features/collection/detail/Socials'
import Image from 'app/features/common/Image'
import { getExplorerLink, isAddress, shortenAddress } from 'app/functions'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { useActiveWeb3React } from 'app/services/web3'
import { BASE_INO_OR_COLLECTION } from 'app/types/daidai'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const MainInfo = ({ data }: { data: BASE_INO_OR_COLLECTION }) => {
  const { i18n } = useLingui()
  const breakpoint = useBreakPointMediaQuery()
  const isSm = useMemo(() => {
    if (breakpoint == BreakPoint.DEFAULT || breakpoint == BreakPoint.SM) {
      return true
    }
    return false
  }, [breakpoint])
  const { chainId } = useActiveWeb3React()
  const [isRefresh, setIsRefresh] = useState(false)
  const address = data.address
  const category = useMemo(() => {
    if (!data?.CategoryCollections || data?.CategoryCollections.length == 0) {
      return ''
    }
    const result = data?.CategoryCollections.map((category) => {
      return category.category.title
    })
    return result.join(',')
  }, [data?.CategoryCollections])
  return (
    <div>
      {isSm ? (
        <div>
          <div className="flex flex-row items-center gap-2">
            {data.avatar ? (
              <>
                <div className="indicator">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <Image
                        src={data.avatar}
                        alt="avatar"
                        // className="rounded-xl"
                        layout="responsive"
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                  {data.is_verified == 1 ? (
                    <span className="indicator-item indicator-bottom indicator-end bottom-1 right-1">
                      <BadgeCheckIcon className="w-4 text-info" />
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
            <Typography variant="h2" weight={700}>
              {`${data.name}`}
            </Typography>
          </div>
          <div className="flex flex-row items-center justify-between mt-2">
            <span className="border-0 badge badge-sm bg-base-300 text-base-content text-opacity-60">Collectibles</span>
            <div className="flex flex-row items-center justify-end gap-4">
              <Socials data={data} isExtend={false}></Socials>
              <Share
                className="w-5 h-5 cursor-pointer"
                title={data.name ?? ''}
                classNameButton="h-[52px]"
                isRound={false}
              ></Share>
            </div>
          </div>
          <div className="flex flex-row items-center mt-2">
            <CopyHelper toCopy={address} className="opacity-100 text-primary">
              {isAddress(address) ? shortenAddress(address) : 'Unknown'}
            </CopyHelper>
            <Link href={getExplorerLink(chainId, address, 'address')} passHref={true}>
              <a target="_blank" className="flex flex-row items-center h-4">
                <ExternalLinkIcon className="inline-flex w-4 ml-2" />
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center gap-2">
                {data.avatar ? (
                  <>
                    <div className="indicator">
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          <Image
                            src={data.avatar}
                            alt="avatar"
                            // className="rounded-xl"
                            layout="responsive"
                            width={32}
                            height={32}
                          />
                        </div>
                      </div>
                      {data.is_verified == 1 ? (
                        <span className="indicator-item indicator-bottom indicator-end bottom-1 right-1">
                          <BadgeCheckIcon className="w-4 text-info" />
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <Typography variant="h2" weight={700}>
                  {`${data.name}`}
                </Typography>
              </div>
              {category ? (
                <>
                  <span className="ml-4 border-0 badge badge-sm bg-base-300 text-base-content text-opacity-60">
                    {category}
                  </span>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-row items-center justify-end gap-4">
              <Socials data={data} isExtend={true}></Socials>
              <Share
                className="w-5 h-5 cursor-pointer"
                title={data.name ?? ''}
                classNameButton="h-[52px]"
                isRound={true}
              ></Share>
            </div>
          </div>
          <div className="flex flex-row items-center mt-2">
            <CopyHelper toCopy={address} className="opacity-100 text-primary">
              {isAddress(address) ? shortenAddress(address) : 'Unknown'}
            </CopyHelper>
            <Link href={getExplorerLink(chainId, address, 'address')} passHref={true}>
              <a target="_blank" className="flex flex-row items-center h-4">
                <ExternalLinkIcon className="inline-flex w-4 ml-2" />
              </a>
            </Link>
          </div>
        </div>
      )}
      <div className="mt-2">
        <Typography variant="base" className="leading-normal whitespace-pre-line text-base-content text-opacity-60">
          {/* {data.description} */}
          {AutoLink({
            text: data.description ?? '',
          })}
        </Typography>
      </div>
    </div>
  )
}
export default MainInfo
