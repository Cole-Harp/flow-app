
import type { Metadata } from 'next'
import {
  ClerkProvider
} from "@clerk/nextjs";
import "./styles/globals.css"
import 'reactflow/dist/style.css';
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from './providers';
import { cn } from '@/lib/utils';



export const metadata: Metadata = {
  title: 'Learn App',
  description: 'W',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("bg-white")}>
          <Providers>
                {children}
         </Providers>
        </body>
        
      </html>
    </ClerkProvider>
  );
}