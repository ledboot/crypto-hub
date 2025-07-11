import { http,createConfig } from "wagmi";
import {injected,metaMask,walletConnect} from "wagmi/connectors"
import {mainnet,optimism,arbitrum} from "wagmi/chains"

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set");
}

const dappMetadata = {
    name: "CryptoHub Bridge",
    url: "https://cryptohub.lol",
    iconUrl: "https://cryptohub.lol/logo.svg",
};

export const wagmiConfig = createConfig({
    chains:[mainnet,optimism,arbitrum],
    transports:{
        [mainnet.id]:http(),
        [optimism.id]:http(),
        [arbitrum.id]:http(),
    },
    connectors:[
        injected(),
        metaMask({
            dappMetadata,
        }),
        walletConnect({
            projectId,
        }),
    ],
    
});