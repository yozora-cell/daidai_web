import { combineReducers } from '@reduxjs/toolkit'
import portfolio from 'app/features/portfolio/portfolioSlice'

// import tridentAdd from '../features/trident/add/addSlice'
// import tridentCreate from '../features/trident/create/createSlice'
// import tridentMigrations from '../features/trident/migrate/context/migrateSlice'
// import tridentPools from '../features/trident/pools/poolsSlice'
// import tridentRemove from '../features/trident/remove/removeSlice'
import tridentSwap from '../features/trident/swap/swapSlice'
import application from './application/reducer'
import burn from './burn/reducer'
import web3Context from './global/web3ContextSlice'
import limitOrder from './limit-order/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import nfts from './nfts/reducer'
import sign from './sign/reducer'
import slippage from './slippage/slippageSlice'
import swap from './swap/reducer'
import theme from './theme/reducer'
import token from './token/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import wallet from './wallet/reducer'

const reducer = combineReducers({
  application,
  user,
  lists,
  multicall,
  slippage,
  transactions,
  portfolio,
  web3Context,
  theme,
  wallet,
  nfts,
  sign,
  token,
  limitOrder,
  mint,
  swap,
  burn,
  tridentSwap,
  // tridentAdd,
  // tridentRemove,
  // tridentPools,
  // tridentCreate,
  // tridentMigrations,
})

export default reducer
