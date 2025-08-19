import { TransactionReceipt } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import config from 'app/config'
import useNFTMarketplace from 'app/hooks/useNFTMarketplace'
import { getOfferSignature } from 'app/services/apis/fetchers'
import { useAddPopup } from 'app/state/application/hooks'
import { useChainId } from 'app/state/application/hooks'
import { NFTDetail, NFTItemStage, Offer721, OfferItem } from 'app/types/daidai'
import { useCallback, useState } from 'react'
import { useSWRConfig } from 'swr'

import Info from './Info'
import { useDetailKey, useOffer, useOfferList } from './SwrKey'

const AcceptOffer = ({
  data,
  offerData,
  changeStage,
  curStage,
  confirm,
}: {
  data: NFTDetail
  offerData: OfferItem
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  confirm: (tx: TransactionReceipt) => void
}) => {
  const { offerNonce721, globalNonce, acceptOffer721 } = useNFTMarketplace()
  const [pending, setIsPending] = useState(false)
  const { i18n } = useLingui()
  const addPopup = useAddPopup()
  const chainId = useChainId()

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
        <Info data={data} isOfferPrice={true} offerData={offerData}></Info>
        <div className="flex flex-row justify-center w-full mt-8">
          {pending ? (
            <button className="btn btn-primary loading !w-full" disabled>
              {i18n._(t`Pending`)}
            </button>
          ) : (
            <button
              className="btn btn-primary !w-full"
              onClick={async () => {
                if (data.contract && offerData) {
                  const offerNonce721Val = await offerNonce721(offerData.address, data.contract, Number(data.tokenId))
                  const globalNonceVal = await globalNonce(offerData.address)
                  console.log('offerNonce721Val', offerNonce721Val, globalNonceVal)
                  const offer721: Offer721 = {
                    price: offerData.price,
                    buyToken: offerData.payToken,
                    buyer: offerData.address,
                    collection: data.contract,
                    tokenId: Number(data.tokenId),
                    globalNonce: globalNonceVal,
                    offerNonce: offerNonce721Val,
                    expiration: offerData.expiration,
                  }
                  const offerDetail = await getOfferSignature({
                    chainId: Number(chainId),
                    collection: data.contract,
                    tokenId: Number(data.tokenId),
                    address: offerData.address,
                  })
                  const signature = offerDetail.signature
                  console.log('offerDetail', offerDetail, signature)
                  const primose = acceptOffer721(offer721, signature)
                  setIsPending(true)
                  primose
                    .then((tx: TransactionReceipt | undefined) => {
                      console.log('acceptOffer721 then tx', tx)
                      if (tx) {
                        changeStage(NFTItemStage.SUCCESS)
                        confirm(tx)
                      }
                      console.log('AcceptOffer then')
                      updateData()
                    })
                    .catch((error) => {
                      console.error('acceptOffer721 error', error)
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
                      setIsPending(false)
                    })
                }
              }}
            >
              {i18n._(t`Accept Offer`)}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default AcceptOffer
