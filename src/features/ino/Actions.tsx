import { Menu, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Loader from 'app/components/Loader'
import Typography from 'app/components/Typography'
import { defaultChainId } from 'app/config/default_chainid'
import { classNames, maxAmountSpend } from 'app/functions'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import useIno from 'app/hooks/useIno'
import { getSignature } from 'app/services/apis/fetchers'
import { whiteList } from 'app/services/apis/keys'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { useAddPopup } from 'app/state/application/hooks'
import { useBalancesNoZero } from 'app/state/wallet/hooks'
import { INO, INOStage, Plan } from 'app/types/daidai'
import dayjs from 'dayjs'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

export interface TokenPriceProp {
  token: string
  balance: number
}

export enum ActionsStyle {
  Item,
  Detail,
}

const Item = ({
  data,
  getInoData,
  actionsStyle,
  className,
  singal,
}: {
  data: INO
  getInoData: (
    avaliable: number,
    totalCount: number,
    stage: INOStage,
    startTimestamp?: number,
    preSaleTimeStamp?: number,
    preSaleDiscount?: number
  ) => void
  actionsStyle: ActionsStyle
  // 通过singal的变化来触发ino的数据刷新
  singal: number
  className?: string
}) => {
  // console.log('actionsStyle', actionsStyle)
  // console.log('data', data)
  // const { ENSName } = useENSName(data.owner ?? undefined)
  const { account, chainId, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { i18n } = useLingui()
  const addPopup = useAddPopup()

  const defaultMaxBatchMint = 10
  // Renderer callback with condition

  // const { avaliable, totalCount, planList, isStart, startTimestamp, handleBuy } = useIno(
  //   defaultChainId,
  //   data.address,
  //   Number(data.chainId)
  // )

  const getIsBefore = (startTimestamp: number | undefined) => {
    if (!startTimestamp) {
      return true
    }
    const t = `${startTimestamp.toString()}000`
    const isBefore = dayjs(Number(t)).isBefore(Date.now())
    return isBefore
  }

  const inoData = useIno(defaultChainId, data.address, Number(data.chainId), singal)
  // console.log('inoData', inoData)

  const avaliable = useMemo(() => {
    if (account && inoData) {
      return inoData.avaliable
    }
    return Number(data.totalCount) - Number(data.totalSupply)
  }, [account, data.totalCount, data.totalSupply, inoData])

  const totalCount = useMemo(() => {
    if (account && inoData) {
      return inoData.totalCount
    }
    return Number(data.totalCount)
  }, [account, data.totalCount, inoData])

  const maxBatchMint = useMemo(() => {
    if (account && inoData) {
      return inoData.maxBatchMint
    }
    return defaultMaxBatchMint
  }, [account, inoData])

  const planList = useMemo(() => {
    if (account && inoData) {
      return inoData.planList
    }
    // console.log('planList plan', data.plans)
    // 这里的plans只能拿连接钱包之后的，所以这里返回[]即可
    // return data.plans
    return []
  }, [account, inoData])

  const startTimestamp = useMemo(() => {
    if (account && inoData) {
      return inoData.startTimestamp
    }
    return data.startTimestamp ? data.startTimestamp * 1000 : 0
  }, [account, data.startTimestamp, inoData])

  const preSaleTimeStamp = useMemo(() => {
    if (account && inoData) {
      return inoData.preSaleStartTimestamp
    }
    return data.preSaleTimeStamp ? data.preSaleTimeStamp * 1000 : 0
  }, [account, data.preSaleTimeStamp, inoData])

  const preSaleDiscount = useMemo(() => {
    if (account && inoData) {
      return inoData.preSaleDiscount
    }
    return data.preSaleDiscount
  }, [account, data.preSaleDiscount, inoData])

  const isFreeMint = useMemo(() => {
    if (account && inoData) {
      return inoData.isFreeMint
    }
    return data.isFreeMint
  }, [account, data.isFreeMint, inoData])

  // console.log('preSaleDiscount', preSaleDiscount?.toString())

  useEffect(() => {
    getInoData(avaliable, totalCount, inoData.stage, startTimestamp, preSaleTimeStamp, preSaleDiscount)
  }, [avaliable, getInoData, inoData.stage, preSaleDiscount, preSaleTimeStamp, startTimestamp, totalCount])

  // 把ino支持的和用户当前拥有的不为0的token做一个交集
  // const [filterPlanList, setFilterPlanList] = useState<Plan[] | undefined>(undefined)
  const { balances, loading } = useBalancesNoZero()
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined)
  const [initSelectedPlan, setInitSelectedPlan] = useState(false)
  const responseBalance = useMemo(() => {
    if (!selectedPlan) {
      return undefined
    }
    const findObj = balances.find(
      (balance) => balance.currency.symbol?.toLocaleLowerCase() == selectedPlan.token.symbol?.toLocaleLowerCase()
    )
    return findObj ?? undefined
  }, [balances, selectedPlan])
  // const filterPlanList = useMemo<Plan[] | undefined>(() => {
  //   // console.log('useEffect 1', loading, balances, planList)
  //   if (!loading && balances?.length > 0 && planList && planList.length > 0) {
  //     const list: Plan[] = []
  //     planList.map((plan) => {
  //       const findObj = balances.find(
  //         (balance) => balance.currency.symbol?.toLocaleLowerCase() == plan.token.symbol?.toLocaleLowerCase()
  //       )
  //       if (findObj) {
  //         list.push(plan)
  //       }
  //     })
  //     // setFilterPlanList(list)
  //     // if (list.length > 0) {
  //     //   setSelectedPlan(list[0])
  //     // }
  //     // console.log('useEffect 1 end', balances.length, planList.length)
  //     // console.log('balances list')
  //     // balances.map((balance)=>{
  //     //   console.log('balances item', balance.currency.symbol, balance.toSignificant(6))
  //     // })
  //     // console.log('planList list')
  //     // planList.map((plan)=>{
  //     //   console.log('planList item', plan.token.symbol, plan.price.toSignificant(6))
  //     // })
  //     return list
  //   }
  //   return undefined
  // }, [balances, loading, planList])
  useEffect(() => {
    // console.log('useEffect 2')
    // if (!initSelectedPlan && filterPlanList && filterPlanList.length > 0) {
    //   setSelectedPlan(filterPlanList[0])
    //   setInitSelectedPlan(true)
    // }
    if (!initSelectedPlan && planList && planList.length > 0) {
      setSelectedPlan(planList[0])
      setInitSelectedPlan(true)
    }
  }, [initSelectedPlan, planList])

  // approve相关
  // const spender = chainId ? INO_CONTRACT_ADDRESS[chainId] : undefined
  const spender = chainId ? data.address : undefined
  const amountToApprove = useMemo<CurrencyAmount<Currency> | undefined>(() => {
    if (selectedPlan && balances && balances.length) {
      const findBalance = balances.find(
        (balance) => balance.currency.symbol?.toLocaleLowerCase() == selectedPlan.token.symbol?.toLocaleLowerCase()
      )
      if (findBalance) {
        return maxAmountSpend(findBalance)
      }
    }
    return undefined
  }, [selectedPlan, balances])
  // console.log('amountToApprove', amountToApprove)
  const [approvalState, approveCallback] = useApproveCallback(amountToApprove, spender)
  // console.log('approvalState', approvalState, selectedPlan?.token.symbol)
  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])

  // 购买相关的
  const [isBuying, setIsBuying] = useState(false)

  const defaultNumber = 1
  const [number, setNumber] = useState<number>(defaultNumber)
  const cost = useMemo(() => {
    if (selectedPlan) {
      // console.log('selectedPlan', selectedPlan, selectedPlan.price, typeof selectedPlan.price, data)
      return selectedPlan.price.multiply(number)
    }
    return undefined
  }, [number, selectedPlan])
  const minusNumber = () => {
    if (number > 1) {
      setNumber(number - 1)
    }
  }
  const plusNumber = () => {
    if (number < avaliable && number < maxBatchMint) {
      setNumber(number + 1)
    }
  }
  useEffect(() => {
    if (totalCount > 0 && number > avaliable) {
      setNumber(avaliable)
    }
  }, [avaliable, number, totalCount])

  const onPlanSelect = (plan: Plan) => {
    if (plan) {
      setSelectedPlan(plan)
    }
  }

  const buyNowHandleFun = () => {
    if (cost && selectedPlan) {
      // 这里需要用户余额是否足够，不够的话就用warning提醒
      // console.log('responseBalance', responseBalance, cost)
      if (responseBalance && responseBalance.greaterThan(cost)) {
        const promise = inoData.handleBuy({
          plan: selectedPlan,
          cost: cost,
          buyNumber: number,
          inoName: data.name ?? 'INO',
        })
        setIsBuying(true)
        promise
          .catch((error) => {
            console.error('Mint Ino nft error', error)
            // changeStage(NFTItemStage.APPROVED)
            const message = error.message
              ? error.data && error.data.message
                ? `${error.message} ${error.data.message}`
                : error.message
              : ''
            addPopup({
              alert: {
                message: `code: ${error.code} \nmessage: ${message}`,
                success: false,
              },
            })
          })
          .finally(() => {
            setIsBuying(false)
          })
      } else {
        addPopup({
          alert: {
            message: i18n._(t`insufficient funds`),
            success: false,
          },
        })
      }
    }
  }

  const buyNowHandleFunFree = () => {
    setIsBuying(true)
    const promise = inoData.handleBuyFree({
      buyNumber: number,
      inoName: data.name ?? 'INO',
    })
    promise
      .catch((error) => {
        console.error('Mint Ino nft free error', error)
        const message = error.message
          ? error.data && error.data.message
            ? `${error.message} ${error.data.message}`
            : error.message
          : ''
        addPopup({
          alert: {
            message: `code: ${error.code} \nmessage: ${message}`,
            success: false,
          },
        })
      })
      .finally(() => {
        setIsBuying(false)
      })
  }

  const buyNowWhiteListHandleFun = () => {
    if (cost && selectedPlan && preSaleTimeStamp && preSaleDiscount && account && data.address) {
      // 查看白名单
      setIsBuying(true)
      getSignature(whiteList(account, data.address))
        .then((res) => {
          const signature = res.signature
          console.log('buyNowWhiteListHandleFun', signature, preSaleDiscount.toString())
          if (responseBalance && responseBalance.multiply(100).greaterThan(cost.multiply(preSaleDiscount.toString()))) {
            const promise = inoData.handleBuyWhite({
              plan: selectedPlan,
              cost: cost,
              buyNumber: number,
              inoName: data.name ?? 'INO',
              signature: signature,
            })
            promise
              .catch((error) => {
                console.error('Mint Ino nft error', error)
                // changeStage(NFTItemStage.APPROVED)
                const message = error.message
                  ? error.data && error.data.message
                    ? `${error.message} ${error.data.message}`
                    : error.message
                  : ''
                addPopup({
                  alert: {
                    message: `code: ${error.code} \nmessage: ${message}`,
                    success: false,
                  },
                })
              })
              .finally(() => {
                setIsBuying(false)
              })
          } else {
            addPopup({
              alert: {
                message: i18n._(t`insufficient funds`),
                success: false,
              },
            })
          }
        })
        .catch((error) => {
          console.error('not found', error)
          addPopup({
            alert: {
              message: `You are not in whitelist!`,
              success: false,
            },
          })
          setIsBuying(false)
        })
    }
  }

  const buyNowWhiteListHandleFunFree = () => {
    if (preSaleTimeStamp && preSaleDiscount && account && data.address) {
      // 查看白名单
      setIsBuying(true)
      getSignature(whiteList(account, data.address))
        .then((res) => {
          const signature = res.signature
          console.log('buyNowWhiteListHandleFun', signature, preSaleDiscount.toString())
          const promise = inoData.handleBuyWhiteFree({
            buyNumber: number,
            inoName: data.name ?? 'INO',
            signature: signature,
          })
          promise
            .catch((error) => {
              console.error('Mint Ino nft free error', error)
              // changeStage(NFTItemStage.APPROVED)
              const message = error.message
                ? error.data && error.data.message
                  ? `${error.message} ${error.data.message}`
                  : error.message
                : ''
              addPopup({
                alert: {
                  message: `code: ${error.code} \nmessage: ${message}`,
                  success: false,
                },
              })
            })
            .finally(() => {
              setIsBuying(false)
            })
        })
        .catch((error) => {
          console.error('not found', error)
          addPopup({
            alert: {
              message: `You are not in whitelist!`,
              success: false,
            },
          })
          setIsBuying(false)
        })
    }
  }

  const buyNowHandle = () => {
    if (inoData.stage == INOStage.ON_SELLING) {
      if (isFreeMint) {
        buyNowHandleFunFree()
      } else {
        buyNowHandleFun()
      }
    } else if (inoData.stage == INOStage.ON_PRE_SALE) {
      if (isFreeMint) {
        buyNowWhiteListHandleFunFree()
      } else {
        buyNowWhiteListHandleFun()
      }
    }
  }

  const isLoading = useMemo(() => {
    if (account && inoData) {
      return inoData.isLoading && loading
    }
    return true
  }, [account, inoData, loading])

  const breakpoint = useBreakPointMediaQuery()

  const renderBuyItemStyle = () => {
    return (
      <>
        {avaliable > 0 ? (
          <>
            {actionsStyle == ActionsStyle.Item ? (
              <>
                <MinusIcon
                  className="w-6 cursor-pointer"
                  onClick={() => {
                    minusNumber()
                  }}
                />

                <button className={classNames('gap-2 ml-2 mr-2 btn btn-primary')} onClick={buyNowHandle}>
                  {i18n._(t`Buy`)}
                  <Typography variant="base" className="inline-flex ml-4">
                    {number}
                  </Typography>
                </button>

                <PlusIcon
                  className="w-6 cursor-pointer"
                  onClick={() => {
                    plusNumber()
                  }}
                />
              </>
            ) : (
              <>
                <button className={classNames('btn btn-primary w-80')} onClick={buyNowHandle}>
                  {i18n._(t`Buy Now`)}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <button
              className={classNames('btn btn-primary', actionsStyle == ActionsStyle.Item ? 'w-[150px]' : 'w-80')}
              disabled
            >
              {i18n._(t`Sold Out`)}
            </button>
          </>
        )}
      </>
    )
  }

  return (
    <>
      {account ? (
        <>
          {isLoading ? (
            <>
              <div className="flex flex-row items-center h-full">
                <Loader size={'24'}></Loader>
              </div>
            </>
          ) : (
            <>
              {(inoData.stage == INOStage.ON_SELLING || inoData.stage == INOStage.ON_PRE_SALE) && (
                <>
                  {isFreeMint && (
                    <>
                      <div
                        className={classNames(
                          'flex w-full',
                          actionsStyle == ActionsStyle.Item ? 'flex-row items-center justify-between' : 'flex-col'
                        )}
                      >
                        {actionsStyle == ActionsStyle.Item ? (
                          <>
                            <Typography variant="lg" weight={700}>
                              0
                            </Typography>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-row items-center justify-start h-10 gap-4 select-none">
                              <Typography variant="sm" className="w-24 text-base-content text-opacity-60">
                                {i18n._(t`Total Price`)}
                              </Typography>
                              <div className="flex flex-row items-center">
                                <Typography variant="h2" weight={700} className="text-info">
                                  0
                                </Typography>
                              </div>
                            </div>
                            <div className="flex flex-row items-center justify-start h-10 gap-4 mt-2">
                              <Typography variant="sm" className="w-24 text-base-content text-opacity-60">
                                {i18n._(t`Amount`)}
                              </Typography>
                              <div className="flex flex-row items-center">
                                <Typography variant="base">
                                  {avaliable}
                                  {' / '}
                                  {totalCount}
                                </Typography>
                              </div>
                            </div>
                            <div className="flex flex-row items-center justify-start h-10 gap-4 mt-2">
                              <Typography variant="sm" className="w-24 text-base-content text-opacity-60">
                                {i18n._(t`Select nums`)}
                              </Typography>
                              <div className="flex flex-row items-end justify-start gap-8">
                                <div className="flex flex-row items-center btn-group">
                                  <button className="btn btn-square btn-outline btn-sm">
                                    <MinusIcon
                                      className="w-4 cursor-pointer"
                                      onClick={() => {
                                        minusNumber()
                                      }}
                                    />
                                  </button>
                                  <div className="flex items-center justify-center w-12">
                                    <Typography variant="base" weight={700} className="text-info">
                                      {number}
                                    </Typography>
                                  </div>
                                  <button className="btn btn-square btn-outline btn-sm">
                                    <PlusIcon
                                      className="w-4 cursor-pointer"
                                      onClick={() => {
                                        plusNumber()
                                      }}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div
                          className={classNames(
                            'flex flex-row items-center w-full',
                            actionsStyle == ActionsStyle.Item ? 'justify-end' : 'justify-start mt-8'
                          )}
                        >
                          {isBuying && (
                            <>
                              <button className="btn btn-primary loading">{i18n._(t`Buying`)}</button>
                            </>
                          )}
                          {!isBuying && <>{renderBuyItemStyle()}</>}
                        </div>
                      </div>
                    </>
                  )}
                  {isFreeMint === false && (
                    <>
                      {planList && planList.length ? (
                        <div
                          className={classNames(
                            'flex w-full',
                            actionsStyle == ActionsStyle.Item ? 'flex-row items-center justify-between' : 'flex-col'
                          )}
                        >
                          {/* plan相关的 */}
                          {actionsStyle == ActionsStyle.Item ? (
                            <div className="flex flex-col">
                              <Menu as="div" className="relative flex flex-row items-center text-left">
                                <div>
                                  <Menu.Button className="inline-flex items-center justify-center w-full">
                                    <Typography variant="lg" weight={700}>
                                      {/* {selectedPlan?.price.toSignificant(6)} */}
                                      {inoData.stage == INOStage.ON_PRE_SALE
                                        ? (Number(cost?.toSignificant(6)) * ((preSaleDiscount ?? 100) / 100)).toFixed(6)
                                        : cost?.toSignificant(6)}
                                      {/* {cost?.toSignificant(6)} */}
                                    </Typography>
                                    <Typography variant="lg" className="ml-2">
                                      {selectedPlan?.token.symbol}
                                    </Typography>
                                    <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
                                  </Menu.Button>
                                </div>
                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className="absolute left-0 overflow-hidden origin-top-right rounded-md shadow-lg bottom-full w-52 bg-base-100 focus:outline-none sm:bottom-0 sm:left-full">
                                    <div className="">
                                      {planList.map((item) => {
                                        return (
                                          <Menu.Item
                                            key={item.index}
                                            onClick={() => {
                                              onPlanSelect(item)
                                            }}
                                          >
                                            {({ active }) => (
                                              <div className="flex flex-row justify-between p-4 cursor-pointer hover:bg-base-300">
                                                <div className="flex flex-row items-center gap-3">
                                                  <CurrencyLogo currency={item.price.currency}></CurrencyLogo>
                                                  <Typography variant="base">{item.token.symbol}</Typography>
                                                  {selectedPlan && selectedPlan.index == item.index ? (
                                                    <CheckIcon className="w-4" />
                                                  ) : (
                                                    <></>
                                                  )}
                                                </div>
                                                <Typography variant="base">
                                                  {inoData.stage == INOStage.ON_PRE_SALE
                                                    ? (
                                                        Number(item.price.toSignificant(6)) *
                                                        ((preSaleDiscount ?? 100) / 100)
                                                      ).toFixed(6)
                                                    : item.price.toSignificant(6)}
                                                </Typography>
                                              </div>
                                            )}
                                          </Menu.Item>
                                        )
                                      })}
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-row items-center justify-start h-10 gap-4 select-none">
                                <Typography variant="sm" className="w-24 text-base-content text-opacity-60">
                                  {i18n._(t`Total Price`)}
                                </Typography>
                                <div className="flex flex-row items-center">
                                  <Typography variant="h2" weight={700} className="text-info">
                                    {inoData.stage == INOStage.ON_PRE_SALE
                                      ? (Number(cost?.toSignificant(6)) * ((preSaleDiscount ?? 100) / 100)).toFixed(6)
                                      : cost?.toSignificant(6)}
                                  </Typography>
                                  <Typography variant="h2" className="ml-2">
                                    {selectedPlan?.token.symbol}
                                  </Typography>
                                </div>
                              </div>
                              <div className="flex flex-col items-start justify-start gap-4 mt-2 sm:items-center sm:flex-row">
                                <Typography variant="sm" className="w-24 text-base-content text-opacity-60">
                                  {i18n._(t`Select plan`)}
                                </Typography>
                                <div className="flex flex-row flex-wrap items-center justify-start gap-4">
                                  {planList.map((item) => {
                                    return (
                                      <>
                                        <div
                                          key={item.index}
                                          className={classNames(
                                            'flex flex-row gap-2 px-4 py-1 border cursor-pointer border-primary hover:border-opacity-50 items-center',
                                            selectedPlan && selectedPlan.index == item.index
                                              ? 'border-opacity-100'
                                              : 'border-opacity-20'
                                          )}
                                          onClick={() => {
                                            onPlanSelect(item)
                                          }}
                                        >
                                          <CurrencyLogo currency={item.price.currency}></CurrencyLogo>
                                          <Typography variant="sm" className="ml-2">
                                            {item.token.symbol}{' '}
                                            {inoData.stage == INOStage.ON_PRE_SALE
                                              ? (
                                                  Number(item.price.toSignificant(6)) *
                                                  ((preSaleDiscount ?? 100) / 100)
                                                ).toFixed(6)
                                              : item.price.toSignificant(6)}
                                          </Typography>
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                              </div>
                              <div className="flex flex-row items-center justify-start h-10 gap-4 mt-2">
                                <Typography variant="sm" className="w-24 text-base-content text-opacity-60">
                                  {i18n._(t`Amount`)}
                                </Typography>
                                <div className="flex flex-row items-center">
                                  <Typography variant="base">
                                    {avaliable}
                                    {' / '}
                                    {totalCount}
                                  </Typography>
                                </div>
                              </div>
                              <div className="flex flex-row items-center justify-start h-10 gap-4 mt-2">
                                <Typography variant="sm" className="w-24 text-base-content text-opacity-60">
                                  {i18n._(t`Select nums`)}
                                </Typography>
                                <div className="flex flex-row items-end justify-start gap-8">
                                  <div className="flex flex-row items-center btn-group">
                                    <button className="btn btn-square btn-outline btn-sm">
                                      <MinusIcon
                                        className="w-4 cursor-pointer"
                                        onClick={() => {
                                          minusNumber()
                                        }}
                                      />
                                    </button>
                                    <div className="flex items-center justify-center w-12">
                                      <Typography variant="base" weight={700} className="text-info">
                                        {number}
                                      </Typography>
                                    </div>
                                    <button className="btn btn-square btn-outline btn-sm">
                                      <PlusIcon
                                        className="w-4 cursor-pointer"
                                        onClick={() => {
                                          plusNumber()
                                        }}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {/* 按钮相关的 */}
                          <div
                            className={classNames(
                              'flex flex-row items-center',
                              actionsStyle == ActionsStyle.Item ? 'justify-end' : 'justify-start mt-8'
                            )}
                          >
                            {amountToApprove ? (
                              <>
                                {approvalState == ApprovalState.APPROVED && !isBuying ? (
                                  <>{renderBuyItemStyle()}</>
                                ) : (
                                  <></>
                                )}
                                {approvalState == ApprovalState.APPROVED && isBuying ? (
                                  <>
                                    <button className="btn btn-primary loading">{i18n._(t`Buying`)}</button>
                                  </>
                                ) : (
                                  <></>
                                )}
                                {approvalState == ApprovalState.PENDING || approvalState == ApprovalState.UNKNOWN ? (
                                  <>
                                    <button className="btn btn-primary loading">{i18n._(t`Pending`)}</button>
                                  </>
                                ) : (
                                  <></>
                                )}
                                {approvalState == ApprovalState.NOT_APPROVED ? (
                                  <>
                                    <button className="btn btn-primary" onClick={handleApprove}>
                                      {i18n._(t`Approve`)}
                                    </button>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <>
                                <button className="btn btn-primary" disabled>
                                  {i18n._(t`Approve`)}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={classNames(
                            'flex flex-row items-center h-12',
                            actionsStyle == ActionsStyle.Detail ? 'justify-start' : 'justify-center'
                          )}
                        >
                          <Typography weight={700} className="text-warning">
                            {i18n._(t`Have no plan. Up Coming!`)}
                          </Typography>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              {!(inoData.stage == INOStage.ON_SELLING || inoData.stage == INOStage.ON_PRE_SALE) && (
                <>
                  <div className="h-12"></div>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <button
            className={classNames('btn btn-primary', breakpoint == BreakPoint.DEFAULT ? 'w-full' : '')}
            onClick={() => {
              console.log('toggleWalletModal')
              toggleWalletModal()
            }}
          >
            {i18n._(t`Connect Wallet`)}
          </button>
        </>
      )}
    </>
  )
}
export default Item
