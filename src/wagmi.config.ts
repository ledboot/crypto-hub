import { http,createConfig } from "wagmi";
import {injected,metaMask,walletConnect} from "wagmi/connectors"
import {mainnet,optimism,arbitrum} from "wagmi/chains"
import {walletConnectProjectId} from "./constants/constants"

const dappMetadata = {
    name: "CryptoHub Bridge",
    url: "https://cryptohub.lol",
    iconUrl: "https://cryptohub.lol/logo.svg",
};

export const config = createConfig({
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
            projectId:walletConnectProjectId,
        }),
    ],
    
});