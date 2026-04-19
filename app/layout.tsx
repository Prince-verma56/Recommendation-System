import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import { ConvexClientProvider } from '@/components/ConvexClientProvider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'PersonaUI — Dynamic UI Personalization Engine',
  description: 'A living interface that observes, learns, and physically adapts to you in real-time.',
  keywords: ['AI', 'Personalization', 'Dashboard', 'Behavioral Intelligence'],
}

function AmbientBackground() {
  return (
    <div className="ambient-bg">
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body className="antialiased text-primary">
          <ConvexClientProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
              <AmbientBackground />
              {children}
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
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
