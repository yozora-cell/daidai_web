import { ExternalLinkIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { getExplorerLink } from 'app/functions/explorer'
import { useActiveWeb3React } from 'app/services/web3'
import React from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'

import ExternalLink from '../ExternalLink'

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  return (
    <div className="flex flex-row w-full flex-nowrap z-[1000]">
      <div className="pr-4">
        {success ? <CheckCircle className="w-5 text-info" /> : <AlertCircle className="w-5 text-error" />}
      </div>
      <div className="flex flex-col gap-1">
        <Typography weight={700}>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</Typography>
        {chainId && hash && (
          <ExternalLink
            className="p-0 mt-2 text-blue hover:underline md:p-0"
            href={getExplorerLink(chainId, hash, 'transaction')}
          >
            <div className="flex flex-row items-center gap-1">
              <Typography className="text-sm">{i18n._(t`View on explorer`)}</Typography>
              <ExternalLinkIcon width={20} height={20} />
            </div>
          </ExternalLink>
        )}
      </div>
    </div>
  )
}
