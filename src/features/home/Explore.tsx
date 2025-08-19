import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
import { defaultChainId } from 'app/config/default_chainid'
// import { Feature } from 'app/enums'
import Item, { ItemSkeleton } from 'app/features/nft/Item'
import { classNames } from 'app/functions'
import { useNFTFilterdStatic } from 'app/services/apis'
import { NFTFilterdStatic } from 'app/services/apis/keys'
import { useChainId } from 'app/state/application/hooks'
// import { setCleanup } from 'app/state/nfts/actions'
import { useRouter } from 'next/router'
import type { ParsedUrlQuery } from 'querystring'
// import { NFT } from 'app/types/daidai'
// import TopSellerItem from 'app/features/home/TopSellerItem'
// import Button from 'app/components/Button'
// import Image from 'next/image'
import React, { useMemo } from 'react'
import { format } from 'url'

import ExploreFilters, { OrderFields } from './ExploreFilters'
export enum ExploreFeature {
  HOME = 'home',
  COLLECTION = 'collection',
  EXPLORE = 'explore',
}

export interface NameValue {
  name: string
  value: any
}

export const getChangedQuery = (name: string, value: any, pathname: string, query: ParsedUrlQuery, hash?: string) => {
  let result = { ...query }
  result[name] = value
  if (name !== 'page') {
    result['page'] = '1'
  }
  const href = format({ pathname: pathname, query: result })
  if (hash) {
    return href + hash
  }
  return href
}

export const getChangedQueryMul = (list: NameValue[], pathname: string, query: ParsedUrlQuery, hash?: string) => {
  let result = { ...query }
  let isHavePage = false
  list.forEach((item) => {
    if (item.name === 'page') {
      isHavePage = true
    }
    result[item.name] = item.value
  })
  if (!isHavePage) {
    result['page'] = '1'
  }
  const href = format({ pathname: pathname, query: result })
  if (hash) {
    return href + hash
  }
  return href
}

// address标识collection的地址
const Explore = ({
  feature,
  address,
  onChangeFilter,
  onChangeSort,
  onChangeCollection,
  onChangeCategory,
  onChangePage,
}: {
  feature: ExploreFeature
  onChangeFilter: (isOnSale: boolean) => void
  onChangeSort: (field: OrderFields, direction: 'asc' | 'desc') => void
  onChangeCollection: (collection: string) => void
  onChangeCategory: (category: string) => void
  onChangePage: (page: number) => void
  address?: string
}) => {
  const chainId = useChainId()
  const { i18n } = useLingui()
  const router = useRouter()
  const { query } = router

  const limit = 20
  const pageNeighbours = 1
  // 1是第一页
  const page = useMemo(() => {
    if (query['page']) {
      return Number(query['page'])
    }
    return 1
  }, [query])
  const showOnlyNftsOnSale = useMemo(() => {
    if (query['onsale'] == '1') {
      return true
    }
    return false
  }, [query])
  const { orderingField, orderingDirection } = useMemo(() => {
    const sort = query['sort']
    if (sort) {
      // 这里默认是字符串
      const array = String(sort).split('-')
      const field = array[0]
      const direction = array[1]
      return {
        orderingField: field,
        orderingDirection: direction,
      }
    }
    return {
      orderingField: 'timestamp',
      orderingDirection: 'desc',
    }
  }, [query])
  const category = useMemo(() => {
    const str = query['category']
    if (str) {
      return String(str)
    }
    return ''
  }, [query])
  const collection = useMemo(() => {
    if (address) {
      return address
    }
    const str = query['collection']
    if (str) {
      return String(str)
    }
    return ''
  }, [query, address])
  const { data, isValidating } = useNFTFilterdStatic(
    page,
    limit,
    showOnlyNftsOnSale,
    orderingField,
    orderingDirection,
    category,
    collection
  )
  // console.log('data, error', data, error)
  // console.log('param', page, showOnlyNftsOnSale, orderingField, orderingDirection, category, collection)

  const list = useMemo(() => {
    return data?.data
  }, [data])
  const count = useMemo(() => {
    return data?.count
  }, [data])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])
  // console.log('totalPage', totalPage)

  // useEffect(() => {
  //   // 离开路由前对参数进行清空
  //   router.events.on('beforeHistoryChange', (url) => {
  //     // dispatch(setCleanup())
  //     // console.log(
  //     //   `App is changing to ${url} ${
  //     //     shallow ? 'with' : 'without'
  //     //   } shallow routing`
  //     // )
  //   })
  // })

  const swrKey = NFTFilterdStatic(
    page,
    limit,
    chainId ?? defaultChainId,
    showOnlyNftsOnSale,
    orderingField,
    orderingDirection,
    category,
    collection
  )

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
    <div
      id="explore"
      className={classNames(
        'container',
        feature == ExploreFeature.EXPLORE ? 'mt-12' : '',
        feature == ExploreFeature.HOME ? 'mt-32' : ''
      )}
    >
      <div className="flex flex-col w-full px-6 md:flex-row md:items-center md:justify-between">
        {feature == ExploreFeature.COLLECTION ? (
          <></>
        ) : (
          <div className="pr-4">
            <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Explore`)}</h1>
          </div>
        )}
        {/* filters START */}
        <ExploreFilters
          onChangeFilter={(isOnSale) => {
            onChangeFilter(isOnSale)
            // onChangePage(1)
            // setPage(1)
          }}
          onChangeSort={(field, direction) => {
            onChangeSort(field, direction)
            // onChangePage(1)
            // setPage(1)
          }}
          onChangeCollection={(collection) => {
            onChangeCollection(collection)
            // onChangePage(1)
            // setPage(1)
          }}
          onChangeCategory={(category) => {
            onChangeCategory(category)
            // onChangePage(1)
            // setPage(1)
          }}
          isShowCollectionFilters={!address ? true : false}
          showOnlyNftsOnSale={showOnlyNftsOnSale}
          orderingField={orderingField}
          orderingDirection={orderingDirection}
          categoryValue={category}
          collectionValue={collection}
        />
        {/* filters END */}
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
            <div className="flex flex-row justify-center mt-8">
              <Pagination
                totalPages={totalPage}
                onChange={(index) => {
                  onChangePage(index + 1)
                  // window.location.hash = '#explore'
                  // setPage(index + 1)
                }}
                currentPage={page - 1}
                pageNeighbours={pageNeighbours}
                canNextPage={!(page == totalPage)}
                canPreviousPage={!(page == 1)}
              ></Pagination>
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
export default Explore
