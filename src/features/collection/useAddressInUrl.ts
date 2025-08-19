import { ChainId } from '@sushiswap/core-sdk'
import { isAddress } from 'app/functions'
import { useRouter } from 'next/router'

export const useAddressInUrl = (redirectPath: string): string | undefined => {
  const router = useRouter()
  const address = router.query.address as string

  if (!address || !isAddress(address)) {
    void router.replace(redirectPath)
  }

  return address
}

export const useChainidAddressInUrl = (
  redirectPath: string
):
  | {
      chainid: string
      address: string
    }
  | undefined => {
  const router = useRouter()
  const address = router.query.address as string
  const chainid = router.query.chainid as string
  if (!chainid || !(Number(chainid) in ChainId) || !address || !isAddress(address)) {
    void router.replace(redirectPath)
  }

  return {
    chainid,
    address,
  }
}

export const useChainidAddressTokenidInUrl = (
  redirectPath: string
):
  | {
      chainid: string
      address: string
      tokenid: string
    }
  | undefined => {
  const router = useRouter()
  const address = router.query.address as string
  const chainid = router.query.chainid as string
  const tokenid = router.query.tokenid as string
  if (
    !chainid ||
    !(Number(chainid) in ChainId) ||
    !address ||
    !isAddress(address) ||
    tokenid == undefined ||
    tokenid == null
  ) {
    void router.replace(redirectPath)
  }

  return {
    chainid,
    address,
    tokenid,
  }
}

export const useAddressTokenidInUrl = (
  redirectPath: string
):
  | {
      address: string
      tokenid: string
    }
  | undefined => {
  const router = useRouter()
  const address = router.query.address as string
  const tokenid = router.query.tokenid as string

  if (!address || !isAddress(address)) {
    void router.replace(redirectPath)
  }

  return {
    address,
    tokenid,
  }
}
