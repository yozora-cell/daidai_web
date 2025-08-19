import { AddressZero } from '@ethersproject/constants'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { parseBalance } from 'app/functions'
import { useNFTMarketplaceContract } from 'app/hooks/useContract'
import {
  createBuyOrder,
  createSellOrder,
  delBuyOrder,
  delSellOrder,
  getCreatorFeeSignature,
  makeExchange,
  updBuyOrder,
  updSellOrder,
} from 'app/services/apis/fetchers'
import { useActiveWeb3React } from 'app/services/web3'
import { useChainId } from 'app/state/application/hooks'
import { useTokenByAddressCallback, useTokenList } from 'app/state/token/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { Listing721, Offer721 } from 'app/types/daidai'
import { ethers } from 'ethers'
import { useCallback } from 'react'
import ReactGA from 'react-ga'
import { soliditySha3 } from 'web3-utils'

/**
 * 2022/8/02 所有上下架改为半中心化，collection上架相关的也改为数据库管理
 * 这个hooks的方法参数要改，依赖的方法也要进行修改，主要是要处理签名
 * buyNFT, createAskOrder, cancelAskOrder调用会报错
 * @returns
 */
const useNFTMarketplace = () => {
  const chainId = useChainId()
  const contract = useNFTMarketplaceContract()
  const addTransaction = useTransactionAdder()
  const { account, library } = useActiveWeb3React()

  // 暂时不验证
  const validateOffer721 = (offer: Offer721): boolean => {
    return true
  }

  // 暂时不验证
  const validateListing721 = (listing: Listing721): boolean => {
    return true
  }

  const tokenList = useTokenList()
  const getTargetToken = useTokenByAddressCallback()

  const getCreatorFeeSignatureFun = async (chainId: number, collection: string) => {
    return await getCreatorFeeSignature({
      chainId: chainId,
      collection: collection,
    })
  }

  const buyNFT = useCallback(
    async ({
      collection,
      tokenId,
      price,
      tokenAddress,
      nftName,
    }: {
      collection: string | undefined
      tokenId: number | undefined
      price: number | undefined
      tokenAddress: string | undefined
      nftName: string
    }) => {
      // console.log('buyNFT param', collection, tokenId, price, tokenAddress, nftName)
      if (contract && account && chainId && collection && tokenId !== undefined && price && tokenAddress) {
        const targetToken = getTargetToken(tokenAddress)
        if (!targetToken) {
          return
        }
        // console.log('buyNFT', targetToken.symbol, targetToken.address, collection, tokenId, price, tokenAddress)
        const wei = parseBalance(String(price), targetToken.decimals)
        const params: any = [collection, tokenId, wei, tokenAddress]
        if (tokenAddress.toLocaleLowerCase() === AddressZero) {
          const bnbValue = parseEther(String(price))
          params.push({
            value: bnbValue,
          })
        }
        const tx: TransactionReceipt = await contract
          .buyNFT(...params)
          .then(async (response: TransactionResponse) => {
            const summary = `Buy NFT ${nftName} cost ${price} ${targetToken.symbol}`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace buy nft`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to buy nft', error)
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace buy nft`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        // console.log('tx', tx)
        return tx
      }
    },
    [contract, account, chainId, getTargetToken, addTransaction]
  )

  const createAskOrder = useCallback(
    async ({ listing, signature }: { listing: Listing721; signature: string }) => {
      const targetToken = getTargetToken(listing.sellToken)
      if (chainId && targetToken) {
        await createSellOrder({
          chainId: chainId,
          collection: listing.collection,
          tokenId: listing.tokenId,
          price: String(listing.price),
          payToken: listing.sellToken,
          signature: signature,
          expiration: listing.expiration,
        })
          .then(() => {})
          .catch((error: Error) => {
            console.log('createAskOrder error', error)
            throw error
          })
      }
    },
    [chainId, getTargetToken]
  )

  const changeAskOrder = useCallback(
    async ({ listing, signature }: { listing: Listing721; signature: string }) => {
      const targetToken = getTargetToken(listing.sellToken)
      if (chainId && targetToken) {
        await updSellOrder({
          chainId: chainId,
          collection: listing.collection,
          tokenId: listing.tokenId,
          price: String(listing.price),
          payToken: listing.sellToken,
          signature: signature,
          expiration: listing.expiration,
          nonce: listing.listingNonce,
        })
          .then(() => {})
          .catch((error: Error) => {
            console.log('createAskOrder error', error)
            throw error
          })
      }
    },
    [chainId, getTargetToken]
  )

  const cancelAskOrder = useCallback(
    async ({ collection, tokenId, expiration }: { collection: string; tokenId: number; expiration: number }) => {
      if (chainId) {
        await delSellOrder({
          chainId: chainId,
          collection,
          tokenId,
          expiration,
        })
          .then(() => {})
          .catch((error: Error) => {
            console.log('cancelAskOrder error', error)
            throw error
          })
      }
    },
    [chainId]
  )

  const createOffer = useCallback(
    async ({ offer, signature }: { offer: Offer721; signature: string }) => {
      const targetToken = getTargetToken(offer.buyToken)
      if (chainId && targetToken) {
        await createBuyOrder({
          chainId: chainId,
          collection: offer.collection,
          tokenId: offer.tokenId,
          price: String(offer.price),
          payToken: offer.buyToken,
          signature: signature,
          expiration: offer.expiration,
        })
          .then(() => {})
          .catch((error: Error) => {
            console.log('createBuyOrder error', error)
            throw error
          })
      }
    },
    [chainId, getTargetToken]
  )

  const changeOffer = useCallback(
    async ({ offer, signature }: { offer: Offer721; signature: string }) => {
      const targetToken = getTargetToken(offer.buyToken)
      if (chainId && targetToken) {
        await updBuyOrder({
          chainId: chainId,
          collection: offer.collection,
          tokenId: offer.tokenId,
          price: String(offer.price),
          payToken: offer.buyToken,
          signature: signature,
          expiration: offer.expiration,
          nonce: offer.offerNonce,
        })
          .then(() => {})
          .catch((error: Error) => {
            console.log('updBuyOrder error', error)
            throw error
          })
      }
    },
    [chainId, getTargetToken]
  )

  const cancelOffer = useCallback(
    async ({ collection, tokenId, expiration }: { collection: string; tokenId: number; expiration: number }) => {
      if (chainId) {
        await delBuyOrder({
          chainId: chainId,
          collection,
          tokenId,
          expiration,
        })
          .then(() => {})
          .catch((error: Error) => {
            console.log('delBuyOrder error', error)
            throw error
          })
      }
    },
    [chainId]
  )

  //
  //      user      nonce
  // mapping(address=>uint256) public globalNonce;
  const globalNonce = useCallback(
    async (address: string) => {
      if (contract) {
        const nonce = await contract.globalNonce(address)
        return nonce.toString()
      }
      return '-1'
    },
    [contract]
  )

  //      user              nft             tokenId  nonce
  // mapping(address=>mapping(address=>mapping(uint256=>uint256))) public listingNonce721;
  const listingNonce721 = useCallback(
    async (address: string, collection: string, tokenId: number) => {
      if (contract) {
        const nonce = await contract.listingNonce721(address, collection, tokenId)
        return nonce.toString()
      }
      return '-1'
    },
    [contract]
  )

  //      user              nft             tokenId  nonce
  // mapping(address=>mapping(address=>mapping(uint256=>uint256))) public offerNonce721;
  const offerNonce721 = useCallback(
    async (address: string, collection: string, tokenId: number) => {
      if (contract) {
        const nonce = await contract.offerNonce721(address, collection, tokenId)
        return nonce.toString()
      }
      return '-1'
    },
    [contract]
  )

  const increaseListingNonce721 = useCallback(
    async (collection: string, tokenId: number) => {
      if (contract && account && chainId && collection && tokenId !== undefined) {
        const params: any = [collection, tokenId]

        let methodName = 'increaseListingNonce721'

        const tx: TransactionReceipt = await contract[methodName](...params)
          .then(async (response: TransactionResponse) => {
            const summary = `Successfully updated Listing nonce!`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace ${methodName}`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug(`Failed to ${methodName}`, error)
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace ${methodName}`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        // console.log('tx', tx)
        return tx
      }
    },
    [addTransaction, contract, chainId, account]
  )

  const increaseOfferNonce721 = useCallback(
    async (collection: string, tokenId: number) => {
      if (contract && account && chainId && collection && tokenId !== undefined) {
        const params: any = [collection, tokenId]

        let methodName = 'increaseOfferNonce721'

        const tx: TransactionReceipt = await contract[methodName](...params)
          .then(async (response: TransactionResponse) => {
            const summary = `Successfully updated Offer nonce!`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace ${methodName}`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug(`Failed to ${methodName}`, error)
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace ${methodName}`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        // console.log('tx', tx)
        return tx
      }
    },
    [addTransaction, contract, chainId, account]
  )

  const acceptListing721 = useCallback(
    async (listing: Listing721, signature: string) => {
      const creatorFeeSignature = await getCreatorFeeSignatureFun(Number(chainId), listing.collection)
      console.log('acceptListing721 param', listing, signature, creatorFeeSignature)
      const targetToken = getTargetToken(listing.sellToken)
      if (contract && account && chainId && validateListing721(listing) && signature && targetToken) {
        const params: any = []
        const listingParams: any = []
        listingParams.push(listing.seller)
        listingParams.push(listing.collection)
        listingParams.push(listing.tokenId)
        listingParams.push(listing.sellToken)
        listingParams.push(parseBalance(String(listing.price), targetToken.decimals).toString())
        listingParams.push(Number(listing.globalNonce))
        listingParams.push(Number(listing.listingNonce))
        listingParams.push(listing.expiration)
        params.push(listingParams)
        params.push(signature)
        // creatorFee list
        const creatorFeeList: any = []
        creatorFeeSignature.creatorFee.forEach((fee) => {
          const list: any = []
          list.push(fee.address)
          list.push(fee.fee)
          creatorFeeList.push(list)
        })
        params.push(creatorFeeList)
        // closeBefore
        params.push(creatorFeeSignature.closetime)
        // signature2
        params.push(creatorFeeSignature.signature)
        if (listing.sellToken.toLocaleLowerCase() === AddressZero) {
          const bnbValue = parseEther(String(listing.price))
          params.push({
            value: bnbValue,
          })
        }
        console.log('acceptListing721 params', params)
        let methodName = 'acceptListing721'

        const tx: TransactionReceipt = await contract[methodName](...params)
          .then(async (response: TransactionResponse) => {
            // const summary = `${listing.seller} ${methodName} ${listing.collection} ${listing.tokenId}`
            const summary = `Successfully accepted Listing!`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace ${methodName}`,
              label: summary,
            })
            console.log('response', response)
            makeExchange({
              txId: response.hash,
              chainId: String(chainId),
              collection: listing.collection,
              address: listing.seller,
              tokenId: String(listing.tokenId),
              price: String(listing.price),
              payToken: listing.sellToken,
              type: '0',
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug(`Failed to ${methodName}`, error)
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace ${methodName}`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        // console.log('tx', tx)
        return tx
      }
    },
    [account, addTransaction, chainId, contract, getTargetToken]
  )

  const acceptOffer721 = useCallback(
    async (offer: Offer721, signature: string) => {
      const creatorFeeSignature = await getCreatorFeeSignatureFun(Number(chainId), offer.collection)
      console.log('acceptOffer721 param', offer, signature, creatorFeeSignature)
      const targetToken = getTargetToken(offer.buyToken)
      if (contract && account && chainId && validateOffer721(offer) && signature && targetToken) {
        const params: any = []
        const offerParams: any = []
        offerParams.push(offer.buyer)
        offerParams.push(offer.collection)
        offerParams.push(offer.tokenId)
        offerParams.push(offer.buyToken)
        offerParams.push(parseBalance(String(offer.price), targetToken.decimals))
        offerParams.push(offer.globalNonce)
        offerParams.push(offer.offerNonce)
        offerParams.push(offer.expiration)
        params.push(offerParams)
        params.push(signature)
        // creatorFee list
        const creatorFeeList: any = []
        creatorFeeSignature.creatorFee.forEach((fee) => {
          const list: any = []
          list.push(fee.address)
          list.push(fee.fee)
          creatorFeeList.push(list)
        })
        params.push(creatorFeeList)
        // closeBefore
        params.push(creatorFeeSignature.closetime)
        // signature2
        params.push(creatorFeeSignature.signature)
        console.log('acceptOffer721 params', params)
        let methodName = 'acceptOffer721'

        const tx: TransactionReceipt = await contract[methodName](...params)
          .then(async (response: TransactionResponse) => {
            // const summary = `${offer.buyer} ${methodName} ${offer.collection} ${offer.tokenId}`
            const summary = `Successfully accepted Offer!`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace ${methodName}`,
              label: summary,
            })
            console.log('response', response)
            makeExchange({
              txId: response.hash,
              chainId: String(chainId),
              collection: offer.collection,
              address: offer.buyer,
              tokenId: String(offer.tokenId),
              price: String(offer.price),
              payToken: offer.buyToken,
              type: '1',
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug(`Failed to ${methodName}`, error)
            ReactGA.event({
              category: 'smart contract',
              action: `NFT marketplace ${methodName}`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        // console.log('tx', tx)
        return tx
      }
    },
    [account, addTransaction, chainId, contract, getTargetToken]
  )

  /**
   * 返回如果是空字符串的话，那就是签名失败了
   */
  const listingSign = useCallback(
    async (listing: Listing721): Promise<string> => {
      const targetToken = getTargetToken(listing.sellToken)
      if (targetToken && account && library) {
        const signer = library.getSigner()
        console.log(
          'listingMsg1 params',
          listing.seller,
          listing.collection,
          listing.tokenId,
          listing.sellToken,
          parseBalance(String(listing.price), targetToken.decimals).toString(),
          Number(listing.globalNonce),
          Number(listing.listingNonce),
          listing.expiration
        )
        const listingMsg1 = soliditySha3(
          listing.seller,
          listing.collection,
          listing.tokenId,
          listing.sellToken,
          parseBalance(String(listing.price), targetToken.decimals).toString(),
          Number(listing.globalNonce),
          Number(listing.listingNonce),
          listing.expiration
        )
        console.log('listingMsg1', listingMsg1)
        if (listingMsg1) {
          console.log('ethers', ethers)
          const msg = ethers.utils.arrayify(listingMsg1)
          console.log('msg', msg)
          const signature = await signer.signMessage(msg)
          console.log('msg signature', signature)
          return signature
        } else {
          return ''
        }
      }
      return ''
    },
    [account, getTargetToken, library]
  )

  const offerSign = useCallback(
    async (offer: Offer721): Promise<string> => {
      const targetToken = getTargetToken(offer.buyToken)
      if (targetToken && account && library) {
        const signer = library.getSigner()
        const listingMsg1 = soliditySha3(
          offer.buyer,
          offer.collection,
          offer.tokenId,
          offer.buyToken,
          parseBalance(String(offer.price), targetToken.decimals).toString(),
          offer.globalNonce,
          offer.offerNonce,
          offer.expiration
        )
        if (listingMsg1) {
          console.log('ethers', ethers)
          const msg = ethers.utils.arrayify(listingMsg1)
          const signature = await signer.signMessage(msg)
          return signature
        }
      }
      return ''
    },
    [account, getTargetToken, library]
  )

  return {
    buyNFT,
    getTargetToken,
    createAskOrder,
    changeAskOrder,
    cancelAskOrder,
    globalNonce,
    listingNonce721,
    offerNonce721,
    increaseListingNonce721,
    increaseOfferNonce721,
    acceptListing721,
    acceptOffer721,
    listingSign,
    offerSign,
    createOffer,
    changeOffer,
    cancelOffer,
  }
}
export default useNFTMarketplace
