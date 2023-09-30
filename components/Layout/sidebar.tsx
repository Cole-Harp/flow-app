"use client"

import { cn } from "@/lib/utils";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Home, LayoutDashboard } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


export const Sidebar = () => {
    const pathName = usePathname();
    const router = useRouter();
    const routes = [
        {
            icon: Home,
            href: "/",
            label: "Home",
            pro: false,
        },
        {
            icon: LayoutDashboard,
            href: "/Dashboard",
            label: "Roots",
            pro: false
        }
    ]

    const onNavigate = (url: string, pro: boolean) => {

        return router.push(url)
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen text-primary bg-secondary">
          <div className="p-3 flex flex-1 justify-center">
            <div className="space-y-2 flex flex-col justify-between items-center">
              <div className="pl-2">
                {routes.map((route) => (
                  <div
                    onClick={() => onNavigate(route.href, route.pro)}
                    key={route.href}
                    className={cn(
                      "text-muted-foreground text-xs group flex px-5 mt-2 w-11/12 justify-center font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                      pathName === route.href && "bg-primary/10 text-primary"
                    )}
                  >
                    <div className="flex flex-col gap-y-2 items-center pb-2 mt-2">
                      <route.icon className="h-6 w-6" />
                      {route.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-col gap-y-2 items-center text-center mt-auto fixed bottom-0 text-muted-foreground text-xs group flex p-3 font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition">
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      );
}

export const ExampleSidebar = () => {
    const pathName = usePathname();
    const router = useRouter();
    const routes = [
        {
            icon: Home,
            href: "/",
            label: "Home",
            pro: false,
        },
        {
            icon: LayoutDashboard,
            href: "/Dashboard",
            label: "Roots",
            pro: false
        }
    ]

    const onNavigate = (url: string, pro: boolean) => {

        return router.push(url)
    }
    return (
        <div className="flex flex-col justify-center items-center h-screen text-primary bg-secondary">
          <div className="p-3 flex flex-1 justify-center">
            <div className="space-y-2 flex flex-col justify-between items-center">
              <div className="pl-2">
                {routes.map((route) => (
                  <div
                    onClick={() => onNavigate(route.href, route.pro)}
                    key={route.href}
                    className={cn(
                      "text-muted-foreground text-xs group flex px-5 mt-2 w-11/12 justify-center font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                      pathName === route.href && "bg-primary/10 text-primary"
                    )}
                  >
                    <div className="flex flex-col gap-y-2 items-center pb-2 mt-2">
                      <route.icon className="h-6 w-6" />
                      {route.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-col gap-y-2 items-center text-center mt-auto fixed bottom-0 text-muted-foreground text-xs group flex p-3 font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition">
                <SignInButton />
              </div>
            </div>
          </div>
        </div>
      );
}