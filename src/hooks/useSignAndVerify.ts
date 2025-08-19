// import { storageAvailable } from 'app/functions'
import { checkAuth, getNonce, verifySignature } from 'app/services/apis'
import { useAccount } from 'app/state/application/hooks'
import { useSetIsSigning } from 'app/state/sign/hooks'
import { useAuthToken, useSetAuthToken } from 'app/state/user/hooks'
import useSign from 'hooks/useSignMessage'
import { useCallback, useEffect } from 'react'

declare global {
  interface Window {
    isSigning: boolean
  }
}

const isBrowser = () => typeof window !== 'undefined'

if (isBrowser()) {
  window.isSigning = false
}

// 2022.08.22 没用到
export const getIsSigning = () => {
  // if (storageAvailable()) {
  //   const result = window.localStorage.getItem('isSigning')
  //   // console.log('getIsSigning', result, new Date().getTime())
  //   if (result == 'true') {
  //     return true
  //   }
  //   return false
  // }
  // return false
  if (!isBrowser()) {
    return false
  }
  console.log('getIsSigning', window.isSigning)
  if (window.isSigning !== undefined) {
    return window.isSigning
  }
  return false
}

export const setIsSigning = (isSigning: boolean) => {
  if (!isBrowser()) {
    return
  }
  // if (storageAvailable()) {
  //   window.localStorage.setItem('isSigning', String(isSigning))
  // }
  window.isSigning = isSigning
}

export const useCheckAuth = (account: string | null | undefined, authToken: string | null) => {
  const setAuthToken = useSetAuthToken()
  useEffect(() => {
    if (account && authToken && authToken.length > 0) {
      checkAuth().catch((error) => {
        if (error.response.status === 401) {
          // 清空token
          setAuthToken(account, '')
        }
      })
    }
  }, [account, authToken, setAuthToken])
}

const useSignAndVerify = () => {
  const signFunc = useSign()
  const setAuthToken = useSetAuthToken()

  const cb = useCallback(
    async (account: string | null | undefined, authToken: string | null): Promise<boolean> => {
      if (account && !authToken) {
        // 获取随机数
        const nonce = await getNonce()
        // 调用metamask进行签名
        let signature = ''
        await signFunc(nonce)
          .then((res) => {
            signature = res
            return Promise.resolve(true)
          })
          .catch((error) => {
            return Promise.reject(false)
          })
        // 验证签名的合法性
        const verifyResult = await verifySignature(nonce, signature)
        if (verifyResult) {
          setAuthToken(account, verifyResult)
          return Promise.resolve(true)
        }
        // eslint-disable-next-line
        return Promise.reject(false)
      }
      // eslint-disable-next-line
      return Promise.resolve(true)
    },
    [signFunc, setAuthToken]
  )
  return cb
}

const useIsShouldSign = () => {
  const setIsSigning = useSetIsSigning()
  return useCallback(
    (account: string | null | undefined, authToken: string | null) => {
      // 连接钱包了但是没有签名
      if (account && !authToken) {
        setIsSigning(true)
      } else {
        setIsSigning(false)
      }
    },
    [setIsSigning]
  )
}

export const SignatureUpdater = () => {
  const account = useAccount()
  const authToken = useAuthToken(account)
  const signAndVerify = useSignAndVerify()
  const judgeIsShouldSign = useIsShouldSign()
  useEffect(() => {
    setTimeout(() => {
      // 这里从调用直接的签名改为调用判断是否需要签名的函数
      // 因为这里延时了4秒，所以基本上AuthUpdater的函数是执行完的
      // signAndVerify(account, authToken)
      judgeIsShouldSign(account, authToken)
    }, 4000)
  }, [account, authToken, judgeIsShouldSign, signAndVerify])

  return null
}

export const AuthUpdater = () => {
  const account = useAccount()
  const authToken = useAuthToken(account)
  useCheckAuth(account, authToken)

  return null
}

export default useSignAndVerify
