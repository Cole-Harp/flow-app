"use client"
import Link from 'next/link'
import { Poppins } from "next/font/google"

const font = Poppins({
    weight: "600",
    subsets: ["latin"]
})

import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../mode-toggle"
import { MobileSidebar } from './mobile-sidebar'

export const Navbar = () => {
    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 border-b-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <MobileSidebar/>
                <Link href="/">
                    <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary pl-4",
                    font.className
                    )}>
                        Roots?
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-x-3 pr-5">
                <Button variant="premium" size="sm">
                    Upgrade
                    <Sparkles className=" h-4 w-4 fill-white text-white ml-2" />
                </Button>
                <ModeToggle/>
                <UserButton />
            </div>
        </div>
    )
}