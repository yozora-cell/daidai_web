import { createAction } from '@reduxjs/toolkit'
import { TokenSys } from 'app/types/daidai'

export const loadTokenList = createAction<{ list: TokenSys[] }>('token/loadTokenList')
