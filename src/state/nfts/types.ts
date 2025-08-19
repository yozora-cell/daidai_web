export interface NftFilter {
  collection: string
  showOnlyOnSale: boolean
  ordering: {
    field: string
    direction: 'asc' | 'desc'
  }
  categorys: string
  approvalStageSet: number[]
  tokenApprovalStageSet: number[]
}

export interface State {
  filters: NftFilter
}
