import { AddressZero } from '@ethersproject/constants'
import { TransactionReceipt } from '@ethersproject/providers'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { classNames, isAddress, shortenAddress } from 'app/functions'
import { parseBalance } from 'app/functions'
import useMultiTransfer from 'app/hooks/useMultiTransfer'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
// import useDebounce from 'app/hooks/useDebounce'
import { NFTItemStage } from 'app/types/daidai'
import { useCallback, useMemo, useState } from 'react'

import { Assets } from '../portfolio/AssetBalances/types'

export interface UserAssetsInput {
  assets: Assets | undefined
  useradd: string
  amount: string
  isDelete: boolean
}

const MulTransferTokens = ({
  balances,
  changeStage,
  curStage,
  confirm,
}: {
  balances?: Assets[]
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  confirm: (tx: TransactionReceipt) => void
}) => {
  const addPopup = useAddPopup()
  const { account } = useActiveWeb3React()

  const { i18n } = useLingui()
  const [isTransfer, setIsTransfer] = useState(false)

  const getDefaultListItem = (): UserAssetsInput => {
    return {
      assets: undefined,
      useradd: '',
      amount: '',
      isDelete: false,
    }
  }

  const getDefaultList = () => {
    const defaultList: UserAssetsInput[] = []
    defaultList.push(getDefaultListItem())
    return defaultList
  }

  const [list, setList] = useState<UserAssetsInput[]>(getDefaultList)

  const addListItem = () => {
    const copyList = [...list]
    copyList.push(getDefaultListItem())
    setList(copyList)
  }

  const updateListItem = (index: number, item: UserAssetsInput) => {
    const copyList = [...list]
    copyList[index] = item
    setList(copyList)
  }

  const updateListItemAmount = (index: number, amount: string) => {
    const copyList = [...list]
    const curItem = copyList[index]
    const newItem = {
      assets: curItem.assets,
      useradd: curItem.useradd,
      amount: amount,
      isDelete: curItem.isDelete,
    }
    updateListItem(index, newItem)
  }

  const updateListItemUseradd = (index: number, useradd: string) => {
    const copyList = [...list]
    const curItem = copyList[index]
    const newItem = {
      assets: curItem.assets,
      useradd: useradd,
      amount: curItem.amount,
      isDelete: curItem.isDelete,
    }
    updateListItem(index, newItem)
  }

  const updateListItemAssets = (index: number, assets: Assets | undefined) => {
    const copyList = [...list]
    const curItem = copyList[index]
    const newItem = {
      assets: assets,
      useradd: curItem.useradd,
      amount: curItem.amount,
      isDelete: curItem.isDelete,
    }
    updateListItem(index, newItem)
  }

  const updateListItemIsDelete = (index: number, isDelete: boolean) => {
    const copyList = [...list]
    const curItem = copyList[index]
    const newItem = {
      assets: curItem.assets,
      useradd: curItem.useradd,
      amount: curItem.amount,
      isDelete: isDelete,
    }
    updateListItem(index, newItem)
  }

  const useradds = useMemo(() => {
    return list.map((item) => {
      return item.useradd
    })
  }, [list])

  const amounts = useMemo(() => {
    return list.map((item) => {
      return item.amount
    })
  }, [list])

  const tokenadds = useMemo(() => {
    return list.map((item) => {
      const balance = item.assets
      if (balance) {
        return balance.asset.currency.isNative ? AddressZero : balance.asset.currency.wrapped.address
      } else {
        return ''
      }
    })
  }, [list])

  const useraddsOks = useMemo(() => {
    let result: boolean[] = []
    if (useradds && useradds.length > 0) {
      result = useradds.map((address, index) => {
        if (list[index].isDelete) {
          return true
        }
        const isValidate = isAddress(address) ? true : false
        return isValidate && address.toLocaleLowerCase() != account?.toLocaleLowerCase()
      })
    }
    return result
  }, [account, list, useradds])

  const getBalanceIndex = useCallback(
    (assets: Assets | undefined) => {
      if (assets == undefined) {
        return -1
      }
      if (balances && balances.length > 0) {
        return balances.findIndex((balance) => {
          return balance.asset.currency.symbol == assets.asset.currency.symbol
        })
      }
      return -1
    },
    [balances]
  )

  // 这里用户有可能选多种币种
  const amountOks = useMemo(() => {
    let result: boolean[] = []
    if (list && list.length > 0 && amounts && amounts.length > 0 && balances && balances.length > 0) {
      // 记录当前每个token可用的balance，这里暂时不考虑gas费用
      const balancesRecords = balances.map((balance) => {
        // 这里暂时用Number来处理，没有用到BigNumber
        return Number(balance.asset.toSignificant(balance.asset.currency.decimals))
      })

      result = amounts.map((amount, index) => {
        if (list[index].isDelete) {
          return true
        }
        // 这里暂时用Number来处理，没有用到BigNumber
        const num = Number(amount)
        const isNumber = !Number.isNaN(num)
        if (!isNumber) {
          return false
        }
        const isOverZero = num > 0
        if (!isOverZero) {
          return false
        }
        const curAssets = list[index].assets ?? undefined
        if (curAssets) {
          // 计算当前剩余的balance
          const index = getBalanceIndex(curAssets)
          const avaliableBalance = balancesRecords[index]
          if (avaliableBalance >= num) {
            // 更新balancesRecords
            balancesRecords[index] = avaliableBalance - num
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
    }
    return result
  }, [list, amounts, balances, getBalanceIndex])

  const isOk = useMemo(() => {
    let result = true
    if (useraddsOks && useraddsOks.length > 0) {
      useraddsOks.map((value) => {
        if (value == false) {
          result = false
        }
      })
    } else {
      result = false
    }
    if (amountOks && amountOks.length > 0) {
      amountOks.map((value) => {
        if (value == false) {
          result = false
        }
      })
    } else {
      result = false
    }
    // 检测所有元素是否都是被删除了
    let isAllDelete = true
    list.forEach((item) => {
      if (item.isDelete == false) {
        isAllDelete = false
      }
    })
    if (isAllDelete) {
      result = false
    }
    return result
  }, [amountOks, list, useraddsOks])

  const { airdropTokens } = useMultiTransfer()

  const handleAirdropTokens = async () => {
    setIsTransfer(true)
    if (!(balances && balances.length > 0)) {
      return
    }
    // console.log('handleAirdropTokens', useradds, tokenadds, weis)
    const useradds_ = useradds.filter((item, index) => {
      return list[index].isDelete == false
    })
    const tokenadds_ = tokenadds.filter((item, index) => {
      return list[index].isDelete == false
    })
    const amounts_ = amounts.filter((item, index) => {
      return list[index].isDelete == false
    })
    // amounts eth => wei
    const weis = amounts_.map((amount, index) => {
      const wei = parseBalance(String(amount), list[index].assets?.asset.currency.decimals)
      return wei.toString()
    })
    await airdropTokens({
      useradds: useradds_,
      tokenadds: tokenadds_,
      amounts: weis,
    })
      .then((tx: TransactionReceipt | undefined) => {
        if (tx) {
          changeStage(NFTItemStage.SUCCESS)
          confirm(tx)
        }
      })
      .catch((error) => {
        console.error('airdropTokens error', error)
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
        setIsTransfer(false)
      })
  }

  const currencyRender = (assets: Assets) => {
    return (
      <>
        <div className="flex flex-row items-center gap-4">
          <CurrencyLogo currency={assets.asset.currency} className="!rounded-full" size={48} />
          <Typography weight={400} variant="sm" className="inline-flex text-base-content">
            {assets.asset.currency.symbol}
          </Typography>
        </div>
      </>
    )
  }

  const [isConfirm, setIsConfirm] = useState(false)

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="table w-full mx-auto">
          <thead className="border-b">
            <tr>
              <th className="bg-base-100">{i18n._(t`Asset`)}</th>
              <th className="text-right bg-base-100">{i18n._(t`Balances`)}</th>
              <th className="text-center bg-base-100">{i18n._(t`Amount`)}</th>
              <th className="w-64 bg-base-100">{i18n._(t`Airdrop Address`)}</th>
              {!isConfirm ? (
                <>
                  <th className="bg-base-100">{i18n._(t`Delete`)}</th>
                </>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          {balances && balances.length > 0 && list && list.length > 0 ? (
            <>
              <tbody>
                {list.map((item, i) => (
                  <>
                    {item.isDelete == false ? (
                      <>
                        <tr key={i}>
                          <th className="flex flex-row items-center">
                            {isConfirm && item.assets ? (
                              <>{currencyRender(item.assets)}</>
                            ) : (
                              <>
                                <select
                                  value={getBalanceIndex(item.assets)}
                                  className="w-32 select"
                                  onChange={(event) => {
                                    const index = Number(event.target.value)
                                    const balance = balances[index]
                                    updateListItemAssets(i, balance)
                                  }}
                                >
                                  <option disabled selected value={-1}>
                                    {i18n._(t`Token`)}
                                  </option>
                                  {balances.map((balance, index) => {
                                    return <>{<option value={index}>{balance.asset.currency.symbol}</option>}</>
                                  })}
                                </select>
                              </>
                            )}
                          </th>
                          <td className="text-right">
                            {' '}
                            <Typography weight={400} variant="sm" className="text-base-content">
                              {item.assets ? item.assets.asset.toSignificant(6) : '-'}
                            </Typography>
                          </td>
                          <td className="text-center">
                            {isTransfer || isConfirm ? (
                              <>{amounts[i]}</>
                            ) : (
                              <>
                                <div className="flex flex-row items-center gap-2">
                                  <input
                                    value={amounts[i]}
                                    placeholder={i18n._(t`${item.assets ? item.assets.asset.currency.symbol : ''}`)}
                                    className={classNames(
                                      'input input-bordered w-24',
                                      amountOks[i] ? 'input-success' : '',
                                      amounts[i] && amountOks[i] == false ? 'input-error' : ''
                                    )}
                                    onChange={(event) => {
                                      const input = event.target.value
                                      // console.log('transfer input', input)
                                      updateListItemAmount(i, input)
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </td>
                          <td>
                            {isTransfer || isConfirm ? (
                              <>{shortenAddress(useradds[i])}</>
                            ) : (
                              <>
                                <div className="flex flex-row items-center gap-2">
                                  <input
                                    value={useradds[i]}
                                    placeholder={i18n._(t`airdrop address`)}
                                    className={classNames(
                                      'w-64 input input-bordered',
                                      useraddsOks[i] ? 'input-success' : '',
                                      useradds[i] && useraddsOks[i] == false ? 'input-error' : ''
                                    )}
                                    onChange={(event) => {
                                      let input = event.target.value
                                      // console.log('transfer input', input)
                                      input = input.replace(' ', '')
                                      updateListItemUseradd(i, input)
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </td>
                          {!isConfirm ? (
                            <>
                              <td>
                                <MinusCircleIcon
                                  className="w-5 h-5 cursor-pointer text-primary"
                                  onClick={() => {
                                    updateListItemIsDelete(i, true)
                                  }}
                                ></MinusCircleIcon>
                              </td>
                            </>
                          ) : (
                            <></>
                          )}
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </tbody>
            </>
          ) : (
            <></>
          )}
        </table>
      </div>
      {!isConfirm ? (
        <>
          <div className="flex flex-row justify-center p-4">
            <PlusCircleIcon
              className="w-6 h-6 cursor-pointer text-primary"
              onClick={() => {
                addListItem()
              }}
            ></PlusCircleIcon>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="w-full pt-4 pb-4">
        {isOk ? (
          <>
            {isTransfer ? (
              <>
                <button className="w-full mt-4 btn btn-primary loading" disabled>
                  {i18n._(t`Pending`)}
                </button>
              </>
            ) : (
              <>
                {isConfirm ? (
                  <>
                    <div className="flex flex-col">
                      <button
                        className="w-full mt-4 btn btn-outline"
                        onClick={() => {
                          setIsConfirm(false)
                        }}
                      >
                        {i18n._(t`Edit`)}
                      </button>
                      <div className="divider">
                        <Typography variant="sm" weight={700}>
                          {i18n._(t`Or`)}
                        </Typography>
                      </div>
                      <button className="w-full mt-4 btn btn-primary" onClick={handleAirdropTokens}>
                        {i18n._(t`Airdrop`)}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full mt-4 btn btn-primary"
                      onClick={() => {
                        setIsConfirm(true)
                      }}
                    >
                      {i18n._(t`Confirm`)}
                    </button>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <button className="w-full mt-4 btn btn-primary" disabled>
            {i18n._(t`Airdrop`)}
          </button>
        )}
      </div>
    </>
  )
}

export default MulTransferTokens
