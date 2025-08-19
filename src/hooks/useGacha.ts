import { AddressZero } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { Currency, CurrencyAmount, JSBI } from '@sushiswap/core-sdk'
import { useGachaContract } from 'app/hooks/useContract'
import { useAppSelector } from 'app/state/hooks'
import { useSingleContractMultipleMethods } from 'app/state/multicall/hooks'
import { getTokenAddress, useTokenByAddressCallback, useTokenList } from 'app/state/token/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { Slots, SlotsNFT, SlotsToken, SlotsType } from 'app/types/daidai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'

const useGacha = (singal: number) => {
  const gachaContract = useGachaContract()
  const addTransaction = useTransactionAdder()
  // 通过监听block number的变化来进行数据的加载
  const blockNumber = useAppSelector((state) => state.application.blockNumber)

  const [drawLimit, setDrawLimit] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [maxDrawDiscount, setMaxDrawDiscount] = useState(0)
  const [owner, setOwner] = useState('')
  const [slots, setSlots] = useState<Slots[]>([])
  // paymentToken和price需要转化
  const [paymentToken, setPaymentToken] = useState<Currency | undefined>(undefined)
  const [price, setPrice] = useState<CurrencyAmount<Currency> | undefined>(undefined)
  const [nonceList, setNonceList] = useState<number[]>([])
  const usedNonceParam = useMemo(() => {
    if (nonceList.length === 0) {
      return undefined
    }
    const paramList: any[] = []
    nonceList.forEach((nonce) => {
      paramList.push({
        methodName: 'usedNonce',
        callInputs: [nonce],
      })
    })
    return paramList
  }, [nonceList])
  const nonceState = useSingleContractMultipleMethods(gachaContract, usedNonceParam)
  const usedNonce = useMemo(() => {
    const map = new Map<number, boolean>()
    nonceList.forEach((nonce, index) => {
      const result = nonceState[index].result
      if (result !== undefined && result.length > 0) {
        map.set(nonce, result[0])
      }
    })
    return map
  }, [nonceList, nonceState])
  // console.log('usedNonce', usedNonce)
  // console.log('nonceState', nonceList, nonceState, usedNonceParam)
  const tokenList = useTokenList()
  const findToken = useTokenByAddressCallback()

  useEffect(() => {
    async function loadData() {
      if (gachaContract) {
        const tempPaymentToken = await gachaContract.paymentToken()
        const tempPrice = await gachaContract.price()
        const currentToken = findToken(String(tempPaymentToken))
        if (currentToken) {
          const price = CurrencyAmount.fromRawAmount(currentToken, JSBI.BigInt(tempPrice))
          setPaymentToken(currentToken)
          setPrice(price)
        }
      }
    }
    loadData()
  }, [gachaContract, tokenList, blockNumber, findToken])

  useEffect(() => {
    async function loadData() {
      if (gachaContract) {
        const tempDrawLimit = await gachaContract.drawLimit()
        const tempIsOpen = await gachaContract.isOpen()
        const tempMaxDrawDiscount = await gachaContract.maxDrawDiscount()
        const tempOwner = await gachaContract.owner()
        setDrawLimit(Number(tempDrawLimit.toString()))
        setIsOpen(tempIsOpen)
        setMaxDrawDiscount(Number(tempMaxDrawDiscount.toString()))
        setOwner(tempOwner)
      }
    }
    loadData()
  }, [gachaContract, blockNumber])

  useEffect(() => {
    async function loadData() {
      if (gachaContract) {
        const tempSlots = await gachaContract.getSlots()
        const resultSlots: Slots[] = []
        if (tempSlots && tempSlots.length > 0) {
          tempSlots.forEach((item: { asset: any; idOrAmount: { toString: () => any }; sType: any }) => {
            resultSlots.push({
              asset: item.asset,
              idOrAmount: item.idOrAmount.toString(),
              sType: item.sType,
            })
          })
          setSlots(resultSlots)
        }
      }
    }
    loadData()
  }, [gachaContract, singal, blockNumber])

  const tokens = useMemo(() => {
    const list: SlotsToken[] = []
    slots.forEach((item: Slots) => {
      if (item.sType === SlotsType.Token) {
        const address = item.asset
        const currentToken = findToken(address)
        if (currentToken) {
          const price = CurrencyAmount.fromRawAmount(currentToken, JSBI.BigInt(item.idOrAmount))
          list.push({
            token: currentToken,
            price: price,
          })
        }
      }
    })
    return list
  }, [findToken, slots])

  const nfts = useMemo(() => {
    const list: SlotsNFT[] = []
    slots.forEach((item: Slots) => {
      if (item.sType === SlotsType.NFT) {
        list.push({
          id: item.idOrAmount,
          address: item.asset,
        })
      }
    })
    return list
  }, [slots])

  const emptyLength = useMemo(() => {
    let length = 0
    slots.forEach((item: Slots) => {
      if (item.sType === SlotsType.Empty) {
        length++
      }
    })
    return length
  }, [slots])

  const handleFreeDraw = useCallback(
    async ({ times, nonce, signature }: { times: number; nonce: string; signature: string }) => {
      if (gachaContract) {
        const params: any = [times, nonce, signature]
        console.log('FreeDraw params', params)
        const estimateGas = await gachaContract.estimateGas.freeDraw(...params)
        params.push({
          gasLimit: estimateGas.mul(2),
        })
        console.log('FreeDraw params gasLimit', params)
        const tx: TransactionResponse = await gachaContract
          .freeDraw(...params)
          .then(async (response: TransactionResponse) => {
            const summary = `Free Draw ${times} times`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `Free Draw`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to free draw', error)
            ReactGA.event({
              category: 'smart contract',
              action: `Free Draw`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [addTransaction, gachaContract]
  )

  const handleLuckDraw = useCallback(
    async ({ times }: { times: number }) => {
      if (gachaContract) {
        const params: any = [times]
        let isTokenAddressZero = false
        if (price && paymentToken && getTokenAddress(paymentToken) === AddressZero) {
          isTokenAddressZero = true
          let bnbValue = parseEther(price.toSignificant(price.currency.decimals)).mul(times)
          if (times === drawLimit) {
            bnbValue = bnbValue.mul(maxDrawDiscount).div(100)
          }
          params.push({
            value: bnbValue,
          })
          console.log('bnbValue.toString', bnbValue.toString(), maxDrawDiscount, drawLimit)
        }
        console.log('LuckDraw params', params)
        const estimateGas = await gachaContract.estimateGas.luckDraw(...params)
        // 预估了estimateGas了之后需要再次修改参数
        if (isTokenAddressZero) {
          params[params.length - 1].gasLimit = estimateGas.mul(2)
        } else {
          params.push({
            gasLimit: estimateGas.mul(2),
          })
        }
        console.log('LuckDraw estimateGas', estimateGas.toString())
        const tx: TransactionResponse = await gachaContract
          .luckDraw(...params)
          .then(async (response: TransactionResponse) => {
            const summary = `Luck Draw ${times} times`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `Luck Draw`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to luck draw', error)
            ReactGA.event({
              category: 'smart contract',
              action: `Luck Draw`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [addTransaction, drawLimit, gachaContract, maxDrawDiscount, paymentToken, price]
  )

  return {
    drawLimit,
    isOpen,
    maxDrawDiscount,
    owner,
    paymentToken,
    price,
    slots,
    tokens,
    nfts,
    emptyLength,
    handleFreeDraw,
    handleLuckDraw,
    setNonceList,
    usedNonce,
    nonceList,
  }
}

export default useGacha
