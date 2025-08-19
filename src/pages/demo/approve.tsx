// import { ArrowDownIcon } from '@heroicons/react/solid'
// import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount, Token } from '@sushiswap/core-sdk'
// import { fetchAPI } from '../../lib/api'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { currencyFormatter, maxAmountSpend } from 'app/functions'
// import { classNames, formatNumber, maxAmountSpend, tryParseAmount, warningSeverity } from 'app/functions'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { useUSDCPriceWithLoadingIndicator } from 'app/hooks/useUSDCPrice'
import { useUSDCValueWithLoadingIndicator } from 'app/hooks/useUSDCPrice'
// import { Feature } from 'app/enums/Feature'
// import NetworkGuard from 'app/guards/Network'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
import { useBalancesNoZero } from 'app/state/wallet/hooks'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

export const PriceCell = ({
  amount,
  balancesLoading,
}: {
  amount: CurrencyAmount<Currency>
  balancesLoading?: boolean
}) => {
  // usdc的这里还用不了，可能和api有关
  const { price, loading } = useUSDCPriceWithLoadingIndicator(balancesLoading ? undefined : amount.currency)
  console.log('price cell price', price)
  if (loading || balancesLoading) {
    return (
      <div className="flex gap-2.5 items-center w-full h-10">
        <div className="rounded-full bg-dark-800 w-9 h-9 animate-pulse" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 bg-dark-700 rounded animate-pulse w-[50px]" />
          <div className="h-2 bg-dark-800 rounded animate-pulse w-[50px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2.5 items-center h-10">
      <CurrencyLogo currency={amount.currency} className="!rounded-full" size={36} />
      <div className="flex flex-col">
        <Typography weight={700} className="text-left text-info">
          {amount.currency.symbol}
        </Typography>
        {price && (
          <Typography weight={400} variant="sm" className="text-left text-low-emphesis">
            {currencyFormatter.format(Number(price?.toFixed()))}
          </Typography>
        )}
      </div>
    </div>
  )
}

export const ValueCell = ({
  amount,
  balancesLoading,
}: {
  amount: CurrencyAmount<Currency>
  balancesLoading?: boolean
}) => {
  const { value, loading } = useUSDCValueWithLoadingIndicator(balancesLoading ? undefined : amount)
  console.log('value cell price', value)
  if (loading || balancesLoading) {
    return (
      <div className="flex gap-2.5 items-center justify-end w-full">
        <div className="flex flex-col gap-1.5">
          <div className="h-4 bg-dark-700 rounded animate-pulse w-[50px]" />
          <div className="h-2 bg-dark-800 rounded animate-pulse w-[50px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Typography weight={700} className="w-full text-right text-info">
        {value ? `${currencyFormatter.format(Number(value.toExact()))}` : '-'}
      </Typography>
      <Typography weight={400} variant="sm" className="text-right text-low-emphesis">
        {maxAmountSpend(amount)?.toExact()}
      </Typography>
    </div>
  )
}
// bsc的sushi的swap合约地址 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506
const spender = '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'
const Cell = ({ amount, balancesLoading }: { amount: CurrencyAmount<Token | Currency>; balancesLoading?: boolean }) => {
  // 4. 进行approve
  // 5. 对approve进行状态处理
  // check whether the user has approved the router on the input token
  const [amountToApprove, setAmountToApprove] = useState<CurrencyAmount<Currency> | undefined>(undefined)
  const [approvalState, approveCallback] = useApproveCallback(amountToApprove, spender)
  const handleApprove = useCallback(async () => {
    await approveCallback()
    // if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
    //   try {
    //     await gatherPermitSignature()
    //   } catch (error) {
    //     // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
    //     if (error?.code !== USER_REJECTED_TRANSACTION) {
    //       await approveCallback()
    //     }
    //   }
    // } else {
    //   await approveCallback()
    // }
  }, [approveCallback])
  console.log('approvalState', approvalState)
  useEffect(() => {
    if (!balancesLoading) {
      setAmountToApprove(maxAmountSpend(amount))
    }
  }, [amount, balancesLoading])
  if (balancesLoading) {
    return <></>
  }
  return (
    <div
      className="flex flex-row items-center w-full p-4 border cursor-pointer"
      onClick={() => {
        if (approvalState == ApprovalState.NOT_APPROVED) {
          handleApprove()
        }
      }}
    >
      <CurrencyLogo currency={amount.currency} className="!rounded-full" size={36} />
      <Typography weight={700} variant="sm" className="ml-4 text-base-content">
        {amount.currency.symbol}
      </Typography>
      <Typography weight={400} variant="sm" className="ml-4 text-base-content">
        {amount.toSignificant(6)}
      </Typography>
      <Typography weight={400} variant="sm" className="ml-4 text-base-content">
        {maxAmountSpend(amount)?.toExact()}
      </Typography>
      <Typography weight={400} variant="sm" className="ml-4 text-base-content">
        {approvalState == ApprovalState.UNKNOWN ? 'UNKNOWN' : ''}
        {approvalState == ApprovalState.APPROVED ? 'APPROVED' : ''}
        {approvalState == ApprovalState.NOT_APPROVED ? 'NOT_APPROVED' : ''}
        {approvalState == ApprovalState.PENDING ? 'PENDING' : ''}
      </Typography>
    </div>
  )
}

const Home = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  // 1. 获取当前用户的account，和选择一个currency
  // 2. 获取对应的currency的数量
  // 3. 获取当前currency最多可以用到的amount
  const { chainId } = useActiveWeb3React()
  const { balances, loading } = useBalancesNoZero()

  return (
    <>
      <NextSeo title="Demo" />
      <div className="container mx-auto">
        {account ? (
          <>
            <h1>Click Currency to Approve</h1>
            {balances?.map((item, i) => (
              <div key={i}>
                <Cell amount={item} balancesLoading={loading}></Cell>
              </div>
            ))}
          </>
        ) : (
          <>
            <Typography variant="base" className="py-2 text-center">
              Please click connect wallet to continue
            </Typography>

            <Button fullWidth color="primary" onClick={toggleWalletModal} className="rounded-2xl md:rounded">
              connect wallet
            </Button>
          </>
        )}
      </div>
    </>
  )
}
// Home.Guard = NetworkGuard(Feature.HOME)
export default Home
