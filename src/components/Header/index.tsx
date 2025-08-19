import Mobile from 'app/components/Header/Mobile'
import { BreakPoint,useBreakPointMediaQuery } from 'app/hooks/useDesktopMediaQuery'
import React, { FC, useMemo } from 'react'

import Desktop from './Desktop'

const Header: FC = () => {
  // const isDesktop = useDesktopMediaQuery()
  const breakpoint = useBreakPointMediaQuery()
  // console.log('breakpoint', breakpoint)
  const isDesktop = useMemo(()=>{
    if( breakpoint === BreakPoint.XL || breakpoint === BreakPoint.XL2 ){
      return true
    }
    return false
  }, [breakpoint])
  return <>{isDesktop ? <Desktop /> : <Mobile />}</>
}

export default Header
