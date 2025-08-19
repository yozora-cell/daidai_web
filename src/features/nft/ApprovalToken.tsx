import { ExternalLinkIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import CopyHelper from 'app/components/AccountDetails/Copy'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import { MULTI_TRANSFER_ADDRESS, NFT_MARKETPLACE_ADDRESS } from 'app/config/address'
import { maxAmountSpend } from 'app/functions'
import { getExplorerLink, shortenAddress } from 'app/functions'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { ApprovalTarget } from 'app/hooks/useNFT'
import useNFTMarketplace from 'app/hooks/useNFTMarketplace'
import { useActiveWeb3React } from 'app/services/web3'
import { useBalances } from 'app/state/wallet/hooks'
import { NFTItemStage } from 'app/types/daidai'
import { useCallback, useEffect, useMemo } from 'react'

const ApprovalToken = ({
  tokenAddress,
  changeStage,
  curStage,
  approvalTarget,
  amount,
  isShowTip = false,
}: {
  tokenAddress: string
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  approvalTarget: ApprovalTarget
  // 如果指定了amount的话，就approval指定的价格
  amount?: CurrencyAmount<Currency> | undefined
  isShowTip?: boolean
}) => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const { getTargetToken } = useNFTMarketplace()

  const getApproveAddress = useCallback(
    (approvalTarget: ApprovalTarget) => {
      if (chainId) {
        switch (approvalTarget) {
          case ApprovalTarget.MULTI_TRANSFER:
            return MULTI_TRANSFER_ADDRESS[chainId]
          case ApprovalTarget.NFT_MARKETPLACE:
            return NFT_MARKETPLACE_ADDRESS[chainId]
        }
      }
      return ''
    },
    [chainId]
  )

  // find token
  const targetToken = useMemo(() => {
    if (account && chainId && tokenAddress) {
      return getTargetToken(tokenAddress)
    }
    return undefined
  }, [account, chainId, getTargetToken, tokenAddress])

  const { balances, loading } = useBalances()

  // token approval
  const spender = getApproveAddress(approvalTarget)
  const amountToApprove = useMemo<CurrencyAmount<Currency> | undefined>(() => {
    if (amount) {
      return amount
    }
    if (targetToken && balances && balances.length) {
      const findBalance = balances.find(
        (balance) => balance.currency.symbol?.toLocaleLowerCase() == targetToken.symbol?.toLocaleLowerCase()
      )
      if (findBalance) {
        return maxAmountSpend(findBalance)
      }
    }
  }, [amount, targetToken, balances])
  const [approvalState, approveCallback] = useApproveCallback(amountToApprove, spender)
  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])

  // 这里会一直渲染，因为用到了useWeb3Active
  useEffect(() => {
    console.log('setApprovalState changeStage ApprovalToken', approvalState)
    switch (approvalState) {
      case ApprovalState.APPROVED:
        changeStage(NFTItemStage.APPROVED)
        break
      case ApprovalState.PENDING:
        changeStage(NFTItemStage.PENDING)
        break
      case ApprovalState.UNKNOWN:
        changeStage(NFTItemStage.UNKNOWN)
        break
      case ApprovalState.NOT_APPROVED:
        changeStage(NFTItemStage.NOT_APPROVED)
        break
    }
  }, [approvalState, changeStage])
  return (
    <>
      {isShowTip ? (
        <>
          <div className="flex flex-col items-center justify-center pb-4">
            <div className="w-full text-center">
              <Typography variant="h2">
                {i18n._(t`Give permission to access your`)}
                {` `}
                {targetToken?.symbol}
                {' ?'}
              </Typography>
            </div>
            <div className="w-full mt-4 text-center">
              <Typography variant="base">
                {i18n._(t`By granting permission, you are allowing the following contract to access your funds`)}
              </Typography>
            </div>
            {spender ? (
              <>
                <div className="flex flex-row items-center justify-center w-full mt-4">
                  <div className="flex flex-row items-center justify-center px-4 py-2 w-fit">
                    <ExternalLink href={getExplorerLink(chainId, spender, 'address')} color="primary">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <Typography variant="sm">{shortenAddress(spender)}</Typography>
                        <ExternalLinkIcon className="w-4 cursor-pointer" />
                      </div>
                    </ExternalLink>
                    <CopyHelper toCopy={spender} className="ml-2 opacity-100 text-primary"></CopyHelper>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="flex flex-col items-center justify-center">
        <>
          {approvalState == ApprovalState.APPROVED ? (
            <>
              <button className="w-full btn btn-ghost text-primary" disabled={true}>
                {i18n._(t`APPROVED`)}
              </button>
            </>
          ) : (
            <></>
          )}
          {approvalState == ApprovalState.PENDING || approvalState == ApprovalState.UNKNOWN ? (
            <>
              <button className="w-full btn btn-ghost text-primary loading" disabled={true}>
                {i18n._(t`Pending`)}
              </button>
            </>
          ) : (
            <></>
          )}
          {approvalState == ApprovalState.NOT_APPROVED ? (
            <>
              <button className="w-full btn btn-primary" disabled={false} onClick={handleApprove}>
                {i18n._(t`Approve`)}
              </button>
            </>
          ) : (
            <></>
          )}
        </>
      </div>
    </>
  )
}

export default ApprovalToken
