import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import useSignAndVerify, { setIsSigning, useCheckAuth } from 'app/hooks/useSignAndVerify'
import { useAccount, useWalletModalToggle } from 'app/state/application/hooks'
import { useAuthToken } from 'app/state/user/hooks'
import React, { FC, useMemo } from 'react'

interface SignGuardProps {
  asModal?: boolean
}

const Component: FC<SignGuardProps> = ({ children, asModal = true }) => {
  const { i18n } = useLingui()
  const toggleWalletModal = useWalletModalToggle()
  const account = useAccount()
  const authToken = useAuthToken(account)
  const signAndVerify = useSignAndVerify()
  useCheckAuth(account, authToken)

  const isSigned = useMemo(() => {
    return account && authToken && authToken.length > 0
  }, [account, authToken])

  const signContent = (
    <div className="flex justify-center lg:mt-[200px]">
      <div className="flex flex-col items-center justify-center gap-5 p-4 mt-10 lg:mt-0">
        <Typography variant="h2" className="max-w-2xl text-center text-primary" weight={700}>
          {i18n._(t`Please sign in with your wallet`)}
        </Typography>
        <div className="flex flex-row justify-center mt-4">
          <button
            className="btn btn-primary btn-outline w-52"
            onClick={() => {
              setIsSigning(false)
              const promise = signAndVerify(account, authToken)
              promise
                .then((res) => {
                  console.log('res', res)
                })
                .catch(() => {
                  console.log('reject')
                })
            }}
          >
            {i18n._(t`Sign`)}
          </button>
        </div>
      </div>
    </div>
  )

  const connectWalletContent = (
    <div className="flex justify-center lg:mt-[200px]">
      <div className="flex flex-col items-center justify-center gap-5 p-4 mt-10 lg:mt-0">
        <Typography variant="h2" className="max-w-2xl text-center text-primary" weight={700}>
          {i18n._(t`Please connect wallet and sign in with wallet`)}
        </Typography>
        <div className="flex flex-row justify-center mt-4">
          <button
            className="btn btn-primary btn-outline w-52"
            onClick={() => {
              toggleWalletModal()
            }}
          >
            {i18n._(t`Connect Wallet`)}
          </button>
        </div>
      </div>
    </div>
  )

  const content = <>{!account ? <>{connectWalletContent}</> : <>{signContent}</>}</>

  if (!asModal) {
    if (!isSigned) {
      return content
    }

    return <>{children}</>
  }

  return (
    <>
      <HeadlessUIModal.Controlled isOpen={!isSigned} onDismiss={() => null} transparent={true}>
        {content}
      </HeadlessUIModal.Controlled>
      {children}
    </>
  )
}

type SignGuard = (renderChildren?: boolean) => FC
const SignGuard: SignGuard = (renderChildren = true) => {
  if (!renderChildren) {
    return ({ children }) => <Component asModal={false}>{children}</Component>
  }

  return ({ children }) => <Component>{children}</Component>
}

export default SignGuard
