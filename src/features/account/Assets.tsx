import { BanIcon, PaperAirplaneIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, NATIVE, Token, ZERO } from '@sushiswap/core-sdk'
// import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import { getCurrencyLogoUrls } from 'app/components/CurrencyLogo/CurrencyLogo'
import { LoadingSpinner } from 'app/components/LoadingSpinner'
import Typography from 'app/components/Typography'
import MulTransferTokensActions from 'app/features/nft/MulTransferTokensActions'
import { Assets } from 'app/features/portfolio/AssetBalances/types'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { initTokenApprovalStage } from 'app/state/nfts/actions'
import { useAllTokenBalancesWithLoadingIndicatorV2Account, useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const AssetsPage = ({ account }: { account: string }) => {
  const dispatch = useAppDispatch()
  const { i18n } = useLingui()

  const web3 = useActiveWeb3React()
  const chainId = web3.chainId
  const library = web3.library
  const { data: _balances, loading } = useAllTokenBalancesWithLoadingIndicatorV2Account(account)

  // @ts-ignore TYPE NEEDS FIXING
  const ethBalance = useCurrencyBalance(account ? account : undefined, chainId ? NATIVE[chainId] : undefined)

  const balances = useMemo(() => {
    const res = Object.values(_balances).reduce<Assets[]>((acc, cur) => {
      if (cur.greaterThan(ZERO)) acc.push({ asset: cur })

      return acc
    }, [])

    if (ethBalance) {
      res.push({ asset: ethBalance })
    }
    return res
  }, [_balances, ethBalance])

  const [isCheckboxMode, setIsCheckboxMode] = useState(false)

  // 用户选中的下标
  const [checkData, setCheckData] = useState<Set<number>>(new Set<number>())

  const checkIsInCheckData = useCallback(
    (index: number) => {
      return checkData.has(index)
    },
    [checkData]
  )

  const doCheckbox = (index: number) => {
    const setCopy = new Set(checkData)
    if (checkIsInCheckData(index)) {
      // delete
      setCopy.delete(index)
    } else {
      setCopy.add(index)
    }
    setCheckData(setCopy)
  }

  const clean = useCallback(() => {
    setIsCheckboxMode(false)
    setCheckData(new Set())
    dispatch(initTokenApprovalStage())
  }, [dispatch])

  useEffect(() => {
    clean()
  }, [account, clean])

  const checkboxList = useMemo(() => {
    if (balances && balances.length > 0) {
      return balances.map((item, index) => {
        // check item is checked
        return checkIsInCheckData(index)
      })
    }
    return []
  }, [checkIsInCheckData, balances])

  const transferList = useMemo(() => {
    const list: Assets[] = []
    if (balances.length != checkboxList.length) {
      return list
    }
    balances.forEach((item, index) => {
      if (checkboxList[index]) {
        list.push(item)
      }
    })
    return list
  }, [checkboxList, balances])

  const addToken = (currencyToAdd: Currency) => {
    const token: Token | undefined = currencyToAdd.wrapped
    if (library && library.provider.isMetaMask && library.provider.request && token) {
      library.provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            // @ts-ignore // need this for incorrect ethers provider type
            type: 'ERC20',
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
              image: getCurrencyLogoUrls(token),
            },
          },
        })
        .then((success) => {
          console.log('addToken', success)
        })
        .catch((error) => {
          console.log('addToken', error)
        })
    }
  }

  return (
    <div className="w-full">
      {web3.account?.toLocaleLowerCase() == account.toLocaleLowerCase() ? (
        <>
          <div className="w-full">
            {isCheckboxMode ? (
              <>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    clean()
                  }}
                >
                  {i18n._(t`Cancel`)}
                </button>
              </>
            ) : (
              <>
                <button
                  className="gap-2 btn btn-primary btn-outline btn-sm"
                  onClick={() => {
                    setIsCheckboxMode(true)
                    setCheckData(new Set())
                  }}
                >
                  <PaperAirplaneIcon className="w-5 rotate-90" />
                  {i18n._(t`Airdrop`)}
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      {loading ? (
        <>
          <div className="flex flex-row justify-center w-full p-6">
            <LoadingSpinner active={loading}></LoadingSpinner>
          </div>
        </>
      ) : (
        <>
          <div className="w-full mt-2 overflow-x-auto">
            <table className="table w-full mx-auto">
              <thead className="border-b">
                <tr>
                  {isCheckboxMode ? (
                    <>
                      <th className="w-10 bg-base-100"></th>
                    </>
                  ) : (
                    <></>
                  )}
                  <th className="bg-base-100">{i18n._(t`Asset`)}</th>
                  <th className="text-right bg-base-100">{i18n._(t`Balances`)}</th>
                </tr>
              </thead>
              <tbody className="">
                {balances.map((item, i) => (
                  <tr key={i}>
                    {isCheckboxMode ? (
                      <>
                        <th className="w-10">
                          <input
                            readOnly
                            type="checkbox"
                            checked={checkboxList[i]}
                            className="checkbox"
                            onClick={() => {
                              doCheckbox(i)
                            }}
                          />
                        </th>
                      </>
                    ) : (
                      <></>
                    )}
                    <th className="flex flex-row items-center gap-4">
                      <CurrencyLogo currency={item.asset.currency} className="!rounded-full" size={36} />
                      <Typography weight={400} variant="sm" className="inline-flex text-base-content min-w-[60px]">
                        {item.asset.currency.symbol}
                      </Typography>
                      <div className="tooltip" data-tip={i18n._(t`add token to wallet`)}>
                        <PlusCircleIcon
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => {
                            addToken(item.asset.currency)
                          }}
                        ></PlusCircleIcon>
                      </div>
                    </th>
                    <td className="text-right">
                      {' '}
                      <Typography weight={400} variant="sm" className="text-base-content">
                        {item.asset.toSignificant(6)}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {isCheckboxMode ? (
        <>
          <div className="fixed bottom-0 left-0 right-0 z-20 border-t shadow-lg bg-base-100">
            <div className="container flex flex-row justify-end p-4 mx-auto">
              <div className="flex flex-row items-center justify-end gap-4">
                {transferList && transferList.length > 0 ? (
                  <>
                    <MulTransferTokensActions
                      balances={transferList}
                      confirm={() => {
                        clean()
                      }}
                    ></MulTransferTokensActions>
                  </>
                ) : (
                  <>
                    <button className="gap-2 btn btn-primary btn-outline btn-sm btn-disabled">
                      <BanIcon className="w-5" />
                      {i18n._(t`Airdrop`)}
                    </button>
                  </>
                )}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    clean()
                  }}
                >
                  {i18n._(t`Cancel`)}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
export default AssetsPage
