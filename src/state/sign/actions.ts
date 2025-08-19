import { createAction } from '@reduxjs/toolkit'

export const updateIsSigning = createAction<{
  isSigning: boolean
}>('sign/updateIsSigning')
