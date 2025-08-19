import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CopyHelper from 'app/components/AccountDetails/Copy'
import Typography from 'app/components/Typography'
import { Affiliate } from 'app/types/daidai'
import { useEffect, useMemo, useState } from 'react'

const InviteCode = ({ user, code }: { user?: Affiliate; code?: string }) => {
  const { i18n } = useLingui()
  const [rate, setRate] = useState(0)
  const [refferrerId, setRefferrerId] = useState('')
  const href = window.location.href
  const refferrerLink = useMemo(() => {
    // 当前链接后面的Affiliate code进行替换
    if (refferrerId && code) {
      return href.replace(code, refferrerId)
    }
    if (refferrerId) {
      if (href.lastIndexOf('/') == href.length - 1) {
        return href + refferrerId
      } else {
        return href + '/' + refferrerId
      }
    }
    return ''
  }, [code, href, refferrerId])

  useEffect(() => {
    console.log('user', user)
    if (user) {
      setRate(Math.round(user.commissionRate * 100))
      setRefferrerId(user.refererId)
      // setRefferrerLink(user.referrerLink)
    }
  }, [user])
  return (
    <>
      <div className="w-full mt-8 border shadow-lg card bg-base-100">
        <div className="card-body">
          <h2 className="card-title">{i18n._(t`Invite code`)}</h2>
          <div className="flex flex-row items-center justify-between w-full">
            <Typography variant="base">{i18n._(t`Commission Rate`)}</Typography>
            <Typography variant="h3" weight={700} className="text-info">
              {rate}%
            </Typography>
          </div>
          <div className="flex flex-row items-center justify-between w-full mt-2">
            <Typography variant="base">{i18n._(t`Refferrer ID`)}</Typography>
            <CopyHelper toCopy={refferrerId} className="opacity-100 text-primary">
              {refferrerId}
            </CopyHelper>
          </div>
          <div className="flex flex-col w-full mt-2 md:items-center md:justify-between md:flex-row">
            <Typography variant="base">{i18n._(t`Refferrer Link`)}</Typography>
            <CopyHelper toCopy={refferrerLink} className="flex-row justify-between opacity-100 text-primary">
              <Typography className="w-full truncate">{refferrerLink}</Typography>
            </CopyHelper>
          </div>
        </div>
      </div>
    </>
  )
}

export default InviteCode
