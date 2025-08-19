import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import { ChainId } from '@sushiswap/core-sdk'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import SUPPORTED_NETWORKS_, { SWITCH_NETWORKS } from 'app/config/support_networks'
import { classNames } from 'app/functions'
import { logEvent } from 'app/functions/analytics'
import { useActiveWeb3React } from 'app/services/web3'
import { ApplicationModal } from 'app/state/application/actions'
import { useModalOpen, useNetworkModalToggle } from 'app/state/application/hooks'
// @ts-ignore TYPE NEEDS FIXING
import Image from 'next/image'
import React, { FC } from 'react'

export const SUPPORTED_NETWORKS = SUPPORTED_NETWORKS_

const NetworkModal: FC = () => {
  const { i18n } = useLingui()
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <HeadlessUiModal.Controlled isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header header={i18n._(t`Select a network`)} onClose={toggleNetworkModal} />
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
          {SWITCH_NETWORKS.sort((key) => (chainId === key ? -1 : 0)).map((key: number, i: number) => {
            if (chainId === key) {
              return (
                <div
                  key={i}
                  className="flex items-center w-full gap-4 px-4 py-3 border rounded cursor-default focus:outline-none border-base-300"
                >
                  <Image
                    // @ts-ignore TYPE NEEDS FIXING
                    src={NETWORK_ICON[key]}
                    alt="Switch Network"
                    className="rounded-full"
                    width="32px"
                    height="32px"
                  />
                  <Typography weight={700} className="text-base-content">
                    {NETWORK_LABEL[key]}
                  </Typography>
                </div>
              )
            }
            return (
              <button
                key={i}
                onClick={async () => {
                  console.debug(`Switching to chain ${key}`, SUPPORTED_NETWORKS[key])
                  toggleNetworkModal()
                  const params = SUPPORTED_NETWORKS[key]
                  try {
                    await library?.send('wallet_switchEthereumChain', [{ chainId: `0x${key.toString(16)}` }, account])
                    logEvent('Chain', 'switch', params.chainName, key)
                  } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    // @ts-ignore TYPE NEEDS FIXING
                    if (switchError.code === 4902) {
                      try {
                        await library?.send('wallet_addEthereumChain', [params, account])
                      } catch (addError) {
                        // handle "add" error
                        console.error(`Add chain error ${addError}`)
                      }
                    }
                    console.error(`Switch chain error ${switchError}`)
                    // handle other "switch" errors
                  }
                }}
                className={classNames(
                  'focus:outline-none flex items-center gap-4 w-full px-4 py-3 rounded border hover:border-primary'
                )}
              >
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                <Image
                  src={NETWORK_ICON[key]}
                  alt="Switch Network"
                  className="rounded-full"
                  width="32px"
                  height="32px"
                />
                <Typography weight={700} className="text-base-content">
                  {NETWORK_LABEL[key]}
                </Typography>
              </button>
            )
          })}
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default NetworkModal
