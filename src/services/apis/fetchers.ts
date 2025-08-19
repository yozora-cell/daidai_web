import { ChainId } from '@sushiswap/core-sdk'
import { defaultChainId } from 'app/config/default_chainid'
import { affiliate, affiliateHistoryWithdrawApply, auth, nftsFind, tokensByChainId } from 'app/services/apis/keys'
// import store from 'app/state'
import {
  Account,
  Affiliate,
  AffiliateHistory,
  AttributeData,
  BASE_INO_OR_COLLECTION,
  Category,
  Collection,
  CollectionTokenIds,
  CreatorFeeSignature,
  GachaSignature,
  History,
  IndexData,
  INO,
  ListingDetail,
  Medium,
  NFTDetail,
  NFTListPage,
  NFTMetadata,
  OfferDetail,
  OfferItem,
  Posts,
  Signature,
  TokenSys,
  Trade,
  UserTrade,
} from 'app/types/daidai'
import axios from 'axios'
import qs from 'qs'

export const VERSION = 1
// export const API_BASE = `${process.env.NEXT_PUBLIC_WEB_API_DOMAIN ?? ''}/api/v${VERSION}`
export const API_BASE = `${
  defaultChainId == ChainId.BSC && typeof window !== 'undefined' && !!window.location
    ? new URL(window.location.href).origin
    : process.env.NEXT_PUBLIC_WEB_API_DOMAIN
  // defaultChainId == ChainId.BSC ? new URL(window.location.href).origin : "http://127.0.0.1:3010"
}/api/v${VERSION}`
// console.log('API_BASE', API_BASE, defaultChainId)
export const HEADER_ACCOUNT_CONFIG = 'X-CONNECT-ADDRESS'
export const HEADER_CHAIN_ID = 'X-CHAIN-ID'

export const contentType = {
  json: { 'content-type': 'application/json; charset=UTF-8' },
  formData: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
}

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

// 把嵌套的 params 序列化成 `a[b]=c` 的格式
axiosInstance.interceptors.request.use((config) => {
  config.paramsSerializer = (params) =>
    qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false,
    })
  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    const data = response.data
    if (data.code !== 1) {
      return Promise.reject(data)
    }
    return { ...response, data: data.data }
  },
  (error) => {
    // Do something with response error
    // if (error.response.status === 401) {
    // 这里逻辑改为只有调用checkAuth的时候catch 401error，才执行清空token，其他api就不需要
    // 401 unauthorized 清空token
    // const account = axiosInstance.defaults.headers.common[HEADER_ACCOUNT_CONFIG]
    // store.dispatch({ type: 'user/updateAuthToken', payload: { account: account, authToken: '' } })
    // }
    return Promise.reject(error)
  }
)

export async function getNonce(): Promise<number> {
  const api = 'sign/nonce'
  const response = await axiosInstance.get(api)
  return response.data
}

export async function verifySignature(nonce: number, signature: string): Promise<string | null> {
  const api = 'sign/verify'
  const response = await axiosInstance.post(api, { nonce, signature })

  const result = response.data
  if (result) {
    // 不写在updater中，是因为updaterd执行顺序比较靠后，会先返回无token的axios实例
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${result}`
  }
  return result
}

/**
 * 获取用户信息
 * @param address
 * @returns
 */
export async function getProfile(address?: string): Promise<Account> {
  const api = address ? `profile/${address}` : 'profile'
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getProfileAccount(api: string): Promise<Account> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function updateProfile(params: FormData) {
  const api = 'profile'
  const response = await axiosInstance.put(api, params, {
    headers: {
      ...contentType.formData,
    },
  })
  return response.data
}

export async function getCollectionsIno(api: string): Promise<{ data: INO[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getExplorer(api: string): Promise<IndexData> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getNFTDetail(api: string): Promise<NFTDetail> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getCollection(api: string): Promise<BASE_INO_OR_COLLECTION> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getNFTFilterd(api: string): Promise<NFTListPage> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getProfileCollectibles(api: string): Promise<CollectionTokenIds> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getNFTTransactions(api: string): Promise<{ data: History[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getProfileTransactions(api: string): Promise<{ data: History[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getProfileOnsale(api: string): Promise<NFTListPage> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getCollections(api: string): Promise<{ data: BASE_INO_OR_COLLECTION[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getCollectionTrades(api: string): Promise<{ data: Trade[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getProfileTrades(api: string): Promise<{ data: UserTrade[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getRefreshmetadata(api: string): Promise<NFTMetadata> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getAffiliate(api: string): Promise<Affiliate> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function updateUpReferer(upRefererId: string): Promise<Affiliate> {
  const response = await axiosInstance.put(affiliate(), {
    upRefererId,
  })

  const result = response.data
  return result
}

export async function getAffiliateHistory(api: string): Promise<{
  count: number
  data: AffiliateHistory[]
}> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getTotalNotWithdrawAmount(api: string): Promise<string> {
  const response = await axiosInstance.get(api)

  const result = response.data
  return result
}

export async function withdrawApply(): Promise<AffiliateHistory> {
  const response = await axiosInstance.put(affiliateHistoryWithdrawApply())

  const result = response.data
  return result
}

export async function getCategory(api: string): Promise<{ data: Category[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function checkAuth() {
  const api = auth()
  const response = await axiosInstance.get(api)
  return response.data
}

// [collection-tokenId, collection2-tokenId2]
export async function postNftsFind(collectionIds: string[]): Promise<NFTDetail[]> {
  const api = nftsFind()
  const response = await axiosInstance.post(api, collectionIds)
  return response.data
}

export async function getTokensByChainId(chainId: number): Promise<TokenSys[]> {
  const api = tokensByChainId(chainId)
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getMedium(api: string): Promise<Medium[]> {
  const response = await axiosInstance.get(api)
  return response.data[0].data.userResult.homepagePostsConnection.posts
}

export async function getSignature(api: string): Promise<Signature> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getPosts(api: string): Promise<Posts[]> {
  const response = await axiosInstance.get(api)
  return response.data.data
}

export async function getPostsById(api: string): Promise<Posts> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getTicket(api: string): Promise<{ data: GachaSignature[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getSearch(api: string): Promise<{ data: NFTDetail[]; count: number; collections: Collection[] }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getSearchByCollection(api: string): Promise<{ data: NFTDetail[]; count: number }> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getAttributes(api: string): Promise<AttributeData> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function createSellOrder({
  chainId,
  collection,
  tokenId,
  price,
  payToken,
  signature,
  expiration,
}: {
  chainId: number
  collection: string
  tokenId: number
  price: string
  payToken: string
  signature: string
  expiration: number
}): Promise<number> {
  const api = 'orderBook/createSellOrder'
  const response = await axiosInstance.post(api, {
    chainId: String(chainId),
    collection,
    tokenId: String(tokenId),
    price,
    payToken,
    signature,
    expiration,
  })
  return response.data
}

export async function updSellOrder({
  chainId,
  collection,
  tokenId,
  price,
  payToken,
  signature,
  expiration,
  nonce,
}: {
  chainId: number
  collection: string
  tokenId: number
  price: string
  payToken: string
  signature: string
  expiration: number
  nonce: string
}): Promise<number> {
  const api = 'orderBook/updSellOrder'
  const response = await axiosInstance.post(api, {
    chainId: String(chainId),
    collection,
    tokenId: String(tokenId),
    price,
    payToken,
    signature,
    expiration,
    nonce: Number(nonce),
  })
  return response.data
}

export async function delSellOrder({
  chainId,
  collection,
  tokenId,
  expiration,
}: {
  chainId: number
  collection: string
  tokenId: number
  expiration: number
}): Promise<number> {
  const api = 'orderBook/delSellOrder'
  const response = await axiosInstance.post(api, {
    chainId: String(chainId),
    collection,
    tokenId: String(tokenId),
    expiration,
    status: 2,
  })
  return response.data
}

export async function createBuyOrder({
  chainId,
  collection,
  tokenId,
  price,
  payToken,
  signature,
  expiration,
}: {
  chainId: number
  collection: string
  tokenId: number
  price: string
  payToken: string
  signature: string
  expiration: number
}): Promise<number> {
  const api = 'orderBook/createBuyOrder'
  const response = await axiosInstance.post(api, {
    chainId: String(chainId),
    collection,
    tokenId: String(tokenId),
    price,
    payToken,
    signature,
    expiration,
  })
  return response.data
}

export async function updBuyOrder({
  chainId,
  collection,
  tokenId,
  price,
  payToken,
  signature,
  expiration,
  nonce,
}: {
  chainId: number
  collection: string
  tokenId: number
  price: string
  payToken: string
  signature: string
  expiration: number
  nonce: string
}): Promise<number> {
  const api = 'orderBook/updBuyOrder'
  const response = await axiosInstance.post(api, {
    chainId: String(chainId),
    collection,
    tokenId: String(tokenId),
    price,
    payToken,
    signature,
    expiration,
    nonce: Number(nonce),
  })
  return response.data
}

export async function delBuyOrder({
  chainId,
  collection,
  tokenId,
  expiration,
}: {
  chainId: number
  collection: string
  tokenId: number
  expiration: number
}): Promise<number> {
  const api = 'orderBook/delBuyOrder'
  const response = await axiosInstance.post(api, {
    chainId: String(chainId),
    collection,
    tokenId: String(tokenId),
    expiration,
    status: 2,
  })
  return response.data
}

export async function getBuyOrderList(api: string): Promise<OfferItem[]> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getBuyOrderByAccount(api: string): Promise<OfferItem | null> {
  const response = await axiosInstance.get(api)
  return response.data
}

export async function getSellingSignature({
  chainId,
  collection,
  tokenId,
}: {
  chainId: number
  collection: string
  tokenId: number
}): Promise<ListingDetail> {
  const response = await axiosInstance.get(`orderBook/sellOrder/${chainId}/${collection}/${tokenId}`)
  return response.data
}

export async function getOfferSignature({
  chainId,
  collection,
  tokenId,
  address,
}: {
  chainId: number
  collection: string
  tokenId: number
  address: string
}): Promise<OfferDetail> {
  const response = await axiosInstance.get(`orderBook/buyOrder/${chainId}/${collection}/${tokenId}/${address}`)
  return response.data
}

export async function getCreatorFeeSignature({
  chainId,
  collection,
}: {
  chainId: number
  collection: string
}): Promise<CreatorFeeSignature> {
  const response = await axiosInstance.get(`creatorFee/feeSign/${chainId}/${collection}`)
  return response.data
}

export async function makeExchange({
  txId,
  chainId,
  collection,
  address,
  tokenId,
  price,
  payToken,
  type,
}: {
  txId: string
  chainId: string
  collection: string
  address: string
  tokenId: string
  price: string
  payToken: string
  // "0":sellList "1":buyList
  type: string
}) {
  const response = await axiosInstance.post(`orderBook/makeExchange`, {
    txId,
    chainId,
    collection,
    address,
    tokenId,
    price,
    payToken,
    type,
  })
  return response.data
}

export async function getRecommend(api: string): Promise<NFTDetail[][]> {
  const response = await axiosInstance.get(api)
  return response.data
}
