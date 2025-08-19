// import { LightningBoltIcon, SwitchVerticalIcon, TrendingDownIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import PleaseSignIn from 'app/components/PleaseSignIn'
import { Feature } from 'app/enums/Feature'
import List from 'app/features/collection/List'
import Actions, { ActionsStyle } from 'app/features/ino/Actions'
import Countdown from 'app/features/ino/Countdown'
import Banner from 'app/features/ino/detail/Banner'
import MainInfo from 'app/features/ino/detail/MainInfo'
import Picture from 'app/features/ino/detail/Picture'
import Label from 'app/features/ino/Label'
// import Stat from 'app/features/ino/detail/Stat'
import NetworkGuard from 'app/guards/Network'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import { useCollection } from 'app/services/apis/hooks'
import { INOStage } from 'app/types/daidai'
// import { useActiveWeb3React } from 'app/services/web3'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import { useMemo, useState } from 'react'

const Page = (content: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { i18n } = useLingui()
  // const { account, chainId } = useActiveWeb3React()
  const chainid = content.props.chainid
  const address = content.props.address
  return (
    <>
      <NextSeo title={`${i18n._(t`INO`)} ${address}`} />
      <INOPage chainid={chainid} address={address}></INOPage>
      {/* {account ? (
        <INOPage chainid={chainid} address={address}></INOPage>
      ) : (
        <div className="container">
          <PleaseSignIn></PleaseSignIn>
        </div>
      )} */}
    </>
  )
}

const INOPage = ({ chainid, address }: { chainid: string; address: string }) => {
  const { i18n } = useLingui()
  const breakpoint = useBreakPointMediaQuery()
  const isSm = useMemo(() => {
    if (breakpoint == BreakPoint.DEFAULT || breakpoint == BreakPoint.SM || breakpoint == BreakPoint.MD) {
      return true
    }
    return false
  }, [breakpoint])
  const { data, error } = useCollection(address)
  const [avaliable, setAvaliable] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [startTimestamp, setStartTimestamp] = useState(0)
  const [preSaleStartTimestamp, setPreSaleStartTimestamp] = useState(0)
  const [preSaleDiscount, setPreSaleDiscount] = useState(0)
  const [stage, setStage] = useState(INOStage.LOADING)
  const [singal, setSingal] = useState(0)

  return (
    <>
      <div className="flex flex-col items-center w-full">
        {data ? (
          <>
            {isSm ? (
              <>
                <Banner data={data}></Banner>
                <div className="container px-6 mt-4">
                  <Label stage={stage} isBadge={true} />
                  <div className="w-full mt-2">
                    <MainInfo data={data}></MainInfo>
                  </div>
                  {/* <Stat data={data}></Stat> */}
                  <div className="relative px-4 mt-4">
                    <Picture data={data}></Picture>
                    <div className="absolute left-0 right-0 text-base-100 top-4">
                      <Countdown
                        stage={stage}
                        startTimestamp={stage == INOStage.PRE_SALE_COMING_SOON ? preSaleStartTimestamp : startTimestamp}
                        onEnd={() => {
                          // 修改信号来引发inoData的更新
                          console.log('countdown end')
                          setSingal(singal + 1)
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Actions
                      data={data}
                      getInoData={(avaliable, totalCount, stage, startTimestamp, preSaleTimeStamp, preSaleDiscount) => {
                        setAvaliable(avaliable)
                        setTotalCount(totalCount)
                        setStage(stage)
                        setStartTimestamp(startTimestamp ?? 0)
                        setPreSaleStartTimestamp(preSaleTimeStamp ?? 0)
                        setPreSaleDiscount(preSaleDiscount ?? 0)
                      }}
                      actionsStyle={ActionsStyle.Detail}
                      singal={singal}
                    ></Actions>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Banner data={data}></Banner>
                <div className="w-full px-4 lg:px-8">
                  <div className="flex flex-row mt-16">
                    <div className="relative w-4/12 px-4">
                      <Picture data={data}></Picture>
                      <div className="absolute left-0 right-0 text-base-100 top-4">
                        <Countdown
                          stage={stage}
                          startTimestamp={
                            stage == INOStage.PRE_SALE_COMING_SOON ? preSaleStartTimestamp : startTimestamp
                          }
                          onEnd={() => {
                            // 修改信号来引发inoData的更新
                            console.log('countdown end')
                            setSingal(singal + 1)
                          }}
                        />
                      </div>
                    </div>
                    <div className="box-border w-8/12 pl-12">
                      <Label stage={stage} isBadge={true} />
                      <MainInfo data={data}></MainInfo>
                      <div className="mt-8">
                        <Actions
                          data={data}
                          getInoData={(
                            avaliable,
                            totalCount,
                            stage,
                            startTimestamp,
                            preSaleTimeStamp,
                            preSaleDiscount
                          ) => {
                            setAvaliable(avaliable)
                            setTotalCount(totalCount)
                            setStage(stage)
                            setStartTimestamp(startTimestamp ?? 0)
                            setPreSaleStartTimestamp(preSaleTimeStamp ?? 0)
                            setPreSaleDiscount(preSaleDiscount ?? 0)
                          }}
                          actionsStyle={ActionsStyle.Detail}
                          singal={singal}
                        ></Actions>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      {data ? (
        <>
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
        chainid: context.query.chainid,
        address: context.query.address,
      },
    }, // will be passed to the page component as props
  }
}

Page.Guard = NetworkGuard(Feature.INO)
export default Page
