// import { ArrowDownIcon } from '@heroicons/react/solid'
// import { t } from '@lingui/macro'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
// import { fetchAPI } from '../../lib/api'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useWalletModalToggle } from 'app/state/application/hooks'
// import { Feature } from 'app/enums/Feature'
// import NetworkGuard from 'app/guards/Network'
import { NextSeo } from 'next-seo'
import React, { useCallback, useState } from 'react'

const Home = () => {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [currency, setCurrency] = useState(undefined)
  const handleInputSelect = useCallback((inputCurrency) => {
    console.log('handleInputSelect inputCurrency', inputCurrency)
    setCurrency(inputCurrency)
  }, [])
  return (
    <>
      <NextSeo title="Demo" />
      <div className="container mx-auto">
        {account ? (
          <>
            <CurrencySearch
              currency={currency}
              onSelect={handleInputSelect}
              spendFromWallet={true}
              id={'test_button'}
              // 这里要传undefined才有检索结果的
              currencies={undefined}
              hideSearchModal={false}
            />
          </>
        ) : (
          <>
            <Typography variant="base" className="py-2 text-center">
              Please click connect wallet to continue
            </Typography>

            <Button fullWidth color="primary" onClick={toggleWalletModal} className="rounded-2xl md:rounded">
              connect wallet
            </Button>
          </>
        )}
      </div>
    </>
  )
}

const CurrencySearch = ({
  currency,
  onSelect,
  spendFromWallet,
  id,
  currencies,
  hideSearchModal,
}: {
  currency: Currency | undefined
  onSelect: (x: Currency) => void
  spendFromWallet: boolean
  id: string
  currencies: [] | undefined
  hideSearchModal: boolean
}) => {
  const { i18n } = useLingui()

  const trigger = currency ? (
    <div id={id} className={classNames('flex items-center')}>
      <CurrencyLogo currency={currency} className="!rounded-full overflow-hidden" size={20} />
      <Typography variant="sm" className="!text-xl" weight={700}>
        {!spendFromWallet ? currency.wrapped.symbol : currency.symbol}
      </Typography>
      {!hideSearchModal && <ChevronDownIcon width={18} />}
    </div>
  ) : (
    <Button color="primary" variant="filled" size="sm" id={id} className="!rounded-full !px-2 !py-0 !h-[32px] !pl-3">
      {i18n._(t`Select a Token`)}
      <ChevronDownIcon width={18} />
    </Button>
  )

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center">
        {!hideSearchModal ? (
          <CurrencySearchModal
            selectedCurrency={currency}
            onCurrencySelect={(currency) => onSelect && onSelect(currency)}
            trigger={trigger}
            currencyList={currencies}
          />
        ) : (
          trigger
        )}
      </div>
    </div>
  )
}

// Home.Guard = NetworkGuard(Feature.HOME)
export default Home
