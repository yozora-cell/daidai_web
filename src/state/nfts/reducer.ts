import { createReducer } from '@reduxjs/toolkit'
import { NFTItemStage } from 'app/types/daidai'

import {
  initApprovalStage,
  initTokenApprovalStage,
  setCategorys,
  setCleanup,
  setCollection,
  setFiltersOrdering,
  setShowOnlyOnSale,
  updateApprovalStage,
  updateTokenApprovalStage,
} from './actions'
import { NftFilter, State } from './types'

const initialNftFilterState: NftFilter = {
  collection: '',
  showOnlyOnSale: false,
  ordering: {
    field: 'timestamp',
    direction: 'desc',
  },
  categorys: '',
  approvalStageSet: [],
  tokenApprovalStageSet: [],
}

const initialState: State = {
  filters: initialNftFilterState,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setShowOnlyOnSale, (state, action) => {
      state.filters.showOnlyOnSale = action.payload
    })
    .addCase(setCollection, (state, action) => {
      state.filters.collection = action.payload
    })
    .addCase(setFiltersOrdering, (state, action) => {
      state.filters.ordering.field = action.payload.field
      state.filters.ordering.direction = action.payload.direction
    })
    .addCase(setCleanup, (state, action) => {
      state.filters.showOnlyOnSale = initialNftFilterState.showOnlyOnSale
      state.filters.ordering.field = initialNftFilterState.ordering.field
      state.filters.ordering.direction = initialNftFilterState.ordering.direction
      state.filters.collection = initialNftFilterState.collection
      state.filters.categorys = initialNftFilterState.categorys
    })
    .addCase(setCategorys, (state, action) => {
      state.filters.categorys = action.payload
    })
    .addCase(initApprovalStage, (state, action) => {
      state.filters.approvalStageSet = initialNftFilterState.approvalStageSet
    })
    .addCase(updateApprovalStage, (state, action) => {
      const copy = [...state.filters.approvalStageSet]
      if (action.payload.stage == NFTItemStage.APPROVED) {
        copy.push(action.payload.index)
      }
      state.filters.approvalStageSet = copy
    })
    .addCase(initTokenApprovalStage, (state, action) => {
      state.filters.tokenApprovalStageSet = initialNftFilterState.tokenApprovalStageSet
    })
    .addCase(updateTokenApprovalStage, (state, action) => {
      const copy = [...state.filters.tokenApprovalStageSet]
      if (action.payload.stage == NFTItemStage.APPROVED) {
        copy.push(action.payload.index)
      }
      state.filters.tokenApprovalStageSet = copy
    })
)
