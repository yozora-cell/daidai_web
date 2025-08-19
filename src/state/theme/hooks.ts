import { AppState } from 'app/state'
import { useAppSelector } from 'app/state/hooks'
// import { useAppDispatch } from 'app/state/hooks'
// import { useCallback } from 'react'

// import { updateDarkMode, updateTheme } from './action'

export function useTheme(): AppState['theme']['theme'] {
  return useAppSelector((state) => state.theme.theme)
}

export function useIsDarkMode(): AppState['theme']['isDarkMode'] {
  return useAppSelector((state) => state.theme.isDarkMode)
}

// export function useUpdateTheme(theme: string): () => void {
//   const dispatch = useAppDispatch()
//   return useCallback(() => dispatch(updateTheme({ theme: theme })), [dispatch, theme])
// }

// export function useUpdateIsDarkMode(isDarkMode: boolean): () => void {
//   const dispatch = useAppDispatch()
//   return useCallback(() => dispatch(updateDarkMode({ isDarkMode: isDarkMode })), [dispatch, isDarkMode])
// }
