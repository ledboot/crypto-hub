'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LOCALE, getMessage, LOCALES, Locale } from '@/lib/i18n'

interface I18nContextValue {
	locale: Locale
	setLocale: (locale: Locale) => void
	t: (key: string, fallback?: string) => string
}

const STORAGE_KEY = 'crypto-hub-locale'

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

function isLocale(value: string | null): value is Locale {
	return !!value && LOCALES.includes(value as Locale)
}

function resolveClientLocale(): Locale {
	if (typeof window === 'undefined') {
		return DEFAULT_LOCALE
	}

	const stored = window.localStorage.getItem(STORAGE_KEY)
	if (isLocale(stored)) {
		return stored
	}

	const browserLocale = window.navigator.language.toLowerCase()
	return browserLocale.startsWith('zh') ? 'zh' : 'en'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

	useEffect(() => {
		setLocaleState(resolveClientLocale())
	}, [])

	useEffect(() => {
		document.documentElement.lang = locale
		window.localStorage.setItem(STORAGE_KEY, locale)
	}, [locale])

	const setLocale = useCallback((nextLocale: Locale) => {
		setLocaleState(nextLocale)
	}, [])

	const t = useCallback(
		(key: string, fallback?: string) => {
			return getMessage(locale, key, fallback)
		},
		[locale]
	)

	const value = useMemo(
		() => ({
			locale,
			setLocale,
			t,
		}),
		[locale, setLocale, t]
	)

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
	const context = useContext(I18nContext)
	if (!context) {
		throw new Error('useI18n must be used within I18nProvider')
	}
	return context
}
