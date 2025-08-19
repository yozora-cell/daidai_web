import { AppState } from 'app/state'
import { useSelector } from 'react-redux'

import { NftFilter } from './types'

export const useGetNftShowOnlyOnSale = () => {
  const filter: NftFilter = useSelector((state: AppState) => state.nfts.filters)
  return filter.showOnlyOnSale
}
export const useGetOrdering = () => {
  const filter: NftFilter = useSelector((state: AppState) => state.nfts.filters)
  return filter.ordering
}
export const useGetCollection = () => {
  const filter: NftFilter = useSelector((state: AppState) => state.nfts.filters)
  return filter.collection
}
export const useGetCategorys = () => {
  const filter: NftFilter = useSelector((state: AppState) => state.nfts.filters)
  return filter.categorys
}
export const useGetApprovalStageSet = () => {
  const filter: NftFilter = useSelector((state: AppState) => state.nfts.filters)
  return filter.approvalStageSet
}

export const useGetTokenApprovalStageSet = () => {
  const filter: NftFilter = useSelector((state: AppState) => state.nfts.filters)
  return filter.tokenApprovalStageSet
}
