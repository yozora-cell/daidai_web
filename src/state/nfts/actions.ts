import { createAction } from '@reduxjs/toolkit'
import { NFTItemStage } from 'app/types/daidai'

export const setShowOnlyOnSale = createAction<boolean>('nfts/setShowOnlyOnSale')
export const setCollection = createAction<string>('nfts/setCollection')
export const setFiltersOrdering = createAction<{ field: string; direction: 'asc' | 'desc' }>('nfts/setFiltersOrdering')
export const setCleanup = createAction('nfts/setCleanup')
export const setCategorys = createAction<string>('nfts/setCategorys')
export const initApprovalStage = createAction('nfts/initApprovalStage')
export const updateApprovalStage = createAction<{ index: number; stage: NFTItemStage }>('nfts/updateApprovalStage')
export const initTokenApprovalStage = createAction('nfts/initTokenApprovalStage')
export const updateTokenApprovalStage = createAction<{ index: number; stage: NFTItemStage }>(
  'nfts/updateTokenApprovalStage'
)
