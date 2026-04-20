import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import { ConvexClientProvider } from '@/components/ConvexClientProvider'
import { Toaster } from 'sonner'
import { PreloaderWrapper } from '@/components/ui/PreloaderWrapper'
import { LenisProvider } from '@/components/providers/LenisProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PersonaUI — Dynamic UI Personalization Engine',
  description: 'A living interface that observes, learns, and physically adapts to you in real-time.',
  keywords: ['AI', 'Personalization', 'Dashboard', 'Behavioral Intelligence'],
}

import { BackgroundBlob } from '@/components/layout/BackgroundBlob'
import { PremiumBackground } from '@/components/layout/PremiumBackground'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased text-primary overflow-x-hidden min-h-screen`}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
            <ConvexClientProvider>
              <BackgroundBlob />
              <PremiumBackground />
              <PreloaderWrapper>
                <LenisProvider>
                  {children}
                </LenisProvider>
              </PreloaderWrapper>
              <Toaster
                theme="dark"
                toastOptions={{
                  style: {
                    background: 'var(--bg-secondary)',
                    border: '0.5px solid var(--border)',
                    color: 'var(--text-primary)',
                    backdropFilter: 'saturate(180%) blur(20px)',
                    borderRadius: '14px',
                  },
                }}
              />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
