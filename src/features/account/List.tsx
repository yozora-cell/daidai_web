import { BanIcon, CheckCircleIcon, PaperAirplaneIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NoData from 'app/components/NoData'
import Pagination from 'app/components/Pagination'
import Typography from 'app/components/Typography'
import CollectionFilters from 'app/features/home/CollectionFilters'
import Item, { ItemSkeleton } from 'app/features/nft/Item'
import MulTransferActions from 'app/features/nft/MulTransferActions'
import { classNames } from 'app/functions'
import { postNftsFind } from 'app/services/apis/fetchers'
import { useProfileCollectibles, useProfileOnsale } from 'app/services/apis/hooks'
import { profileCollectibles, profileOnsale } from 'app/services/apis/keys'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { initApprovalStage } from 'app/state/nfts/actions'
import { CollectionTokenIds, NFTDetail } from 'app/types/daidai'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

export enum STATUS {
  ON_SALE = 'onsale',
  ITEMS = 'items',
}

const getCollectionIds = (data: CollectionTokenIds) => {
  const array: string[] = []
  for (const pro in data) {
    const tokenids = data[pro]
    tokenids.map((tokenid) => {
      array.push(`${pro}-${tokenid}`)
    })
  }
  return array
}

const NFTList = ({ account }: { account: string }) => {
  const web3 = useActiveWeb3React()

  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const data = useProfileCollectibles(account)
  // console.log('nft list data', data)

  const filterCollectionSet = useMemo(() => {
    const set = new Set<string>()
    for (const pro in data) {
      set.add(pro.toLocaleLowerCase())
    }
    // console.log('set', set)
    return set
  }, [data])
  const [list, setList] = useState<NFTDetail[] | undefined>(undefined)
  const [page, setPage] = useState(1)
  const limit = 20
  const pageNeighbours = 1
  const onChangePage = (newPage: number) => {
    setPage(newPage)
  }

  const onLoadData = useCallback(
    (isInit: boolean) => {
      if (data) {
        const promise = postNftsFind(getCollectionIds(data))
        promise.then((data) => {
          // console.log('test', data)
          if (data) {
            setList(data)
            if (isInit) {
              setPage(1)
            }
          }
        })
      }
    },
    [data]
  )

  useEffect(() => {
    // console.log('account list data', data)
    onLoadData(true)
  }, [data, onLoadData])
  // console.log('nft list data', data)
  // const render = (address: string, tokenIds: string[]) => {
  //   return tokenIds.map((tokenId) => {
  //     return <NFTItem key={`${address}/${tokenId}/}/${Math.random()}`} address={address} tokenId={tokenId}></NFTItem>
  //   })
  // }
  const swrKey = profileCollectibles(account)

  const [collection, setCollection] = useState<string | null>(null)

  const filteredList = useMemo(() => {
    if (list && list.length > 0) {
      if (collection) {
        return list.filter((item) => {
          return item.contract?.toLocaleLowerCase() == collection.toLocaleLowerCase()
        })
      }
      return list
    }
    return []
  }, [collection, list])

  const totalPage = useMemo(() => {
    return Math.ceil(filteredList.length / limit)
  }, [filteredList.length])

  const [isCheckboxMode, setIsCheckboxMode] = useState(false)

  const [transferList, setTransferList] = useState<NFTDetail[]>([])

  const isSelect = (nft: NFTDetail): boolean => {
    const res = transferList.find((item) => {
      return item.id === nft.id
    })
    return res ? true : false
  }

  const selectNFT = (nft: NFTDetail) => {
    if (isSelect(nft)) {
      const res: NFTDetail[] = []
      transferList.forEach((item) => {
        if (item.id !== nft.id) {
          res.push({ ...item })
        }
      })
      setTransferList(res)
    } else {
      const res = [...transferList]
      res.push({ ...nft })
      setTransferList(res)
    }
  }

  const clean = useCallback(() => {
    setIsCheckboxMode(false)
    setTransferList([])
    dispatch(initApprovalStage())
  }, [dispatch])

  useEffect(() => {
    clean()
  }, [account, clean])

  return (
    <>
      {data && list ? (
        <>
          <div className="flex flex-row flex-wrap items-center gap-4" id="accountItems">
            <CollectionFilters
              defaultValue=""
              onChangeCollection={(curCollection) => {
                setCollection(curCollection)
                setPage(1)
              }}
              filterSet={filterCollectionSet}
            ></CollectionFilters>
            {web3.account?.toLocaleLowerCase() == account.toLocaleLowerCase() ? (
              <>
                {isCheckboxMode ? (
                  <>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        clean()
                      }}
                    >
                      {i18n._(t`Cancel`)}
                    </button>
                    <Typography className="text-sm text-base-content text-opacity-60">
                      {i18n._(t`Please select items and click Airdrop button in the bottom page`)}
                    </Typography>
                  </>
                ) : (
                  <>
                    <button
                      className="gap-2 btn btn-primary btn-outline btn-sm"
                      onClick={() => {
                        setIsCheckboxMode(true)
                        setTransferList([])
                      }}
                    >
                      <PaperAirplaneIcon className="w-5 rotate-90" />
                      {i18n._(t`Airdrop`)}
                    </button>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          {filteredList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredList.slice((page - 1) * limit, (page - 1) * limit + limit).map((nft, index) => {
                  return (
                    <>
                      <div
                        className={classNames(isCheckboxMode ? 'cursor-pointer' : '')}
                        onClick={() => {
                          if (isCheckboxMode) {
                            selectNFT(nft)
                          }
                        }}
                      >
                        <div className={classNames(isCheckboxMode ? 'pointer-events-none' : '', 'relative')}>
                          <Item
                            data={nft}
                            key={`${nft.contract}${nft.chainId}${nft.tokenId}/explore/nft/istems`}
                            swrKey={swrKey}
                            onSuccess={() => {
                              onLoadData(false)
                            }}
                          ></Item>
                          {isCheckboxMode ? (
                            <>
                              <div
                                className={classNames(
                                  'absolute inset-0 w-full h-full bg-base-100 z-10 bg-opacity-30',
                                  isSelect(nft) ? 'border-info rounded-md border-2' : ''
                                )}
                              ></div>
                              {isSelect(nft) ? (
                                <>
                                  <div className="absolute top-[-12px] right-[-12px] w-6 h-6 rounded-full bg-base-100 z-10">
                                    <CheckCircleIcon width={24} className="text-info" />
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </>
                  )
                })}
              </div>
              <div className="flex flex-row justify-center w-full mt-8">
                <Pagination
                  totalPages={totalPage}
                  onChange={(index) => {
                    onChangePage(index + 1)
                    // window.location.hash = '#accountItems'
                    // setPage(index + 1)
                  }}
                  currentPage={page - 1}
                  pageNeighbours={pageNeighbours}
                  canNextPage={!(page == totalPage)}
                  canPreviousPage={!(page == 1)}
                ></Pagination>
              </div>
            </>
          ) : (
            <>
              <NoData></NoData>
            </>
          )}
          {isCheckboxMode ? (
            <>
              <div className="fixed bottom-0 left-0 right-0 z-20 border-t shadow-lg bg-base-100">
                <div className="container flex flex-row justify-end p-4 mx-auto">
                  <div className="flex flex-row items-center justify-end gap-4">
                    {transferList && transferList.length > 0 ? (
                      <>
                        <MulTransferActions
                          list={transferList}
                          swrKey={swrKey}
                          confirm={() => {
                            clean()
                          }}
                          dismiss={() => {
                            console.log('dismiss')
                          }}
                        ></MulTransferActions>
                      </>
                    ) : (
                      <>
                        <button className="gap-2 btn btn-primary btn-outline btn-sm btn-disabled">
                          <BanIcon className="w-5" />
                          {i18n._(t`Airdrop`)}
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        clean()
                      }}
                    >
                      {i18n._(t`Cancel`)}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
          </div>
        </>
      )}
    </>
  )
}

const OnSaleNFTList = ({ account }: { account: string }) => {
  const limit = 20
  const [page, setPage] = useState(1)
  const pageNeighbours = 1
  const queryData = useProfileOnsale(account, page, limit)
  const list = useMemo(() => {
    if (queryData && queryData.data && queryData.data.data) {
      return queryData.data.data
    }
    return []
  }, [queryData])
  // console.log('list', list)
  const count = useMemo(() => {
    return queryData?.data?.count
  }, [queryData])
  const totalPage = useMemo(() => {
    return count ? Math.ceil(count / limit) : 0
  }, [count])

  const swrKey = profileOnsale(account, page, limit)
  return (
    <>
      {list && list.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((nft) => {
              return (
                <Item data={nft} key={`${nft.contract}${nft.chainId}${nft.tokenId}/explore/nft`} swrKey={swrKey}></Item>
              )
            })}
          </div>
          <div className="flex flex-row justify-center mt-8">
            <Pagination
              totalPages={totalPage}
              onChange={(index) => {
                setPage(index + 1)
              }}
              currentPage={page - 1}
              pageNeighbours={pageNeighbours}
              canNextPage={!(page == totalPage)}
              canPreviousPage={!(page == 1)}
            ></Pagination>
          </div>
        </>
      )}
      {!queryData.isValidating && list && list.length == 0 && (
        <>
          <NoData></NoData>
        </>
      )}
      {queryData.isValidating && list && list.length == 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
            <ItemSkeleton></ItemSkeleton>
          </div>
        </>
      )}
    </>
  )
}

const AccountNFTList = ({ account, status }: { account: string; status: STATUS }) => {
  const { i18n } = useLingui()
  // const [list, setList] = useState<ItemProp[]>([])
  if (status == STATUS.ITEMS) {
    return <NFTList account={account}></NFTList>
  } else {
    return <OnSaleNFTList account={account}></OnSaleNFTList>
  }
}

export default AccountNFTList
