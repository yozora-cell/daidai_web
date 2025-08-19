import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { classNames } from 'app/functions'
import useNFT from 'app/hooks/useNFT'
import { useActiveWeb3React } from 'app/services/web3'
import { NFTDetail, NFTOperateStage } from 'app/types/daidai'
import { useEffect, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import ActionsContent from './ActionsContent'
import ActionsModal from './ActionsModal'

const TransferActions = ({
  data,
  className,
  // 用于强制刷新swr请求的一个key，在close和confirm之后都会进行调用
  swrKey,
}: {
  data: NFTDetail
  className?: string
  swrKey?: string
}) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  const listingItem = useMemo(() => {
    if (data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])
  const { ownerOf } = useNFT(data.contract ?? '')
  const [owner, setOwner] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (account && data.tokenId != undefined) {
      const promise = ownerOf(Number(data.tokenId), listingItem?.address)
      promise.then((result) => {
        setOwner(result)
      })
    }
  }, [account, data.tokenId, listingItem?.address, ownerOf])

  const { mutate } = useSWRConfig()
  const [isOpen, setIsOpen] = useState(false)

  const closeHandle = () => {
    console.log('ActionsModal close')
    setIsOpen(false)
    if (swrKey) {
      mutate(swrKey)
    }
  }

  const confirmHandle = () => {
    console.log('ActionsModal confirm and close')
    setIsOpen(false)
    if (swrKey) {
      mutate(swrKey)
    }
  }

  return (
    <>
      {account && String(owner).toLocaleLowerCase() == account.toLocaleLowerCase() && !listingItem ? (
        <>
          <div className={classNames('tooltip', className)} data-tip={i18n._(t`Transfer`)}>
            <PaperAirplaneIcon
              className="w-5 rotate-90 cursor-pointer"
              onClick={() => {
                setIsOpen(true)
              }}
            />
          </div>
          <ActionsModal
            isOpen={isOpen}
            close={closeHandle}
            content={
              <ActionsContent
                data={data}
                close={closeHandle}
                confirm={confirmHandle}
                operateType={NFTOperateStage.TRANSFER}
              ></ActionsContent>
            }
          ></ActionsModal>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default TransferActions
