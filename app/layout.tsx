import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import "./styles/globals.css"
import React from "react";

export const metadata: Metadata = {
  title: 'Learn App',
  description: 'W',
}

import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <body >
          

          <Providers>
              {children}
              </Providers>

        </body>
      </html>
    </ClerkProvider>
  );
}