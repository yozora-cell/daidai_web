import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { parseBalance } from 'app/functions'
import { getReceipt } from 'app/functions/retry'
import { ApprovalTarget } from 'app/hooks/useNFT'
import useNFTMarketplace from 'app/hooks/useNFTMarketplace'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { getTokenAddress, useTokenByAddressCallback, useTokenListOnlyToken } from 'app/state/token/hooks'
import { useBalancesNoZero } from 'app/state/wallet/hooks'
// import useDebounce from 'app/hooks/useDebounce'
import { NFTDetail, NFTItemStage, Offer721, OfferItem } from 'app/types/daidai'
import { Fragment, useEffect, useMemo, useState } from 'react'

// import DatePicker from 'react-datepicker'
import ApprovalToken from './ApprovalToken'
import Info from './Info'

const OfferContent = ({
  data,
  offerData,
  changeStage,
  curStage,
  confirm,
}: {
  data: NFTDetail
  offerData?: OfferItem
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  confirm: () => void
}) => {
  const { i18n } = useLingui()
  const { createOffer, changeOffer, cancelOffer, offerSign, offerNonce721, globalNonce, increaseOfferNonce721 } =
    useNFTMarketplace()
  const [isDoing, setIsDoing] = useState(false)

  const [confirmOfferToken, setConfirmOfferToken] = useState<Currency | undefined>(undefined)
  const [confirmOfferAmount, setConfirmOfferAmount] = useState<number | undefined>(undefined)

  const [token, setToken] = useState<Currency | undefined>(undefined)
  const [oldToken, setOldToken] = useState<Currency | undefined>(undefined)
  const [amount, setAmount] = useState<number | string>(offerData && offerData.address ? offerData.price : '')
  const [oldAmount] = useState<number | string>(offerData && offerData.address ? offerData.price : '')
  const [expiration, setExpiration] = useState<Date | undefined>(
    offerData && offerData.address ? new Date(offerData.expiration * 1000) : undefined
  )
  const [oldExpiration] = useState<Date | undefined>(
    offerData && offerData.address ? new Date(offerData.expiration * 1000) : undefined
  )

  const { chainId, account, library } = useActiveWeb3React()
  const [isError, setIsError] = useState(false)
  const [isDateError, setIsDateError] = useState(false)

  const tokenList = useTokenListOnlyToken()
  const getTokenByAddress = useTokenByAddressCallback()

  useEffect(() => {
    if (data && offerData && offerData.address) {
      const tokenAddress = offerData.payToken
      const findOne = getTokenByAddress(tokenAddress)
      setToken(findOne)
      setOldToken(findOne)
    }
  }, [data, getTokenByAddress, offerData])

  const addPopup = useAddPopup()

  // approval出现死循环，需要处理
  const [approvalState, setApprovalState] = useState(NFTItemStage.NOT_APPROVED)

  // 根据用户输入的价格来转换需要用到approval amount
  const amountToApprove = useMemo<CurrencyAmount<Currency> | undefined>(() => {
    if (token && amount > 0) {
      console.log('approvalState2 amount', parseBalance(String(amount), token.decimals).toString())
      return CurrencyAmount.fromRawAmount(token, parseBalance(String(amount), token.decimals).toString())
    }
    return undefined
  }, [token, amount])

  const { balances } = useBalancesNoZero()
  // token对应的amount
  const responseBalance = useMemo(() => {
    if (!token) {
      return undefined
    }
    const findObj = balances.find(
      (balance) => balance.currency.symbol?.toLocaleLowerCase() == token.symbol?.toLocaleLowerCase()
    )
    return findObj ?? undefined
  }, [balances, token])

  const isNoEnoughError = useMemo(() => {
    console.log('amountToApprove isNoEnoughError', amountToApprove, responseBalance)
    if (responseBalance && amountToApprove) {
      console.log('amountToApprove isNoEnoughError', responseBalance && amountToApprove)
      // 如果需要授权的token数量大于现有的
      if (amountToApprove.greaterThan(responseBalance)) {
        return true
      }
    }
    // 如果都输入价格和已经选择了token都还是无法查询到价格的话，那就是用户没有对应的token
    if (amount > 0 && token && responseBalance === undefined) {
      console.log('amountToApprove isNoEnoughError', amount, token, responseBalance)
      return true
    }
    return false
  }, [amount, amountToApprove, responseBalance, token])

  console.log('approvalState2', approvalState, amountToApprove)

  const createOfferHandle = async () => {
    // console.log('createOfferHandle', isCreate, token, amount)
    // confirm 验证
    if (token && amount > 0) {
      setIsError(false)
    } else {
      setIsError(true)
    }
    if (expiration && expiration.getTime() > new Date().getTime()) {
      setIsDateError(false)
    } else {
      setIsDateError(true)
    }
    if (
      token &&
      expiration &&
      account &&
      data.contract &&
      amount > 0 &&
      expiration &&
      expiration.getTime() > new Date().getTime() &&
      responseBalance &&
      amountToApprove &&
      !amountToApprove.greaterThan(responseBalance)
    ) {
      setIsDoing(true)
      setConfirmOfferToken(token)
      setConfirmOfferAmount(Number(amount))
      const offerNonce721Val = await offerNonce721(account, data.contract, Number(data.tokenId))
      const globalNonceVal = await globalNonce(account)
      if (globalNonceVal !== '-1' && offerNonce721Val !== '-1') {
        // 先签名，拿到数据
        const offer: Offer721 = {
          price: Number(amount),
          buyToken: getTokenAddress(token),
          buyer: account,
          collection: data.contract,
          tokenId: Number(data.tokenId),
          globalNonce: globalNonceVal,
          offerNonce: offerNonce721Val,
          expiration: Number.parseInt(String(expiration.getTime() / 1000)),
        }
        const signature = await offerSign(offer).catch(() => {
          setIsDoing(false)
        })
        if (signature) {
          console.log('signature', signature)
          // console.log('todo')
          await createOffer({
            offer: offer,
            signature: signature,
          })
            .then(() => {
              changeStage(NFTItemStage.SUCCESS)
              confirm()
            })
            .catch((error) => {
              console.error('create Offer error', error)
              // changeStage(NFTItemStage.APPROVED)
              const message = error.message
              addPopup({
                alert: {
                  message: `${message}`,
                  success: false,
                },
              })
            })
            .finally(() => {
              setIsDoing(false)
            })
        } else {
          console.error('signature error', signature)
        }
      } else {
        console.error('nonce error', globalNonceVal, offerNonce721Val)
      }
    }
  }

  const changeOfferHandleInner = async () => {
    if (account && data.contract && token && expiration) {
      const offerNonce721Val = await offerNonce721(account, data.contract, Number(data.tokenId))
      const globalNonceVal = await globalNonce(account)
      if (globalNonceVal !== '-1' && offerNonce721Val !== '-1') {
        // 先签名，拿到数据
        const offer: Offer721 = {
          price: Number(amount),
          buyToken: getTokenAddress(token),
          buyer: account,
          collection: data.contract,
          tokenId: Number(data.tokenId),
          globalNonce: globalNonceVal,
          offerNonce: offerNonce721Val,
          expiration: Number.parseInt(String(expiration.getTime() / 1000)),
        }
        const signature = await offerSign(offer).catch(() => {
          setIsDoing(false)
        })
        if (signature) {
          console.log('signature', signature)
          // console.log('todo')
          await changeOffer({
            offer: offer,
            signature: signature,
          })
            .then(() => {
              changeStage(NFTItemStage.SUCCESS)
              confirm()
            })
            .catch((error) => {
              console.error('change Offer error', error)
              // changeStage(NFTItemStage.APPROVED)
              const message = error.message
              addPopup({
                alert: {
                  message: `${message}`,
                  success: false,
                },
              })
            })
            .finally(() => {
              setIsDoing(false)
            })
        } else {
          console.error('signature error', signature)
        }
      } else {
        console.error('nonce error', globalNonceVal, offerNonce721Val)
      }
    }
  }

  const increaseOfferNonce721Handle = async (
    contract: string,
    tokenId: number,
    success: () => void,
    failure: () => void
  ) => {
    if (!chainId) {
      return
    }
    await increaseOfferNonce721(contract, tokenId)
      .then((tx: any) => {
        console.log('increaseOfferNonce721', tx)
        const txHash = tx.transactionHash
        console.log('txHash', txHash)
        const { promise } = getReceipt(txHash, library, chainId)
        promise
          .then((receipt) => {
            console.log('receipt', receipt)
            // success
            if (receipt && receipt.status === 1) {
              success()
            }
          })
          .catch((error: any) => {
            failure()
            setIsDoing(false)
            addPopup({
              alert: {
                message: error.data.message,
                success: false,
              },
            })
          })
      })
      .catch((error) => {
        failure()
        setIsDoing(false)
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
  }

  const changeOfferHandle = async () => {
    // confirm 验证
    if (token && amount > 0) {
      setIsError(false)
    } else {
      setIsError(true)
    }
    if (expiration && expiration.getTime() > new Date().getTime()) {
      setIsDateError(false)
    } else {
      setIsDateError(true)
    }
    console.log(
      'changeOfferHandle param',
      Number(amount),
      Number(oldAmount),
      // getTokenAddress(token?),
      // oldToken?.address,
      expiration?.getTime(),
      oldExpiration?.getTime()
    )
    // 如果东西都没有修改的话就不提交
    if (
      Number(amount) === Number(oldAmount) &&
      (token === oldToken || (token && oldToken && getTokenAddress(token) === getTokenAddress(oldToken))) &&
      expiration?.getTime() === oldExpiration?.getTime()
    ) {
      addPopup({
        alert: {
          message: i18n._(t`Please update price or expiration time`),
          success: false,
        },
      })
      return
    }
    if (
      oldToken &&
      token &&
      oldExpiration &&
      expiration &&
      account &&
      data.contract &&
      chainId &&
      amount > 0 &&
      expiration &&
      expiration.getTime() > new Date().getTime() &&
      responseBalance &&
      amountToApprove &&
      !amountToApprove.greaterThan(responseBalance)
    ) {
      // 不需要increaseOfferNonce721的条件
      // 买单价格提高，不变币种
      // 设定更长的过期时间
      setIsDoing(true)
      setConfirmOfferToken(token)
      setConfirmOfferAmount(Number(amount))
      if (
        (Number(amount) > Number(oldAmount) &&
          getTokenAddress(token) === getTokenAddress(oldToken) &&
          expiration.getTime() === oldExpiration.getTime()) ||
        (Number(amount) === Number(oldAmount) &&
          getTokenAddress(token) === getTokenAddress(oldToken) &&
          expiration.getTime() > oldExpiration.getTime())
      ) {
        changeOfferHandleInner()
      } else {
        increaseOfferNonce721Handle(
          data.contract,
          Number(data.tokenId),
          () => {
            changeOfferHandleInner()
          },
          () => {}
        )
      }
    }
  }

  const cancelOfferHandle = async () => {
    // 继续
    setIsDoing(true)
    if (data.contract) {
      // 需要更新一下nonce
      increaseOfferNonce721Handle(
        data.contract,
        Number(data.tokenId),
        async () => {
          if (!data.contract) {
            return
          }
          await cancelOffer({
            collection: data.contract,
            tokenId: Number(data.tokenId),
            expiration: oldExpiration ? Number.parseInt(String(oldExpiration.getTime() / 1000)) : 0,
          })
            .then(() => {
              changeStage(NFTItemStage.SUCCESS)
              confirm()
            })
            .catch((error) => {
              console.error('cancel Offer error', error)
              // changeStage(NFTItemStage.APPROVED)
              const message = error.message
              addPopup({
                alert: {
                  message: `${message}`,
                  success: false,
                },
              })
            })
            .finally(() => {
              setIsDoing(false)
            })
        },
        () => {}
      )
    }
  }

  const renderButton = (isCreate: boolean) => {
    // 为了防止用户选择了授权过的token，然后再选未授权过的token的时候的bug，每次选择了新的token都要重置一下approvalState
    // 修改了amount的时候也需要重置approvalState
    if (approvalState === NFTItemStage.APPROVED) {
      if (isCreate) {
        return (
          <>
            <button
              className="btn btn-primary !w-full"
              onClick={() => {
                createOfferHandle()
              }}
            >
              {i18n._(t`Make Offer`)}
            </button>
          </>
        )
      } else {
        return (
          <>
            <button
              className="btn btn-primary !w-full"
              onClick={() => {
                changeOfferHandle()
              }}
            >
              {i18n._(t`Change Offer`)}
            </button>
          </>
        )
      }
    } else {
      if (token && amount > 0 && isNoEnoughError === false) {
        return (
          <>
            <ApprovalToken
              tokenAddress={getTokenAddress(token)}
              curStage={NFTItemStage.NOT_APPROVED}
              changeStage={(stage) => {
                console.log('setApprovalState changeStage', stage)
                setApprovalState(stage)
              }}
              approvalTarget={ApprovalTarget.NFT_MARKETPLACE}
              amount={amountToApprove}
            ></ApprovalToken>
          </>
        )
      } else {
        return (
          <>
            <button className="btn btn-primary !w-full" disabled>
              {isCreate ? i18n._(t`Make Offer`) : i18n._(t`Change Offer`)}
            </button>
          </>
        )
      }
    }
    return <></>
  }

  return (
    <div className="w-full">
      <div className="pb-4">
        <Typography variant="base" weight={700}>
          {i18n._(t`NFT Base Information`)}
        </Typography>
      </div>
      <Info
        data={data}
        isOfferPrice={true}
        offerData={offerData}
        confirmOfferAmount={confirmOfferAmount}
        confirmOfferToken={confirmOfferToken}
      ></Info>
      <div className="w-full mt-8">
        {isDoing ? (
          <>
            <button className="btn btn-primary loading !w-full" disabled>
              {i18n._(t`Pending`)}
            </button>
          </>
        ) : (
          <>
            <div className="pt-4 mt-4 border-t">
              <div>
                <Typography variant="base" weight={700}>
                  {i18n._(t`Setting Price`)}
                </Typography>
              </div>
              <div className="flex flex-col items-center gap-4 pt-4 pb-4 sm:flex-row">
                <input
                  type="number"
                  defaultValue={amount > 0 ? amount : ''}
                  placeholder={i18n._(t`please input amount`)}
                  className="w-full input input-bordered sm:w-auto"
                  onChange={(event) => {
                    const input = event.target.value
                    // console.log('ask order input', input)
                    setAmount(Number(input))
                    console.log('setApprovalState changeStage input amount', input)
                    setApprovalState(NFTItemStage.NOT_APPROVED)
                  }}
                />
                <Listbox
                  value={token}
                  onChange={(value) => {
                    setToken(value)
                    console.log('setApprovalState changeStage Listbox', value)
                    setApprovalState(NFTItemStage.NOT_APPROVED)
                  }}
                >
                  <div className="relative w-full">
                    <Listbox.Button>
                      <div className="flex flex-row items-center gap-4">
                        {token ? <CurrencyLogo currency={token} size={24}></CurrencyLogo> : <></>}
                        <Typography variant="base" weight={700}>
                          {token ? token.symbol : i18n._(t`Select a Token`)}
                        </Typography>
                        <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 w-full overflow-auto shadow bg-base-100 max-h-56">
                        {tokenList.map((curToken) => (
                          <Listbox.Option key={getTokenAddress(curToken)} value={curToken} disabled={false}>
                            {({ selected }) => (
                              <>
                                <div className="flex flex-row items-center justify-between p-4 cursor-pointer">
                                  <CurrencyLogo currency={curToken} size={24}></CurrencyLogo>
                                  {selected ? (
                                    <Typography variant="base" weight={700}>
                                      {curToken.symbol}
                                    </Typography>
                                  ) : (
                                    <Typography variant="base">{curToken.symbol}</Typography>
                                  )}
                                </div>
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <div>
                {isError && (
                  <Typography variant="sm" className="text-error">
                    {i18n._(t`please input amount over zero and select a token`)}
                  </Typography>
                )}
                {isNoEnoughError && (
                  <Typography variant="sm" className="text-error">
                    {i18n._(t`insufficient funds`)}
                  </Typography>
                )}
              </div>
            </div>
            <div className="pt-4 mt-4 border-t">
              <div>
                <Typography variant="base" weight={700}>
                  {i18n._(t`Setting Expiration time`)}
                </Typography>
              </div>
              <div className="mt-4">
                {/* <DatePicker
                  selected={expiration}
                  onChange={(date: Date) => {
                    setExpiration(date)
                  }}
                  className="w-full"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeSelect
                  includeDateIntervals={[
                    {
                      start: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                      end: new Date(new Date().getTime() + 31 * 24 * 60 * 60 * 1000),
                    },
                  ]}
                  filterTime={(time) => {
                    const currentDate = new Date()
                    const selectedDate = new Date(time)

                    return currentDate.getTime() < selectedDate.getTime()
                  }}
                /> */}
              </div>
              <div>
                {isDateError && (
                  <Typography variant="sm" className="text-error">
                    {i18n._(t`Please set an expiration time beyond the present time`)}
                  </Typography>
                )}
              </div>
            </div>
            <div className="mt-4">
              {offerData && offerData.address ? (
                <>
                  <div className="flex flex-col">
                    {renderButton(false)}
                    <div className="divider">
                      <Typography variant="sm" weight={700}>
                        {i18n._(t`Or`)}
                      </Typography>
                    </div>
                    <button className="btn btn-primary !w-fullF" onClick={cancelOfferHandle}>
                      {i18n._(t`Cancel Offer`)}
                    </button>
                  </div>
                </>
              ) : (
                <>{renderButton(true)}</>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OfferContent
