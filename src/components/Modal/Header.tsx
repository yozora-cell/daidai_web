import { ArrowLeftIcon, XIcon } from '@heroicons/react/outline'
import Typography from 'app/components/Typography'
import React, { FC, ReactNode } from 'react'

export interface ModalHeaderProps {
  header: string | ReactNode
  subheader?: string
  onClose?(): void
  onBack?(): void
}

const ModalHeader: FC<ModalHeaderProps> = ({ header, subheader, onBack, onClose }) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col justify-center gap-1">
        <Typography weight={700} className="flex items-center gap-3 text-base-content">
          {onBack && (
            <ArrowLeftIcon onClick={onBack} width={24} height={24} className="cursor-pointer text-base-content" />
          )}
          {header}
        </Typography>
        {subheader && <Typography variant="sm">{subheader}</Typography>}
      </div>
      {onClose && (
        <div className="flex items-center justify-center w-6 h-6 cursor-pointer" onClick={onClose}>
          <XIcon width={24} height={24} className="text-base-content" />
        </div>
      )}
    </div>
  )
}

export default ModalHeader
