import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import config from 'app/config'
import { classNames } from 'app/functions'
import { BreakPoint, useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import useNFT from 'app/hooks/useNFT'
import useSignAndVerify from 'app/hooks/useSignAndVerify'
import { AppState } from 'app/state'
import { setIsActionsOpen } from 'app/state/application/actions'
import { useAddPopup, useWalletModalToggle } from 'app/state/application/hooks'
import { useAccount } from 'app/state/application/hooks'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { useAuthToken } from 'app/state/user/hooks'
import { useBalancesNoZero } from 'app/state/wallet/hooks'
import { ListingItem, NFTDetail, NFTOperateStage } from 'app/types/daidai'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSWRConfig } from 'swr'

import ActionsContent from './ActionsContent'
import ActionsModal from './ActionsModal'

export enum ButtonStyle {
  TEXT = 'text',
  BUTTON = 'button',
}

const ButtonText = ({
  buttonStyle,
  content,
  disabled,
  clickEvent,
  className,
  ...rest
}: {
  buttonStyle: ButtonStyle
  content: string
  disabled: boolean
  clickEvent?: () => void
  className?: string
}) => {
  const breakpoint = useBreakPointMediaQuery()
  return buttonStyle == ButtonStyle.BUTTON ? (
    <button
      {...rest}
      className={classNames('btn btn-primary', className, breakpoint == BreakPoint.DEFAULT ? 'w-full' : 'w-52')}
      onClick={clickEvent}
      disabled={disabled}
    >
      {content}
    </button>
  ) : (
    <Typography
      {...rest}
      className={classNames('inline-flex', disabled ? 'text-primary' : 'text-info cursor-pointer', className)}
      onClick={clickEvent}
    >
      {content}
    </Typography>
  )
}

/**
 * 是否已经连接wallet
 * 1. 如果已经连接wallet，执行Actions的职责（下面）
 * 2. 如果未登录，展示文本“connect wallet”，点击进行登录
 *
 * Actions的职责（下面的功能是已用户已经登录wallet）
 * 1. 作为外部展示给用户的入口，现在样式有两种，一个是按钮，另外是link
 * 2. Actions需要根据NFT的data来判断当前的nft是不是属于当前account
 * 3. 如果是属于account的，展示askorder相关的功能
 * 3.1 如果未上架，判断依据是listingItem是否不为空，那就展示上架（点击弹框）
 * 3.2 否则，就展示下架和修改（点击弹框）
 * 4. 如果不属于当前用户，需要判断当前NFT的状态
 * 4.1 如果NFT是on sale的，那就展示buy（点击弹框）
 * 4.2 否则，那就是not on sale，没其他操作
 * @param param0
 * @returns
 */
const Actions = ({
  listingItem,
  data,
  collection,
  tokenId,
  buttonStyle,
  // 用于强制刷新swr请求的一个key，在close和confirm之后都会进行调用
  swrKey,
  onSuccess,
  onClose,
  className,
}: {
  listingItem?: ListingItem
  data: NFTDetail
  collection?: string
  tokenId: number
  buttonStyle: ButtonStyle
  swrKey?: string | undefined
  onSuccess?: () => void
  onClose?: () => void
  className?: string
}) => {
  const dispatch = useDispatch()
  // 改为用redex来管理isOpen字段，避免出现数据刷新导致的isOpen被重置的问题
  const redexKey = useMemo(() => {
    return collection + '_' + String(tokenId)
  }, [collection, tokenId])
  const isActionsOpen = useSelector<AppState, AppState['application']['isActionsOpen']>(
    (state) => state.application.isActionsOpen
  )
  const isOpen = useMemo(() => {
    let result = false
    for (let pro in isActionsOpen) {
      if (pro === redexKey) {
        return isActionsOpen[pro]
      }
    }
    return result
  }, [isActionsOpen, redexKey])
  // console.log('redux isOpen', redexKey, isOpen)
  // console.log('actions swrKey', swrKey)
  const { i18n } = useLingui()
  const addPopup = useAddPopup()
  const account = useAccount()
  const authToken = useAuthToken(account)
  const signAndVerify = useSignAndVerify()
  const toggleWalletModal = useWalletModalToggle()
  const { ownerOf } = useNFT(collection ? collection : data.contract ?? '')
  const [owner, setOwner] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (account && tokenId != undefined) {
      const promise = ownerOf(tokenId, listingItem?.address)
      promise.then((result) => {
        setOwner(result)
      })
    }
  }, [account, listingItem?.address, ownerOf, tokenId])

  const { balances, loading } = useBalancesNoZero()

  const findToken = useTokenByAddressCallback()
  const currentToken = findToken(listingItem?.payToken)
  const responseBalance = useMemo(() => {
    if (!listingItem) {
      return undefined
    }
    const findObj = balances.find(
      (balance) => balance.currency.symbol?.toLocaleLowerCase() == currentToken?.symbol?.toLocaleLowerCase()
    )
    return findObj ?? undefined
  }, [balances, currentToken?.symbol, listingItem])

  const { mutate } = useSWRConfig()

  // const [isOpen, setIsOpen] = useState(false)
  // console.log('isOpen', isOpen)

  const closeHandle = () => {
    console.log('ActionsModal close')
    // setIsOpen(false)
    dispatch(setIsActionsOpen({ isActionsOpen: false, key: redexKey }))
    // 解决弹框出现之后签名弹框出现，之后关闭了所有弹框导致的无法滚动问题
    const html = document.documentElement
    html.style.overflow = 'auto'
    html.style.paddingRight = ''
    onClose ? onClose() : null
    // if (swrKey) {
    //   mutate(swrKey)
    //   setTimeout(() => {
    //     mutate(swrKey)
    //   }, config.graph_timeout)
    // }
  }

  const confirmHandle = () => {
    console.log('ActionsModal confirm and close')
    // setIsOpen(false)
    if (swrKey) {
      console.log('confirmHandle', swrKey)
      mutate(swrKey)
      setTimeout(() => {
        mutate(swrKey)
      }, config.graph_timeout)
    }
    onSuccess ? onSuccess() : null
  }

  const isOwner = useMemo(() => {
    if (!account) {
      return false
    }
    return String(owner).toLocaleLowerCase() == account.toLocaleLowerCase()
  }, [account, owner])

  return (
    <>
      {account ? (
        <>
          {isOwner ? (
            <>
              {listingItem ? (
                <ButtonText
                  buttonStyle={buttonStyle}
                  content={i18n._(t`Modify Or Cancel`)}
                  disabled={false}
                  clickEvent={() => {
                    // setIsOpen(true)
                    const promise = signAndVerify(account, authToken)
                    promise
                      .then((res) => {
                        console.log('res', res)
                        dispatch(setIsActionsOpen({ isActionsOpen: true, key: redexKey }))
                      })
                      .catch(() => {
                        console.log('reject')
                      })
                  }}
                  className={className}
                ></ButtonText>
              ) : (
                <ButtonText
                  buttonStyle={buttonStyle}
                  content={i18n._(t`To List`)}
                  disabled={false}
                  clickEvent={() => {
                    // setIsOpen(true)
                    const promise = signAndVerify(account, authToken)
                    promise
                      .then((res) => {
                        console.log('res', res)
                        dispatch(setIsActionsOpen({ isActionsOpen: true, key: redexKey }))
                      })
                      .catch(() => {
                        console.log('reject')
                      })
                  }}
                  className={className}
                ></ButtonText>
              )}
            </>
          ) : (
            <>
              {listingItem ? (
                <ButtonText
                  buttonStyle={buttonStyle}
                  content={i18n._(t`Buy Now`)}
                  disabled={false}
                  clickEvent={() => {
                    // 判断是否已经过时或者是余额是否充足
                    const time = listingItem.expiration * 1000
                    const nowTime = new Date().getTime()
                    // 已过期
                    if (nowTime > time) {
                      addPopup({
                        alert: {
                          message: i18n._(t`listing has expired`),
                          success: false,
                        },
                      })
                      return
                    }
                    if (responseBalance && Number(responseBalance.toSignificant(6)) >= Number(listingItem.price)) {
                      // setIsOpen(true)
                      const promise = signAndVerify(account, authToken)
                      promise
                        .then((res) => {
                          console.log('res', res)
                          dispatch(setIsActionsOpen({ isActionsOpen: true, key: redexKey }))
                        })
                        .catch(() => {
                          console.log('reject')
                        })
                    } else {
                      addPopup({
                        alert: {
                          message: i18n._(t`insufficient funds`),
                          success: false,
                        },
                      })
                    }
                  }}
                  className={className}
                ></ButtonText>
              ) : (
                <>
                  {buttonStyle == ButtonStyle.BUTTON ? (
                    // <ButtonText buttonStyle={buttonStyle} content={i18n._(t`Sold Out`)} disabled={true}></ButtonText>
                    <></>
                  ) : (
                    // <ButtonText buttonStyle={buttonStyle} content={i18n._(t` `)} disabled={true}></ButtonText>
                    <></>
                  )}
                </>
              )}
            </>
          )}
          <ActionsModal
            isOpen={isOpen}
            close={closeHandle}
            content={
              <ActionsContent
                data={data}
                close={closeHandle}
                confirm={confirmHandle}
                operateType={isOwner ? NFTOperateStage.ORDER : NFTOperateStage.BUY}
              ></ActionsContent>
            }
          ></ActionsModal>
        </>
      ) : (
        <ButtonText
          buttonStyle={buttonStyle}
          content={i18n._(t`Connect Wallet`)}
          disabled={false}
          clickEvent={toggleWalletModal}
          className={className}
        ></ButtonText>
      )}
    </>
  )
}
export default Actions
