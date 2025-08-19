import { createAction } from '@reduxjs/toolkit'

export const updateTheme = createAction<{ theme: string }>('theme/updateTheme')
export const updateDarkMode = createAction<{ isDarkMode: boolean }>('theme/updateDarkMode')
