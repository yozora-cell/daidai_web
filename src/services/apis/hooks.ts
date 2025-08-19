import { defaultChainId } from 'app/config/default_chainid'
import { useChainId } from 'app/state/application/hooks'
import { Daytype, NameValues } from 'app/types/daidai'
import useSWR from 'swr'

import {
  getAffiliate,
  getAffiliateHistory,
  getAttributes,
  getBuyOrderByAccount,
  getBuyOrderList,
  getCategory,
  getCollection,
  getCollections,
  getCollectionsIno,
  getCollectionTrades,
  getExplorer,
  getMedium,
  getNFTDetail,
  getNFTFilterd,
  getNFTTransactions,
  getPosts,
  getPostsById,
  getProfileAccount,
  // getNonce,
  getProfileCollectibles,
  getProfileOnsale,
  getProfileTrades,
  getProfileTransactions,
  getRecommend,
  getSearch,
  getSearchByCollection,
  getTicket,
  getTotalNotWithdrawAmount,
} from './fetchers'
import {
  affiliate,
  affiliateHistory,
  affiliateHistoryNotWithdrawAmount,
  attributes,
  buyOrderByAccount,
  buyOrderList,
  category,
  collection,
  collections,
  collectionsIno,
  collectionTrades,
  explorer,
  medium,
  NFTDetail,
  NFTFilterd,
  NFTFilterdStatic,
  NFTTransactions,
  posts,
  postsById,
  profile,
  // nonce,
  profileCollectibles,
  profileOnsale,
  profileTrades,
  profileTransactions,
  recommend,
  search,
  searchByCollection,
  ticket,
} from './keys'

// export function useGetNonce() {
//   const { data } = useSWR(nonce(), getNonce)
//   return data
// }

export function useCollectionsIno(page: number, limit: number) {
  const chainId = useChainId()
  const { data, error } = useSWR(chainId ? collectionsIno(page, limit, chainId) : null, getCollectionsIno)
  return { data, error }
}

export function useExplorer() {
  const chainId = useChainId()
  const { data, error, isValidating } = useSWR(chainId ? explorer(chainId) : null, getExplorer)
  return { data, error, isValidating }
}

// chainId
export function useNFTDetail(address: string | undefined, tokenId: string | undefined, chainId: number | null) {
  const key = NFTDetail(address, tokenId, chainId)
  // const chainId = useChainId()
  // const { data, error } = useSWR(chainId ? key : null, getNFTDetail)
  const { data, error } = useSWR(key, getNFTDetail)
  return { data, error }
}

export function useCollection(address: string | undefined) {
  // const key = `collections/${chainId}/${address}`
  const chainId = useChainId()
  const key = collection(address)
  const { data, error } = useSWR(chainId ? key : null, getCollection)
  return { data, error }
}

export function useNFTFilterdStatic(
  page: number,
  limit: number,
  showOnlyNftsOnSale: boolean,
  field: string,
  direction: string,
  categorys: string,
  collection: string | undefined
) {
  const systemChainId = useChainId()
  const key = NFTFilterdStatic(
    page,
    limit,
    systemChainId ?? defaultChainId,
    showOnlyNftsOnSale,
    field,
    direction,
    categorys,
    collection
  )
  const { data, error, isValidating } = useSWR(systemChainId ? key : null, getNFTFilterd)
  return { data, error, isValidating }
}

export function useNFTFilterd(page: number, limit: number, chainId: number, collection?: string) {
  const systemChainId = useChainId()
  const key = NFTFilterd(page, limit, chainId, collection)
  const { data, error } = useSWR(systemChainId ? key : null, getNFTFilterd)
  return { data, error }
}

export function useProfileCollectibles(account: string) {
  const chainId = useChainId()
  const key = profileCollectibles(account)
  const { data, error } = useSWR(chainId ? key : null, getProfileCollectibles)
  return data
}

export function useNFTTransactions(address: string, tokenId: number, page: number, limit: number) {
  const chainId = useChainId()
  const key = NFTTransactions(address, tokenId, page, limit)
  const { data, error } = useSWR(chainId ? key : null, getNFTTransactions)
  return { data: data, error: error }
}

export function useProfileTransactions(address: string, page: number, limit: number) {
  const chainId = useChainId()
  const key = profileTransactions(address, page, limit)
  const { data, error } = useSWR(chainId ? key : null, getProfileTransactions)
  return { history: data, error: error }
}

export function useProfileOnsale(address: string, page: number, limit: number) {
  const chainId = useChainId()
  const key = profileOnsale(address, page, limit)
  const { data, error, isValidating } = useSWR(chainId ? key : null, getProfileOnsale)
  return { data: data, error: error, isValidating: isValidating }
}

export function useCollections(page: number, limit: number, isIno?: string) {
  const chainId = useChainId()
  const key = collections(page, limit, isIno)
  const { data, error } = useSWR(chainId ? key : null, getCollections)
  return { data: data, error: error }
}

export function useCollectionTrades(
  page: number,
  limit: number,
  daytype: Daytype,
  orderField: string,
  orderDirection: string,
  chainId?: number
) {
  const systemChainId = useChainId()
  const key = collectionTrades(page, limit, daytype, orderField, orderDirection, chainId)
  const { data, error } = useSWR(systemChainId ? key : null, getCollectionTrades)
  return { data: data, error: error }
}

export function useProfileTrades(
  page: number,
  limit: number,
  daytype: Daytype,
  orderField: string,
  orderDirection: string,
  chainId?: number
) {
  const systemChainId = useChainId()
  const key = profileTrades(page, limit, daytype, orderField, orderDirection, chainId)
  const { data, error } = useSWR(systemChainId ? key : null, getProfileTrades)
  return { data: data, error: error }
}

// auth
export function useAffiliate(connectAddress: string | null | undefined) {
  const chainId = useChainId()
  const key = affiliate(connectAddress)
  const { data, error } = useSWR(chainId ? key : null, getAffiliate)
  return { data: data, error: error }
}

// auth
export function useAffiliateHistory(
  page: number,
  limit: number,
  connectAddress: string | null | undefined,
  status?: string
) {
  const chainId = useChainId()
  const key = affiliateHistory(page, limit, status, connectAddress)
  const { data, error } = useSWR(chainId ? key : null, getAffiliateHistory)
  return { data: data, error: error }
}

// auth
export function useTotalNotWithdrawAmount(connectAddress: string | undefined | null) {
  const chainId = useChainId()
  const key = affiliateHistoryNotWithdrawAmount(connectAddress)
  const { data, error } = useSWR(chainId ? key : null, getTotalNotWithdrawAmount)
  return { data: data, error: error }
}

export function useCategory(page: number, limit: number) {
  const chainId = useChainId()
  const key = category()
  const { data, error } = useSWR(chainId ? key : null, getCategory)
  return { data: data, error: error }
}

export function useProfile(account: string | null | undefined) {
  return useSWR(account ? profile(account) : null, getProfileAccount)
}

export function useMedium() {
  return useSWR(medium(), getMedium)
}

export function usePosts() {
  return useSWR(posts(), getPosts)
}

export function usePostsById(id: string) {
  return useSWR(postsById(id), getPostsById)
}

export function useTicket(account: string | null | undefined) {
  return useSWR(account ? ticket(account) : null, getTicket)
}

export function useSearch(
  query: string,
  page: number,
  limit: number,
  category?: string[],
  currentAskToken?: string[],
  currentAskPriceMin?: string,
  currentAskPriceMax?: string
) {
  const key = search(query, page, limit, category, currentAskToken, currentAskPriceMin, currentAskPriceMax)
  const { data, error, isValidating } = useSWR(key, getSearch)
  return { data: data, error: error, isValidating: isValidating }
}

export function useSearchByCollection(
  collection: string,
  page: number,
  limit: number,
  currentAskToken?: string[],
  currentAskPriceMin?: string,
  currentAskPriceMax?: string,
  props?: NameValues[]
) {
  const key = searchByCollection(
    collection,
    page,
    limit,
    currentAskToken,
    currentAskPriceMin,
    currentAskPriceMax,
    props
  )
  const { data, error, isValidating } = useSWR(collection !== '' ? key : null, getSearchByCollection)
  return { data: data, error: error, isValidating: isValidating }
}

export function useAttributes(collection: string) {
  const key = attributes(collection)
  const { data, error, isValidating } = useSWR(collection !== '' ? key : null, getAttributes)
  return { data: data, error: error, isValidating: isValidating }
}

export function useRecommend() {
  const chainId = useChainId()
  const { data, error, isValidating } = useSWR(chainId ? recommend(chainId) : null, getRecommend)
  return { data: data, error: error, isValidating: isValidating }
}

export function useBuyOrderList(collection: string, tokenId: number) {
  const chainId = useChainId()
  const { data, error } = useSWR(
    chainId
      ? buyOrderList({
          chainId: chainId,
          collection: collection,
          tokenId: tokenId,
        })
      : null,
    getBuyOrderList
  )
  return { data: data, error: error }
}

export function useBuyOrderByAccount(collection: string, tokenId: number, address: string) {
  const chainId = useChainId()
  const { data, error } = useSWR(
    chainId
      ? buyOrderByAccount({
          chainId: chainId,
          collection: collection,
          tokenId: tokenId,
          address: address,
        })
      : null,
    getBuyOrderByAccount
  )
  return { data: data, error: error }
}
