// import { GlobeIcon, SwitchVerticalIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { SwitchVerticalIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { defaultChainId } from 'app/config/default_chainid'
// import { SUSHI_ADDRESS } from '@sushiswap/core-sdk'
// import { RocketIcon, WalletIcon } from 'app/components/Icon'
// import { WalletIcon } from 'app/components/Icon'
import { Feature } from 'app/enums'
import { featureEnabled } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useActiveWeb3React } from 'app/services/web3'
import { ReactNode, useMemo } from 'react'

export interface MenuItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  icon?: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()
  const isDesktop = useDesktopMediaQuery()

  return useMemo(() => {
    if (!chainId) return []
    const menu: Menu = []

    if (!isDesktop) {
      menu.push({
        key: 'home',
        title: i18n._(t`Home`),
        link: `/home`,
      })
    }

    if (featureEnabled(Feature.EXPLORE, !account ? defaultChainId : chainId)) {
      menu.push({
        key: 'explore',
        title: i18n._(t`Explore`),
        link: `/explore`,
      })
    }

    if (featureEnabled(Feature.INO, !account ? defaultChainId : chainId)) {
      menu.push({
        key: 'ino',
        title: i18n._(t`INO`),
        link: `/ino`,
      })
    }

    if (featureEnabled(Feature.RANKINGS, !account ? defaultChainId : chainId)) {
      menu.push({
        key: 'ranking',
        title: i18n._(t`Ranking`),
        // link: `/ranking`,
        items: [
          {
            key: 'ranking/collection',
            title: i18n._(t`Collection`),
            link: '/ranking/collection',
          },
          {
            key: 'ranking/user',
            title: i18n._(t`User`),
            link: '/ranking/user',
          },
        ],
      })
    }

    if (featureEnabled(Feature.GACHA, !account ? defaultChainId : chainId)) {
      menu.push({
        key: 'gacha',
        title: i18n._(t`Gacha`),
        link: `/gacha`,
      })
    }

    if (account) {
      menu.push({
        key: 'portfolio',
        title: i18n._(t`My profile`),
        // link: `/account/${account}`,
        link: `/account`,
        // icon: <WalletIcon width={20} />,
      })
    }

    if (!isDesktop) {
      if (account) {
        menu.push({
          key: 'affiliate',
          title: i18n._(t`Affiliate`),
          link: `/affiliate`,
        })
        menu.push({
          key: 'setting',
          title: i18n._(t`Setting`),
          link: `/account/settings`,
        })
      }
    }

    const legacyItems = [
      {
        key: 'swap',
        title: i18n._(t`Swap`),
        link: '/swap',
      },
      // {
      //   key: 'limit',
      //   title: i18n._(t`Limit order`),
      //   link: '/limit-order',
      //   disabled: !featureEnabled(Feature.LIMIT_ORDERS, chainId),
      // },
      {
        key: 'pool',
        title: i18n._(t`Pool`),
        link: '/pool',
      },
      {
        key: 'add',
        title: i18n._(t`Add`),
        link: '/add',
      },
      {
        key: 'import',
        title: i18n._(t`Import`),
        link: '/find',
      },
      // {
      //   key: 'migrate',
      //   title: i18n._(t`Migrate`),
      //   link: '/migrate',
      // }
    ]

    // By default show just a swap button
    let legacy: MenuItem = {
      key: 'legacy',
      title: i18n._(t`Legacy`),
      icon: <SwitchVerticalIcon width={20} />,
      // items: legacyItems.filter((item) => !item?.disabled),
      items: legacyItems,
    }

    // menu.push(legacy)

    return menu.filter((el) => Object.keys(el).length > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, i18n, isDesktop, i18n.locale])
}

export default useMenu
