"use client"

import Link from "next/link"
import { Search, Menu } from "lucide-react"
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
import { useState } from "react"

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="logo" width={180} height={35} />
        </Link>
        {/* 桌面端导航 */}
        <NavigationMenu className="ml-6 hidden md:block" viewport={false}>
          <NavigationMenuList>
            {MenuItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="text-base hover:text-sky-900">{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent className="p-0">
                      <ul className="w-[200px] p-2">
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
        {/* 移动端菜单按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="打开菜单"
        >
          <Menu className="w-6 h-6" />
        </Button>
        {/* 桌面端搜索和github */}
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="输入搜索内容" className="w-64 pl-9" />
          </div>
          <div className="hidden md:block">
            <Link href="https://github.com/ledboot/crypto-hub" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Image src="/icons/github-mark.svg" alt="github" width={20} height={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* 移动端菜单弹出层 */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center mb-6">
              <Image src="/logo.svg" alt="logo" width={120} height={30} />
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setMobileMenuOpen(false)} aria-label="关闭菜单">
                ×
              </Button>
            </div>
            <nav>
              <ul className="space-y-2">
                {MenuItems.map((item) => (
                  <li key={item.title}>
                    {item.items ? (
                      <>
                        <div className="font-semibold mb-1">{item.title}</div>
                        <ul className="pl-2 space-y-1">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <Link
                                href={subItem.href}
                                className="block py-1 px-2 rounded hover:bg-accent"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className="block py-1 px-2 rounded hover:bg-accent"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" placeholder="输入搜索内容" className="w-full pl-9" />
              </div>
              <Link href="https://github.com/ledboot/crypto-hub" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <Image src="/icons/github-mark.svg" alt="github" width={20} height={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

