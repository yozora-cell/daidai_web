import { FilterIcon, XIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import { getChangedQuery, getChangedQueryMul, NameValue } from 'app/features/home/Explore'
import Item, { ItemSkeleton } from 'app/features/nft/Item'
import PriceFilter from 'app/features/search/PriceFilter'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { useAttributes, useSearchByCollection } from 'app/services/apis/hooks'
import { searchByCollection } from 'app/services/apis/keys'
import { NameValues } from 'app/types/daidai'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useMemo, useState } from 'react'
import { format } from 'url'

import AttributesFilter from './AttributesFilter'

const CollectionListPage = ({ address }: { address: string }) => {
  const { i18n } = useLingui()
  const router = useRouter()
  const { pathname, query } = router
  // console.log('query', query)
  const changeQuery = (name: string, value: any, hash?: string) => {
    router.push(getChangedQuery(name, value, pathname, query, hash), undefined, { shallow: true })
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const changeQueryMul = (list: NameValue[], hash?: string) => {
    router.push(getChangedQueryMul(list, pathname, query, hash), undefined, { shallow: true })
  }
  // console.log('query', query)

  const limit = 20
  const pageNeighbours = 1

  const page = useMemo(() => {
    if (query['page']) {
      return Number(query['page'])
    }
    return 1
  }, [query])

  const token = useMemo(() => {
    if (query['token']) {
      return String(query['token'])
    }
    return ''
  }, [query])

  const min = useMemo(() => {
    if (query['min']) {
      return String(query['min'])
    }
    return ''
  }, [query])

  const max = useMemo(() => {
    if (query['max']) {
      return String(query['max'])
    }
    return ''
  }, [query])

  const props = useMemo<NameValues[]>(() => {
    if (query['props']) {
      try {
        return JSON.parse(String(query['props']))
      } catch (e) {
        console.error(e)
        return []
      }
    }
    return []
  }, [query])

  const filterCount = useMemo(() => {
    let count = 0
    if (min !== '') {
      count++
    }
    if (max !== '') {
      count++
    }
    if (token !== '') {
      count++
    }
    count += props.length
    return count
  }, [max, min, props.length, token])

  const { data, error, isValidating } = useSearchByCollection(
    address,
    page,
    limit,
    token ? [token] : [],
    min,
    max,
    props
  )

  const swrKey = useMemo(() => {
    if (address) {
      return searchByCollection(address, page, limit, token ? [token] : [], min, max, props)
    }
    return ''
  }, [address, max, min, page, props, token])

  const list = useMemo(() => {
    return data?.data
  }, [data])
  const count = useMemo(() => {
    return data?.count
  }, [data])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])

  const skeleton = (
    <>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
      <ItemSkeleton></ItemSkeleton>
    </>
  )

  const [singalPrice, setSingalPrice] = useState(1)

  const priceFilterRender = useCallback(() => {
    return (
      <>
        <PriceFilter
          defaultMax={max}
          defaultMin={min}
          defaultToken={token}
          onChangePrice={(min, max, token) => {
            const list: NameValue[] = []
            list.push({
              name: 'min',
              value: min,
            })
            list.push({
              name: 'max',
              value: max,
            })
            list.push({
              name: 'token',
              value: token,
            })
            changeQueryMul(list)
          }}
          singal={singalPrice}
        ></PriceFilter>
      </>
    )
  }, [changeQueryMul, max, min, singalPrice, token])

  const attrData = useAttributes(address)

  const attributesFilterRender = () => {
    return (
      <>
        <AttributesFilter
          defaultProps={props}
          onChange={(props) => {
            console.log('props', props)
            changeQuery('props', JSON.stringify(props))
          }}
          data={attrData.data}
        ></AttributesFilter>
      </>
    )
  }

  const clearAttrbute = (prop: NameValues) => {
    let newProps: NameValues[] = []
    props.map((item) => {
      if (!(item.name === prop.name && item.values === prop.values)) {
        newProps.push(item)
      }
    })
    changeQuery('props', JSON.stringify(newProps))
  }

  const clearPrice = () => {
    const list: NameValue[] = []
    list.push({
      name: 'min',
      value: '',
    })
    list.push({
      name: 'max',
      value: '',
    })
    list.push({
      name: 'token',
      value: '',
    })
    changeQueryMul(list)
    // 通知子组件更新
    setSingalPrice(singalPrice + 1)
  }

  const clearAll = () => {
    let tempQuery = { ...query }
    delete tempQuery.max
    delete tempQuery.min
    delete tempQuery.token
    delete tempQuery.page
    delete tempQuery.props
    const href = format({
      pathname: pathname,
      query: tempQuery,
    })
    router.push(href, undefined, { shallow: true })
    setSingalPrice(singalPrice + 1)
  }

  const breakpoint = useBreakPointMediaQuery()
  const isSm = useMemo(() => {
    if (!(breakpoint === BreakPoint.XL || breakpoint === BreakPoint.XL2)) {
      return true
    }
    return false
  }, [breakpoint])

  return (
    <>
      <NextSeo title="Search" />
      <div className="flex flex-row w-full gap-4" id="explore">
        <div
          className="sticky top-[64px] w-[340px] overflow-auto flex-col px-4 xl:flex hidden"
          style={{
            height: 'calc(100vh - 64px)',
          }}
        >
          <div className="p-4 mt-12 border-b">
            <Typography variant="h2">{i18n._(t`Filter`)}</Typography>
          </div>
          {priceFilterRender()}
          {attributesFilterRender()}
        </div>
        <div
          className="flex-grow"
          style={{
            maxWidth: isSm ? '100vw' : 'calc(100vw - 340px)',
          }}
        >
          <div className="px-6 mt-10">
            <div className="flex flex-row justify-between w-full p-4">
              <Typography variant="h2">
                {count ?? '--'} {i18n._(t`items`)}
              </Typography>
              <label className="flex gap-2 btn btn-primary btn-outline xl:hidden modal-button" htmlFor="my-modal-4">
                <FilterIcon className="w-5 h-5" />
                {filterCount}
              </label>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-4 p-4">
              {token !== '' && (min !== '' || max !== '') && (
                <>
                  <div className="flex gap-4 px-5 py-3 rounded bg-base-200 w-fit">
                    <Typography weight={700} variant="base">
                      {min !== '' && (
                        <>
                          {i18n._(t`Min`)}
                          {` `}
                          {min}
                          {` `}
                          {token}
                          {max !== '' && <>{`, `}</>}
                        </>
                      )}
                      {max !== '' && (
                        <>
                          {i18n._(t`Max`)}
                          {` `}
                          {max}
                          {` `}
                          {token}
                        </>
                      )}
                    </Typography>
                    <XIcon
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => {
                        clearPrice()
                      }}
                    ></XIcon>
                  </div>
                </>
              )}
              {props && props.length > 0 && (
                <>
                  {props.map((prop) => (
                    <>
                      <div className="flex gap-4 px-5 py-3 rounded bg-base-200 w-fit">
                        <Typography weight={700} variant="base">
                          {prop.name}
                          {`: `}
                          {prop.values}
                        </Typography>
                        <XIcon
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => {
                            clearAttrbute(prop)
                          }}
                        ></XIcon>
                      </div>
                    </>
                  ))}
                </>
              )}
              {filterCount > 0 && (
                <>
                  <div
                    className="flex gap-4 px-5 py-3 cursor-pointer w-fit"
                    onClick={() => {
                      clearAll()
                    }}
                  >
                    <Typography weight={700} variant="base">
                      {i18n._(t`Clear all`)}
                    </Typography>
                  </div>
                </>
              )}
            </div>
            {list && list.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
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
                      changeQuery('page', String(index + 1), '#explore')
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                  {skeleton}
                  {skeleton}
                  {skeleton}
                  {skeleton}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="px-4 cursor-pointer modal">
        <label className="relative modal-box max-w-[360px] w-full">
          <h3 className="text-lg font-bold text-center">{i18n._(t`Filter`)}</h3>
          <div className="w-full">
            {priceFilterRender()}
            {attributesFilterRender()}
          </div>
        </label>
      </label>
    </>
  )
}

export default CollectionListPage
