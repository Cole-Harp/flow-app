"use client";

import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import { Analytics } from "@vercel/analytics/react";
import { displayFontMapper, defaultFontMapper } from "@/app/styles/fonts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from 'next/font/google'

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Mono",
  setFont: () => {},
});

const inter = Inter({ subsets: ['latin'] })

import "./styles/globals.css"
export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Mono" );

  return (

      <AppContext.Provider
        value={{
          font,
          setFont,
        }}
      >
        
        <body className={cn(displayFontMapper[font], defaultFontMapper[font], "bg-white", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem enableColorScheme>
          {children}
          </ThemeProvider>
        </body>
        <Analytics />
      </AppContext.Provider>


  );
}