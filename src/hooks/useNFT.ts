import { AddressZero } from '@ethersproject/constants'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { MULTI_TRANSFER_ADDRESS, NFT_MARKETPLACE_ADDRESS } from 'app/config/address'
import { shortenAddress } from 'app/functions'
import { useNFTContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'
import ReactGA from 'react-ga'

export enum ApprovalTarget {
  NFT_MARKETPLACE,
  MULTI_TRANSFER,
}

const useNFT = (nftAddress: string) => {
  const contract = useNFTContract(nftAddress)
  const addTransaction = useTransactionAdder()
  const { chainId, account, connector, deactivate, library } = useActiveWeb3React()

  const getApproveAddress = useCallback(
    (approvalTarget: ApprovalTarget) => {
      if (chainId) {
        switch (approvalTarget) {
          case ApprovalTarget.MULTI_TRANSFER:
            return MULTI_TRANSFER_ADDRESS[chainId]
          case ApprovalTarget.NFT_MARKETPLACE:
            return NFT_MARKETPLACE_ADDRESS[chainId]
        }
      }
      return ''
    },
    [chainId]
  )

  const getIsApprovalForAll = useCallback(
    async (approvalTarget: ApprovalTarget) => {
      if (contract && account && chainId) {
        const result = await contract.isApprovedForAll(account, getApproveAddress(approvalTarget))
        return result
      } else {
        return false
      }
    },
    [contract, account, chainId, getApproveAddress]
  )

  const setApprovalForAll = useCallback(
    async ({ approvalTarget, approvalForAll }: { approvalTarget: ApprovalTarget; approvalForAll: boolean }) => {
      if (contract && account && chainId) {
        const params: any = [getApproveAddress(approvalTarget), approvalForAll]
        const tx: TransactionReceipt = await contract
          .setApprovalForAll(...params)
          .then(async (response: TransactionResponse) => {
            const summary = `Approval to contract address ${shortenAddress(getApproveAddress(approvalTarget))}`
            addTransaction(response, {
              summary: summary,
            })
            ReactGA.event({
              category: 'smart contract',
              action: `NFT approval for all`,
              label: summary,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to setApprovalForAll', error)
            ReactGA.event({
              category: 'smart contract',
              action: `NFT approval for all`,
              label: `error => { name: ${error.name}, message: ${error.message}, stack: ${error.stack} }`,
            })
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [contract, account, chainId, getApproveAddress, addTransaction]
  )

  // 返回当前tokenId的拥有者
  const ownerOf = useCallback(
    async (tokenId: number, currentSeller?: string) => {
      if (currentSeller && currentSeller != AddressZero) {
        return currentSeller
      }
      if (contract && account) {
        const result = await contract.ownerOf(tokenId)
        return result
      } else {
        return undefined
      }
    },
    [contract, account]
  )

  return {
    getIsApprovalForAll,
    setApprovalForAll,
    ownerOf,
    getApproveAddress,
  }
}
export default useNFT
