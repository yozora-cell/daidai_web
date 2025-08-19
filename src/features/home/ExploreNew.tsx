import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Item, { ItemSkeleton } from 'app/features/nft/Item'
import { classNames } from 'app/functions'
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
    <div id="explore" className={classNames('container mt-32')}>
      <div className="flex flex-col w-full px-6 md:flex-row md:items-center md:justify-between">
        <div className="pr-4">
          <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Explore`)}</h1>
        </div>
      </div>
      <div className="px-6 mt-10">
        {list && list.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
