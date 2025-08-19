import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'

export interface Plan {
  token: Currency
  price: CurrencyAmount<Currency>
  index: number
}

export interface Socials {
  name: string
  url: string
}

export interface BASE_INO_OR_COLLECTION {
  CategoryCollections?: CategoryWrap[]
  address: string
  avatar?: string
  banner?: string
  chainId: number | string
  createdAt?: string
  description?: string
  floorPrice?: number
  id?: number
  isINO?: 1 | 0
  length?: number
  name?: string
  owner: string
  plans?: Plan[]
  startTimestamp?: number
  status?: number
  symbol?: string
  totalSupply?: number
  updatedAt?: string
  verified?: string
  is_verified?: number
  cover?: string
  collectionId?: string
  hot?: number
  listed?: number
  totalCount?: number
  totalTrades?: number
  totalVolumeETH?: number
  isFreeMint?: boolean
  socials?: {
    website?: Socials
    twitter?: Socials
    medium?: Socials
    discord?: Socials
  }
}

export interface INO extends BASE_INO_OR_COLLECTION {
  // isINO: 1
  preSaleTimeStamp?: number
  preSaleDiscount?: number
}

export interface Collection extends BASE_INO_OR_COLLECTION {
  // isINO: 0
}

export interface Attribute {
  // [propName: string]: string
  trait_type: string
  value: string
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes?: Attribute[]
}

export interface CategoryWrap {
  category: Category
}

export interface SimpleCollection {
  CategoryCollections: CategoryWrap[]
  address: string
  avatar: string
  banner: string
  chainId: string
  cover: string
  description: string
  id: number
  name: string
  owner: string
  symbol: string
  verified: string
  is_verified: number
}

export interface NFT {
  chainId?: string | number
  contract?: string
  tokenId?: string | number
  image?: string
  name?: string
  attributes?: Attribute[]
  collectionName?: string
  floorPrice?: number
  creator?: string
  // 1 or 0
  verified?: string
  is_verified?: number
  SellList?: ListingItem[]
}

export interface NFTDetail extends NFT {
  id?: string
  description?: string
  collection?: SimpleCollection
  image_data?: string
  external_url?: string
  background_color?: string
  animation_url?: string
  youtube_url?: string
  status?: string
  createdAt?: string
  updatedAt?: string
  sort?: number
  // marketData?: MarketData | undefined
  owner?: Account
}

export interface MarketData {
  currentAskPrice: number
  currentSeller: string
  currentToken: string
  isTradable: boolean
  latestTradedPriceInETH: number
  totalTrades: number
  tradeVolumeETH: number
  updatedTime: number
}

export interface IndexData {
  recommendCollection?: BASE_INO_OR_COLLECTION | undefined
  hotCollection?: Collection[] | undefined
  inoCollection?: INO[] | undefined
  // nfts?: NFT[] | undefined
}

export interface NFTListPage {
  data: NFTDetail[]
  count: number
}

export interface CollectionTokenIds {
  [propName: string]: string[]
}

export enum NFTItemStage {
  // APPROVAL相关
  // 已经授权，展示业务界面
  APPROVED = 'APPROVED',

  // 未授权，展示授权界面
  NOT_APPROVED = 'NOT_APPROVED',

  // 正在授权，展示pending中的界面
  PENDING = 'PENDING',

  // 正在确认是否已授权，展示loading中的界面
  UNKNOWN = 'UNKNOWN',

  // 业务相关
  // 用户关闭页面
  CANCEL = 'CANCEL',

  // 用户在授权之后确认要执行操作，展示正在pending的界面
  CONFIRM = 'CONFIRM',

  // 操作成功，展示有操作成功的界面
  SUCCESS = 'SUCCESS',

  // 操作失败，展示操作失败的界面，
  FAILURE = 'FAILURE',

  // 签名相关 这个暂时先不管
  // 已签名
  SIGNATURE = 'SIGNATURE',
  // 未签名
  NO_SIGNATURE = 'NO_SIGNATURE',
}

export enum NFTModalPageStage {
  // 授权页面
  APPROVAL = 'APPROVAL',
  // 操作页面
  OPERATE = 'OPERATE',
  // 成功页面
  SUCCESS = 'SUCCESS',
}

// 操作页面的类型
export enum NFTOperateStage {
  //上下架
  ORDER = 'ORDER',
  // 购买
  BUY = 'BUY',
  // transfer
  TRANSFER = 'TRANSFER',
  // multi transfer nft
  MULTI_TRANSFER = 'MULTI_TRANSFER',
  // multi transfer token
  MULTI_TRANSFER_TOKENS = 'MULTI_TRANSFER_TOKENS',
  // offer
  OFFER = 'OFFER',
  // 接收offer
  ACCEPT_OFFER = 'ACCEPT_OFFER',
}

export enum OrderType {
  New = 'Create Order',
  Modify = 'Modify Order',
  Cancel = 'Cancel Order',
  // 交易记录
  Sold = 'Sold',
}

export interface History {
  txid: string
  timestamp: number
  chainId: string
  collection: string
  tokenId: string
  askPrice: string
  askToken: string
  netPrice: number
  buyer: string
  seller: string
  createdAt: string
  orderType: OrderType
}

export interface Trade {
  chainId: string
  address: string
  name: string
  avatar: string
  symbol: string
  updatedAt: string
  volumeEth: number
  trades: number
}

export interface UserTrade {
  chainId: string
  account: string
  avatar_url: string
  username: string
  updatedAt: string
  volumeEth: number
  trades: number
}

export enum Daytype {
  total = 'total',
  oneDay = 'oneDay',
  sevenDay = 'sevenDay',
  thirtyDay = 'thirtyDay',
}

export type Affiliate = {
  id: number
  address: string
  refererId: string
  upRefererId: string | null
  commissionRate: number
  commissionRateUp: number
  invitedBy: string | null
  totalReward: string
  status: number
  createdAt: Date
  updatedAt: Date
  totalRewardETH: number
  totalRewardUSDT: number
}

export type AffiliateHistory = {
  id: number
  address: string
  rewardFrom: string | null
  rewardAmount: string | null
  rewardETH: number | null
  rewardUSDT: number | null
  token: string | null
  withdrawTx: string | null
  depositTx: string | null
  status: AffiliateHistoryStatus
  createdAt: Date
  updatedAt: Date
}

export enum AffiliateHistoryStatus {
  INIT = 0, // 初始化
  APPLY = 1, // 申请
  PENDING = 2, // 区块链执行中，此时存在交易hash
  SUCCESS = 3, // 执行完毕
}

export interface Category {
  id: string
  createTime: string
  title: string
  title_jp: string
  title_en: string
  subtitle: string
  subtitle_jp: string
  desc: string
  desc_jp: string
  desc_en: string
  shorturl: string
  extension: string
  image_url: string
  published: boolean
}

// account: "0x5aa190a5fe508be9ed7dd3c7cfd8eb13255207a7"
// avatar_url: "https://ipfstest.daidai.io/ipfs/QmTUbEZ6qj6riBWFXrbjs1ggoiKDK9GYFN5ti3yMnhrgzQ"
// banner_url: "https://ipfstest.daidai.io/ipfs/QmNpDHiLoufzUWowJMReqTkEAPDY71jjE8qvb6d6cNTuLp"
// bio: "test\r\ntest\r\ntest"
// collectionNumber: 2
// createdAt: "2022-04-11T09:10:53.021Z"
// email: "saberjunn@gmail.com"
// nftNumber: 121
// totalTrades: 6
// totalVolumeETH: 105.063
// updatedAt: "2022-04-22T08:12:27.480Z"
// username: "saber"

export interface Account {
  account: string
  avatar_url: string
  banner_url: string
  bio: string
  collectionNumber: number
  createdAt: string
  email: string
  nftNumber: number
  totalTrades: number
  totalVolumeETH: number
  updatedAt: string
  username: string
}

export interface TokenSys {
  id: string
  createTime: string
  name: string
  symbol: string
  chainId: string
  address: string
  decimals: string
  logoURI: string
  status: number
}

export interface Medium {
  mediumUrl: string
  previewImage: {
    id: string
  }
  title: string
  previewContent: {
    subtitle: string
  }
  latestPublishedAt: number
}

export enum INOStage {
  // per-sale coming soon
  PRE_SALE_COMING_SOON = 'PRE_SALE_COMING_SOON',
  // on pre-sale
  ON_PRE_SALE = 'ON_PRE_SALE',
  // on-selling
  ON_SELLING = 'ON_SELLING',
  // public coming soon
  PUBLIC_COMING_SOON = 'PUBLIC_COMING_SOON',
  // loading
  LOADING = 'LOADING',
}

export interface Signature {
  id: number
  chainId: number
  collection: string
  account: string
  signature: string
  createdAt: string
}

export interface Posts {
  title: string
  title_cn: string
  title_jp: string
  subtitle: string
  subtitle_cn: string
  subtitle_jp: string
  desc: string
  desc_jp: string
  desc_cn: string
  body: string
  body_jp: string
  body_cn: string
  shorturl: string
  extension: string
  image_url: string
  id: string
}

export enum SlotsType {
  Empty = 0,
  NFT = 1,
  Token = 2,
}

export interface Slots {
  asset: string
  idOrAmount: string
  sType: SlotsType
}

export interface SlotsGraph {
  asset: string
  idOrAmount: string
  slotType: SlotsType
}

export interface SlotsNFT {
  address: string
  id: string
}

export interface SlotsToken {
  price: CurrencyAmount<Currency>
  token: Currency
}

export interface GachaSignature {
  times: number
  nonce: number
  signature: string
  createdAt: string
}

export interface NameValues {
  name: string
  values: string
}

export interface Values {
  key: string
  count: number
}

export interface Attributes {
  name: string
  values: Values[]
}

export interface AttributeData {
  address: string
  chainId: string
  id: number
  attributes: Attributes[]
}

export interface Listing721 {
  price: number
  sellToken: string
  seller: string
  collection: string
  tokenId: number
  globalNonce: string
  listingNonce: string
  expiration: number
}

export interface ListingItem {
  address: string
  expiration: number
  payToken: string
  // 这里后台返回的是字符串
  price: number
}

export interface ListingDetail {
  id: number
  chainId: string
  collection: string
  tokenId: string
  address: string
  price: string
  payToken: string
  globalNonce: number
  nonce: number
  signature: string
  expiration: number
  status: number
  createdAt: Date
  updatedAt: Date
  nftId: string
}

export interface Offer721 {
  price: number
  buyToken: string
  buyer: string
  collection: string
  tokenId: number
  globalNonce: string
  offerNonce: string
  expiration: number
}

export interface OfferItem {
  id: number
  chainId: number
  collection: string
  tokenId: number
  nftId: string
  // account的地址？
  address: string
  price: number
  payToken: string
  globalNonce: number
  nonce: number
  signature: string
  expiration: number
  status: number
  createdAt: Date
  updatedAt: Date
}

export interface OfferDetail {
  id: string
  chainId: string
  collection: string
  tokenId: string
  nftId: string
  address: string
  price: string
  payToken: string
  globalNonce: number
  nonce: number
  signature: string
  expiration: number
  status: number
  createdAt: Date
  updatedAt: Date
}

export interface CreatorFee {
  id: number
  chainId: string
  collection: string
  address: string
  fee: number
  status: number
  createdAt: Date
}

export interface CreatorFeeSignature {
  signature: string
  closetime: number
  creatorFee: CreatorFee[]
}
