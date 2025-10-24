import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import ClientNavbarWrapper from '@/components/ClientNavbarWrapper';
import ConditionalLayout from '@/components/ConditionalLayout';
import WithCredentialsProvider from '@/components/WithCredentialsProvider'
import SuppressHydrationWarning from '@/components/suppress-hydration-warnig'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CareerAdvance - Transform Your Career Journey',
  description: 'Join the future of work with our AI-powered platform connecting talent, opportunities, and innovation. Next-generation career development for ambitious professionals.',
  generator: 'Seoulix Technology',
  icons: {
    icon: '/Favicon.png', // ✅ This line adds your favicon
  },  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <SuppressHydrationWarning />
        <WithCredentialsProvider />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster />
      </body>
    </html>
  )
}