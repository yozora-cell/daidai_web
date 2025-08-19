import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Page = () => {
  const router = useRouter()
  return (
    <div className="flex flex-row items-center w-full h-full gap-4 p-4 mt-40">
      <div className="flex flex-col items-center w-full sm:items-end sm:w-6/12">
          <div className="block sm:hidden">
            <Image src="/images/404.png" alt="404" layout="intrinsic" width={100} height={100} />
          </div>
        <Typography variant="hero" className="text-[#424142]" weight={700}>OOPS!!</Typography>
        <Typography variant="h1" className="mt-2 text-[#424142]" weight={700}>404:NOT_FOUND</Typography>
        <Typography variant="h2" className="mt-2 text-[#c4c4c4]">We have lost this page.</Typography>
        <Button
          className="mt-4"
          onClick={() => {
            router.push('/home')
          }}
        >
          Return Home
        </Button>
      </div>
      <div className="hidden w-6/12 sm:block">
        <Image src="/images/404.png" alt="404" layout="intrinsic" width={250} height={250} />
      </div>
    </div>
  )
}
export default Page
