import getConfig from 'next/config'
import { useMediaQuery } from 'react-responsive'
const { publicRuntimeConfig } = getConfig()

export enum BreakPoint {
  XL2,
  XL,
  LG,
  MD,
  SM,
  DEFAULT,
}

// https://tailwindcss.com/docs/responsive-design#customizing-breakpoints

export const useBreakPointMediaQuery = () => {
  const { breakpoints } = publicRuntimeConfig
  // console.log('breakpoints', breakpoints)
  const isSm = useMediaQuery({ query: `(min-width: ${breakpoints.sm})` })
  const isMd = useMediaQuery({ query: `(min-width: ${breakpoints.md})` })
  const isLg = useMediaQuery({ query: `(min-width: ${breakpoints.lg})` })
  const isXl = useMediaQuery({ query: `(min-width: ${breakpoints.xl})` })
  const is2Xl = useMediaQuery({ query: `(min-width: ${breakpoints['2xl']})` })
  if (is2Xl) {
    return BreakPoint.XL2
  }
  if (isXl) {
    return BreakPoint.XL
  }
  if (isLg) {
    return BreakPoint.LG
  }
  if (isMd) {
    return BreakPoint.MD
  }
  if (isSm) {
    return BreakPoint.SM
  }
  return BreakPoint.DEFAULT
}

export const useDesktopMediaQuery = () => {
  const { breakpoints } = publicRuntimeConfig
  return useMediaQuery({ query: `(min-width: ${breakpoints.lg})` })
}

export const useTouchDeviceMediaQuery = () => {
  return useMediaQuery({ query: `(hover: none) and (pointer: coarse)` })
}

export default useDesktopMediaQuery
