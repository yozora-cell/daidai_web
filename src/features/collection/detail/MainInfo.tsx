import { BadgeCheckIcon, RefreshIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import AutoLink from 'app/components/AutoLink'
import Typography from 'app/components/Typography'
import TransferActions from 'app/features/nft/TransferActions'
import { classNames } from 'app/functions'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { getRefreshmetadata } from 'app/services/apis/fetchers'
import { refreshmetadata } from 'app/services/apis/keys'
import { NFTDetail as NFTDetailKey } from 'app/services/apis/keys'
import { useActiveWeb3React } from 'app/services/web3'
import { NFTDetail } from 'app/types/daidai'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import Share from './Share'

const MainInfo = ({ data }: { data: NFTDetail }) => {
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
  const refreshHandle = () => {
    const address = data.contract ?? ''
    if (chainId && data.tokenId) {
      if (isRefresh) {
        return
      }
      const url = refreshmetadata(chainId, address, Number(data.tokenId))
      setIsRefresh(true)
      const promise = getRefreshmetadata(url)
      promise
        .then((data) => {
          // console.log('refreshmetadata', data)
        })
        .finally(() => {
          setIsRefresh(false)
        })
    }
  }
  const swrKey = useMemo(() => {
    const address = data.contract ?? ''
    const tokenid = data.tokenId ? data.tokenId : ''
    if (address) {
      return NFTDetailKey(address, String(tokenid), Number(chainId))
    }
    return undefined
  }, [chainId, data.contract, data.tokenId])

  const category = useMemo(() => {
    if (!data.collection?.CategoryCollections || data.collection?.CategoryCollections.length == 0) {
      return ''
    }
    const result = data.collection?.CategoryCollections.map((category) => {
      return category.category.title
    })
    return result.join(',')
  }, [data.collection?.CategoryCollections])

  // console.log("AutoLink", AutoLink(data.description ?? ''))

  return (
    <div>
      {isSm ? (
        <div>
          <Link href={`/collection/${data.chainId}/${data.contract}`}>
            <a className="flex flex-row items-center">
              <Typography variant="sm" className="text-base-content text-opacity-60">
                {data.collectionName ? data.collectionName : '???'}
              </Typography>
              <BadgeCheckIcon className="inline-flex w-4 ml-2" />
            </a>
          </Link>
          <Typography variant="h2" weight={700} className="mt-2">
            {`${data.name}`}
          </Typography>
          <div className="flex flex-row items-center gap-4 mt-2">
            {category ? (
              <>
                <span className="border-0 badge badge-sm bg-base-300 text-base-content text-opacity-60">
                  {category}
                </span>
              </>
            ) : (
              <></>
            )}
            <div className="flex flex-row items-center">
              <div className="mr-4 tooltip" data-tip={i18n._(t`Refresh metadata`)}>
                <RefreshIcon
                  className={classNames('w-6 cursor-pointer', isRefresh ? 'animate-spin' : '')}
                  onClick={refreshHandle}
                />
              </div>
              <TransferActions data={data} swrKey={swrKey} className="mr-4"></TransferActions>
              <div>
                <Share
                  className="w-6 h-6 cursor-pointer"
                  title={data.name ?? ''}
                  classNameButton="h-6"
                  direction="right"
                ></Share>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Link href={`/collection/${data.chainId}/${data.contract}`}>
            <a className="flex flex-row items-center">
              <Typography variant="sm" className="text-base-content text-opacity-60">
                {data.collectionName ? data.collectionName : '???'}
              </Typography>
              <BadgeCheckIcon className="inline-flex w-4 ml-2" />
            </a>
          </Link>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <Typography variant="h2" weight={700}>
                {`${data.name}`}
              </Typography>
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
            <div className="flex flex-row items-center">
              <div className="tooltip" data-tip={i18n._(t`Refresh metadata`)}>
                <RefreshIcon
                  className={classNames('w-6 cursor-pointer', isRefresh ? 'animate-spin' : '')}
                  onClick={refreshHandle}
                />
              </div>
              <TransferActions data={data} className="ml-4" swrKey={swrKey}></TransferActions>
              <div className="ml-4">
                <Share className="w-6 h-6 cursor-pointer" title={data.name ?? ''} classNameButton="h-6"></Share>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4">
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
