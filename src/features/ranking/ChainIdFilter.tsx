import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { NETWORK_ICON, NETWORK_LABEL } from 'app/config/networks'
import { SWITCH_NETWORKS } from 'app/config/support_networks'
import Image from 'app/features/common/Image'
import { useChainId } from 'app/state/application/hooks'
import { Fragment, useState } from 'react'

const ChainIdFilter = ({ onChangeChainId }: { onChangeChainId: (chainId: number | undefined) => void }) => {
  const { i18n } = useLingui()

  const chainId = useChainId()

  const [selected, setSelected] = useState<number | undefined>(undefined)

  return (
    <>
      <div>
        <Listbox
          value={selected}
          onChange={(selected) => {
            setSelected(selected)
            if (selected) {
              onChangeChainId(selected)
            } else {
              onChangeChainId(undefined)
            }
          }}
        >
          <div className="relative">
            <Listbox.Button className="relative flex flex-row items-center w-full">
              <button className="w-40 gap-2 btn btn-outline btn-sm">
                {selected ? (
                  <div className="flex flex-row items-center justify-between w-full gap-2">
                    <div className="avatar">
                      <div className="w-5 rounded-full">
                        <Image
                          src={NETWORK_ICON[selected]}
                          // src={defaultImg}
                          alt=""
                          // className="rounded-xl"
                          layout="responsive"
                          width={20}
                          height={20}
                          className="w-5 h-5 "
                        />
                      </div>
                    </div>
                    <div>{NETWORK_LABEL[selected]}</div>
                    <SelectorIcon className="w-4" aria-hidden="true" />
                  </div>
                ) : (
                  <>
                    {chainId ? (
                      <>
                        <div className="flex flex-row items-center justify-between w-full gap-2">
                          <div className="avatar">
                            <div className="w-5 rounded-full">
                              <Image
                                src={NETWORK_ICON[chainId]}
                                // src={defaultImg}
                                alt=""
                                // className="rounded-xl"
                                layout="responsive"
                                width={20}
                                height={20}
                                className="w-5 h-5 "
                              />
                            </div>
                          </div>
                          <div>{NETWORK_LABEL[chainId]}</div>
                          <SelectorIcon className="w-4" aria-hidden="true" />
                        </div>
                      </>
                    ) : (
                      <>
                        {i18n._(t`Network`)}
                        <SelectorIcon className="w-4" aria-hidden="true" />
                      </>
                    )}
                  </>
                )}
              </button>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-20 shadow-lg bg-base-100">
                {SWITCH_NETWORKS.sort((key) => (chainId === key ? -1 : 0)).map((key: number, i: number) => {
                  return (
                    <>
                      <Listbox.Option
                        key={`${i}/${key}/chainidfilter`}
                        className={({ active }) =>
                          `cursor-pointer select-none relative p-4 ${active ? 'bg-base-200' : ''}`
                        }
                        value={key}
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex flex-row items-center justify-start w-full gap-4">
                              <div className="avatar">
                                <div className="w-5 rounded-full">
                                  <Image
                                    src={NETWORK_ICON[key]}
                                    // src={defaultImg}
                                    alt=""
                                    // className="rounded-xl"
                                    layout="responsive"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 "
                                  />
                                </div>
                              </div>
                              <div className="flex flex-row items-center justify-between grow-1">
                                <Typography className="w-full truncate" weight={700}>
                                  {NETWORK_LABEL[key]}
                                </Typography>
                                {selected ? <CheckIcon className="w-5 h-5 text-info" aria-hidden="true" /> : null}
                              </div>
                            </div>
                          </>
                        )}
                      </Listbox.Option>
                    </>
                  )
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </>
  )
}

export default ChainIdFilter
