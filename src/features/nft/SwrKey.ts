import { buyOrderByAccount, buyOrderList, NFTDetail as NFTDetailKey } from 'app/services/apis/keys'
import { useActiveWeb3React } from 'app/services/web3'
import { useChainId } from 'app/state/application/hooks'
import { NFTDetail } from 'app/types/daidai'
import { useMemo } from 'react'

export function useDetailKey(data: NFTDetail) {
  const chainId = useChainId()
  const swrKey = useMemo(() => {
    const address = data.contract ?? ''
    const tokenid = data.tokenId ? data.tokenId : ''
    if (address) {
      return NFTDetailKey(address, String(tokenid), chainId)
    }
    return undefined
  }, [chainId, data.contract, data.tokenId])
  console.log('useDetailKey', data, swrKey)
  return swrKey
}

export function useOffer(data: NFTDetail) {
  const chainId = useChainId()
  const { account } = useActiveWeb3React()
  const swrKey = useMemo(() => {
    return buyOrderByAccount({
      chainId: Number(chainId),
      collection: data.contract ?? '',
      tokenId: Number(data.tokenId),
      address: account ?? '',
    })
  }, [account, chainId, data.contract, data.tokenId])
  console.log('useOffer', data, swrKey)
  return swrKey
}

export function useOfferList(data: NFTDetail) {
  const chainId = useChainId()
  const swrKey = useMemo(() => {
    const address = data.contract ?? ''
    const tokenid = data.tokenId ? data.tokenId : ''
    if (address && chainId) {
      return buyOrderList({
        chainId: chainId,
        collection: address,
        tokenId: Number(tokenid),
      })
    }
    return undefined
  }, [chainId, data.contract, data.tokenId])
  console.log('useOfferList', data, swrKey)
  return swrKey
}
