import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import config from 'app/config'
import useNFT from 'app/hooks/useNFT'
import useSignAndVerify from 'app/hooks/useSignAndVerify'
import { useAccount, useWalletModalToggle } from 'app/state/application/hooks'
import { useAuthToken } from 'app/state/user/hooks'
import { ListingItem, NFTDetail, NFTOperateStage, OfferItem } from 'app/types/daidai'
import { useEffect, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import ActionsContent from './ActionsContent'
import ActionsModal from './ActionsModal'

/**
 * 是否已经连接wallet
 * 1. 如果已经连接wallet，执行Actions的职责（下面）
 * 2. 如果未登录，展示文本“connect wallet”，点击进行登录
 *
 * AcceptOfferActions的职责（下面的功能是已用户已经登录wallet）
 * 1. 作为外部展示给用户的入口，样式只有一种，就是按钮的
 * 2. Actions需要根据NFT的data来判断当前的nft是不是属于当前account
 * 3. 如果是属于account的，就展示Accept Offer
 * 4. 如果不属于当前用户，就不展示文本
 * @param param0
 * @returns
 */
const AcceptOfferActions = ({
  listingItem,
  offerData,
  data,
  collection,
  tokenId,
  // 用于强制刷新swr请求的一个key，在close和confirm之后都会进行调用
  swrKey,
}: {
  listingItem?: ListingItem
  offerData: OfferItem
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
  const toggleWalletModal = useWalletModalToggle()

  const collectionAddress = useMemo(() => {
    return collection ? collection : data.contract ?? ''
  }, [collection, data.contract])

  const { ownerOf } = useNFT(collectionAddress)
  const [owner, setOwner] = useState<string | undefined>(undefined)
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
      setTimeout(() => {
        mutate(swrKey)
      }, config.graph_timeout)
    }
  }

  const isExpiration = useMemo(() => {
    if (offerData && offerData.expiration) {
      return new Date(offerData.expiration * 1000).getTime() < new Date().getTime()
    }
    return false
  }, [offerData])

  return (
    <>
      {account ? (
        <>
          {String(owner).toLocaleLowerCase() == account.toLocaleLowerCase() && (
            <>
              {isExpiration ? (
                <>
                  <button className="btn btn-primary btn-sm" disabled>
                    {i18n._(t`Accept Offer`)}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary btn-sm"
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
                    {i18n._(t`Accept Offer`)}
                  </button>
                </>
              )}
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
                operateType={NFTOperateStage.ACCEPT_OFFER}
                offerData={offerData}
              ></ActionsContent>
            }
          ></ActionsModal>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              toggleWalletModal()
            }}
          >
            {i18n._(t`Connect Wallet`)}
          </button>
        </>
      )}
    </>
  )
}
export default AcceptOfferActions
