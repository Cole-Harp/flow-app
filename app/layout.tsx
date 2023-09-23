import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import "./styles/globals.css"
import 'reactflow/dist/style.css';
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from '@/components/Flow/Toolbar/ChatBox/Providers';

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
          <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem key={new Date().toISOString()}>
              {children}
              </ThemeProvider>
              </QueryProvider>
          </Providers>

        </body>
      </html>
    </ClerkProvider>
  );
}