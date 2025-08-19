import { TransactionReceipt } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { isAddress } from 'app/functions'
import useMultiTransfer from 'app/hooks/useMultiTransfer'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
// import useDebounce from 'app/hooks/useDebounce'
import { NFTDetail, NFTItemStage } from 'app/types/daidai'
import { useMemo, useState } from 'react'

import Info from './Info'

const Transfer = ({
  data,
  changeStage,
  curStage,
  confirm,
}: {
  data: NFTDetail
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  confirm: (tx: TransactionReceipt) => void
}) => {
  const addPopup = useAddPopup()
  const { account } = useActiveWeb3React()

  const { i18n } = useLingui()
  const [isTransfer, setIsTransfer] = useState(false)
  const [address, setAddress] = useState('')
  const isOk = useMemo(() => {
    if (address) {
      return isAddress(address) ? true : false
    }
    return false
  }, [address])

  const { airdropNFTs } = useMultiTransfer()

  const handleAirdropNfTs = async () => {
    const collection = data.contract ?? ''
    const tokenid = data.tokenId ?? -1
    if (!collection || tokenid == -1) {
      addPopup({
        alert: {
          success: false,
          message: i18n._(t`NFT data error, collection ${collection}, tokenid ${tokenid}`),
        },
      })
      return
    }
    if (account && address.toLocaleLowerCase() == account.toLocaleLowerCase()) {
      addPopup({
        alert: {
          success: false,
          message: i18n._(t`don't transfer to yourself!`),
        },
      })
      return
    }
    setIsTransfer(true)
    await airdropNFTs({
      collections: [collection],
      tokenids: [String(tokenid)],
      useradds: [address],
    })
      .then((tx: TransactionReceipt | undefined) => {
        if (tx) {
          changeStage(NFTItemStage.SUCCESS)
          confirm(tx)
        }
      })
      .catch((error) => {
        console.log('airdropNFTs error', error)
        // changeStage(NFTItemStage.APPROVED)
        const message = error.message
          ? error.data && error.data.message
            ? `${error.message} ${error.data.message}`
            : error.message
          : ''
        addPopup({
          alert: {
            message: `code: ${error.code} \nmessage: ${message}`,
            success: false,
          },
        })
      })
      .finally(() => {
        setIsTransfer(false)
      })
  }

  return (
    <div className="w-full">
      <Info data={data}></Info>
      <div className="w-full mt-8">
        {isTransfer ? (
          <div className="w-full pt-4 mt-4 border-t">
            <div>
              <Typography variant="base" weight={700}>
                {i18n._(t`Transfer To`)}
              </Typography>
            </div>
            <div className="w-full pt-4 pb-4">
              <Typography variant="base" weight={700}>
                {address}
              </Typography>
              <button className="btn btn-primary loading !w-full mt-4" disabled>
                {i18n._(t`Pending`)}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full pt-4 mt-4 border-t">
              <div>
                <Typography variant="base" weight={700}>
                  {i18n._(t`Transfer To`)}
                </Typography>
              </div>
              <div className="w-full pt-4 pb-4">
                <input
                  placeholder={i18n._(t`address you want to transfer`)}
                  className="w-full input input-bordered"
                  onChange={(event) => {
                    const input = event.target.value
                    // console.log('transfer input', input)
                    setAddress(input)
                  }}
                />
                {isOk ? (
                  <button className="w-full mt-4 btn btn-primary" onClick={handleAirdropNfTs}>
                    {i18n._(t`Transfer`)}
                  </button>
                ) : (
                  <button className="w-full mt-4 btn btn-primary" disabled>
                    {i18n._(t`Transfer`)}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default Transfer
