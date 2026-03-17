'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MenuItems } from '@/constant'
import { useI18n } from '@/components/i18n-provider'
import type { Locale } from '@/lib/i18n'

export function MainNav() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const { t, locale, setLocale } = useI18n()

	const setLanguage = (nextLocale: Locale) => {
		setLocale(nextLocale)
	}

	return (
		<header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 text-slate-100 backdrop-blur-xl">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6">
				<div className="hidden items-center md:flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<Image src="/logo.svg" alt="logo" width={170} height={33} className="brightness-[1.25]" />
					</Link>
					<NavigationMenu viewport={false}>
						<NavigationMenuList>
							{MenuItems.map((item) => (
								<NavigationMenuItem key={item.key}>
									{item.items ? (
										<>
											<NavigationMenuTrigger className="bg-transparent text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white focus:bg-white/10 data-[state=open]:bg-white/10 data-[state=open]:text-white">
												{t(item.key, item.title)}
											</NavigationMenuTrigger>
											<NavigationMenuContent className="border border-white/10 bg-slate-900/95 p-1 shadow-2xl backdrop-blur">
												<ul className="w-[220px] p-1">
													{item.items.map((subItem) => (
														<li key={subItem.key} className="text-sm">
															<NavigationMenuLink asChild>
																<Link
																	href={subItem.href}
																	className="block rounded-md px-3 py-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
																>
																	{t(subItem.key, subItem.title)}
																</Link>
															</NavigationMenuLink>
														</li>
													))}
												</ul>
											</NavigationMenuContent>
										</>
									) : (
										<Link href={item.href || '#'} legacyBehavior passHref>
											<NavigationMenuLink
												className={`${navigationMenuTriggerStyle()} bg-transparent text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white focus:bg-white/10`}
											>
												{t(item.key, item.title)}
											</NavigationMenuLink>
										</Link>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<Button
					variant="ghost"
					size="icon"
					className="text-slate-100 hover:bg-white/10 md:hidden"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					aria-label={t('nav.menu.open', 'Open menu')}
				>
					<Menu className="h-6 w-6" />
				</Button>

				<div className="ml-auto flex items-center space-x-3">
					<div className="relative hidden md:block">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							type="search"
							placeholder={t('nav.searchPlaceholder', 'Search')}
							className="w-56 border-white/15 bg-white/5 pl-9 text-slate-100 placeholder:text-slate-400 focus-visible:ring-indigo-400"
						/>
					</div>
					<div className="hidden items-center gap-1 rounded-lg border border-white/15 bg-white/5 p-1 md:flex">
						<Button
							variant={locale === 'zh' ? 'default' : 'ghost'}
							size="sm"
							className="h-7 px-2 text-xs"
							onClick={() => setLanguage('zh')}
						>
							{t('nav.lang.zh', '中文')}
						</Button>
						<Button
							variant={locale === 'en' ? 'default' : 'ghost'}
							size="sm"
							className="h-7 px-2 text-xs"
							onClick={() => setLanguage('en')}
						>
							{t('nav.lang.en', 'English')}
						</Button>
					</div>
					<Link href="https://github.com/ledboot/crypto-hub" target="_blank" rel="noopener noreferrer" className="hidden md:block">
						<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-200 hover:bg-white/10 hover:text-white">
							<Image src="/icons/github-mark.svg" alt="github" width={18} height={18} className="invert" />
						</Button>
					</Link>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className="fixed inset-0 z-50 bg-black/70 md:hidden" onClick={() => setMobileMenuOpen(false)}>
					<div
						className="absolute left-0 top-0 h-full w-4/5 max-w-xs border-r border-white/10 bg-slate-950 p-6 shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="mb-6 flex items-center">
							<Image src="/logo.svg" alt="logo" width={130} height={30} className="brightness-[1.25]" />
							<Button
								variant="ghost"
								size="icon"
								className="ml-auto text-slate-100 hover:bg-white/10"
								onClick={() => setMobileMenuOpen(false)}
								aria-label={t('nav.menu.close', 'Close menu')}
							>
								<X className="h-6 w-6" />
							</Button>
						</div>

						<nav>
							<ul className="space-y-3">
								{MenuItems.map((item) => (
									<li key={item.key}>
										{item.items ? (
											<>
												<div className="mb-1 text-sm font-semibold text-slate-200">{t(item.key, item.title)}</div>
												<ul className="space-y-1 pl-2">
													{item.items.map((subItem) => (
														<li key={subItem.key}>
															<Link
																href={subItem.href}
																className="block rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
																onClick={() => setMobileMenuOpen(false)}
															>
																{t(subItem.key, subItem.title)}
															</Link>
														</li>
													))}
												</ul>
											</>
										) : (
											<Link
												href={item.href || '#'}
												className="block rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
												onClick={() => setMobileMenuOpen(false)}
											>
												{t(item.key, item.title)}
											</Link>
										)}
									</li>
								))}
							</ul>
						</nav>

						<div className="mt-6 border-t border-white/10 pt-4">
							<div className="relative mb-4">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<Input
									type="search"
									placeholder={t('nav.searchPlaceholder', 'Search')}
									className="w-full border-white/15 bg-white/5 pl-9 text-slate-100 placeholder:text-slate-400"
								/>
							</div>
							<div className="mb-4">
								<div className="mb-2 text-xs text-slate-400">{t('nav.lang.label', 'Language')}</div>
								<div className="flex gap-2">
									<Button variant={locale === 'zh' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('zh')}>
										{t('nav.lang.zh', '中文')}
									</Button>
									<Button variant={locale === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('en')}>
										{t('nav.lang.en', 'English')}
									</Button>
								</div>
							</div>
							<Link href="https://github.com/ledboot/crypto-hub" target="_blank" rel="noopener noreferrer">
								<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-200 hover:bg-white/10 hover:text-white">
									<Image src="/icons/github-mark.svg" alt="github" width={18} height={18} className="invert" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</header>
	)
}
