import { ClockIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import Actions, { ButtonStyle } from 'app/features/nft/Actions'
import OfferActions from 'app/features/nft/OfferActions'
import { formatDateAgo, formatDateFuture } from 'app/functions'
import { buyOrderList, NFTDetail as NFTDetailKey } from 'app/services/apis/keys'
import { useChainId } from 'app/state/application/hooks'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { NFTDetail } from 'app/types/daidai'
import { useMemo } from 'react'

const PriceBuy = ({ data }: { data: NFTDetail }) => {
  const { i18n } = useLingui()
  // const { chainId } = useActiveWeb3React()
  const chainId = useChainId()
  const findToken = useTokenByAddressCallback()
  const targetToken = useMemo(() => {
    if (chainId && data.SellList && data.SellList.length > 0) {
      const tokenAddress = data.SellList[0].payToken
      return findToken(tokenAddress)
    } else {
      return undefined
    }
  }, [chainId, data.SellList, findToken])

  const swrKey = useMemo(() => {
    const address = data.contract ?? ''
    const tokenid = data.tokenId ? data.tokenId : ''
    if (address) {
      return NFTDetailKey(address, String(tokenid), chainId)
    }
    return undefined
  }, [chainId, data.contract, data.tokenId])

  const offerSwrKey = useMemo(() => {
    const address = data.contract ?? ''
    const tokenid = data.tokenId ? data.tokenId : ''
    if (address && chainId) {
      return buyOrderList({
        chainId: chainId,
        collection: address,
        tokenId: Number(tokenid),
      })
    }
    return undefined
  }, [chainId, data.contract, data.tokenId])

  const listingItem = useMemo(() => {
    if (data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])

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
    <div className="flex flex-row flex-wrap items-end justify-start">
      <div>
        {listingItem ? (
          <div className="mr-4">
            <Typography variant="sm" className="text-base-content text-opacity-60">
              {i18n._(t`Price`)}
            </Typography>
            {targetToken ? (
              <div className="flex flex-row items-center gap-4">
                <Typography variant="lg" weight={700}>
                  {listingItem.price} {targetToken.symbol}
                </Typography>
                <Typography className="flex flex-row">
                  {`(`}
                  <ClockIcon className="w-5 h-5" />
                  {` `}
                  {i18n._(t`Expiration`)}
                  {`: `}
                  {dateRender(listingItem.expiration)}
                  {`)`}
                </Typography>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        <div className="mt-4">
          <Actions
            buttonStyle={ButtonStyle.BUTTON}
            listingItem={listingItem}
            collection={data.contract}
            tokenId={Number(data.tokenId)}
            data={data}
            swrKey={swrKey}
          ></Actions>
        </div>
      </div>
      <div>
        <OfferActions
          listingItem={listingItem}
          collection={data.contract}
          tokenId={Number(data.tokenId)}
          data={data}
          swrKey={offerSwrKey}
        ></OfferActions>
      </div>
    </div>
  )
}
export default PriceBuy
