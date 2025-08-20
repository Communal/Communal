import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';

function BackHome() {
  return (
    <Link
      href='/'
      className='bg-foreground flex text-background px-3 rounded-lg w-fit h-fit gap-1 py-2 text-sm'>
      <ChevronLeftIcon className='size-5' />
      <span>Home</span>
    </Link>
  );
}

export default BackHome;
