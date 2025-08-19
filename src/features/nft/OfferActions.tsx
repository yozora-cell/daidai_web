import { ClockIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import config from 'app/config'
import { classNames } from 'app/functions'
import { formatDateAgo, formatDateFuture } from 'app/functions'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import useNFT from 'app/hooks/useNFT'
import useSignAndVerify from 'app/hooks/useSignAndVerify'
import { useBuyOrderByAccount } from 'app/services/apis/hooks'
import { buyOrderByAccount } from 'app/services/apis/keys'
import { useAccount, useChainId } from 'app/state/application/hooks'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { useAuthToken } from 'app/state/user/hooks'
import { ListingItem, NFTDetail, NFTOperateStage } from 'app/types/daidai'
import { useEffect, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import ActionsContent from './ActionsContent'
import ActionsModal from './ActionsModal'

/**
 * 是否已经连接wallet
 * 1. 如果已经连接wallet，执行Actions的职责（下面）
 * 2. 如果未登录，这里直接不渲染就行，隔壁的Actions会负责展示连接钱包的按钮
 *
 * Actions的职责（下面的功能是已用户已经登录wallet）
 * 1. 作为外部展示给用户的入口，样式只有一种，就是按钮的
 * 2. Actions需要根据NFT的data来判断当前的nft是不是属于当前account
 * 3. 如果是属于account的，直接不展示了
 * 4. 如果不属于当前用户，展示Make Offer
 * 4.1 如果之前有过Offer，这里需要改为Change Offer
 * @param param0
 * @returns
 */
const OfferActions = ({
  listingItem,
  data,
  collection,
  tokenId,
  // 用于强制刷新swr请求的一个key，在close和confirm之后都会进行调用
  swrKey,
}: {
  listingItem?: ListingItem
  data: NFTDetail
  collection?: string
  tokenId: number
  swrKey?: string | undefined
}) => {
  // console.log('actions swrKey', swrKey)
  const { i18n } = useLingui()
  const account = useAccount()
  const authToken = useAuthToken(account)
  const signAndVerify = useSignAndVerify()
  const collectionAddress = useMemo(() => {
    return collection ? collection : data.contract ?? ''
  }, [collection, data.contract])
  const { ownerOf } = useNFT(collectionAddress)
  const [owner, setOwner] = useState<string | undefined>(undefined)
  const queryData = useBuyOrderByAccount(collectionAddress, Number(data.tokenId), account ?? '')
  const offerData = useMemo(() => {
    if (queryData && queryData.data) {
      return queryData.data
    }
    return undefined
  }, [queryData])

  const chainId = useChainId()
  const findToken = useTokenByAddressCallback()
  const targetToken = useMemo(() => {
    if (chainId && offerData && offerData.payToken) {
      const tokenAddress = offerData.payToken
      return findToken(tokenAddress)
    } else {
      return undefined
    }
  }, [chainId, findToken, offerData])

  const curSwrKey = useMemo(() => {
    return buyOrderByAccount({
      chainId: Number(chainId),
      collection: collectionAddress,
      tokenId: Number(data.tokenId),
      address: account ?? '',
    })
  }, [account, chainId, collectionAddress, data.tokenId])
  console.log('queryData useBuyOrderByAccount', queryData)
  useEffect(() => {
    if (account && tokenId != undefined) {
      const promise = ownerOf(tokenId, listingItem?.address)
      promise.then((result) => {
        setOwner(result)
      })
    }
  }, [account, listingItem?.address, ownerOf, tokenId])

  const { mutate } = useSWRConfig()

  const [isOpen, setIsOpen] = useState(false)

  const closeHandle = () => {
    console.log('ActionsModal close')
    setIsOpen(false)
    // 解决弹框出现之后签名弹框出现，之后关闭了所有弹框导致的无法滚动问题
    const html = document.documentElement
    html.style.overflow = 'auto'
    html.style.paddingRight = ''
    // if (swrKey) {
    //   mutate(swrKey)
    //   mutate(curSwrKey)
    //   setTimeout(() => {
    //     mutate(swrKey)
    //     mutate(curSwrKey)
    //   }, config.graph_timeout)
    // }
  }

  const confirmHandle = () => {
    console.log('ActionsModal confirm and close')
    // setIsOpen(false)
    if (swrKey) {
      mutate(swrKey)
      mutate(curSwrKey)
      setTimeout(() => {
        mutate(swrKey)
        mutate(curSwrKey)
      }, config.graph_timeout)
    }
  }
  const breakpoint = useBreakPointMediaQuery()

  const dateRender = (expiration: number) => {
    const time = expiration * 1000
    const date = new Date(time)
    const nowTime = new Date().getTime()
    // 还未过期
    if (time >= nowTime) {
      return formatDateFuture(date)
    } else {
      return formatDateAgo(date)
    }
  }

  return (
    <>
      {account ? (
        <>
          {String(owner).toLocaleLowerCase() != account.toLocaleLowerCase() && (
            <>
              <div className="flex flex-col gap-4">
                {offerData && (
                  <>
                    <div>
                      <Typography variant="sm" className="text-base-content text-opacity-60">
                        {i18n._(t`Offer Price`)}
                      </Typography>
                      {targetToken ? (
                        <div className="flex flex-row items-center gap-4">
                          <Typography variant="lg" weight={700}>
                            {offerData.price} {targetToken.symbol}
                          </Typography>
                          <Typography className="flex flex-row">
                            {`(`}
                            <ClockIcon className="w-5 h-5" />
                            {` `}
                            {i18n._(t`Expiration`)}
                            {`: `}
                            {dateRender(offerData.expiration)}
                            {`)`}
                          </Typography>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                )}
                <button
                  className={classNames('btn btn-primary', breakpoint == BreakPoint.DEFAULT ? 'w-full' : 'w-52')}
                  onClick={() => {
                    const promise = signAndVerify(account, authToken)
                    promise
                      .then((res) => {
                        console.log('res', res)
                        setIsOpen(true)
                      })
                      .catch(() => {
                        console.log('reject')
                      })
                  }}
                >
                  {offerData && offerData.address ? i18n._(t`Change Offer`) : i18n._(t`Make Offer`)}
                </button>
              </div>
            </>
          )}
          <ActionsModal
            isOpen={isOpen}
            close={closeHandle}
            content={
              <ActionsContent
                data={data}
                close={closeHandle}
                confirm={confirmHandle}
                operateType={NFTOperateStage.OFFER}
                offerData={offerData}
              ></ActionsContent>
            }
          ></ActionsModal>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default OfferActions
