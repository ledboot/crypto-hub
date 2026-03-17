export interface MenuSubItem {
  key: string;
  title: string;
  href: string;
}

export interface MenuItem {
  key: string;
  title: string;
  items?: MenuSubItem[];
  href?: string;
}

export const MenuItems: MenuItem[] = [
  {
    key: "nav.tools",
    title: "实用工具",
    items: [
      {
        key: "nav.tools.batchQuery",
        title: "批量查询地址余额",
        href: "/tools/batch-query",
      },
      {
        key: "nav.tools.transferOneToMany",
        title: "批量转账(一对多)",
        href: "",
      },
      {
        key: "nav.tools.transferManyToOne",
        title: "批量转账(多对一)",
        href: "",
      },
      {
        key: "nav.tools.hdWallet",
        title: "HD Wallet 生成器",
        href: "/tools/hd-wallet",
      },
    ],
    href: "",
  },
  // {
  //   title: "跨链桥",
  //   href: "/tools/cross-chain-bridge",
  // },
  {
    key: "nav.binanceAlpha",
    title: "Binance Alpha",
    items: [
      {
        key: "nav.binanceAlpha.tradingStats",
        title: "交易统计",
        href: "/binance-alpha/trading-statistics",
      },
      {
        key: "nav.binanceAlpha.walletQuery",
        title: "钱包查询",
        href: "/binance-alpha/wallet-query",
      },
    ],
  },
  {
    key: "nav.polymarket",
    title: "Polymarket",
    items: [
      {
        key: "nav.polymarket.markets",
        title: "市场浏览",
        href: "/polymarket/markets",
      },
      {
        key: "nav.polymarket.traders",
        title: "交易员排行榜",
        href: "/polymarket/traders",
      },
    ],
  },
];

export const SupportedChains = [
  {
    name: "Ethereum",
    chainId: 1,
    symbol: "ETH",
    logo: "https://icons-ckg.pages.dev/stargate-light/tokens/eth.svg",
    rpcList: ["https://rpc.ankr.com/eth", "https://rpc.mevblocker.io"],
    defaultTokenList: [
      {
        address: "ETH",
        type: "Native",
        symbol: "ETH",
        decimals: 18,
        logo: "https://icons-ckg.pages.dev/stargate-light/tokens/eth.svg",
      },
      {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        type: "ERC20",
        symbol: "WETH",
        decimals: 18,
        logo: "https://icons-ckg.pages.dev/stargate-light/tokens/eth.svg",
      },
    ],
  },
  {
    name: "Arbitrum",
    chainId: 42161,
    symbol: "ARB",
    logo: "https://icons-ckg.pages.dev/stargate-light/networks/arbitrum.svg",
    rpcList: [
      "https://rpc.ankr.com/arbitrum",
      "https://arbitrum.gateway.tenderly.co",
    ],
    defaultTokenList: [
      {
        address: "ETH",
        type: "Native",
        symbol: "ETH",
        decimals: 18,
        logo: "https://icons-ckg.pages.dev/stargate-light/tokens/eth.svg",
      },
    ],
  },
  {
    name: "Base",
    chainId: 8453,
    symbol: "BASE",
    logo: "https://icons-ckg.pages.dev/stargate-light/networks/base.svg",
    rpcList: ["https://rpc.ankr.com/base", "https://base.gateway.tenderly.co"],
    defaultTokenList: [
      {
        address: "ETH",
        type: "Native",
        symbol: "ETH",
        decimals: 18,
        logo: "https://icons-ckg.pages.dev/stargate-light/tokens/eth.svg",
      },
    ],
  },
  {
    name: "Optimism",
    chainId: 10,
    symbol: "OP",
    logo: "https://icons-ckg.pages.dev/stargate-light/networks/optimism.svg",
    rpcList: [
      "https://rpc.ankr.com/optimism",
      "https://optimism.gateway.tenderly.co",
    ],
    defaultTokenList: [
      {
        address: "ETH",
        type: "Native",
        symbol: "ETH",
        decimals: 18,
        logo: "https://icons-ckg.pages.dev/stargate-light/tokens/eth.svg",
      },
    ],
  },
  {
    name: "Berachain",
    chainId: 10,
    symbol: "OP",
    logo: "https://icons-ckg.pages.dev/stargate-light/networks/bera.svg",
    rpcList: ["https://rpc.berachain.com"],
    defaultTokenList: [
      {
        address: "BERA",
        type: "Native",
        symbol: "BERA",
        decimals: 18,
        logo: "https://icons-ckg.pages.dev/stargate-light/networks/bera.svg",
      },
    ],
  },
];
