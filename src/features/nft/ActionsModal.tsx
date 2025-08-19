import { Dialog, Transition } from '@headlessui/react'
import { classNames } from 'app/functions'
import { Fragment, ReactNode } from 'react'

export default function ActionsModal({
  isOpen,
  close,
  content,
  maxWidthClassName = 'max-w-md',
}: {
  isOpen: boolean
  close: () => void
  content: ReactNode
  maxWidthClassName?: string
}) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={close}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
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
              <div
                className={classNames(
                  maxWidthClassName,
                  'inline-block w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform border shadow-xl bg-base-100 rounded-2xl'
                )}
              >
                {content}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
