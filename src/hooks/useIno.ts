import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { Currency, CurrencyAmount, JSBI, Token } from '@sushiswap/core-sdk'
// import { Assets } from 'app/features/portfolio/AssetBalances/types'
// import { useApproveCallback } from 'app/hooks/useApproveCallback'
import { useInoContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppSelector } from 'app/state/hooks'
// import { INO_CONTRACT_ADDRESS } from 'app/config/address'
import { getTokenAddress, useTokenByAddressCallback, useTokenList } from 'app/state/token/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { INOStage, Plan } from 'app/types/daidai'
// import { useAllTokenBalancesWithLoadingIndicatorV2, useCurrencyBalance } from 'app/state/wallet/hooks'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import ReactGA from 'react-ga'

// 通过singal的变化来触发ino的数据刷新
const useIno = (defaultChainId: number, address: string, inoChainid: number, singal: number) => {
  const { chainId } = useActiveWeb3React()
  const inoContract = useInoContract(address, inoChainid)
  const addTransaction = useTransactionAdder()

  const [isLoading, setIsLoading] = useState(true)
  const [avaliable, setAvaliable] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [maxBatchMint, setMaxBatchMint] = useState(0)
  const [planList, setPlanList] = useState<Plan[]>([])
  const [startTimestamp, setStartTimestamp] = useState(0)
  const [preSaleStartTimestamp, setPreSaleStartTimestamp] = useState(0)
  const [preSaleDiscount, setPreSaleDiscount] = useState(0)
  const [isFreeMint, setIsFreeMint] = useState(false)
  const [stage, setStage] = useState(INOStage.LOADING)

  // 通过监听block number的变化来进行数据的加载
  const blockNumber = useAppSelector((state) => state.application.blockNumber)

  const tokenList = useTokenList()

  const handleBuy = useCallback(
    async ({
      plan,
      cost,
      buyNumber,
      inoName,
    }: {
      plan: Plan
      cost: CurrencyAmount<Currency | Token>
      buyNumber: number
      inoName: string
    }) => {
      if (inoContract) {
        const wei = cost.multiply(JSBI.BigInt(BigNumber.from(10).pow(plan.token.decimals))).toSignificant()
        const params: any = [plan.index, wei, buyNumber]
        if (getTokenAddress(plan.token).toLocaleLowerCase() === AddressZero) {
          const bnbValue = parseEther(cost.toSignificant(cost.currency.decimals))
          params.push({
            value: bnbValue,
          })
        }
        console.log('mintNFTByToken params', params)
        const tx: TransactionResponse = await inoContract
          .mintNFTByToken(...params)
          .then(async (response: TransactionResponse) => {
            const summary = `Minting ${inoName}'s ${buyNumber} NFT cost ${cost.toSignificant(6)} ${plan.token.symbol}`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `Ino Mint`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to buy ino nft', error)
            ReactGA.event({
              category: 'smart contract',
              action: `Ino Mint`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [addTransaction, inoContract]
  )

  const handleBuyFree = useCallback(
    async ({ buyNumber, inoName }: { buyNumber: number; inoName: string }) => {
      if (inoContract) {
        const params: any = [0, 0, buyNumber]
        console.log('mintNFTByToken params Free', params)
        const tx: TransactionResponse = await inoContract
          .mintNFTByToken(...params)
          .then(async (response: TransactionResponse) => {
            const summary = `Minting ${inoName}'s ${buyNumber} NFT Free`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `Ino Mint Free`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to buy ino nft free', error)
            ReactGA.event({
              category: 'smart contract',
              action: `Ino Mint Free`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [addTransaction, inoContract]
  )

  // 调用white
  const handleBuyWhite = useCallback(
    async ({
      plan,
      cost,
      buyNumber,
      inoName,
      signature,
    }: {
      plan: Plan
      cost: CurrencyAmount<Currency | Token>
      buyNumber: number
      inoName: string
      signature: string
    }) => {
      if (inoContract) {
        // const wei = cost.multiply(JSBI.BigInt(BigNumber.from(10).pow(plan.token.decimals))).toSignificant()
        // const params: any = [plan.index, wei, buyNumber]
        const params: any = [plan.index, buyNumber, signature]
        if (getTokenAddress(plan.token).toLocaleLowerCase() === AddressZero) {
          const bnbValue = parseEther(cost.toSignificant(cost.currency.decimals))
          // const bnbValue = parseEther(cost.toSignificant(6))
          params.push({
            value: bnbValue.mul(preSaleDiscount).div(100),
          })
        }
        console.log('mintByWhitelist params', params)
        const tx: TransactionResponse = await inoContract
          .mintByWhitelist(...params)
          .then(async (response: TransactionResponse) => {
            const summary = `MintingByWhiteList ${inoName}'s ${buyNumber} NFT cost ${
              (Number(cost.toSignificant(6)) * preSaleDiscount) / 100
            } ${plan.token.symbol}`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `Ino MintingByWhiteList`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to buy ino nft', error)
            ReactGA.event({
              category: 'smart contract',
              action: `Ino MintingByWhiteList`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [addTransaction, inoContract, preSaleDiscount]
  )

  const handleBuyWhiteFree = useCallback(
    async ({ buyNumber, inoName, signature }: { buyNumber: number; inoName: string; signature: string }) => {
      if (inoContract) {
        const params: any = [0, buyNumber, signature]
        console.log('mintByWhitelist params Free', params)
        const tx: TransactionResponse = await inoContract
          .mintByWhitelist(...params)
          .then(async (response: TransactionResponse) => {
            const summary = `MintingByWhiteList ${inoName}'s ${buyNumber} NFT Free`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `Ino MintingByWhiteList Free`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to buy ino nft', error)
            ReactGA.event({
              category: 'smart contract',
              action: `Ino MintingByWhiteList Free`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [addTransaction, inoContract]
  )

  useEffect(() => {
    async function loadData() {
      if (inoContract) {
        const totalCount = await inoContract.totalCount()
        const totalSupply = await inoContract.totalSupply()
        const tempMaxBatchMint = await inoContract.maxBatchMint()
        const a = BigNumber.from(totalCount).sub(BigNumber.from(totalSupply))
        setAvaliable(a.toNumber())
        setTotalCount(totalCount.toNumber())
        setMaxBatchMint(tempMaxBatchMint.toNumber())

        const tempstartTimestamp = await inoContract.startTimestamp()
        setStartTimestamp(Number(`${tempstartTimestamp.toString()}000`))
      }
    }
    loadData()
  }, [inoContract, blockNumber, preSaleStartTimestamp, preSaleDiscount, singal])

  useEffect(() => {
    const now = Date.now()
    // console.log(
    //   'xxxx',
    //   preSaleStartTimestamp,
    //   startTimestamp,
    //   now,
    //   dayjs(now).isBefore(dayjs(preSaleStartTimestamp)),
    //   dayjs(now).isBefore(dayjs(startTimestamp))
    // )
    if (preSaleStartTimestamp && preSaleDiscount) {
      if (dayjs(now).isBefore(dayjs(preSaleStartTimestamp))) {
        setStage(INOStage.PRE_SALE_COMING_SOON)
      } else if (dayjs(now).isBefore(dayjs(startTimestamp))) {
        setStage(INOStage.ON_PRE_SALE)
      } else {
        setStage(INOStage.ON_SELLING)
      }
    } else {
      if (dayjs(now).isBefore(dayjs(startTimestamp))) {
        setStage(INOStage.PUBLIC_COMING_SOON)
      } else {
        setStage(INOStage.ON_SELLING)
      }
    }
  }, [preSaleDiscount, preSaleStartTimestamp, startTimestamp, singal])

  useEffect(() => {
    async function getPre() {
      if (inoContract) {
        try {
          // 新的合约abi才有preSaleStartTimestamp和preSaleDiscount
          const preSaleStartTimestamp = await inoContract.preSaleStartTimestamp()
          setPreSaleStartTimestamp(Number(`${preSaleStartTimestamp.toString()}000`))

          const preSaleDiscount = await inoContract.discount()
          setPreSaleDiscount(preSaleDiscount)

          const isFreeMint = await inoContract.isFreeMint()
          setIsFreeMint(isFreeMint)
        } catch (e) {
          console.error('old ino contract', e)
        }
      }
    }
    getPre()
  }, [inoContract, singal])

  const findToken = useTokenByAddressCallback()

  useEffect(() => {
    async function getPlans() {
      if (inoContract) {
        const plansRaw = await inoContract.getPlans()
        const list: Plan[] = plansRaw
          .map((arr: [string, BigNumber], index: number) => {
            const address = arr[0].toLowerCase()
            const priceValue = arr[1].toString()
            const currentToken = findToken(address)
            if (currentToken && arr[1].gt(0)) {
              return {
                token: currentToken,
                price: CurrencyAmount.fromRawAmount(currentToken, JSBI.BigInt(priceValue)),
                index: index,
              }
            }
            return null
          })
          .filter((el: any) => el)
        setPlanList(list)
        setIsLoading(false)
      }
    }
    getPlans()
  }, [chainId, inoContract, defaultChainId, tokenList, singal, findToken])

  return {
    avaliable,
    totalCount,
    maxBatchMint,
    planList,
    // filterdPlanList,
    startTimestamp,
    preSaleStartTimestamp,
    preSaleDiscount,
    isFreeMint,
    handleBuy,
    handleBuyFree,
    handleBuyWhite,
    handleBuyWhiteFree,
    isLoading,
    stage,
    // approvalState,
    // approveCallback,
  }
}
export default useIno
