import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
      }
    }
  | {
      listUpdate: {
        listUrl: string
        oldList: TokenList
        newList: TokenList
        auto: boolean
      }
    }
  | {
      alert: {
        title?: string
        message: string
        success: boolean
      }
    }

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  DELEGATE,
  VOTE,
  LANGUAGE,
  NETWORK,
}

export const updateBlockNumber = createAction<{
  chainId: number
  blockNumber: number
}>('application/updateBlockNumber')
export const updateBlockTimestamp = createAction<{
  chainId: number
  blockTimestamp: number
}>('application/updateBlockTimestamp')
export const updateChainId = createAction<{ chainId: number }>('application/updateChainId')
export const setChainConnectivityWarning = createAction<{ chainConnectivityWarning: boolean }>(
  'application/setChainConnectivityWarning'
)
export const setImplements3085 = createAction<{ implements3085: boolean }>('application/setImplements3085')
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
export const addPopup = createAction<{
  key?: string
  removeAfterMs?: number | null
  content: PopupContent
}>('application/addPopup')
export const removePopup = createAction<{ key: string }>('application/removePopup')
export const setKashiApprovalPending = createAction<string>('application/setKashiApprovalPending')
export const updateAccount = createAction<{ account: string | null | undefined }>('application/updateAccount')
export const setIsActionsOpen = createAction<{ isActionsOpen: boolean; key: string }>('application/setIsActionsOpen')
