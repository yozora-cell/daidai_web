import Item, { ItemSkeleton } from 'app/features/nft/Item'
import { useNFTDetail } from 'app/services/apis/hooks'
import { NFTDetail } from 'app/services/apis/keys'
import { useChainId } from 'app/state/application/hooks'
import { useMemo } from 'react'

const NFTItem = ({ address, tokenId }: { address: string; tokenId: string }) => {
  const chainId = useChainId()
  const { data, error } = useNFTDetail(address, tokenId, chainId)
  const swrKey = useMemo(() => {
    if (address) {
      return NFTDetail(address, String(tokenId), chainId)
    }
    return undefined
  }, [address, chainId, tokenId])

  //   if (data) {
  //     console.log('NFTItem data', data)
  //   }
  return data && typeof data != 'undefined' ? (
    <Item data={data} swrKey={swrKey}></Item>
  ) : error && error.code != -2 ? (
    <ItemSkeleton></ItemSkeleton>
  ) : (
    <></>
  )
}
export default NFTItem
