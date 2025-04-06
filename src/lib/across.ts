// lib/across.ts
import { createAcrossClient } from "@across-protocol/app-sdk";
import { mainnet, optimism, arbitrum } from "viem/chains";


export const initAcrossClient = async () => {
    const client = createAcrossClient({
        integratorId: "<your-integratorId>", // 2-byte hex string
        chains: [mainnet, optimism, arbitrum],
        useTestnet: true,
      });
  return client;
};