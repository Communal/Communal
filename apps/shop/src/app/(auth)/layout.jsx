import { DM_Sans } from 'next/font/google';
import '../globals.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProtectedRoutes from "@/components/ProtectedRoutes";
import { Toaster } from 'sonner';


const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  variable: '--font-DMsans',
  subsets: ['latin'],
});


export default function AuthLayout({ children }) {
  return (
    <ProtectedRoutes>
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
      <div className={`min-h-screen flex flex-col bg-background pt-32 ${dmSans.variable}`}>
        <Header />
        <div className="flex flex-1">
          <aside className="hidden md:flex flex-col justify-between w-1/4 bg-foreground text-background p-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Welcome to Communal Shop
              </h2>
              <p className="text-lg">
                Shop together, save together. Join our community and enjoy exclusive deals!
              </p>
            </div>
            <div className="text-sm opacity-70">
              &copy; {new Date().getFullYear()} Communal Shop
            </div>
          </aside>
          <main className="flex-1 flex w-full justify-center px-3 pt-3">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </ProtectedRoutes>
  );
}
