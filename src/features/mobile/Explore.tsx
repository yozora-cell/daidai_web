import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Typography from 'app/components/Typography'
import Item, { ItemSkeleton } from 'app/features/nft/ItemMobile'
import { useRecommend } from 'app/services/apis'
import { recommend } from 'app/services/apis/keys'
import { useChainId } from 'app/state/application/hooks'
import { NFTDetail } from 'app/types/daidai'
import React, { useMemo } from 'react'

const ExploreNew = () => {
  const { i18n } = useLingui()
  const { data, error, isValidating } = useRecommend()
  const list = useMemo<NFTDetail[]>(() => {
    if (data && data.length > 0) {
      const all: NFTDetail[] = []
      data.forEach((list) => {
        list.forEach((item) => {
          all.push(item)
        })
      })
      return all.sort(() => 0.5 - Math.random())
    }
    return []
  }, [data])

  const chainId = useChainId()
  const swrKey = useMemo(() => {
    if (chainId) {
      return recommend(chainId)
    }
    return undefined
  }, [chainId])

  const skeleton = (
    <>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
    </>
  )

  return (
    <div id="explore" className="w-full">
      <div className="flex flex-row justify-start mt-8">
        <Typography className="text-sm" weight={700}>
          {i18n._(t`Hot Items`)}
        </Typography>
      </div>
      <div className="mt-10">
        {list && list.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {list.map((nft) => {
                return (
                  <Item
                    data={nft}
                    key={`${nft.contract}${nft.chainId}${nft.tokenId}/explore/nft`}
                    swrKey={swrKey}
                  ></Item>
                )
              })}
            </div>
          </>
        )}
        {!isValidating && list && list.length == 0 && (
          <>
            <NoData></NoData>
          </>
        )}
        {isValidating && list && list.length == 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {skeleton}
              {skeleton}
              {skeleton}
              {skeleton}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default ExploreNew
