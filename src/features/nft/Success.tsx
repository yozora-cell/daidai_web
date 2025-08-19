import { TransactionReceipt } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import { getExplorerLink } from 'app/functions'
import { isAddress, shortenAddress } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { NFTDetail, NFTItemStage } from 'app/types/daidai'
import React from 'react'

const Success = ({
  data,
  changeStage,
  curStage,
  tx,
  close,
}: {
  data?: NFTDetail
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  tx: TransactionReceipt | undefined
  close: () => void
}) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  return tx && tx.blockHash ? (
    <>
      <div className="flex flex-col">
        <div className="">
          <Typography variant="base">{i18n._(t`You can check this transaction by clicking this link!`)}</Typography>
        </div>
        <div className="mt-4">
          <ExternalLink
            href={getExplorerLink(chainId, tx.transactionHash, 'transaction')}
            className="flex items-center gap-2"
          >
            <Typography variant="xs" weight={700} className="flex items-center hover:underline py-0.5 truncate">
              {isAddress(tx.transactionHash) ? shortenAddress(tx.transactionHash) : tx.transactionHash}
            </Typography>
          </ExternalLink>
        </div>
        <div className="mt-4">
          <Typography variant="base" className="text-info">
            {i18n._(t`If the data is not updated, please refresh the page after about 10 seconds.`)}
          </Typography>
        </div>
        <div className="mt-4">
          <button className="w-full btn btn-primary" onClick={close}>
            {i18n._(t`Close`)}
          </button>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-col">
        <div className="mt-4">
          <button className="w-full btn btn-primary" onClick={close}>
            {i18n._(t`Close`)}
          </button>
        </div>
      </div>
    </>
  )
}

export default Success
