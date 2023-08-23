"use client";

import "@/app/styles/prosemirror.css";
import React from "react"

import { Metadata } from "next";


const title =
  "Learn App";
const description =
  "Novel is a Notion-style WYSIWYG editor";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@steventey",
  },
  metadataBase: new URL("https://novel.sh"),
  themeColor: "#ffffff",
};



export default function FlowLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
     <body>
        


        {children}

 

      </body>

    </html>
  );
}