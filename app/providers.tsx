"use client";

import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import { Analytics } from "@vercel/analytics/react";
import { displayFontMapper, defaultFontMapper } from "@/app/styles/fonts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Default",
  setFont: () => {},
});


export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default" );

  return (

      <AppContext.Provider
        value={{
          font,
          setFont,
        }}
      >
        <body className={cn(displayFontMapper[font], defaultFontMapper[font])}>
          {children}
        </body>
        <Analytics />
      </AppContext.Provider>

  );
}