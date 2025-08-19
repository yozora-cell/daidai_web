import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Feature } from 'app/enums/Feature'
import Header from 'app/features/collection/Header'
import List from 'app/features/collection/List'
// import { useChainidAddressInUrl } from 'app/features/collection/useAddressInUrl'
import NetworkGuard from 'app/guards/Network'
import { useCollection } from 'app/services/apis/hooks'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import React from 'react'

const CollectionPage = (content: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log('CollectionPage', content)
  const { i18n } = useLingui()
  // const result = useChainidAddressInUrl('/')
  const chainid = content.props.chainid
  const address = content.props.address
  const { data, error } = useCollection(address)

  // console.log('chainid address', chainid, address)
  return (
    <>
      <NextSeo title={`${i18n._(t`Collection`)} ${address}`} />
      {address && data ? (
        <>
          <Header address={address} data={data}></Header>
          <List address={address}></List>
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
        chaind: context.query.chainid,
        address: context.query.address,
      },
    }, // will be passed to the page component as props
  }
}

CollectionPage.Guard = NetworkGuard(Feature.COLLECTION)
export default CollectionPage
