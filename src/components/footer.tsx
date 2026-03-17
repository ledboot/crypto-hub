'use client'

import { useI18n } from '@/components/i18n-provider'

export function Footer() {
    const { t } = useI18n()

    return(
        <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} CryptoHubs. {t('footer.copyright', 'All rights reserved.')}</p>
          </div>
        </div>
      </footer>
    )
}
