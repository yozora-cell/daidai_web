import { useGetCategorys, useGetCollection, useGetNftShowOnlyOnSale, useGetOrdering } from 'app/state/nfts/hooks'
import { Daytype, NameValues } from 'app/types/daidai'

export function nonce() {
  return 'api/getNonce'
}

export function collectionsIno(page: number, limit: number, chainId: number) {
  const key = `collections/ino?limit=${limit}&page=${page}&chainId=${chainId}`
  return key
}

export function explorer(chainId: number) {
  return `explorer?chainId=${chainId}`
}

export function NFTDetail(address: string | undefined, tokenId: string | undefined, chainId: number | null) {
  const key = `collections/${address}/nfts/${tokenId}?chainId=${chainId}`
  return key
}

export function collection(address: string | undefined) {
  // const key = `collections/${chainId}/${address}`
  const key = `collections/${address}`
  return key
}

export function NFTFilterdStatic(
  page: number,
  limit: number,
  chainId: number,
  showOnlyNftsOnSale: boolean,
  field: string,
  direction: string,
  categorys: string,
  collection: string | undefined
) {
  const orderby = `orderby[${field}]=${direction}`

  const collectionPart = collection ? `&collection=${collection}` : ''

  const categoryPart = categorys ? `&categorys=${categorys}` : ''
  const key = `nfts/filtered?page=${page}&limit=${limit}&chainId=${chainId}${collectionPart}${categoryPart}&onsale=${
    showOnlyNftsOnSale ? '1' : ''
  }&${orderby}`
  return key
}

export function NFTFilterd(page: number, limit: number, chainId: number, collection?: string) {
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale()
  const ordering = useGetOrdering()
  // 以collection优先
  const storeCollection = useGetCollection()
  const categorys = useGetCategorys()
  return NFTFilterdStatic(
    page,
    limit,
    chainId,
    showOnlyNftsOnSale,
    ordering.field,
    ordering.direction,
    categorys,
    collection ? collection : storeCollection
  )
}

export function profileCollectibles(account: string) {
  const key = `profile/collectibles/${account}`
  return key
}

export function NFTTransactions(address: string, tokenId: number, page: number, limit: number) {
  const key = `collections/${address}/nfts/${tokenId}/transactions?page=${page}&limit=${limit}`
  return key
}

export function profileTransactions(address: string, page: number, limit: number) {
  const key = `profile/transactions/${address}?page=${page}&limit=${limit}`
  return key
}

export function profileOnsale(address: string, page: number, limit: number) {
  const key = `profile/onsale/${address}?page=${page}&limit=${limit}`
  return key
}

export function collections(page: number, limit: number, isIno?: string) {
  const inoPart = isIno != undefined ? `&isIno=${isIno}` : ''
  const key = `collections?limit=${limit}&page=${page}${inoPart}`
  return key
}

export function collectionTrades(
  page: number,
  limit: number,
  daytype: Daytype,
  orderField: string,
  orderDirection: string,
  chainId?: number
) {
  const daytypePart = `&daytype=${daytype}`
  const orderbyPart = `&orderby[${orderField}]=${orderDirection}`
  const chainIdPart = chainId ? `&chainId=${chainId}` : ''
  const key = `statistics/collectionTrades?limit=${limit}&page=${page}${daytypePart}${chainIdPart}${orderbyPart}`
  return key
}

export function profileTrades(
  page: number,
  limit: number,
  daytype: Daytype,
  orderField: string,
  orderDirection: string,
  chainId?: number
) {
  const daytypePart = `&daytype=${daytype}`
  const orderbyPart = `&orderby[${orderField}]=${orderDirection}`
  const chainIdPart = chainId ? `&chainId=${chainId}` : ''
  const key = `statistics/profileTrades?limit=${limit}&page=${page}${daytypePart}${chainIdPart}${orderbyPart}`
  return key
}

export function refreshmetadata(chainId: number, address: string, tokenId: number) {
  const key = `nfts/refreshmetadata/${chainId}/${address}/${tokenId}`
  return key
}

export function affiliate(connectAddress?: string | null | undefined) {
  const key = 'affiliate'
  if (connectAddress) {
    return `${key}?connectAddress=${connectAddress}`
  }
  return key
}

export function affiliateHistory(
  page: number,
  limit: number,
  status?: string,
  connectAddress?: string | null | undefined
) {
  const statusPart = status != undefined ? `&status=${status}` : ''
  const addressPart = connectAddress ? `&connectAddress=${connectAddress}` : ''
  const key = `affiliate-history?limit=${limit}&page=${page}${statusPart}${addressPart}`
  return key
}

export function affiliateHistoryNotWithdrawAmount(connectAddress?: string | null | undefined) {
  const key = 'affiliate-history/notWithdrawAmount'
  if (connectAddress) {
    return `${key}?connectAddress=${connectAddress}`
  }
  return key
}

export function affiliateHistoryWithdrawApply() {
  return 'affiliate-history/withdrawApply'
}

export function category() {
  return 'category'
}

export function auth() {
  return 'sign/auth'
}

export function nftsFind() {
  return 'nfts/find'
}

export function tokensByChainId(chainId: number) {
  return `tokens/chainId/${chainId}`
}

export function profile(account: string) {
  return `profile/${account}`
}

export function whiteList(account: string, collection: string) {
  return `white-list/${collection}/${account}`
}

const mediumId = process.env.NEXT_PUBLIC_MEDIUM_ID

export function medium() {
  return `medium/${mediumId}`
}

export function posts() {
  return `posts?published=1`
}

export function postsById(id: string) {
  return `posts/${id}`
}

export function ticket(connectAddress?: string | null | undefined) {
  const key = 'gacha/user/ticket'
  if (connectAddress) {
    return `${key}?connectAddress=${connectAddress}`
  }
  return key
}

export function search(
  query: string,
  page: number,
  limit: number,
  category?: string[],
  currentAskToken?: string[],
  currentAskPriceMin?: string,
  currentAskPriceMax?: string
) {
  let param = `page=${page}&limit=${limit}&search[name]=${encodeURIComponent(
    query
  )}&search[description]=${encodeURIComponent(query)}`
  if (category && category.length > 0) {
    category.forEach((item, index) => {
      param += `&search[category][${index}]=${item}`
    })
  }
  if (currentAskToken && currentAskToken.length > 0) {
    currentAskToken.forEach((item, index) => {
      param += `&search[currentAskToken][${index}]=${item}`
    })
  }
  if (currentAskPriceMin !== undefined && currentAskPriceMin !== '') {
    param += `&search[currentAskPrice][min]=${currentAskPriceMin}`
  }
  if (currentAskPriceMax !== undefined && currentAskPriceMax !== '') {
    param += `&search[currentAskPrice][max]=${currentAskPriceMax}`
  }
  return `search?${param}`
}

export function searchByCollection(
  collection: string,
  page: number,
  limit: number,
  currentAskToken?: string[],
  currentAskPriceMin?: string,
  currentAskPriceMax?: string,
  props?: NameValues[]
) {
  let param = `page=${page}&limit=${limit}&search[sort][0][field]=tokenId&search[sort][0][order]=asc`
  if (currentAskToken && currentAskToken.length > 0) {
    currentAskToken.forEach((item, index) => {
      param += `&search[currentAskToken][${index}]=${item}`
    })
  }
  if (currentAskPriceMin !== undefined && currentAskPriceMin !== '') {
    param += `&search[currentAskPrice][min]=${currentAskPriceMin}`
  }
  if (currentAskPriceMax !== undefined && currentAskPriceMax !== '') {
    param += `&search[currentAskPrice][max]=${currentAskPriceMax}`
  }
  if (props && props.length > 0) {
    //
    const list: { name: string; values: string[] }[] = []
    const set = new Set<string>()
    props.forEach((prop) => {
      if (set.has(prop.name)) {
        const find = list.find((item) => {
          return item.name === prop.name
        })
        find?.values.push(prop.values)
      } else {
        set.add(prop.name)
        list.push({
          name: prop.name,
          values: [prop.values],
        })
      }
    })
    // console.log('change', props, list)
    param += `&search[props]=${JSON.stringify(list)}`
  }
  return `search/${collection}?${param}`
}

export function attributes(collection: string) {
  return `collections/${collection}/attributes`
}

export function recommend(chainId: number) {
  return `explorer/recommend?chainId=${chainId}`
}

// TODO: 要改为分页的
export function buyOrderList({
  chainId,
  collection,
  tokenId,
}: {
  chainId: number
  collection: string
  tokenId: number
}) {
  return `orderBook/buyOrder/${chainId}/${collection}/${tokenId}`
}

export function buyOrderByAccount({
  chainId,
  collection,
  tokenId,
  address,
}: {
  chainId: number
  collection: string
  tokenId: number
  address: String
}) {
  return `orderBook/buyOrder/${chainId}/${collection}/${tokenId}/${address}`
}
