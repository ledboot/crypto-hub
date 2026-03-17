'use client'

import { BridgeForm } from '@/components/BridgeForm'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/wagmi.config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function CrossChainBridge() {
	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 sm:py-10">
					<div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
						<BridgeForm />
					</div>
				</div>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
