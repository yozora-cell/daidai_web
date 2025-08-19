import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { useTotalNotWithdrawAmount } from 'app/services/apis'
import { withdrawApply } from 'app/services/apis/fetchers'
import { affiliateHistoryNotWithdrawAmount } from 'app/services/apis/keys'
import { useAddPopup } from 'app/state/application/hooks'
import { useAccount } from 'app/state/application/hooks'
import { useCallback, useMemo } from 'react'
import { useSWRConfig } from 'swr'

const WithdrawAmount = ({ callback }: { callback: () => void }) => {
  const addPopup = useAddPopup()
  const { i18n } = useLingui()
  const { mutate } = useSWRConfig()
  const account = useAccount()

  const { data, error } = useTotalNotWithdrawAmount(account)
  const amount = useMemo(() => {
    if (data) {
      // console.log('data', data)
      // return BigNumber.from(data).div(e10(18)).toFixed(4)
      return Number(data)
    }
  }, [data])

  const apply = useCallback(async () => {
    if (account) {
      withdrawApply().then((res) => {
        addPopup({
          alert: {
            success: true,
            message: i18n._(t`Success`),
          },
        })
        mutate(affiliateHistoryNotWithdrawAmount())
        callback()
      })
    }
  }, [account, addPopup, callback, i18n, mutate])
  return (
    <div className="flex flex-row items-center justify-start gap-4 md:justify-end">
      {amount && Number(amount) > 0 ? (
        <>
          <div className="flex flex-row items-center justify-end">
            <Typography className="text-info" weight={700} variant="lg">
              {amount}
            </Typography>
            <Typography className="text-info" variant="base">
              ETH
            </Typography>
          </div>
          <div className="flex flex-row items-end justify-end">
            <button className="btn btn-primary btn-sm btn-outline" disabled={Number(amount) === 0} onClick={apply}>
              {i18n._(t`Withdraw Now`)}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row items-end justify-end">
            <Typography className="text-primary text-opacity-40" variant="base">
              {i18n._(t`Not Withdrawn amount`)}
            </Typography>
          </div>
        </>
      )}
    </div>
  )
}

export default WithdrawAmount
