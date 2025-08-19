import gql from 'graphql-tag'

// get_user_draw_counts
export const getUserDrawCountsQuery = gql`
  query ($account: String!) {
    drawer(id: $account) {
      count
    }
  }
`

// get_user_draw_by_tx
export const getUserDrawByTxQuery = gql`
  query ($account: String!, $tx: String!) {
    draws(where: { receiver: $account, txHash: $tx }) {
      slotType
      asset
      idOrAmount
    }
  }
`

export const getUserDrawQuery = gql`
query ($account: String!) {
  draws(where: { receiver: $account }) {
    slotType
    asset
    idOrAmount
  }
}
`
