import AutoFitImage from 'app/components/AutoFitImage'
import HeadlessUIModal from 'app/components/Modal/HeadlessUIModal'

const ModalImage = ({ url, isOpen, dismiss }: { url: string; isOpen: boolean; dismiss: () => void }) => {
  return (
    <>
      <HeadlessUIModal.Controlled
        // @ts-ignore TYPE NEEDS FIXING
        isOpen={isOpen}
        onDismiss={() => dismiss()}
        transparent={true}
        maxWidth="3xl"
      >
        <div className="w-full h-full p-4">
          <AutoFitImage
            imageUrl={url}
            defaultHeightStyle="100%"
            defaultWidthStyle="100%"
            roundedClassName=""
          ></AutoFitImage>
        </div>
      </HeadlessUIModal.Controlled>
    </>
  )
}

export default ModalImage
