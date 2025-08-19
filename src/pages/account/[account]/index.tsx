import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import PleaseSignIn from 'app/components/PleaseSignIn'
import { Feature } from 'app/enums/Feature'
import Activity from 'app/features/account/Activity'
import Assets from 'app/features/account/Assets'
import CollectionList from 'app/features/account/CollectionList'
import Header from 'app/features/account/Header'
import List, { STATUS } from 'app/features/account/List'
// import { useAccountInUrl } from 'app/features/portfolio/useAccountInUrl'
import { classNames } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useMemo } from 'react'
import { format } from 'url'

enum TabName {
  ON_SALE = 'on_sale',
  ITEM = 'items',
  COLLECTION = 'collections',
  ACTIVITY = 'activity',
  WALLET = 'wallet',
}

const Page = (content: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { i18n } = useLingui()
  // const { account, chainId } = useActiveWeb3React()
  const account = content.props.account
  return (
    <>
      <NextSeo title={`${i18n._(t`Account`)} ${account}`} />
      <Account account={account}></Account>
      {/* {account ? (
        <>
          <NextSeo title={`${i18n._(t`Account`)} ${account}`} />
          <Account account={account}></Account>
        </>
      ) : (
        <>
          <NextSeo title={`${i18n._(t`Account`)}`} />
          <div className="container">
            <PleaseSignIn></PleaseSignIn>
          </div>
        </>
      )} */}
    </>
  )
}

export const Account = ({ account }: { account: string }) => {
  const { i18n } = useLingui()
  // const account = useAccountInUrl('/')
  const router = useRouter()
  const { pathname, query } = router
  const activeTab = useMemo(() => {
    const tab = query['tab']
    if (tab) {
      return String(tab)
    }
    return String(TabName.ON_SALE)
  }, [query])

  const changeQueryTab = (value: TabName) => {
    let result = { ...query }
    result['tab'] = String(value)
    const href = format({ pathname: pathname, query: result })
    router.push(href, undefined, { shallow: true })
  }

  if (!account) return <></>
  return (
    <>
      <Header account={account}></Header>
      <div className={classNames('container', 'mt-12', 'border-t border-t-base-300 pt-4')}>
        <div className="flex flex-row justify-center sticky top-0 lg:top-[64px] left-0 right-0 z-20">
          <div className="tabs flex-nowrap bg-base-100">
            <a
              className={classNames('tab tab-bordered h-auto', activeTab == TabName.ON_SALE ? 'tab-active' : '')}
              onClick={() => {
                changeQueryTab(TabName.ON_SALE)
              }}
            >
              {i18n._(t`On Sale`)}
            </a>
            <a
              className={classNames('tab tab-bordered h-auto', activeTab == TabName.ITEM ? 'tab-active' : '')}
              onClick={() => {
                changeQueryTab(TabName.ITEM)
              }}
            >
              {i18n._(t`Items`)}
            </a>
            <a
              className={classNames('tab tab-bordered h-auto', activeTab == TabName.COLLECTION ? 'tab-active' : '')}
              onClick={() => {
                changeQueryTab(TabName.COLLECTION)
              }}
            >
              {i18n._(t`Collections`)}
            </a>
            <a
              className={classNames('tab tab-bordered h-auto', activeTab == TabName.ACTIVITY ? 'tab-active' : '')}
              onClick={() => {
                changeQueryTab(TabName.ACTIVITY)
              }}
            >
              {i18n._(t`Activity`)}
            </a>
            <a
              className={classNames('tab tab-bordered h-auto', activeTab == TabName.WALLET ? 'tab-active' : '')}
              onClick={() => {
                changeQueryTab(TabName.WALLET)
              }}
            >
              {i18n._(t`Wallet`)}
            </a>
          </div>
        </div>
        <div className="px-6 mt-6">
          <div className={classNames(activeTab == TabName.ON_SALE ? 'block' : 'hidden')}>
            {activeTab == TabName.ON_SALE ? <List account={account} status={STATUS.ON_SALE}></List> : <></>}
          </div>
          <div className={classNames(activeTab == TabName.ITEM ? 'block' : 'hidden')}>
            {activeTab == TabName.ITEM ? <List account={account} status={STATUS.ITEMS}></List> : <></>}
          </div>
          <div className={classNames(activeTab == TabName.COLLECTION ? 'block' : 'hidden')}>
            {activeTab == TabName.COLLECTION ? <CollectionList account={account}></CollectionList> : <></>}
          </div>
          <div className={classNames(activeTab == TabName.ACTIVITY ? 'block' : 'hidden')}>
            {activeTab == TabName.ACTIVITY ? <Activity account={account}></Activity> : <></>}
          </div>
          <div className={classNames(activeTab == TabName.WALLET ? 'block' : 'hidden')}>
            {activeTab == TabName.WALLET ? <Assets account={account}></Assets> : <></>}
          </div>
        </div>
      </div>
    </>
  )
}

// 参数改为由这里传过去
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      props: {
        account: context.query.account,
      },
    }, // will be passed to the page component as props
  }
}

Page.Guard = NetworkGuard(Feature.ACCOUNT)
export default Page
