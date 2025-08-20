import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  variable: '--font-DMsans',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Communal Shop',
  description: '',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${dmSans.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                '!bg-fgColor-dark/60 backdrop-blur-md !rounded-[0.5rem] !drop-shadow-xs top-[9vh] py-3 px-5 !border-0 flex flex-col justify-center',
              title: '!text-white !text-center ml-5 !font-semibold',
              description: '!text-white/80 !text-center',
              success: '!text-white',
              error: '!text-white/80',
              warning: '!text-white/70',
            },
          }}
        />
      </body>
    </html>
  );
}