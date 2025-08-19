import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
import { Feature } from 'app/enums'
import ChainIdFilter from 'app/features/ranking/ChainIdFilter'
import DayFilter from 'app/features/ranking/DayFilter'
import Item from 'app/features/ranking/Item'
import NetworkGuard from 'app/guards/Network'
import { useCollectionTrades } from 'app/services/apis/hooks'
import { Daytype } from 'app/types/daidai'
import { NextSeo } from 'next-seo'
import { Fragment, useMemo, useState } from 'react'

const Ranking = () => {
  const { i18n } = useLingui()

  const limit = 20
  const pageNeighbours = 1
  // 1是第一页
  const [page, setPage] = useState(1)
  const defaultDayType = Daytype.thirtyDay
  const [daytype, setDaytype] = useState(defaultDayType)
  const [orderField, setOrderField] = useState('orderby[volumeETH]')
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedChainId, setSelectedChainId] = useState<number | undefined>(undefined)

  const { data, error } = useCollectionTrades(page, limit, daytype, orderField, orderDirection, selectedChainId)
  // console.log('data, error', data, error)

  const list = useMemo(() => {
    return data?.data
  }, [data])
  const count = useMemo(() => {
    return data?.count
  }, [data])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])

  //   console.log('ranking list', list)

  return (
    <>
      <NextSeo title={`${i18n._(t`Ranking`)}`} />
      <div className="container">
        <div className="flex flex-col mt-12 md:flex-row md:items-center">
          <div className="flex flex-col w-full gap-4 px-6 sm:flex-row sm:justify-start sm:items-center">
            <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`Collection Ranking`)}</h1>
            <DayFilter
              onChangeDayType={(dayType) => {
                setDaytype(dayType)
              }}
              defaultDayType={defaultDayType}
            ></DayFilter>
            <ChainIdFilter
              onChangeChainId={(chainId) => {
                // console.log('chainId', chainId)
                setSelectedChainId(chainId)
              }}
            ></ChainIdFilter>
          </div>
        </div>
        <div className="px-6 mt-10">
          <div className="w-full overflow-x-auto">
            {list ? (
              <>
                {list.length > 0 ? (
                  <>
                    <table className="table w-full">
                      <thead className="border-b">
                        <tr>
                          <th className="w-20 bg-base-100">{i18n._(t`Collection`)}</th>
                          <th className="bg-base-100"></th>
                          {/* <th className="bg-base-100">{i18n._(t`Symbol`)}</th> */}
                          <th className="bg-base-100">{i18n._(t`Volume(ETH)`)}</th>
                          <th className="bg-base-100">{i18n._(t`Trades`)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, index) => {
                          return (
                            <>
                              <Item
                                data={item}
                                key={`${index}/${item.address}/trade/${item.updatedAt}`}
                                index={index + 1}
                              ></Item>
                            </>
                          )
                        })}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>
                    <NoData></NoData>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-center mt-8">
          <Pagination
            totalPages={totalPage}
            onChange={(index) => {
              setPage(index + 1)
            }}
            currentPage={page - 1}
            pageNeighbours={pageNeighbours}
            canNextPage={!(page == totalPage)}
            canPreviousPage={!(page == 1)}
          ></Pagination>
        </div>
      </div>
    </>
  )
}
Ranking.Guard = NetworkGuard(Feature.RANKINGS)
export default Ranking
