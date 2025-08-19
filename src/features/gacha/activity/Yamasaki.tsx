import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import { ChainId } from '@sushiswap/core-sdk'
import { Currency, CurrencyAmount, JSBI } from '@sushiswap/core-sdk'
import AutoFitImage from 'app/components/AutoFitImage'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { GACHA_ADDRESS } from 'app/config/address'
import Image from 'app/features/common/Image'
import { classNames, maxAmountSpend } from 'app/functions'
import { getReceipt } from 'app/functions/retry'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import useGacha from 'app/hooks/useGacha'
import { postNftsFind } from 'app/services/apis/fetchers'
import { useTicket } from 'app/services/apis/hooks'
import { useUserDrawByTx } from 'app/services/graph/hooks/gacha'
import { useActiveWeb3React } from 'app/services/web3'
import { useChainId } from 'app/state/application/hooks'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { useAddPopup } from 'app/state/application/hooks'
// import { useAppSelector } from 'app/state/hooks'
import { useTokenByAddressCallback, useTokenList } from 'app/state/token/hooks'
// import { selectTransactions } from 'app/state/transactions/selectors'
import { useBalancesNoZero } from 'app/state/wallet/hooks'
import { GachaSignature, NFTDetail, SlotsGraph, SlotsNFT, SlotsToken, SlotsType } from 'app/types/daidai'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import TicketModal from '../TicketModal'

const getCollectionIds = (data: SlotsNFT[]) => {
  const array: string[] = []
  data.forEach((item) => {
    array.push(`${item.address}-${item.id}`)
  })
  return array
}

interface BingoResType {
  draws: SlotsGraph[]
}

const Page = ({ loadData }: { loadData: (nfts: SlotsNFT[], tokens: SlotsToken[]) => void }) => {
  const { account, library } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const addPopup = useAddPopup()
  const chainId = useChainId()
  // useEffect(() => {
  //   if (library && chainId) {
  //     //0x03dfb5a17a8ea8b495264a5a0614fbc0ba862c8d087d65984a59a51c21c189ec
  //     const tx = '0x03dfb5a17a8ea8b495264a5a0614fbc0ba862c8d087d65984a59a51c21c189ec'
  //     const { promise } = getReceipt(tx, library, chainId)
  //     promise.then((receipt) => {
  //       console.log('receipt', receipt)
  //     })
  //   }
  // }, [chainId, library])
  // const state = useAppSelector(selectTransactions)
  // const transactions = useMemo(() => (chainId ? state[chainId as ChainId] ?? {} : {}), [chainId, state])
  const { i18n } = useLingui()

  const tokenList = useTokenList()
  const [singal, setSingal] = useState(1)
  const data = useGacha(singal)
  // console.log('data', data)
  const bg = '/images/gacha/activity/yamasaki_bg.jpeg'
  const congratulation = '/images/gacha/congratulation.png'
  const left_gray = '/images/gacha/left_gray.png'
  const left_white = '/images/gacha/left_white.png'
  const left_black = '/images/gacha/left_black.png'
  const right_gray = '/images/gacha/right_gray.png'
  const right_white = '/images/gacha/right_white.png'
  const right_black = '/images/gacha/right_black.png'

  const [isOpenTicketModal, setIsOpenTicketModal] = useState(false)
  const [curTicket, setCurTicket] = useState<GachaSignature | undefined>(undefined)

  const ticketData = useTicket(account)
  // 设定NonceList，这里要控制只能设定一次，要不然会死循环
  useEffect(() => {
    if (
      ticketData &&
      ticketData.data &&
      ticketData.data.data &&
      ticketData.data.data.length > 0 &&
      data.usedNonce.size == 0
    ) {
      const nonceList: number[] = []
      const list = ticketData.data.data
      list.forEach((item) => {
        nonceList.push(item.nonce)
      })
      data.setNonceList(nonceList)
    }
  }, [data, ticketData])
  useEffect(() => {
    // 检查 curTicket 是否已经被使用
    // 不检查的话，在抽完之后，因为 curTicket 为 true，所以不会自动更新 curTicket 的值
    let used = true
    if (curTicket) {
      const nonce = curTicket.nonce
      if (data.usedNonce.has(nonce) && data.usedNonce.get(nonce) === false) {
        used = false
      }
    }
    // 如果curTicket被使用过 或者 当curTicket没有值的时候，才执行下面的方法
    // 否则会覆盖掉模态框的选择结果
    if (
      used &&
      ticketData &&
      ticketData.data &&
      ticketData.data.data &&
      ticketData.data.data.length > 0 &&
      data.usedNonce.size > 0
    ) {
      const list = ticketData.data.data
      // 找到第一个可用的nonce
      const result = list.find((item) => {
        const nonce = item.nonce
        if (data.usedNonce.has(nonce) && data.usedNonce.get(nonce) === false) {
          return true
        }
      })
      setCurTicket(result)
    }
  }, [ticketData, data.usedNonce, curTicket])

  const [count, setCount] = useState(1)
  const maxCount = useMemo(() => {
    return data.drawLimit
  }, [data.drawLimit])
  const minCount = 1

  useEffect(() => {
    loadData(data.nfts, data.tokens)
  }, [data, loadData])

  const nftsRare = useMemo(() => {
    if (data.slots && data.slots.length > 0 && data.nfts && data.nfts.length > 0) {
      return Number((100 * data.nfts.length) / data.slots.length).toFixed(2)
    }
    return 0
  }, [data.nfts, data.slots])

  const tokensRare = useMemo(() => {
    if (data.slots && data.slots.length > 0 && data.tokens && data.tokens.length > 0) {
      return Number((100 * data.tokens.length) / data.slots.length).toFixed(2)
    }
    return 0
  }, [data.slots, data.tokens])

  // const [freeDrawCount, setFreeDrawCount] = useState(0)

  const cost = useMemo(() => {
    if (data && data.price) {
      // console.log('selectedPlan', selectedPlan, selectedPlan.price, typeof selectedPlan.price, data)
      if (count === data.drawLimit) {
        return data.price.multiply(data.drawLimit).multiply(data.maxDrawDiscount).divide(100)
      }
      return data.price.multiply(count)
    }
    return undefined
  }, [count, data])

  const discountCost = useMemo(() => {
    if (data && data.maxDrawDiscount) {
      return data.price?.multiply(data.drawLimit).multiply(data.maxDrawDiscount).divide(100)
    }
    return undefined
  }, [data])

  // const demoAccount = '0xb45162c8c126cdd493545439135229d8b0642b46'
  // const data2 = useUserDrawCounts({
  //   variables: {
  //     account: demoAccount,
  //   },
  //   shouldFetch: true,
  // })
  // console.log('data2', data2)
  // const data3 = useUserDraw({
  //   variables: {
  //     account: '0xfd2962a70eB80C10b498f8F5e0C847152a2c036D',
  //   },
  //   shouldFetch: true,
  // })
  // console.log('data3', data3)

  const [isDrawing, setIsDrawing] = useState(false)
  const [isFreeDrawing, setIsFreeDrawing] = useState(false)

  const luckDraw = (times: number) => {
    if (isDrawing) {
      return
    }
    if (times > 0 && times > data.slots.length) {
      addPopup({
        alert: {
          message: i18n._(t`Slots machine exhausts!`),
          success: false,
        },
      })
      return
    }
    setBingoCount(times)
    setIsDrawing(true)
    setIsOpenModal(false)
    data
      .handleLuckDraw({ times: times })
      .then((tx: any) => {
        console.log('handleLuckDraw', tx)
        const txHash = tx.transactionHash
        console.log('txHash', txHash)
        const { promise } = getReceipt(txHash, library, chainId)
        promise
          .then((receipt) => {
            console.log('receipt', receipt)
            // success
            if (receipt && receipt.status === 1) {
              setBingoTxHash(txHash)
              setIsOpenModal(true)
            }
          })
          .catch((error: any) => {
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
      })
      .catch((error: any) => {
        console.error('handleLuckDraw', error)
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
        setIsDrawing(false)
      })
  }

  const freeDraw = () => {
    if (isFreeDrawing) {
      return
    }
    const times = curTicket ? curTicket.times : 0
    if (curTicket && times > 0 && times > data.slots.length) {
      addPopup({
        alert: {
          message: i18n._(t`Slots machine exhausts!`),
          success: false,
        },
      })
      return
    }
    if (times > 0 && curTicket) {
      setBingoCount(times)
      setIsFreeDrawing(true)
      setIsOpenModal(false)
      data
        .handleFreeDraw({ times: curTicket.times, nonce: String(curTicket.nonce), signature: curTicket.signature })
        .then((tx: any) => {
          console.log('handleFreeDraw', tx)
          const txHash = tx.transactionHash
          console.log('txHash', txHash)
          const { promise } = getReceipt(txHash, library, chainId)
          promise
            .then((receipt) => {
              console.log('receipt', receipt)
              // success
              if (receipt && receipt.status === 1) {
                setBingoTxHash(txHash)
                setIsOpenModal(true)
              }
            })
            .catch((error: any) => {
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
        })
        .catch((error: any) => {
          console.error('handleFreeDraw', error)
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
          setIsFreeDrawing(false)
        })
    }
  }

  const { balances } = useBalancesNoZero()
  // approve相关
  // const spender = chainId ? INO_CONTRACT_ADDRESS[chainId] : undefined
  const spender = useMemo(() => {
    if (chainId && chainId in GACHA_ADDRESS) {
      return GACHA_ADDRESS[chainId]
    }
    return undefined
  }, [chainId])
  const amountToApprove = useMemo<CurrencyAmount<Currency> | undefined>(() => {
    if (data.paymentToken && data.paymentToken.symbol && balances && balances.length) {
      const symbol = data.paymentToken.symbol
      const findBalance = balances.find(
        (balance) => balance.currency.symbol?.toLocaleLowerCase() == symbol.toLocaleLowerCase()
      )
      if (findBalance) {
        return maxAmountSpend(findBalance)
      }
    }
    return undefined
  }, [data.paymentToken, balances])
  // console.log('amountToApprove', amountToApprove)
  const [approvalState, approveCallback] = useApproveCallback(amountToApprove, spender)
  // console.log('approvalState', approvalState, selectedPlan?.token.symbol)
  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])

  const renderDrawBtn = (isNormal: boolean) => {
    return (
      <>
        {account ? (
          <>
            {amountToApprove ? (
              <>
                {approvalState == ApprovalState.APPROVED && !isDrawing ? (
                  <>
                    <button
                      className={classNames('w-full btn btn-primary btn-outline !rounded-lg')}
                      onClick={() => {
                        if (isNormal) {
                          luckDraw(count)
                        } else {
                          luckDraw(data.drawLimit)
                        }
                      }}
                    >
                      {i18n._(t`BUY AND MINT`)}
                    </button>
                  </>
                ) : (
                  <></>
                )}
                {approvalState == ApprovalState.APPROVED && isDrawing ? (
                  <>
                    <button className="w-full btn btn-primary btn-outline loading !rounded-lg">
                      {i18n._(t`BUY AND MINT`)}
                    </button>
                  </>
                ) : (
                  <></>
                )}
                {approvalState == ApprovalState.PENDING || approvalState == ApprovalState.UNKNOWN ? (
                  <>
                    <button className="w-full btn btn-primary btn-outline loading !rounded-lg">
                      {i18n._(t`Pending`)}
                    </button>
                  </>
                ) : (
                  <></>
                )}
                {approvalState == ApprovalState.NOT_APPROVED ? (
                  <>
                    <button className="w-full btn btn-primary btn-outline !rounded-lg" onClick={handleApprove}>
                      {i18n._(t`Approve`)}
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <button className="w-full btn btn-primary btn-outline !rounded-lg" disabled>
                  {i18n._(t`Approve`)}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <button className="w-full btn btn-primary btn-outline !rounded-lg" onClick={toggleWalletModal}>
              {i18n._(t`Connect Wallet`)}
            </button>
          </>
        )}
      </>
    )
  }

  const [isOpenModal, setIsOpenModal] = useState(false)
  // 是否有中奖的
  const [isBingo, setIsBingo] = useState(false)
  const [bingoTxHash, setBingoTxHash] = useState<string | undefined>()
  const shouldLoadBingoRes: boolean = useMemo(() => {
    if (bingoTxHash && account) {
      return true
    }
    return false
  }, [bingoTxHash, account])
  // 这里通过控制一个signal变量来间接控制graph数据的再次加载
  const bingoRes: BingoResType = useUserDrawByTx({
    variables: {
      tx: bingoTxHash,
      account: account,
      singal: singal,
    },
    shouldFetch: shouldLoadBingoRes,
  })
  // console.log('shouldLoadBingoRes', shouldLoadBingoRes, bingoRes, bingoTxHash, account)
  const [bingoCount, setBingoCount] = useState(0)
  const [isLoadingBingo, setIsLoadingBingo] = useState(false)
  const [bingoNFTs, setBingoNFTs] = useState<NFTDetail[]>([])
  const [bingoTokens, setBingoTokens] = useState<SlotsToken[]>([])
  // 因为graph的延时问题，尽管拿到txhash进行加载也无法保证加载结果的正确性，所以这里追加isMatch来验证拿到的graph数据是否是吻合的
  const [isMatch, setIsMatch] = useState(false)
  const findToken = useTokenByAddressCallback()
  useEffect(() => {
    setIsLoadingBingo(true)
    const nfts: SlotsNFT[] = []
    const tokens: SlotsToken[] = []
    if (bingoRes && bingoRes.draws && bingoRes.draws.length) {
      if (bingoRes.draws.length === bingoCount) {
        setIsMatch(true)
      } else {
        setIsMatch(false)
      }
      bingoRes.draws.forEach((slot) => {
        if (slot.slotType === SlotsType.Token) {
          const address = slot.asset
          const currentToken = findToken(address)
          if (currentToken) {
            const price = CurrencyAmount.fromRawAmount(currentToken, JSBI.BigInt(slot.idOrAmount))
            tokens.push({
              token: currentToken,
              price: price,
            })
          }
        } else if (slot.slotType === SlotsType.NFT) {
          nfts.push({
            id: slot.idOrAmount,
            address: slot.asset,
          })
        }
      })
    } else {
      // graph没加载回数据
      setIsMatch(false)
    }
    setBingoTokens(tokens)
    if (nfts.length > 0) {
      // 加载数据的nft数据
      const promise = postNftsFind(getCollectionIds(nfts))
      promise
        .then((data) => {
          // console.log('test', data)
          if (data) {
            setBingoNFTs(data)
          }
        })
        .finally(() => {
          setIsLoadingBingo(false)
        })
    } else {
      setBingoNFTs([])
      setIsLoadingBingo(false)
    }
    setIsBingo(nfts.length + tokens.length > 0)
  }, [bingoCount, bingoRes, findToken, tokenList])

  const mintTimeRender = (isWhite = true) => {
    return (
      <>
        <div
          className={classNames(
            'flex flex-col items-center justify-between w-64 h-64 p-4 mt-8 sm:p-6 md:w-72 md:h-72',
            isWhite ? 'rounded-3xl bg-base-100 bg-opacity-20' : ''
          )}
          style={{
            backdropFilter: isWhite ? 'blur(20px)' : 'none',
          }}
        >
          <Typography variant="lg" className={classNames(isWhite ? 'text-base-100' : '')} weight={700}>
            {i18n._(t`MINT TIME`)}
          </Typography>
          <div className="relative flex flex-row justify-center w-full">
            <div className="absolute left-0 top-[30px]">
              <div
                className={classNames(
                  'relative w-[24.8px] h-[33.6px]',
                  count >= minCount + 1 ? 'cursor-pointer' : 'cursor-disabled'
                )}
                onClick={() => {
                  if (count >= minCount + 1) {
                    setCount(count - 1)
                  }
                }}
              >
                {count <= minCount ? (
                  <>
                    <Image src={left_gray} alt="img" layout="fill" className="object-cover" />
                  </>
                ) : (
                  <>
                    {isWhite ? (
                      <>
                        <Image src={left_white} alt="img" layout="fill" className="object-cover" />
                      </>
                    ) : (
                      <>
                        <Image src={left_black} alt="img" layout="fill" className="object-cover" />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <Typography className={classNames('md:!text-8xl !text-7xl', isWhite ? 'text-base-100' : '')} weight={700}>
              {count}
            </Typography>
            <div className="absolute right-0 top-[30px]">
              <div
                className={classNames(
                  'relative w-[24.8px] h-[33.6px]',
                  count <= maxCount - 1 ? 'cursor-pointer' : 'cursor-disabled'
                )}
                onClick={() => {
                  if (count <= maxCount - 1) {
                    setCount(count + 1)
                  }
                }}
              >
                {count <= maxCount - 1 ? (
                  <>
                    {isWhite ? (
                      <>
                        <Image src={right_white} alt="img" layout="fill" className="object-cover" />
                      </>
                    ) : (
                      <>
                        <Image src={right_black} alt="img" layout="fill" className="object-cover" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Image src={right_gray} alt="img" layout="fill" className="object-cover" />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-end gap-2">
            <Typography variant="h3" className={classNames(isWhite ? 'text-base-100' : '')} weight={700}>
              {cost?.toSignificant(6)}
            </Typography>
            <Typography variant="lg" className={classNames(isWhite ? 'text-base-100' : '')} weight={700}>
              {data.paymentToken?.symbol}
            </Typography>
          </div>
          {renderDrawBtn(true)}
        </div>
      </>
    )
  }

  const mintTimeRender2 = (isWhite = false) => {
    return (
      <>
        <div
          className={classNames(
            'flex flex-col items-center justify-between w-64 h-64 p-4 mt-8 sm:p-6 md:w-72 md:h-72',
            isWhite ? 'rounded-3xl bg-base-100 bg-opacity-20' : ''
          )}
          style={{
            backdropFilter: isWhite ? 'blur(20px)' : 'none',
          }}
        >
          <Typography variant="lg" className={classNames(isWhite ? 'text-base-100' : '')} weight={700}>
            {i18n._(t`SALES PROMOTION`)}
          </Typography>
          <div className="flex flex-row items-end gap-2">
            <div className="relative">
              <Typography className={classNames('md:!text-8xl !text-7xl', isWhite ? 'text-base-100' : '')} weight={700}>
                {data.drawLimit}
              </Typography>
              {isWhite && (
                <>
                  <Typography
                    variant="lg"
                    className={classNames('absolute pl-2 bottom-3 left-full', isWhite ? 'text-base-100' : '')}
                    weight={700}
                  >
                    {i18n._(t`TIMES`)}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row items-end gap-2">
            {/* <Typography variant="h3" className={classNames(isWhite ? 'text-base-100' : '')} weight={700}>
                      100*
                    </Typography> */}
            <Typography variant="h3" className="text-[#FF6C7D]" weight={700}>
              {discountCost?.toSignificant(6)}
            </Typography>
            <Typography variant="lg" className={classNames(isWhite ? 'text-base-100' : '')} weight={700}>
              {data.paymentToken?.symbol}
            </Typography>
          </div>
          {renderDrawBtn(false)}
        </div>
      </>
    )
  }

  return (
    <>
      <div
        className="relative flex flex-row justify-center w-full bg-[length:auto_50%] md:bg-cover"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundColor: '#eba362',
        }}
      >
        <div className="container flex flex-col px-6 py-24">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="flex flex-col gap-4">
              {/**285 79 */}
              <div className="relative">
                <span className="text-4xl text-white md:text-6xl" style={{ textShadow: '0 0.1em 2px rgba(0,0,0,0.6)' }}>
                  DAIDAI EVENT
                </span>
              </div>
              {/**540 65 */}
              <div className="relative">
                <span className="text-3xl text-white md:text-5xl" style={{ textShadow: '0 0.1em 2px rgba(0,0,0,0.6)' }}>
                  YAMASAKI Whisky GACHA MACHINE
                </span>
              </div>
              <div className="md:w-[594px] md:p-6 mt-8 border-8 border-white border-dashed rounded-3xl w-[300px] p-4 gap-4 flex-col flex">
                {/* <Typography className="text-2xl text-base-100 md:text-3xl" weight={700}>
                  {i18n._(t`Maximum Token Reward`)}
                </Typography>
                <Typography className="text-[#FF6C7D] md:text-4xl text-2xl" weight={700}>
                  $2,357
                </Typography> */}
                <div className="flex flex-row items-center gap-4">
                  <Typography className="text-[#F3D421] md:text-4xl text-1xl" weight={700}>
                    {nftsRare}%
                  </Typography>
                  <Typography className="text-1xl text-base-100 md:text-3xl" weight={700}>
                    {i18n._(t`WILL WIN`)}
                  </Typography>
                  <Typography className="text-[#c2291b] md:text-4xl text-1xl" weight={700}>
                    {i18n._(t`NFTS`)}
                  </Typography>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <Typography className="text-[#F3D421] md:text-4xl text-1xl" weight={700}>
                    {tokensRare}%
                  </Typography>
                  <Typography className="text-1xl text-base-100 md:text-3xl" weight={700}>
                    {i18n._(t`WILL WIN`)}
                  </Typography>
                  <Typography className="text-[#c2291b] md:text-4xl text-1xl" weight={700}>
                    {i18n._(t`TOKENS`)}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center grow">
              {/**540 65 */}
              {/* <div className="md:w-[328px] md:h-[418px] relative w-[262.4px] h-[334.4px]">
                <Image src={gacha_machine} alt="img" layout="fill" className="object-cover" />
              </div> */}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 mt-24 md:flex-row">
            <div
              className="p-4 sm:p-6 rounded-3xl bg-base-100 bg-opacity-20"
              style={{
                backdropFilter: 'blur(20px)',
              }}
            >
              <Typography variant="lg" className="text-base-100" weight={700}>
                {i18n._(t`YOUR FREE TIMES`)}
              </Typography>
              <div
                className="flex flex-col items-center justify-between w-64 h-64 p-4 mt-8 sm:p-6 md:w-72 md:h-72 rounded-3xl bg-base-100 bg-opacity-20"
                style={{
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Typography variant="lg" className="text-base-100" weight={700}>
                  {i18n._(t`FREE MINT TIME`)}
                </Typography>
                <Typography className="text-base-100 md:!text-8xl !text-7xl" weight={700}>
                  {curTicket ? curTicket.times : 0}
                </Typography>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="w-full btn btn-primary btn-outline !rounded-lg"
                    disabled={(curTicket ? curTicket.times : 0) === 0}
                    onClick={() => {
                      setIsOpenTicketModal(true)
                    }}
                  >
                    {i18n._(t`Select Ticket`)}
                  </button>
                  <button
                    className={classNames(
                      'w-full btn btn-primary btn-outline !rounded-lg',
                      (curTicket ? curTicket.times : 0) == 0 ? 'btn-disabled' : '',
                      isFreeDrawing ? 'loading' : ''
                    )}
                    disabled={(curTicket ? curTicket.times : 0) === 0}
                    onClick={() => {
                      freeDraw()
                    }}
                  >
                    {i18n._(t`USE`)}
                  </button>
                </div>
              </div>
            </div>
            <div
              className="p-4 sm:p-6 rounded-3xl bg-base-100 bg-opacity-20"
              style={{
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex flex-row justify-between gap-8">
                <Typography variant="lg" className="text-base-100" weight={700}>
                  {i18n._(t`BUY AND MINT`)}
                </Typography>
              </div>
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                {mintTimeRender(true)}
                {mintTimeRender2(true)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/**  */}
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={close}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay
                className="fixed inset-0"
                style={{
                  background:
                    isBingo && isMatch
                      ? `url(${congratulation}) rgba(0, 0, 0, 0.37) no-repeat center center fixed`
                      : 'rgba(0, 0, 0, 0.37)',
                  backgroundSize: 'cover',
                }}
              />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={classNames(
                  'inline-block w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform border shadow-xl bg-base-100 rounded-2xl',
                  isBingo ? 'max-w-md' : 'max-w-lg'
                )}
              >
                <div className="relative flex flex-row justify-center w-full">
                  {isMatch ? (
                    <>
                      {isBingo ? (
                        <>
                          <Typography className="text-1xl" weight={700}>
                            {i18n._(t`CONGRATULATIONS!`)}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography className="text-1xl" weight={700}>
                            {i18n._(t`Uh-oh!`)}
                          </Typography>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Typography className="text-1xl" weight={700}>
                        {i18n._(t`LOADING FROM BLOCKCHAIN!`)}
                      </Typography>
                    </>
                  )}
                  <XIcon
                    className="absolute right-0 w-4 cursor-pointer top-1"
                    onClick={() => {
                      setIsOpenModal(false)
                      setBingoTxHash('')
                    }}
                  ></XIcon>
                </div>
                {isMatch ? (
                  <>
                    {isBingo ? (
                      <>
                        {bingoTokens.length > 0 && (
                          <>
                            <div className="mt-4">
                              <div className="flex flex-row justify-start">
                                <Typography className="lg">{i18n._(t`Token`)}</Typography>
                              </div>
                              <div className="mt-2 overflow-x-auto">
                                <table className="table w-full">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="bg-base-100">{i18n._(t`Token`)}</th>
                                      <th className="bg-base-100">{i18n._(t`Amount`)}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bingoTokens.map((item, index) => (
                                      <>
                                        <tr>
                                          <td>
                                            <div className="flex flex-row items-center gap-2">
                                              <CurrencyLogo currency={item.token}></CurrencyLogo>
                                              <Typography className="base">{item.token.symbol}</Typography>
                                            </div>
                                          </td>
                                          <td>
                                            {item.price.toSignificant(6)}
                                            {item.token.symbol}
                                          </td>
                                        </tr>
                                      </>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        )}
                        {bingoNFTs.length > 0 && (
                          <>
                            <div className="mt-4">
                              <div className="flex flex-row justify-start">
                                <Typography className="lg">{i18n._(t`NFTs`)}</Typography>
                              </div>
                              <div className="mt-2 overflow-x-auto">
                                <table className="table w-full">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="bg-base-100">{i18n._(t`NFT`)}</th>
                                      <th className="bg-base-100">{i18n._(t`Collections/Token ID`)}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bingoNFTs.map((item) => (
                                      <>
                                        <tr>
                                          <td>
                                            <div className="w-20 h-20">
                                              <AutoFitImage
                                                imageUrl={item.image ?? ''}
                                                defaultWidthStyle={'80px'}
                                                defaultHeightStyle={'80px'}
                                                roundedClassName="rounded-md"
                                              ></AutoFitImage>
                                            </div>
                                          </td>
                                          <td>
                                            <div className="flex flex-col">
                                              <div className="flex flex-row gap-2">
                                                <Typography className="lg">{item.name}</Typography>
                                                <Typography className="lg">#{item.tokenId}</Typography>
                                              </div>
                                              <Typography className="base">{item.collection?.name}</Typography>
                                            </div>
                                          </td>
                                        </tr>
                                      </>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center w-full py-4 border-b">
                          <Typography>{i18n._(t`Too close to win.`)}</Typography>
                          <Typography>{i18n._(t`Go and try again!`)}</Typography>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                          {mintTimeRender(false)}
                          {mintTimeRender2(false)}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center w-full py-4 border-b">
                      <Typography>{i18n._(t`DAIDAI is loading data from blockchain, `)}</Typography>
                      <Typography>{i18n._(t`Please click button to load again!`)}</Typography>
                    </div>
                    <div className="mt-4">
                      <button
                        className={classNames('w-full btn btn-primary btn-outline !rounded-lg')}
                        onClick={() => {
                          setSingal(singal + 1)
                        }}
                      >
                        {i18n._(t`LOAD DATA`)}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <TicketModal
        setCurTicket={setCurTicket}
        curTicket={curTicket}
        usedNonce={data && data.usedNonce}
        ticketData={ticketData.data && ticketData.data.data}
        show={isOpenTicketModal}
        onClose={() => {
          setIsOpenTicketModal(false)
        }}
      />
    </>
  )
}

export default Page
