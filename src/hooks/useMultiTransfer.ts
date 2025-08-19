import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { isAddress, shortenAddress } from 'app/functions'
import { useMultiTransferContract } from 'app/hooks/useContract'
import { useActiveWeb3React } from 'app/services/web3'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCallback } from 'react'

// MultiTransfer:
// airdropTokens
// 0x8F9526b8BE110f83Dc0A218B47986305fBF7675d
// [0xb7dC65fa39df8272F23672dE36e544e4B4c08463,0x9d048059B77390C2Cc687706E13B0d971407D18E]
// [0x0000000000000000000000000000000000000000,0xbec722c344b4bb150f14fd81e9d8ca07cc340e14]
// [1000000000000000,10000000000000000]

// airdropNFTs
// [0xc4a6ca51ad6d6a0be785b4cfdfa2896e90af8e6d,0x768f3a5ba54df1952e1e3970265a756854f161b9]
// [0,1]
// [0x9d048059B77390C2Cc687706E13B0d971407D18E,0xdcd0e41fAc62C8858b519b072B4B20aA8c8AdF9d]

// https://testnet.bscscan.com/address/0x8F9526b8BE110f83Dc0A218B47986305fBF7675d#writeContract

const useMultiTransfer = () => {
  const contract = useMultiTransferContract()
  const addTransaction = useTransactionAdder()
  const { chainId, account } = useActiveWeb3React()

  const getPrintUserAddress = (useradds: string[]) => {
    let result = ''
    useradds.map((address) => {
      if (isAddress(address)) {
        result += `${shortenAddress(address)} `
      }
    })
    return result + ''
  }

  const airdropNFTs = useCallback(
    async ({ collections, tokenids, useradds }: { collections: string[]; tokenids: string[]; useradds: string[] }) => {
      if (contract && account && chainId) {
        const params: any = [collections, tokenids, useradds]
        const tx: TransactionReceipt = await contract
          .airdropNFTs(...params)
          .then(async (response: TransactionResponse) => {
            addTransaction(response, {
              summary: `airdropNFTs to user address ${getPrintUserAddress(useradds)} `,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to airdropNFTs', error)
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [account, addTransaction, chainId, contract]
  )

  const airdropTokens = useCallback(
    async ({ useradds, tokenadds, amounts }: { useradds: string[]; tokenadds: string[]; amounts: string[] }) => {
      if (contract && account && chainId) {
        const params: any = [useradds, tokenadds, amounts]
        let bnbValue = BigNumber.from(0)
        tokenadds.map((address, index) => {
          if (address.toLocaleLowerCase() === AddressZero) {
            bnbValue = bnbValue.add(BigNumber.from(amounts[index]))
          }
        })
        if (bnbValue.gt(BigNumber.from(0))) {
          params.push({
            value: bnbValue,
          })
        }
        // console.log('airdropTokens params', params)
        const tx: TransactionReceipt = await contract
          .airdropTokens(...params)
          .then(async (response: TransactionResponse) => {
            addTransaction(response, {
              summary: `airdropTokens to user address ${getPrintUserAddress(useradds)} `,
            })
            return await response.wait()
          })
          .catch((error: Error) => {
            console.debug('Failed to airdropTokens', error)
            throw error
          })
        console.log('tx', tx)
        return tx
      }
    },
    [account, addTransaction, chainId, contract]
  )

  return {
    airdropNFTs,
    airdropTokens,
  }
}
export default useMultiTransfer
