import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useNFT from 'app/hooks/useNFT'
import { useActiveWeb3React } from 'app/services/web3'
import { NFTDetail, NFTOperateStage } from 'app/types/daidai'
import { useEffect, useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'

import ActionsContent from './ActionsContent'
import ActionsModal from './ActionsModal'

const MulTransferActions = ({
  // list一定要有值，要不然会报错
  list,
  className,
  // 用于强制刷新swr请求的一个key，在close和confirm之后都会进行调用
  swrKey,
  confirm,
  dismiss,
}: {
  list: NFTDetail[]
  confirm: () => void
  dismiss?: () => void
  className?: string
  swrKey?: string
}) => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()
  const [data, setData] = useState(list[0])
  const { ownerOf } = useNFT(data.contract ?? '')
  const [owner, setOwner] = useState<string | undefined>(undefined)
  const listingItem = useMemo(() => {
    if (data.SellList && data.SellList.length > 0) {
      return data.SellList[0]
    }
    return undefined
  }, [data])
  useEffect(() => {
    if (account && data.tokenId != undefined) {
      const promise = ownerOf(Number(data.tokenId), listingItem?.address)
      promise.then((result) => {
        setOwner(result)
      })
    }
  }, [account, listingItem, data.tokenId, ownerOf])

  const { mutate } = useSWRConfig()
  const [isOpen, setIsOpen] = useState(false)

  const closeHandle = () => {
    // console.log('ActionsModal close')
    setIsOpen(false)
    if (swrKey) {
      mutate(swrKey)
    }
    // confirm()
    dismiss ? dismiss() : null
  }

  const confirmHandle = () => {
    // console.log('ActionsModal confirm and close')
    setIsOpen(false)
    if (swrKey) {
      mutate(swrKey)
    }
    confirm()
  }

  return (
    <>
      {account && String(owner).toLocaleLowerCase() == account.toLocaleLowerCase() ? (
        <>
          <button
            className="gap-2 btn btn-primary btn-outline btn-sm"
            onClick={() => {
              // 检验list的合法性
              // list.map((item) => {
              //   console.log('selected item', item)
              // })
              setIsOpen(true)
            }}
          >
            <PaperAirplaneIcon className="w-5 rotate-90" />
            {i18n._(t`Airdrop`)}
            {` `}
            {list.length}
          </button>
          <ActionsModal
            maxWidthClassName="max-w-2xl"
            isOpen={isOpen}
            close={closeHandle}
            content={
              <ActionsContent
                data={data}
                list={list}
                close={closeHandle}
                confirm={confirmHandle}
                operateType={NFTOperateStage.MULTI_TRANSFER}
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

export default MulTransferActions
