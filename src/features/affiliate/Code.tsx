import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { updateUpReferer, useAffiliate } from 'app/services/apis'
import { affiliate } from 'app/services/apis/keys'
import { useAccount } from 'app/state/application/hooks'
import { useSWRConfig } from 'swr'

import Info from './Info'
import InviteCode from './InviteCode'

const Code = ({ code }: { code?: string }) => {
  const { i18n } = useLingui()
  const account = useAccount()
  const { mutate } = useSWRConfig()
  const { data, error } = useAffiliate(account)

  // 确认邀请码
  async function handleConfirmUpRefererId(upRefererId: string) {
    if (upRefererId.length > 0) {
      await updateUpReferer(upRefererId).then(async (res) => {
        mutate(affiliate(account))
      })
    }
  }

  return (
    <>
      <Typography variant="h2" className="mt-12" weight={700}>
        {i18n._(t`Affiliate`)}
      </Typography>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2">
        <div>
          <Info user={data} updateUpRefererId={handleConfirmUpRefererId} code={code} />
        </div>
        <div>
          <InviteCode user={data} code={code} />
        </div>
      </div>
    </>
  )
}

export default Code
