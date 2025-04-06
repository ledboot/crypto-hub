'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAccount, useConnect } from 'wagmi'

interface ChainSelectorProps {
    onSelect: (chain: any) => void
    onClose: () => void
    selectorType: 'from' | 'to'
}

export function ChainSelector({
    onSelect,
    onClose,
    selectorType,
}: ChainSelectorProps) {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const chains = [
        {
            id: 1,
            name: 'Ethereum Mainnet',
            icon: '🔵',
            balance: '0.0037',
            selected: selectorType === 'from',
        },
        {
            id: 42161,
            name: 'Arbitrum One',
            icon: '🔵',
            balance: '0.00183',
            selected: selectorType === 'to',
        },
        {
            id: 324,
            name: 'ZkSync Era',
            icon: '⚪',
            balance: '0.000132',
            selected: false,
        },
        {
            id: 10,
            name: 'Optimism',
            icon: '🔴',
            balance: '0.0000363',
            selected: false,
        },
        {
            id: 7777777,
            name: 'Zora',
            icon: '🟣',
            balance: '0',
            selected: false,
        },
        {
            id: 59144,
            name: 'World Chain',
            icon: '⚪',
            balance: '0',
            selected: false,
        },
    ]

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="p-0 max-w-md">
                <DialogHeader className="p-4 border-b flex flex-row justify-between items-center">
                    <DialogTitle>
                        Select chain to send{' '}
                        {selectorType === 'from' ? 'from' : 'to'}
                    </DialogTitle>
                </DialogHeader>
                <div className="p-3">
                    {chains.map((chain) => (
                        <div className="flex flex-col my-1" key={chain.id}>
                            <div
                                className={`flex items-center justify-between p-3 cursor-pointer rounded-md hover:bg-[#8a8ade] ${chain.selected ? 'bg-[#8a8ade]' : ''}`}
                                onClick={() => onSelect(chain)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-xl">{chain.icon}</div>
                                    <div>{chain.name}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {!isConnected ? (
                                        <div>{chain.balance}</div>
                                    ) : (
                                        <Button
                                            className="w-full bg-[#00a3ff] hover:bg-[#0088d1] text-white border-none"
                                        onClick={() =>
                                            connect({
                                                connector: connectors[0],
                                            })
                                        }
                                    >
                                        Connect Wallet
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
