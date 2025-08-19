import { createReducer } from '@reduxjs/toolkit'

import { updateDarkMode, updateTheme } from './action'

export interface ThemeState {
  isDarkMode: boolean
  theme: string
}

const initialState: ThemeState = {
  isDarkMode: false,
  theme: 'lofi',
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateTheme, (state, { payload: { theme } }) => {
      state.theme = theme
    })
    .addCase(updateDarkMode, (state, { payload: { isDarkMode } }) => {
      state.isDarkMode = isDarkMode
    })
)
