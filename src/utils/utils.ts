// 工具函数
export function formatMoney(amount: number | string | undefined): string {
    if (amount === undefined) return '-'
    const n = typeof amount === 'string' ? parseFloat(amount) : amount
    return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}
export function formatTokenAmount(amount: number | string | undefined): string {
    if (amount === undefined) return '-'
    const n = typeof amount === 'string' ? parseFloat(amount) : amount
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

export function formatTransactionHash(hash: string | undefined): string {
    if (!hash) return '-'
    return hash.slice(0, 8) + '...' + hash.slice(-6)
}