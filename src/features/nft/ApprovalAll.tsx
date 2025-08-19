import { ExternalLinkIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import CopyHelper from 'app/components/AccountDetails/Copy'
import ExternalLink from 'app/components/ExternalLink'
import Typography from 'app/components/Typography'
import { getExplorerLink, shortenAddress } from 'app/functions'
import useNFT, { ApprovalTarget } from 'app/hooks/useNFT'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
import { NFTItemStage } from 'app/types/daidai'
import { useEffect, useState } from 'react'

const ApprovalAll = ({
  contract,
  changeStage,
  curStage,
  approvalTarget,
  isShowTip = false,
}: {
  contract: string
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  approvalTarget: ApprovalTarget
  isShowTip?: boolean
}) => {
  const addPopup = useAddPopup()
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const { getIsApprovalForAll, setApprovalForAll, getApproveAddress } = useNFT(contract)

  const approveAddress = getApproveAddress(approvalTarget)

  // 保存setApprovalForAll的结果
  const [isApprovalForAll, setIsApprovalForAll] = useState(false)
  // 标记GetIsApprovalForAll是否已经执行结束
  const [isGetIsApprovalForAllEnd, setIsGetIsApprovalForAllEnd] = useState(false)
  // 标记是否在getIsApprovalForAll中
  const [isGetIsApprovalForAll, setGetIsApprovalForAll] = useState(false)
  // 标记是否在setApprovalForAll中
  const [isSetApprovalForAll, setIsSetApprovalForAll] = useState(false)
  useEffect(() => {
    // console.log('change', account, getIsApprovalForAll, data, changeStage, approvalTarget, addPopup)
    if (account && isGetIsApprovalForAll == false && isGetIsApprovalForAllEnd == false) {
      const promise = getIsApprovalForAll(approvalTarget)
      setGetIsApprovalForAll(true)
      promise
        .then((result) => {
          // console.log('getIsApprovalForAll', result)
          setGetIsApprovalForAll(false)
          if (result === true) {
            changeStage(NFTItemStage.APPROVED)
          } else {
            changeStage(NFTItemStage.NOT_APPROVED)
          }
          setIsApprovalForAll(result)
        })
        .catch((error) => {
          const message = error.message
            ? error.data && error.data.message
              ? `${error.message} ${error.data.message}`
              : error.message
            : ''
          addPopup({
            alert: {
              success: false,
              message: `code: ${error.code} \nmessage: ${message}`,
            },
          })
        })
        .finally(() => {
          setIsGetIsApprovalForAllEnd(true)
        })
    }
  }, [
    account,
    getIsApprovalForAll,
    contract,
    changeStage,
    approvalTarget,
    addPopup,
    isGetIsApprovalForAll,
    isGetIsApprovalForAllEnd,
  ])

  const handleApprove = async () => {
    setIsSetApprovalForAll(true)
    await setApprovalForAll({
      approvalTarget: approvalTarget,
      approvalForAll: true,
    })
      .then((tx) => {
        // console.log('setApprovalForAll tx', tx)
        changeStage(NFTItemStage.APPROVED)
        setIsApprovalForAll(true)
      })
      .catch((error) => {
        console.error('setApprovalForAll error', error)
        const message = error.message
          ? error.data && error.data.message
            ? `${error.message} ${error.data.message}`
            : error.message
          : ''
        addPopup({
          alert: {
            success: false,
            message: `code: ${error.code} \nmessage: ${message}`,
          },
        })
      })
      .finally(() => {
        setIsSetApprovalForAll(false)
      })
  }

  return (
    <>
      {isShowTip ? (
        <>
          <div className="flex flex-col items-center justify-center pb-4">
            <div className="w-full text-center">
              <Typography variant="h2">{i18n._(t`New address detected!`)}</Typography>
            </div>
            <div className="w-full mt-4 text-center">
              <Typography variant="base">{i18n._(t`Click approval to add to your address book.`)}</Typography>
            </div>
            {approveAddress ? (
              <>
                <div className="flex flex-row items-center justify-center w-full mt-4">
                  <div className="flex flex-row items-center justify-center px-4 py-2 w-fit">
                    <ExternalLink href={getExplorerLink(chainId, approveAddress, 'address')} color="primary">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <Typography variant="sm">{shortenAddress(approveAddress)}</Typography>
                        <ExternalLinkIcon className="w-4 cursor-pointer" />
                      </div>
                    </ExternalLink>
                    <CopyHelper toCopy={approveAddress} className="ml-2 opacity-100 text-primary"></CopyHelper>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="flex flex-col items-center justify-center">
        <>
          {isGetIsApprovalForAll ? (
            <>
              <button className="w-full btn btn-ghost text-primary loading" disabled={true}>
                {i18n._(t`Pending`)}
              </button>
            </>
          ) : (
            <>
              {isApprovalForAll ? (
                <>
                  <button className="w-full btn btn-ghost text-primary" disabled={true}>
                    {i18n._(t`APPROVED`)}
                  </button>
                </>
              ) : (
                <>
                  {isSetApprovalForAll ? (
                    <button className="w-full btn btn-ghost text-primary loading" disabled={true}>
                      {i18n._(t`Pending`)}
                    </button>
                  ) : (
                    <button className="w-full btn btn-primary" disabled={false} onClick={handleApprove}>
                      {i18n._(t`Approve`)}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </>
      </div>
    </>
  )
}

export default ApprovalAll
