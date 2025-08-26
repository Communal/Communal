import Link from 'next/link';

function Footer() {
  return (
    <footer className='bg-foreground text-white px-6 py-8 flex flex-col gap-2 items-start'>
      <h2 className='text-2xl font-bold mb-2'>Communal Shop</h2>
      <div className='flex items-center gap-2 mb-2'>
        <span className='font-semibold'>Contact Us :</span>
        <a href="https://wa.me/08128572911">
          <img
            src='/icons/whatsapp.png'
            alt='Contact us'
            className='w-6 h-6'

          />
        </a>
      </div>
      <div className='mb-2'>
        <span className='font-semibold'>Email :</span>
        <span className='ml-2'>communalone@gmail.com</span>
      </div>
      <div className='w-full flex justify-end'>
        <Link
          href='/faq'
          className='underline text-white text-lg font-semibold'>
          FAQ
        </Link>
      </div>
    </footer>
  );
}

export default Footer;