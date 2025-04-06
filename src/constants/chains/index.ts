import { mainnet, optimism, arbitrum,sepolia,unichainSepolia } from 'wagmi/chains'
import { chainConfigs } from "./configs";
import { http,createConfig } from 'wagmi'

export type ChainInfo = (typeof chainConfigs)[0];
export type ChainInfoList = ChainInfo[];
export type ChainInfoTable = Record<number, ChainInfo>;

// ordered enabled chains
const orderedEnabledChainIds = [
  mainnet,
  arbitrum,
  optimism,
  // testnet
  sepolia,
  unichainSepolia
];

export const chainInfoList: ChainInfoList = orderedEnabledChainIds.map(
  (chain) => chainConfigs[chain.id]
);

export const chainInfoTable: ChainInfoTable = Object.fromEntries(
  chainInfoList.map((chain) => {
    return [chain.chainId, chain];
  }, [])
);

export const wagmiConfig = function() {
  return createConfig({
    chains: [mainnet, arbitrum, optimism, sepolia, unichainSepolia],
    transports: {
      [mainnet.id]: http(),
      [arbitrum.id]: http(),
      [optimism.id]: http(),
      [sepolia.id]: http(),
      [unichainSepolia.id]: http(),
    },
  });
}