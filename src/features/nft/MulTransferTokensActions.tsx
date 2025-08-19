import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Assets } from 'app/features/portfolio/AssetBalances/types'
import { useActiveWeb3React } from 'app/services/web3'
import { NFTOperateStage } from 'app/types/daidai'
import { useState } from 'react'

import ActionsContent from './ActionsContent'
import ActionsModal from './ActionsModal'

const MulTransferTokensActions = ({
  balances,
  className,
  confirm,
}: {
  balances: Assets[]
  confirm: () => void
  className?: string
}) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [isOpen, setIsOpen] = useState(false)

  const closeHandle = () => {
    // console.log('ActionsModal close')
    setIsOpen(false)
    confirm()
  }

  const confirmHandle = () => {
    // console.log('ActionsModal confirm and close')
    setIsOpen(false)
    confirm()
  }

  return (
    <>
      <button
        className="gap-2 btn btn-primary btn-outline btn-sm"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <PaperAirplaneIcon className="w-5 rotate-90" />
        {i18n._(t`Airdrop`)}
      </button>
      <ActionsModal
        maxWidthClassName="max-w-2xl"
        isOpen={isOpen}
        close={closeHandle}
        content={
          <ActionsContent
            balances={balances}
            close={closeHandle}
            confirm={confirmHandle}
            operateType={NFTOperateStage.MULTI_TRANSFER_TOKENS}
          ></ActionsContent>
        }
      ></ActionsModal>
    </>
  )
}

export default MulTransferTokensActions
