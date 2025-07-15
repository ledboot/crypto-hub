'use client'

import type React from 'react'
import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, RefreshCw } from 'lucide-react'
import { ChainSelector } from '@/components/ChainSelector'
import { TokenSelector } from '@/components/TokenSelector'
import { TransactionBreakdown } from '@/components/TransactionBreakdown'
import { Input } from '@/components/ui/input'

export function BridgeForm() {
    const { address, isConnected } = useAccount()
    const { connect, connectors } = useConnect()
    const { disconnect } = useDisconnect()

    const [amount, setAmount] = useState<string>('')
    const [usdAmount, setUsdAmount] = useState<string>('$0.00')
    const [fromChain, setFromChain] = useState({
        id: 1,
        name: 'Ethereum Mainnet',
        icon: '🔵',
    })
    const [toChain, setToChain] = useState({
        id: 42161,
        name: 'Arbitrum One',
        icon: '🔵',
    })
    const [fromToken, setFromToken] = useState({
        symbol: 'ETH',
        name: 'Ether',
        icon: '🔵',
    })
    const [toToken, setToToken] = useState({
        symbol: 'ETH',
        name: 'Ether',
        icon: '🔵',
    })
    const [isChainSelectorOpen, setIsChainSelectorOpen] = useState(false)
    const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false)
    const [selectorType, setSelectorType] = useState<'from' | 'to'>('from')

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value)
            setUsdAmount(
                value
                    ? `$${(Number.parseFloat(value) * 3500).toFixed(2)}`
                    : '$0.00'
            )
        }
    }

    const handleMaxClick = () => {
        setAmount('0.1') // Simulated max amount
        setUsdAmount('$350.00')
    }

    const openChainSelector = (type: 'from' | 'to') => {
        setSelectorType(type)
        setIsChainSelectorOpen(true)
        setIsTokenSelectorOpen(false)
    }

    const openTokenSelector = (type: 'from' | 'to') => {
        setSelectorType(type)
        setIsTokenSelectorOpen(true)
        setIsChainSelectorOpen(false)
    }

    const handleChainSelect = (chain: any) => {
        if (selectorType === 'from') {
            setFromChain(chain)
        } else {
            setToChain(chain)
        }
        setIsChainSelectorOpen(false)
    }

    const handleTokenSelect = (token: any) => {
        if (selectorType === 'from') {
            setFromToken(token)
        } else {
            setToToken(token)
        }
        setIsTokenSelectorOpen(false)
    }

    const swapChains = () => {
        const tempChain = fromChain
        const tempToken = fromToken
        setFromChain(toChain)
        setFromToken(toToken)
        setToChain(tempChain)
        setToToken(tempToken)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Cross-Chain Dashboard</CardTitle>
                    <CardDescription>
                        Connect your wallet and interact across multiple
                        blockchains
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    {/* From header */}
                    <div className="flex flex-row items-center justify-between">
                        <div className='text-sm'>
                        From
                        </div>
                        <div
                            className="flex items-center justify-between border rounded-md p-2 cursor-pointer"
                            onClick={() => openChainSelector('from')}
                        >
                            <div className="flex items-center gap-2 text-sm">
                                <span>{fromChain.icon}</span>
                                <span>{fromChain.name}</span>
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    {/* From Section */}
                    <div className="border rounded-md p-2">
                        <div className="flex flex-row items-center justify-between">
                            <div
                                className="border flex items-center justify-between rounded-md px-2 py-1 cursor-pointer text-sm"
                                onClick={() => openTokenSelector('from')}
                            >
                                <span className="mr-1">{fromToken.icon}</span>
                                <span>{fromToken.symbol}</span>
                                <ChevronDown size={16} className='text-sm' />
                            </div>
                            <div className="flex items-center justify-between">
                                <Input
                                    type="text"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="0.0"
                                    className="px-2 border-none bg-transparent text-sm text-right"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between mt-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 pl-2">
                                    <div className="text-xs">
                                        <p>0.1 ETH</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 px-2 text-xs border-none"
                                        onClick={handleMaxClick}
                                    >
                                        MAX
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="bottom-2 left-3 text-sm ">
                                    {usdAmount}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Swap Section */}
                    <div className="flex flex-row items-center justify-between">
                        <div className='text-sm'>To</div>
                        <div className='absolute left-1/2 -translate-x-1/2'>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-[#3a3a3e] hover:border-[#a6a6e7]"
                            onClick={swapChains}
                        >
                            <RefreshCw size={16} className="rotate-90" />
                        </Button>
                        </div>

                        <div
                            className="flex items-center justify-between border rounded-md p-2 cursor-pointer"
                            onClick={() => openChainSelector('to')}
                        >
                            <div className="flex items-center gap-2 text-sm">
                                <span>{toChain.icon}</span>
                                <span>{toChain.name}</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>

                    {/* To Section */}
                    <div className="border rounded-md p-2">
                        <div className="flex flex-row items-center justify-between">
                            <div
                                className="border flex items-center justify-between rounded-md px-2 py-1 cursor-pointer text-sm"
                                onClick={() => openTokenSelector('to')}
                            >
                                <span className="mr-1">{toToken.icon}</span>
                                <span>{toToken.symbol}</span>
                                <ChevronDown size={16} className='text-sm' />
                            </div>
                            <div className="flex items-center justify-between">
                                <Input
                                    type="text"
                                    placeholder="0.0"
                                    className="px-2 border-none bg-transparent text-sm text-right"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between mt-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 pl-2">
                                    <div className="text-xs">
                                        <p>0.0 ETH</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="bottom-2 left-3 text-sm ">
                                    $100
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Breakdown */}
                    <TransactionBreakdown />

                    {/* Connect Wallet Button */}
                    {!isConnected ? (
                        <Button
                            className="w-full mt-4 bg-[#00a3ff] hover:bg-[#0088d1] text-white border-none"
                            onClick={() =>
                                connect({ connector: connectors[0] })
                            }
                        >
                            Connect Wallet
                        </Button>
                    ) : (
                        <Button className="w-full mt-4 bg-[#00a3ff] hover:bg-[#0088d1] text-white border-none">
                            Confirm transaction
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Chain Selector Modal */}
            {isChainSelectorOpen && (
                <ChainSelector
                    onSelect={handleChainSelect}
                    onClose={() => setIsChainSelectorOpen(false)}
                    selectorType={selectorType}
                />
            )}

            {/* Token Selector Modal */}
            {isTokenSelectorOpen && (
                <TokenSelector
                    onSelect={handleTokenSelect}
                    onClose={() => setIsTokenSelectorOpen(false)}
                    selectChain={selectorType === 'from' ? fromChain.name : toChain.name}
                />
            )}
        </>
    )
}
