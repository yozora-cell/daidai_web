import { TransactionReceipt } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import AutoFitImage from 'app/components/AutoFitImage'
import Typography from 'app/components/Typography'
import defaultImg from 'app/config/default_img'
import { classNames, isAddress, shortenAddress } from 'app/functions'
import useMultiTransfer from 'app/hooks/useMultiTransfer'
import { useActiveWeb3React } from 'app/services/web3'
import { useAddPopup } from 'app/state/application/hooks'
// import useDebounce from 'app/hooks/useDebounce'
import { NFTDetail, NFTItemStage } from 'app/types/daidai'
import { useMemo, useState } from 'react'

const MulTransferToMulUser = ({
  list,
  changeStage,
  curStage,
  confirm,
}: {
  list?: NFTDetail[]
  changeStage: (stage: NFTItemStage) => void
  curStage: NFTItemStage
  confirm: (tx: TransactionReceipt) => void
}) => {
  const addPopup = useAddPopup()
  const { account } = useActiveWeb3React()

  const { i18n } = useLingui()
  const [isTransfer, setIsTransfer] = useState(false)

  const getDefaultUsers = (length: number) => {
    const list: string[] = []
    for (let i = 0; i < length; i++) {
      list.push('')
    }
    return list
  }

  const tokenids = useMemo(() => {
    let result: string[] = []
    if (list && list.length > 0) {
      result = list.map((item) => {
        return String(item.tokenId)
      })
    }
    return result
  }, [list])

  const collections = useMemo(() => {
    let result: string[] = []
    if (list && list.length > 0) {
      result = list.map((item) => {
        return String(item.contract)
      })
    }
    return result
  }, [list])

  const [useradds, setUseradds] = useState(getDefaultUsers(list ? list.length : 0))

  const updateUseradds = (index: number, address: string) => {
    let copyList = [...useradds]
    copyList[index] = address
    setUseradds(copyList)
  }

  const useraddsOks = useMemo(() => {
    let result: boolean[] = []
    if (useradds && useradds.length > 0) {
      result = useradds.map((address) => {
        const isValidate = isAddress(address) ? true : false
        return isValidate && address.toLocaleLowerCase() != account?.toLocaleLowerCase()
      })
    }
    return result
  }, [account, useradds])

  const isOk = useMemo(() => {
    let result = true
    if (useraddsOks && useraddsOks.length > 0) {
      useraddsOks.map((value) => {
        if (value == false) {
          result = false
        }
      })
    } else {
      result = false
    }
    return result
  }, [useraddsOks])

  const { airdropNFTs } = useMultiTransfer()

  const handleAirdropNfTs = async () => {
    if (collections.length == 0 || tokenids.length == 0) {
      addPopup({
        alert: {
          success: false,
          message: i18n._(t`NFT data error, collections ${collections.join(',')}, tokenids ${tokenids.join(',')}`),
        },
      })
      return
    }
    setIsTransfer(true)
    await airdropNFTs({
      collections: collections,
      tokenids: tokenids,
      useradds: useradds,
    })
      .then((tx: TransactionReceipt | undefined) => {
        if (tx) {
          changeStage(NFTItemStage.SUCCESS)
          confirm(tx)
        }
      })
      .catch((error) => {
        console.error('airdropNFTs error', error)
        const message = error.message
          ? error.data && error.data.message
            ? `${error.message} ${error.data.message}`
            : error.message
          : ''
        // changeStage(NFTItemStage.APPROVED)
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

  const [isConfirm, setIsConfirm] = useState(false)

  return (
    <>
      {list && list.length > 0 ? (
        <div className="w-full pt-4 mt-4 border-t">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="border-b">
                <tr>
                  <th className="bg-base-100">{i18n._(t`NFT`)}</th>
                  {/* <th className="bg-base-100">{i18n._(t`Collection`)}</th> */}
                  <th className="bg-base-100">
                    {/* {i18n._(t`Name`)}#{i18n._(t`TokenId`)} */}
                    {i18n._(t`Name`)}
                  </th>
                  {/* <th className="bg-base-100">{i18n._(t`TokenId`)}</th> */}
                  <th className="w-64 bg-base-100">{i18n._(t`Airdrop Address`)}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item, index) => {
                  return (
                    <>
                      <tr>
                        <th>
                          <div className="w-20 h-20">
                            <AutoFitImage
                              imageUrl={item?.image ?? defaultImg}
                              defaultHeightStyle="100%"
                              defaultWidthStyle="100%"
                              roundedClassName="rounded-md"
                            ></AutoFitImage>
                          </div>
                        </th>
                        {/* <th>{item.collection?.name}</th> */}
                        <th>
                          <div>
                            <Typography weight={700}>
                              {/* {item.name}#{item.tokenId} */}
                              {item.name}
                            </Typography>
                            <Typography className="text-opacity-40" variant="sm">
                              {item.collection?.name}
                            </Typography>
                          </div>
                        </th>
                        {/* <th>#{item.tokenId}</th> */}
                        <th>
                          {isTransfer || isConfirm ? (
                            <>{shortenAddress(useradds[index])}</>
                          ) : (
                            <>
                              <div className="flex flex-row items-center gap-2">
                                <input
                                  value={useradds[index]}
                                  placeholder={i18n._(t`address you want to airdrop`)}
                                  className={classNames(
                                    'w-64 input input-bordered',
                                    useraddsOks[index] ? 'input-success' : '',
                                    useradds[index] && useraddsOks[index] == false ? 'input-error' : ''
                                  )}
                                  onChange={(event) => {
                                    let input = event.target.value
                                    // console.log('transfer input', input)
                                    input = input.replace(' ', '')
                                    updateUseradds(index, input)
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </th>
                      </tr>
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="w-full pt-4 pb-4">
            {isOk ? (
              <>
                {isTransfer ? (
                  <>
                    <button className="w-full mt-4 btn btn-primary loading" disabled>
                      {i18n._(t`Pending`)}
                    </button>
                  </>
                ) : (
                  <>
                    {isConfirm ? (
                      <>
                        <div className="flex flex-col">
                          <button
                            className="w-full mt-4 btn btn-outline"
                            onClick={() => {
                              setIsConfirm(false)
                            }}
                          >
                            {i18n._(t`Edit`)}
                          </button>
                          <div className="divider">
                            <Typography variant="sm" weight={700}>
                              {i18n._(t`Or`)}
                            </Typography>
                          </div>
                          <button className="w-full mt-4 btn btn-primary" onClick={handleAirdropNfTs}>
                            {i18n._(t`Airdrop`)}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full mt-4 btn btn-primary"
                          onClick={() => {
                            setIsConfirm(true)
                          }}
                        >
                          {i18n._(t`Confirm`)}
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <button className="w-full mt-4 btn btn-primary" disabled>
                {i18n._(t`Airdrop`)}
              </button>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default MulTransferToMulUser
