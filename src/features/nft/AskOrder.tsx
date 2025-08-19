import { TransactionReceipt } from '@ethersproject/providers'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { getReceipt } from 'app/functions/retry'
import useNFTMarketplace from 'app/hooks/useNFTMarketplace'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { getTokenAddress, useTokenByAddressCallback, useTokenList } from 'app/state/token/hooks'
// import useDebounce from 'app/hooks/useDebounce'
import { Listing721, NFTDetail, NFTItemStage } from 'app/types/daidai'
import { Fragment, useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'

import Info from './Info'

const AskOrder = ({
  data,
  changeStage,
  curStage,
  confirm,
}: {
  data: NFTDetail
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  confirm: (tx?: TransactionReceipt) => void
}) => {
  const { i18n } = useLingui()
  const {
    createAskOrder,
    changeAskOrder,
    cancelAskOrder,
    listingSign,
    listingNonce721,
    globalNonce,
    increaseListingNonce721,
  } = useNFTMarketplace()
  const [isDoing, setIsDoing] = useState(false)

  const listingItem = useMemo(() => {
    if (data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])
  const [token, setToken] = useState<Currency | undefined>(undefined)
  const [oldToken, setOldToken] = useState<Currency | undefined>(undefined)
  const [amount, setAmount] = useState<number | string>(
    data.SellList && data.SellList.length > 0 ? data.SellList[0].price : ''
  )
  const [oldAmount] = useState<number | string>(data.SellList && data.SellList.length > 0 ? data.SellList[0].price : '')
  const [expiration, setExpiration] = useState<Date | undefined>(
    data.SellList && data.SellList.length > 0 ? new Date(data.SellList[0].expiration * 1000) : undefined
  )
  const [oldExpiration] = useState<Date | undefined>(
    data.SellList && data.SellList.length > 0 ? new Date(data.SellList[0].expiration * 1000) : undefined
  )

  const [confirmToken, setConfirmToken] = useState<Currency | undefined>(undefined)
  const [confirmAmount, setConfirmAmount] = useState<number | undefined>(undefined)

  const { chainId, account, library } = useActiveWeb3React()
  const [isError, setIsError] = useState(false)
  const [isDateError, setIsDateError] = useState(false)
  const tokenList = useTokenList()
  const findToken = useTokenByAddressCallback()
  useEffect(() => {
    if (data && listingItem) {
      const tokenAddress = listingItem.payToken
      const findOne = findToken(tokenAddress)
      setToken(findOne)
      setOldToken(findOne)
    }
  }, [data, findToken, listingItem, tokenList])

  const addPopup = useAddPopup()

  const increaseListingNonce721Handle = async (
    contract: string,
    tokenId: number,
    success: () => void,
    failure: () => void
  ) => {
    if (!chainId) {
      return
    }
    await increaseListingNonce721(contract, tokenId)
      .then((tx: any) => {
        console.log('increaseListingNonce721', tx)
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

  const createAskOrderHandle = async () => {
    // console.log('createAskOrderHandle', isCreate, token, amount)
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
      expiration.getTime() > new Date().getTime()
    ) {
      setIsDoing(true)
      // 设定要确认的数据
      setConfirmToken(token)
      setConfirmAmount(Number(amount))
      const listingNonce721Val = await listingNonce721(account, data.contract, Number(data.tokenId))
      const globalNonceVal = await globalNonce(account)
      if (globalNonceVal !== '-1' && listingNonce721Val !== '-1') {
        // 先签名，拿到数据
        const listing: Listing721 = {
          price: Number(amount),
          sellToken: getTokenAddress(token),
          seller: account,
          collection: data.contract,
          tokenId: Number(data.tokenId),
          globalNonce: globalNonceVal,
          listingNonce: listingNonce721Val,
          expiration: Number.parseInt(String(expiration.getTime() / 1000)),
        }
        const signature = await listingSign(listing).catch(() => {
          setIsDoing(false)
        })
        if (signature) {
          console.log('signature', signature)
          // console.log('todo')
          await createAskOrder({
            listing: listing,
            signature: signature,
          })
            .then(() => {
              changeStage(NFTItemStage.SUCCESS)
              confirm()
            })
            .catch((error) => {
              console.error('create AskOrder error', error)
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
        console.error('nonce error', globalNonceVal, listingNonce721Val)
      }
    }
  }

  const changeAskOrderHandleInner = async () => {
    if (account && data.contract && token && expiration) {
      const listingNonce721Val = await listingNonce721(account, data.contract, Number(data.tokenId))
      const globalNonceVal = await globalNonce(account)
      if (globalNonceVal !== '-1' && listingNonce721Val !== '-1') {
        // 先签名，拿到数据
        const listing: Listing721 = {
          price: Number(amount),
          sellToken: getTokenAddress(token),
          seller: account,
          collection: data.contract,
          tokenId: Number(data.tokenId),
          globalNonce: globalNonceVal,
          listingNonce: listingNonce721Val,
          expiration: Number.parseInt(String(expiration.getTime() / 1000)),
        }
        const signature = await listingSign(listing).catch(() => {
          setIsDoing(false)
        })
        if (signature) {
          console.log('signature', signature)
          // console.log('todo')
          await changeAskOrder({
            listing: listing,
            signature: signature,
          })
            .then(() => {
              changeStage(NFTItemStage.SUCCESS)
              confirm()
            })
            .catch((error) => {
              console.error('change AskOrder error', error)
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
        console.error('nonce error', globalNonceVal, listingNonce721Val)
      }
    }
  }

  const changeAskOrderHandle = async () => {
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
      'changeAskOrderHandle param',
      Number(amount),
      Number(oldAmount),
      // token?.address,
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
      expiration.getTime() > new Date().getTime()
    ) {
      // 设定要确认的数据
      setConfirmToken(token)
      setConfirmAmount(Number(amount))
      // 不需要increaseListingNonce721的条件
      // 价格从高改到低和过期时间变长，其余不变
      setIsDoing(true)
      if (
        (Number(amount) < Number(oldAmount) &&
          getTokenAddress(token) === getTokenAddress(oldToken) &&
          expiration.getTime() === oldExpiration.getTime()) ||
        (Number(amount) === Number(oldAmount) &&
          getTokenAddress(token) === getTokenAddress(oldToken) &&
          expiration.getTime() > oldExpiration.getTime())
      ) {
        changeAskOrderHandleInner()
      } else {
        increaseListingNonce721Handle(
          data.contract,
          Number(data.tokenId),
          () => {
            changeAskOrderHandleInner()
          },
          () => {}
        )
      }
    }
  }

  const cancelAskOrderHandle = async () => {
    // 继续
    setIsDoing(true)
    if (data.contract) {
      increaseListingNonce721Handle(
        data.contract,
        Number(data.tokenId),
        async () => {
          await cancelAskOrder({
            collection: String(data.contract),
            tokenId: Number(data.tokenId),
            expiration: oldExpiration ? Number.parseInt(String(oldExpiration.getTime() / 1000)) : 0,
          })
            .then(() => {
              changeStage(NFTItemStage.SUCCESS)
              confirm()
            })
            .catch((error) => {
              console.error('cancel AskOrder error', error)
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

  return (
    <div className="w-full">
      <div className="pb-4">
        <Typography variant="base" weight={700}>
          {i18n._(t`NFT Base Information`)}
        </Typography>
      </div>
      <Info data={data} confirmAmount={confirmAmount} confirmToken={confirmToken}></Info>
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
                  }}
                />
                <Listbox
                  value={token}
                  onChange={(value) => {
                    setToken(value)
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
                {isError ? (
                  <Typography variant="sm" className="text-error">
                    {i18n._(t`please input amount over zero and select a token`)}
                  </Typography>
                ) : (
                  <Typography variant="sm">{i18n._(t`Please input price for ${data.name}`)}</Typography>
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
                <DatePicker
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
                />
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
              {listingItem ? (
                <>
                  <div className="flex flex-col">
                    <button
                      className="btn btn-primary !w-full"
                      onClick={() => {
                        changeAskOrderHandle()
                      }}
                    >
                      {i18n._(t`Modify`)}
                    </button>
                    <div className="divider">
                      <Typography variant="sm" weight={700}>
                        {i18n._(t`Or`)}
                      </Typography>
                    </div>
                    <button className="btn btn-primary !w-fullF" onClick={cancelAskOrderHandle}>
                      {i18n._(t`Take down`)}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary !w-full"
                    onClick={() => {
                      createAskOrderHandle()
                    }}
                  >
                    {i18n._(t`To List`)}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AskOrder
