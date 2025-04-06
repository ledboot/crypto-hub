"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TokenSelectorProps {
  onSelect: (token: any) => void
  onClose: () => void
  selectChain: string
}

export function TokenSelector({ onSelect, onClose, selectChain }: TokenSelectorProps) {
  const tokens = [
    {
      symbol: "ETH",
      icon: "🔵",
      selected: true,
    },
    {
      symbol: "WETH",
      icon: "🔵",
      selected: false,
    },
    {
      symbol: "USDC",
      icon: "🔵",
      selected: false,
    },
    {
      symbol: "DAI",
      icon: "🟡",
      selected: false,
    },
    {
      symbol: "WBTC",
      icon: "🟠",
      selected: false,
    },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md">
        <DialogHeader className="p-4 border-b flex flex-row justify-between items-center">
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <div className="p-3">
          {tokens.map((token) => (
            <div className="flex flex-col my-1" key={token.symbol}>
            <div
              className={`flex items-center justify-between p-3 cursor-pointer rounded-md hover:bg-[#8a8ade] ${token.selected ? 'bg-[#8a8ade]' : ''}`}
              onClick={() => onSelect(token)}
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{token.icon}</div>
                <div>
                  <div className="font-bold">{token.symbol}</div>
                  <div className="text-sm text-gray-400">{selectChain}</div>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

