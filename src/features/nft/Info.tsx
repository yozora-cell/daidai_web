import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import AutoFitImage from 'app/components/AutoFitImage'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import { classNames } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { NFTDetail, OfferItem } from 'app/types/daidai'
import { useMemo } from 'react'

const NFTInfo = ({
  data,
  confirmToken,
  confirmAmount,
  confirmOfferToken,
  confirmOfferAmount,
  isOfferPrice,
  offerData,
}: {
  data: NFTDetail
  confirmToken?: Currency
  confirmAmount?: number
  confirmOfferToken?: Currency
  confirmOfferAmount?: number
  isOfferPrice?: boolean
  offerData?: OfferItem
}) => {
  const { account, chainId, library } = useActiveWeb3React()
  // console.log('nft ino', confirmToken, confirmAmount)
  const listingItem = useMemo(() => {
    if (data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])
  const findToken = useTokenByAddressCallback()
  const targetToken = useMemo(() => {
    if (chainId && listingItem && listingItem.payToken) {
      const tokenAddress = listingItem.payToken
      return findToken(tokenAddress)
    } else {
      return undefined
    }
  }, [chainId, findToken, listingItem])

  const targetTokenOffer = useMemo(() => {
    if (isOfferPrice && chainId && offerData && offerData.payToken) {
      const tokenAddress = offerData.payToken
      return findToken(tokenAddress)
    } else {
      return undefined
    }
  }, [chainId, findToken, isOfferPrice, offerData])

  const { i18n } = useLingui()
  return (
    <div className="flex flex-row items-center justify-between w-full gap-4">
      <div className="w-24 h-24">
        <AutoFitImage
          imageUrl={data?.image ?? defaultImg}
          defaultWidthStyle={'96px'}
          defaultHeightStyle={'96px'}
          roundedClassName={'rounded-md'}
        ></AutoFitImage>
      </div>
      <div className="flex flex-col gap-2 grow">
        <Typography variant="lg" weight={700}>
          {data.name}
        </Typography>
        {isOfferPrice ? (
          <>
            {offerData ? (
              <>
                <div className="flex flex-col">
                  <Typography variant="sm" className="text-base-content text-opacity-60">
                    {i18n._(t`Offer Price`)}
                  </Typography>
                  <div className="flex flex-row items-center justify-start gap-2">
                    {targetTokenOffer ? (
                      <Typography
                        variant="base"
                        weight={700}
                        className={classNames(
                          confirmOfferToken && confirmOfferAmount ? 'line-through text-opacity-30 text-primary' : ''
                        )}
                      >
                        {offerData.price} {targetTokenOffer.symbol}
                      </Typography>
                    ) : (
                      <></>
                    )}
                    {confirmOfferToken && confirmOfferAmount ? (
                      <Typography variant="base" weight={700}>
                        {confirmOfferAmount} {confirmOfferToken.symbol}
                      </Typography>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {confirmOfferToken && confirmOfferAmount && (
                  <>
                    <div className="flex flex-col">
                      <Typography variant="sm" className="text-base-content text-opacity-60">
                        {i18n._(t`Change Offer Price To`)}
                      </Typography>
                      <div className="flex flex-row items-center justify-start gap-2">
                        <Typography variant="base" weight={700}>
                          {confirmOfferAmount} {confirmOfferToken.symbol}
                        </Typography>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {listingItem ? (
              <div className="flex flex-col">
                <Typography variant="sm" className="text-base-content text-opacity-60">
                  {i18n._(t`Price`)}
                </Typography>
                <div className="flex flex-row items-center justify-start gap-2">
                  {targetToken ? (
                    <Typography
                      variant="base"
                      weight={700}
                      className={classNames(
                        confirmToken && confirmAmount ? 'line-through text-opacity-30 text-primary' : ''
                      )}
                    >
                      {listingItem.price} {targetToken.symbol}
                    </Typography>
                  ) : (
                    <></>
                  )}
                  {confirmToken && confirmAmount ? (
                    <Typography variant="base" weight={700}>
                      {confirmAmount} {confirmToken.symbol}
                    </Typography>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <>
                {confirmToken && confirmAmount ? (
                  <div className="flex flex-col">
                    <Typography variant="sm" className="text-base-content text-opacity-60">
                      {i18n._(t`Change Price to`)}
                    </Typography>
                    <div className="flex flex-row items-center justify-start gap-2">
                      <Typography variant="base" weight={700}>
                        {confirmAmount} {confirmToken.symbol}
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NFTInfo
