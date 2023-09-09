import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import "./styles/globals.css"
import 'reactflow/dist/style.css';
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";

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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem key={new Date().toISOString()}>
              {children}
              </ThemeProvider>
          </Providers>

        </body>
      </html>
    </ClerkProvider>
  );
}