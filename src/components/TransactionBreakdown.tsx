"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info } from "lucide-react"

export function TransactionBreakdown() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mt-4 border rounded-md overflow-hidden text-xs">
      <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div>Transaction breakdown</div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {isExpanded && (
        <div className="border-t p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-gray-400">
              Net fee <Info size={14} />
            </div>
            <div>-</div>
          </div>

          <div className="ml-4 border-l pl-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-gray-400">
                Bridge fee <Info size={14} />
              </div>
              <div>-</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-400">
                Destination gas fee <Info size={14} />
              </div>
              <div>-</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

