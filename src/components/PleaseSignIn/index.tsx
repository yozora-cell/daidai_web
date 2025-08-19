import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
const PleaseSignIn = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 mx-auto w-72">
      <Typography variant="h3" className="py-2 text-center">
        {i18n._(t`Sign in`)}
      </Typography>
      <Typography variant="base" className="py-2 mt-4 text-center">
        {i18n._(t`Please sign in with your blockchain wallet to see this page`)}
      </Typography>

      <Button fullWidth color="primary" onClick={toggleWalletModal} className="mt-4 rounded-2xl md:rounded">
        {i18n._(t`connect wallet`)}
      </Button>
    </div>
  )
}

export default PleaseSignIn
