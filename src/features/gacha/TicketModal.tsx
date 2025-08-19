import { Dialog, Transition } from '@headlessui/react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { GachaSignature } from 'app/types/daidai'
import { Fragment, useMemo } from 'react'

type TicketModalProps = {
  show: boolean
  onClose: () => void
  ticketData?: GachaSignature[]
  usedNonce: Map<number, boolean>
  curTicket?: GachaSignature
  setCurTicket: React.Dispatch<React.SetStateAction<GachaSignature | undefined>>
}

export default function TicketModal({
  show,
  onClose,
  ticketData,
  usedNonce,
  curTicket,
  setCurTicket,
}: TicketModalProps) {
  const { i18n } = useLingui()

  const tickets = useMemo(() => {
    if (usedNonce && ticketData) {
      const result = ticketData
        .map((item) => {
          const nonce = item.nonce
          if (usedNonce.has(nonce) && usedNonce.get(nonce) === false) {
            return item
          }
        })
        .filter((el) => el)
      return result as GachaSignature[]
    }

    return []
  }, [ticketData, usedNonce])

  function handleSelectTicket(v: GachaSignature) {
    setCurTicket(v)
    setTimeout(() => {
      onClose()
    }, 250)
  }

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-8 md:px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="fixed inset-0"
              style={{
                background: 'rgba(0, 0, 0, 0.37)',
                backgroundSize: 'cover',
              }}
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full p-4 my-8 overflow-hidden text-left align-middle transition-all transform border shadow-xl bg-base-100 rounded-2xl max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
                {tickets.map((el) => {
                  return (
                    <div
                      key={el.nonce}
                      className={classNames(
                        'card shadow-xl transition-colors duration-500',
                        curTicket?.nonce === el.nonce
                          ? 'text-primary-content bg-primary'
                          : 'bg-primary-content text-primary'
                      )}
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-center items-center flex-col">
                          <Typography variant="lg" className="" weight={700}>
                            {i18n._(t`FREE MINT TIME`)}
                          </Typography>
                          <Typography className="md:!text-8xl !text-7xl" weight={700}>
                            {el.times}
                          </Typography>
                        </div>
                        <div className="card-actions justify-end">
                          {curTicket?.nonce === el.nonce ? (
                            ''
                          ) : (
                            <button
                              onClick={() => {
                                handleSelectTicket(el)
                              }}
                              className="btn !rounded-lg btn-primary btn-outline "
                            >
                              {i18n._(t`Select Ticket`)}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
