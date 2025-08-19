import { LightningBoltIcon, SwitchVerticalIcon, TrendingDownIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import { category } from 'app/services/apis/keys'
// import { setFiltersOrdering, setShowOnlyOnSale } from 'app/state/nfts/actions'
// import { useGetNftShowOnlyOnSale, useGetOrdering } from 'app/state/nfts/hooks'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

// import { useDispatch } from 'react-redux'
import CategoryFilters from './CategoryFilters'
import CollectionFilters from './CollectionFilters'

export enum OrderFields {
  currentAskPrice = 'price',
  timestamp = 'timestamp',
}

export default function ExploreFilters({
  onChangeSort,
  onChangeFilter,
  onChangeCollection,
  onChangeCategory,
  isShowCollectionFilters,
  showOnlyNftsOnSale,
  orderingField,
  orderingDirection,
  categoryValue,
  collectionValue,
}: {
  onChangeSort: (field: OrderFields, direction: 'asc' | 'desc') => void
  onChangeFilter: (isOnSale: boolean) => void
  onChangeCollection: (collection: string) => void
  onChangeCategory: (category: string) => void
  isShowCollectionFilters: boolean
  showOnlyNftsOnSale: boolean
  orderingField: string
  // orderingDirection: 'asc' | 'desc'
  orderingDirection: string
  categoryValue: string
  collectionValue: string
}) {
  const { i18n } = useLingui()
  // const dispatch = useDispatch()
  // const showOnlyNftsOnSale = useGetNftShowOnlyOnSale()
  // const ordering = useGetOrdering()
  // const [orderingString, setOrderingString] = useState(`${ordering.field}-${ordering.direction}`)
  const [orderingString, setOrderingString] = useState(`${orderingField}-${orderingDirection}`)

  // useEffect(() => {
  //   setOrderingString(`${ordering.field}-${ordering.direction}`)
  // }, [ordering])

  useEffect(() => {
    setOrderingString(`${orderingField}-${orderingDirection}`)
  }, [orderingField, orderingDirection])

  const LowestPriceBtnClass = classNames('gap-2 mt-3 btn btn-primary btn-sm md:mt-0', {
    'btn-outline': !(orderingString === `${OrderFields.currentAskPrice}-desc`),
    'btn-active': orderingString === `${OrderFields.currentAskPrice}-desc`,
  })
  const HighestPriceBtnClass = classNames('gap-2 mt-3 btn btn-primary btn-sm md:mt-0', {
    'btn-outline': !(orderingString === `${OrderFields.currentAskPrice}-asc`),
    'btn-active': orderingString === `${OrderFields.currentAskPrice}-asc`,
  })
  const RecentlyListedBtnClass = classNames('gap-2 mt-3 btn btn-primary btn-sm md:mt-0', {
    'btn-outline': !(orderingString === `${OrderFields.timestamp}-desc`),
    'btn-active': orderingString === `${OrderFields.timestamp}-desc`,
  })
  const onsaleBtnClass = classNames('gap-2 btn btn-primary  btn-sm md:mt-0', {
    'btn-outline': !showOnlyNftsOnSale,
    'btn-active': showOnlyNftsOnSale,
  })

  const onActiveButtonChange = () => {
    onChangeFilter(!showOnlyNftsOnSale)
    // dispatch(setShowOnlyOnSale(!showOnlyNftsOnSale))
  }
  const onOrderingButtonChange = (field: OrderFields, direction: 'asc' | 'desc') => {
    onChangeSort(field, direction)
    // dispatch(setFiltersOrdering({ field, direction }))
  }
  const onCollectionButtonChange = (collection: string) => {
    onChangeCollection(collection)
  }

  const onCategoryButtonChange = (categorys: string) => {
    onChangeCategory(categorys)
  }

  return (
    <div className="flex flex-col justify-between flex-1 lg:flex-row lg:items-center item-start">
      <div className="flex flex-row flex-wrap items-center justify-start gap-4">
        <button
          onClick={() => {
            onOrderingButtonChange(OrderFields.timestamp, 'desc')
          }}
          className={RecentlyListedBtnClass}
        >
          {orderingString === `${OrderFields.timestamp}-desc` && <SwitchVerticalIcon className="w-4" />}
          {i18n._(t`Recently listed`)}
        </button>
        <button
          onClick={() => {
            onOrderingButtonChange(OrderFields.currentAskPrice, 'desc')
          }}
          className={LowestPriceBtnClass}
        >
          {orderingString === `${OrderFields.currentAskPrice}-desc` && <TrendingDownIcon className="w-4" />}
          {i18n._(t`Price: high -> low`)}
        </button>
        <button
          onClick={() => {
            onOrderingButtonChange(OrderFields.currentAskPrice, 'asc')
          }}
          className={HighestPriceBtnClass}
        >
          {orderingString === `${OrderFields.currentAskPrice}-asc` && <TrendingUpIcon className="w-4" />}
          {i18n._(t`Price: low -> high`)}
        </button>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-start gap-4 mt-3 lg:mt-0 lg:justify-end">
        {isShowCollectionFilters ? (
          <>
            <CategoryFilters onChangeCategory={onCategoryButtonChange} defaultValue={categoryValue}></CategoryFilters>
            <CollectionFilters
              onChangeCollection={onCollectionButtonChange}
              defaultValue={collectionValue}
              isRight={true}
            ></CollectionFilters>
          </>
        ) : (
          <></>
        )}
        <button onClick={onActiveButtonChange} className={onsaleBtnClass}>
          {showOnlyNftsOnSale && <LightningBoltIcon className="w-4" />}
          {i18n._(t`On sale`)}
        </button>
      </div>
    </div>
  )
}
