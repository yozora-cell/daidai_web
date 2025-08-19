import { TransactionReceipt } from '@ethersproject/providers'
import { Dialog } from '@headlessui/react'
import { ArrowNarrowLeftIcon, XIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import { Assets } from 'app/features/portfolio/AssetBalances/types'
import { parseBalance } from 'app/functions'
import { ApprovalTarget } from 'app/hooks/useNFT'
import { useTokenByAddressCallback } from 'app/state/token/hooks'
import { NFTDetail, NFTItemStage, NFTModalPageStage, NFTOperateStage, OfferItem } from 'app/types/daidai'
import { useMemo, useState } from 'react'

import AcceptOffer from './AcceptOffer'
import ApprovalAll from './ApprovalAll'
import ApprovalAllMul from './ApprovalAllMul'
import ApprovalToken from './ApprovalToken'
import ApprovalTokenMul from './ApprovalTokenMul'
import AskOrder from './AskOrder'
import Checkout from './Checkout'
import MulTransferTokens from './MulTransferTokens'
import MulTransferToMulUser from './MulTransferToMulUser'
import Offer from './Offer'
import Success from './Success'
import Transfer from './Transfer'

const ActionsContent = ({
  data,
  list,
  // offerData只有Offer和Accept Offer业务才会出现
  offerData,
  balances,
  close,
  confirm,
  operateType,
}: {
  data?: NFTDetail
  list?: NFTDetail[]
  offerData?: OfferItem
  balances?: Assets[]
  close: () => void
  confirm: () => void
  operateType: NFTOperateStage
}) => {
  const { i18n } = useLingui()
  // Offer的时候没有approval过程，Offer的approval在operate页面那里处理
  const [stage, setStage] = useState<NFTItemStage>(
    operateType === NFTOperateStage.OFFER ? NFTItemStage.APPROVED : NFTItemStage.UNKNOWN
  )
  const findToken = useTokenByAddressCallback()

  const operateName = useMemo(() => {
    switch (operateType) {
      case NFTOperateStage.BUY:
        return i18n._(t`CHECKOUT`)
      case NFTOperateStage.ORDER:
        return i18n._(t`ASK ORDER`)
      case NFTOperateStage.TRANSFER:
        return i18n._(t`TRANSFER`)
      case NFTOperateStage.MULTI_TRANSFER:
        return i18n._(t`AIRDROP NFT`)
      case NFTOperateStage.MULTI_TRANSFER_TOKENS:
        return i18n._(t`AIRDROP TOKEN`)
      case NFTOperateStage.OFFER:
        return i18n._(t`OFFER`)
      case NFTOperateStage.ACCEPT_OFFER:
        return i18n._(t`ACCEPT OFFER`)
    }
  }, [i18n, operateType])

  const renderApproval = () => {
    switch (operateType) {
      case NFTOperateStage.BUY:
        if (!data) {
          return
        }
        const tokenAddress = data.SellList && data.SellList.length > 0 ? data.SellList[0].payToken : ''
        const price = data.SellList && data.SellList.length > 0 ? data.SellList[0].price : ''
        // 这里修改为授权指定amount的数量
        const token = findToken(tokenAddress)
        if (!token) {
          return
        }
        const amount = CurrencyAmount.fromRawAmount(token, parseBalance(String(price), token.decimals).toString())
        return (
          <ApprovalToken
            changeStage={changeStageHandle}
            tokenAddress={tokenAddress}
            curStage={stage}
            approvalTarget={ApprovalTarget.NFT_MARKETPLACE}
            isShowTip={true}
            amount={amount}
          ></ApprovalToken>
        )
      // offer的时候，需要用户确认了Offer之后再执行approval的，所以这里逻辑不一样
      case NFTOperateStage.OFFER:
        return <></>
      case NFTOperateStage.ORDER:
        if (!data) {
          return
        }
        return (
          <ApprovalAll
            changeStage={changeStageHandle}
            contract={data.contract ?? ''}
            curStage={stage}
            approvalTarget={ApprovalTarget.NFT_MARKETPLACE}
            isShowTip={true}
          ></ApprovalAll>
        )
      case NFTOperateStage.TRANSFER:
        if (!data) {
          return
        }
        return (
          <ApprovalAll
            changeStage={changeStageHandle}
            contract={data.contract ?? ''}
            curStage={stage}
            approvalTarget={ApprovalTarget.MULTI_TRANSFER}
            isShowTip={true}
          ></ApprovalAll>
        )
      case NFTOperateStage.MULTI_TRANSFER:
        if (list && list.length > 0) {
          return (
            <ApprovalAllMul
              changeStage={changeStageHandle}
              list={list}
              curStage={stage}
              approvalTarget={ApprovalTarget.MULTI_TRANSFER}
            ></ApprovalAllMul>
          )
        }
      case NFTOperateStage.MULTI_TRANSFER_TOKENS:
        if (balances && balances.length > 0) {
          return (
            <ApprovalTokenMul
              changeStage={changeStageHandle}
              balances={balances}
              curStage={stage}
              approvalTarget={ApprovalTarget.MULTI_TRANSFER}
            ></ApprovalTokenMul>
          )
        }
      case NFTOperateStage.ACCEPT_OFFER:
        if (!data || !offerData) {
          return
        }
        return (
          <ApprovalAll
            changeStage={changeStageHandle}
            contract={data.contract ?? ''}
            curStage={stage}
            approvalTarget={ApprovalTarget.NFT_MARKETPLACE}
            isShowTip={true}
          ></ApprovalAll>
        )
    }
  }

  const renderOperate = () => {
    switch (operateType) {
      case NFTOperateStage.BUY:
        if (!data) {
          return
        }
        return (
          <Checkout
            changeStage={changeStageHandle}
            data={data}
            curStage={stage}
            confirm={checkoutConfirmHandle}
          ></Checkout>
        )
      case NFTOperateStage.ORDER:
        if (!data) {
          return
        }
        return (
          <AskOrder
            changeStage={changeStageHandle}
            data={data}
            curStage={stage}
            confirm={checkoutConfirmHandle}
          ></AskOrder>
        )
      case NFTOperateStage.OFFER:
        if (!data) {
          return
        }
        return (
          <Offer
            changeStage={changeStageHandle}
            data={data}
            curStage={stage}
            confirm={checkoutConfirmHandle}
            offerData={offerData}
          ></Offer>
        )
      case NFTOperateStage.TRANSFER:
        if (!data) {
          return
        }
        return (
          <Transfer
            changeStage={changeStageHandle}
            data={data}
            curStage={stage}
            confirm={checkoutConfirmHandle}
          ></Transfer>
        )
      case NFTOperateStage.MULTI_TRANSFER:
        return (
          <MulTransferToMulUser
            changeStage={changeStageHandle}
            list={list}
            curStage={stage}
            confirm={checkoutConfirmHandle}
          ></MulTransferToMulUser>
        )
      case NFTOperateStage.MULTI_TRANSFER_TOKENS:
        return (
          <MulTransferTokens
            changeStage={changeStageHandle}
            balances={balances ?? []}
            curStage={stage}
            confirm={checkoutConfirmHandle}
          ></MulTransferTokens>
        )
      case NFTOperateStage.ACCEPT_OFFER:
        if (!data || !offerData) {
          return
        }
        return (
          <AcceptOffer
            offerData={offerData}
            changeStage={changeStageHandle}
            data={data}
            curStage={stage}
            confirm={checkoutConfirmHandle}
          ></AcceptOffer>
        )
    }
  }

  const title = useMemo(() => {
    switch (stage) {
      case NFTItemStage.UNKNOWN:
        return i18n._(t`APPROVAL`)

      case NFTItemStage.APPROVED:
        return operateName

      case NFTItemStage.NOT_APPROVED:
        return i18n._(t`APPROVAL`)

      case NFTItemStage.PENDING:
        return i18n._(t`PENDING`)

      case NFTItemStage.CONFIRM:
        return i18n._(t`PENDING`)

      case NFTItemStage.SUCCESS:
        return i18n._(t`TRANSACTION SUCCESS`)

      default:
        return i18n._(t`LOADING`)
    }
  }, [i18n, operateName, stage])

  // modal的页面抽象为三个，approval，operate和success
  const pageStage = useMemo<NFTModalPageStage>(() => {
    switch (stage) {
      case NFTItemStage.UNKNOWN:
      case NFTItemStage.NOT_APPROVED:
      case NFTItemStage.PENDING:
        return NFTModalPageStage.APPROVAL

      case NFTItemStage.APPROVED:
      case NFTItemStage.CONFIRM:
      case NFTItemStage.FAILURE:
        return NFTModalPageStage.OPERATE

      case NFTItemStage.SUCCESS:
        return NFTModalPageStage.SUCCESS
      default:
        return NFTModalPageStage.APPROVAL
    }
  }, [stage])

  // approval -> service -> success
  const toBack = () => {
    switch (pageStage) {
      // approval页面没有返回, approval页面如果是已经approved的话，那就直接去到下一个页面
      case NFTModalPageStage.APPROVAL:
        return

      // 退回approval页面
      case NFTModalPageStage.OPERATE:
        setStage(NFTItemStage.UNKNOWN)
        break

      // 退回业务页面
      case NFTModalPageStage.SUCCESS:
        // setStage(NFTItemStage.APPROVED)
        break
      default:
        break
    }
  }

  const changeStageHandle = (curStage: NFTItemStage) => {
    setStage(curStage)
  }

  const [tx, setTx] = useState<TransactionReceipt | undefined>(undefined)

  const checkoutConfirmHandle = (successTx?: TransactionReceipt) => {
    if (successTx) {
      setTx(successTx)
    }
    confirm()
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        {operateType === NFTOperateStage.OFFER ||
        pageStage == NFTModalPageStage.APPROVAL ||
        pageStage == NFTModalPageStage.SUCCESS ? (
          <></>
        ) : (
          <ArrowNarrowLeftIcon className="w-6 cursor-pointer" onClick={toBack}></ArrowNarrowLeftIcon>
        )}
        <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-base-content">
          {title}
        </Dialog.Title>
        <XIcon className="w-6 cursor-pointer" onClick={close}></XIcon>
      </div>
      <div className="pt-8 pb-8">
        {pageStage == NFTModalPageStage.APPROVAL ? <>{renderApproval()}</> : <></>}
        {pageStage == NFTModalPageStage.OPERATE ? <>{renderOperate()}</> : <></>}
        {pageStage == NFTModalPageStage.SUCCESS ? (
          <Success changeStage={changeStageHandle} data={data} curStage={stage} tx={tx} close={close}></Success>
        ) : (
          <></>
        )}
      </div>
      {/* <div>
        <p>debug info</p>
        <p>{pageStage}</p>
        <p>{stage}</p>
      </div> */}
    </>
  )
}

export default ActionsContent
