import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Audio App',
  description: 'Store and analyze your audio files',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-200`}>
        <Header />
        <div className="flex flex-col min-h-screen pt-[72px]"> {/* Add padding-top to account for fixed header */}
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}