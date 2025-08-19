import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Feature } from 'app/enums/Feature'
import NotFound from 'app/features/404/index'
import Detail from 'app/features/collection/detail/Detail'
import ItemActivity from 'app/features/collection/detail/ItemActivity'
import MainInfo from 'app/features/collection/detail/MainInfo'
import OfferList from 'app/features/collection/detail/OfferList'
import Owner from 'app/features/collection/detail/Owner'
import Picture from 'app/features/collection/detail/Picture'
import PriceBuy from 'app/features/collection/detail/PriceBuy'
import Properties from 'app/features/collection/detail/Properties'
// import { useChainidAddressTokenidInUrl } from 'app/features/collection/useAddressInUrl'
import NetworkGuard from 'app/guards/Network'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { useNFTDetail } from 'app/services/apis/hooks'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import React, { useMemo } from 'react'

const Collection = (content: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { i18n } = useLingui()
  // const result = useChainidAddressTokenidInUrl('/')
  const breakpoint = useBreakPointMediaQuery()
  const isSm = useMemo(() => {
    if (breakpoint == BreakPoint.DEFAULT || breakpoint == BreakPoint.SM) {
      return true
    }
    return false
  }, [breakpoint])
  const chainid = content.props.chainid
  const address = content.props.address
  const tokenid = content.props.tokenid
  // console.log('chainid address tokenid', chainid, address, tokenid)
  const { data, error } = useNFTDetail(address, tokenid, chainid)
  const listingItem = useMemo(() => {
    if (data && data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])
  // console.log('detail error', error)
  // console.log('nft detail', data)
  // if (!result) return
  return (
    <>
      {error && error.code == -2 && (
        <>
          <NotFound></NotFound>
        </>
      )}
      {data ? (
        <>
          <NextSeo title={`${i18n._(t`Collection`)} ${address} ${tokenid}`} />
          <div className="container px-6">
            {isSm ? (
              <>
                <div className="mt-8">
                  <MainInfo data={data}></MainInfo>
                </div>
                <div className="mt-4">
                  <Picture data={data}></Picture>
                </div>
                <div className="mt-4">
                  <PriceBuy data={data}></PriceBuy>
                </div>
                <div className="mt-4">
                  <Detail data={data}></Detail>
                </div>
                <div className="mt-4">
                  <Properties data={data}></Properties>
                </div>
                <div className="mt-4">
                  <OfferList data={data}></OfferList>
                </div>
                <div className="mt-4">
                  <ItemActivity data={data}></ItemActivity>
                </div>
                {listingItem ? (
                  <div className="mt-4">
                    <Owner data={data}></Owner>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="flex flex-row mt-16">
                <div className="w-4/12">
                  <Picture data={data}></Picture>
                  <div className="mt-4">
                    <Detail data={data}></Detail>
                  </div>
                  <div className="mt-4">
                    <Properties data={data}></Properties>
                  </div>
                </div>
                <div className="box-border w-8/12 pl-12">
                  <MainInfo data={data}></MainInfo>
                  <div className="mt-16">
                    <PriceBuy data={data}></PriceBuy>
                  </div>
                  <div className="mt-16">
                    <OfferList data={data}></OfferList>
                  </div>
                  <div className="mt-16">
                    <ItemActivity data={data}></ItemActivity>
                  </div>
                  {listingItem ? (
                    <div className="mt-16">
                      <Owner data={data}></Owner>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

// 参数改为由这里传过去
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      props: {
        chainid: context.query.chainid,
        address: context.query.address,
        tokenid: context.query.tokenid,
      },
    }, // will be passed to the page component as props
  }
}

Collection.Guard = NetworkGuard(Feature.COLLECTION)
export default Collection
