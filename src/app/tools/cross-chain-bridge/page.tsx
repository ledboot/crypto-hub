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
                <div className="container mx-auto py-20  max-w-[600px] min-w-[500px]">
                    <BridgeForm />
                </div>
            </QueryClientProvider>
        </WagmiProvider>
    )
}
