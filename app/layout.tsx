import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
// import "@/app/styles/globals.css";
import "./styles/editor.css"
import "./styles/globals.css";
import "./globals.css"
import "./styles/prosemirror.css";


import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider'
// import { Toaster } from '@/components/ui/toaster';
// import { ProModal } from '@/components/pro-modal';



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learn App',
  description: 'W',
}

import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("bg-secondary", inter.className)}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Providers>
              {children}
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}