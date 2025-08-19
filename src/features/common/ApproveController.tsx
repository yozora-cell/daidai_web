import { AddressZero } from '@ethersproject/constants'
import Button, { ButtonColor, ButtonSize } from 'app/components/Button'
import { tryParseAmount } from 'app/functions'
import { useCurrency } from 'app/hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'

type ApproveControllerProps = {
  token: string
  priceInEth: string
  spender: string
  color?: ButtonColor
  size?: ButtonSize
  className?: string
  children: React.ReactComponentElement<any>
}

export default function ApproveController({
  token,
  priceInEth,
  spender,
  className,
  color = 'primary',
  size = 'md',
  children,
}: ApproveControllerProps) {
  const { account } = useActiveWeb3React()

  const currency = useCurrency(token)
  const currentAmount = currency ? tryParseAmount(priceInEth, currency) : undefined
  const [approvalState, handleApprove] = useApproveCallback(currentAmount, spender)

  // not necessary to approve if the token is AddressZero
  if (token.toLowerCase() === AddressZero.toLowerCase()) {
    return children
  }

  if (approvalState === ApprovalState.APPROVED) {
    return children
  }

  return (
    <div>
      <Button
        color={color}
        size={size}
        className={className}
        onClick={handleApprove}
        disabled={!account || approvalState === ApprovalState.UNKNOWN}
        loading={approvalState === ApprovalState.PENDING}
      >
        Approve
      </Button>
    </div>
  )
}
