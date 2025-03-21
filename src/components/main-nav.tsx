"use client"

import Link from "next/link"
import { Search} from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MenuItems } from "@/constant"
import Image from "next/image"
import LogoIcon from "@/app/icons/logo.svg"
import GithubIcon from "@/app/icons/github-mark.svg"

export function MainNav() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={LogoIcon} alt="logo" width={180} height={35} />
        </Link>
        <NavigationMenu className="ml-6 relative">
          <NavigationMenuList>
            {MenuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="text-base hover:text-sky-900">{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-[200px] p-2 relative">
                        {item.items.map((subItem) => (
                          <li key={subItem.title} className="text-sm">
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                {subItem.title}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={item.href || "#"} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="输入搜索内容" className="w-64 pl-9" />
          </div>
          <div>
            <Link href="https://github.com/ledboot/crypto-hub" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Image src={GithubIcon} alt="github" />
            </Button>
          </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

