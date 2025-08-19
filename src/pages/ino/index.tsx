// import { LightningBoltIcon, SwitchVerticalIcon, TrendingDownIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
// import PleaseSignIn from 'app/components/PleaseSignIn'
import { Feature } from 'app/enums/Feature'
import Item, { ItemSkeleton } from 'app/features/ino/Item'
import NetworkGuard from 'app/guards/Network'
import { useCollectionsIno } from 'app/services/apis/hooks'
import { useActiveWeb3React } from 'app/services/web3'
import { NextSeo } from 'next-seo'
import { useMemo, useState } from 'react'

const Page = () => {
  const { i18n } = useLingui()
  const { account, chainId } = useActiveWeb3React()
  return (
    <>
      <NextSeo title={`${i18n._(t`INO`)}`} />
      <INOPage></INOPage>
      {/* {account ? (
        <INOPage></INOPage>
      ) : (
        <div className="container">
          <PleaseSignIn></PleaseSignIn>
        </div>
      )} */}
    </>
  )
}

const INOPage = () => {
  const { i18n } = useLingui()

  const limit = 20
  const pageNeighbours = 1
  // 1是第一页
  const [page, setPage] = useState(1)
  const { data } = useCollectionsIno(page, limit)

  const list = useMemo(() => {
    return data?.data
  }, [data])
  const count = useMemo(() => {
    return data?.count
  }, [data])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])

  return (
    <>
      <div className="container">
        <div className="flex flex-col w-full px-6 mt-12 md:flex-row md:items-center md:justify-between">
          <div className="pr-4">
            <h1 className="text-2xl font-bold sm:text-3xl text-base-content">{i18n._(t`INO`)}</h1>
          </div>
          {/* <div className="flex flex-col justify-between flex-1 md:flex-row md:items-center item-start">
            <div className="flex flex-row flex-wrap items-center justify-start md:w-[450px]">
              <button className="gap-2 mt-3 mr-4 btn btn-primary btn-outline btn-sm md:mt-0">
                <LightningBoltIcon className="w-4" />
                {i18n._(t`On sale`)}
              </button>
              <button className="gap-2 mt-3 mr-4 btn btn-primary btn-outline btn-sm md:mt-0">
                <TrendingDownIcon className="w-4" />
                {i18n._(t`Lowest price`)}
              </button>
              <button className="gap-2 mt-3 mr-4 btn btn-primary btn-outline btn-sm md:mt-0">
                <TrendingUpIcon className="w-4" />
                {i18n._(t`Highest price`)}
              </button>
            </div>
            <div className="mt-3 md:mt-0">
              <button className="gap-2 btn btn-primary btn-outline btn-sm w-[170px]">
                <SwitchVerticalIcon className="w-4" />
                {i18n._(t`Recently listed`)}
              </button>
            </div>
          </div> */}
        </div>
        <div className="px-6 mt-10">
          {data ? (
            <>
              {list && list.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {list.map((item) => {
                      return <Item data={item} key={`ino item${item.address}/${item.chainId}`}></Item>
                    })}
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
                </>
              ) : (
                <>
                  <NoData></NoData>
                </>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
                <ItemSkeleton></ItemSkeleton>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
Page.Guard = NetworkGuard(Feature.INO)
export default Page
