import { useActiveWeb3React } from 'app/services/web3'
import { useCallback } from 'react'

// 缩进将会影响签名的验证
const _recoverMsg = (account: string, nonce: number) => {
  return `
Welcome to DAIDAI!

Click "Sign" to sign in. No password needed!

Wallet address:
${account}

Nonce:
${nonce}
`
}

const useSign = () => {
  const { account, library } = useActiveWeb3React()
  const cb = useCallback(
    async (nonce: number): Promise<string> => {
      if (library && account) {
        const signer = library.getSigner()
        const msg = _recoverMsg(account.toLowerCase(), nonce)
        const signature = await signer.signMessage(msg)
        return signature
      }
      return ''
    },
    [account, library]
  )
  return cb
}

export default useSign
