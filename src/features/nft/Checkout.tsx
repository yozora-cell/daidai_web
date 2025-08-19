import { TransactionReceipt } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import config from 'app/config'
import useNFTMarketplace from 'app/hooks/useNFTMarketplace'
import { getSellingSignature } from 'app/services/apis/fetchers'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { useChainId } from 'app/state/application/hooks'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { useBalancesNoZero } from 'app/state/wallet/hooks'
import { Listing721, NFTDetail, NFTItemStage } from 'app/types/daidai'
import { useCallback, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import Info from './Info'
import { useDetailKey, useOffer, useOfferList } from './SwrKey'

const Checkout = ({
  data,
  changeStage,
  curStage,
  confirm,
}: {
  data: NFTDetail
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  confirm: (tx: TransactionReceipt) => void
}) => {
  const { listingNonce721, globalNonce, acceptListing721 } = useNFTMarketplace()
  const [isBuying, setIsBuying] = useState(false)
  const { i18n } = useLingui()
  const addPopup = useAddPopup()
  const { balances, loading } = useBalancesNoZero()
  const { account, library } = useActiveWeb3React()
  const chainId = useChainId()

  const listingItem = useMemo(() => {
    if (data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])

  // console.log('tokenList', tokenList)
  const findToken = useTokenByAddressCallback()
  const currentToken = findToken(listingItem?.payToken)

  const responseBalance = useMemo(() => {
    if (!listingItem) {
      return undefined
    }
    const findObj = balances.find(
      (balance) => balance.currency.symbol?.toLocaleLowerCase() == currentToken?.symbol?.toLocaleLowerCase()
    )
    return findObj ?? undefined
  }, [balances, currentToken?.symbol, listingItem])

  const { mutate } = useSWRConfig()
  const detailKey = useDetailKey(data)
  const offerKey = useOffer(data)
  const offerList = useOfferList(data)
  const updateData = useCallback(() => {
    console.log('updateData', detailKey, offerKey, offerList)
    mutate(detailKey)
    mutate(offerKey)
    mutate(offerList)
    setTimeout(() => {
      mutate(detailKey)
      mutate(offerKey)
      mutate(offerList)
    }, config.graph_timeout)
  }, [detailKey, mutate, offerKey, offerList])

  return (
    <>
      <div className="w-full">
        <Info data={data}></Info>
        <div className="flex flex-row justify-center w-full mt-8">
          {isBuying ? (
            <button className="btn btn-primary loading !w-full" disabled>
              {i18n._(t`Buying`)}
            </button>
          ) : (
            <button
              className="btn btn-primary !w-full"
              onClick={async () => {
                if (
                  data.contract &&
                  listingItem &&
                  responseBalance &&
                  Number(responseBalance.toSignificant(6)) >= Number(listingItem.price)
                ) {
                  const listingNonce721Val = await listingNonce721(
                    listingItem.address,
                    data.contract,
                    Number(data.tokenId)
                  )
                  const globalNonceVal = await globalNonce(listingItem.address)
                  console.log('listingNonce721Val', listingNonce721Val, globalNonceVal)
                  const listing: Listing721 = {
                    price: listingItem.price,
                    sellToken: listingItem.payToken,
                    seller: listingItem.address,
                    collection: data.contract,
                    tokenId: Number(data.tokenId),
                    globalNonce: globalNonceVal,
                    listingNonce: listingNonce721Val,
                    expiration: listingItem.expiration,
                  }
                  const listingDetail = await getSellingSignature({
                    chainId: Number(chainId),
                    collection: data.contract,
                    tokenId: Number(data.tokenId),
                  })
                  console.log('listingDetail', listingDetail)
                  const signature = listingDetail.signature
                  const primose = acceptListing721(listing, signature)
                  setIsBuying(true)
                  primose
                    .then((tx: TransactionReceipt | undefined) => {
                      console.log('acceptListing721 then tx', tx)
                      if (tx) {
                        changeStage(NFTItemStage.SUCCESS)
                        confirm(tx)
                      }
                      console.log('checkout then')
                      // 最后都更新数据
                      updateData()
                    })
                    .catch((error) => {
                      console.error('acceptListing721 error', error)
                      // changeStage(NFTItemStage.APPROVED)
                      const message = error.message
                        ? error.data && error.data.message
                          ? `${error.message} ${error.data.message}`
                          : error.message
                        : ''
                      addPopup({
                        alert: {
                          message: `code: ${error.code} \nmessage: ${message}`,
                          success: false,
                        },
                      })
                    })
                    .finally(() => {
                      setIsBuying(false)
                    })
                } else {
                  addPopup({
                    alert: {
                      message: i18n._(t`insufficient funds`),
                      success: false,
                    },
                  })
                }
              }}
            >
              {i18n._(t`Buy now`)}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Checkout
