import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { HeadlessUiModal } from 'app/components/Modal'
import Typography from 'app/components/Typography'
import useSignAndVerify from 'app/hooks/useSignAndVerify'
import { useAccount } from 'app/state/application/hooks'
import { useIsSigning, useSetIsSigning } from 'app/state/sign/hooks'
import { useAuthToken } from 'app/state/user/hooks'
import React, { useState } from 'react'

export const SignModal = () => {
  const { i18n } = useLingui()
  const account = useAccount()
  const authToken = useAuthToken(account)
  const isSigning = useIsSigning()
  const setIsSigning = useSetIsSigning()
  const signAndVerify = useSignAndVerify()
  const [isDoing, setIsDoing] = useState(false)

  if (!account) return <></>

  return (
    <HeadlessUiModal.Controlled isOpen={isSigning} onDismiss={() => setIsSigning(false)} maxWidth="sm">
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header header={i18n._(t`Welcom to DAIDAI!`)} onClose={() => setIsSigning(false)} />
        <div className="flex flex-row justify-center mt-2">
          <Typography className="text-center">
            {i18n._(
              t`By clicking "SIGN IN", you will allow DAIDAI to access your wallet address information and have better services!`
            )}
          </Typography>
        </div>

        <div className="flex flex-row justify-center gap-4 mt-4">
          {isDoing && (
            <>
              <button className="w-full btn btn-primary btn-outline loading" disabled>
                {i18n._(t`Pending`)}
              </button>
            </>
          )}
          {!isDoing && (
            <>
              <button
                className="w-full btn btn-primary btn-outline"
                onClick={() => {
                  setIsDoing(true)
                  const promise = signAndVerify(account, authToken)
                  promise
                    .then((res) => {
                      console.log('res', res)
                      setIsSigning(false)
                    })
                    .catch(() => {
                      console.log('reject')
                    })
                    .finally(() => {
                      setIsDoing(false)
                    })
                }}
              >
                {i18n._(t`Sign In`)}
              </button>
            </>
          )}
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}
