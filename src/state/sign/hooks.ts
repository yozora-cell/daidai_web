import { AppState } from 'app/state'
import { useAppDispatch } from 'app/state/hooks'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { updateIsSigning } from './actions'

// 目前使用的入口只有useSignAndVerify里面的SignatureUpdater和弹框ui那里，也就是用户拒绝签名的时候
// 但是用户后面刷新页面的话，这个弹框ui会再次出现
export function useSetIsSigning() {
  const dispatch = useAppDispatch()

  const updateFun = useCallback(
    (isSigning: boolean) => {
      dispatch(updateIsSigning({ isSigning: isSigning }))
    },
    [dispatch]
  )

  return updateFun
}
// isSigning用于判断是否需要执行签名弹窗
export function useIsSigning() {
  return useSelector<AppState, AppState['sign']['isSigning']>((state) => state.sign.isSigning)
}
