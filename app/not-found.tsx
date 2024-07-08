import { Button } from '@/components/ui/button'
import Link from 'next/link'
 
export default async function NotFound() {
  return (
    <div className='flex w-full gap-4 h-full items-center justify-center flex-col'>
      <div className='text-center'>
      <p className="text-4xl font-bold">404 - Page not found</p>
      <p className='mt-6 '>The page you&apos;re looking for does not exist!</p>
      </div>
      <Link href={'/'}>
        <Button className='font-bold'>
          Go to your Dashboard
        </Button>
      </Link>
    </div>
  )
}