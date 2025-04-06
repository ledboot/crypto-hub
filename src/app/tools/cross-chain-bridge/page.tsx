'use client'

import { BridgeForm } from '@/components/BridgeForm'
import { chainInfoList } from '@/constants/chains'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/constants/chains/index'
import {
    QueryClientProvider,
    QueryClient,
    QueryCache,
    MutationCache,
  } from "@tanstack/react-query";
export default function CrossChainBridge() {
    const client = new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            console.error("Query failed:", error);
            // Sentry.captureException(error, (scope) => {
            //   scope.setContext("query", { queryHash: query.queryHash });
            //   return scope;
            // });
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, vars, context, mutation) => {
            console.error("Mutation failed:", error);
            // Sentry.captureException(error, (scope) => {
            //   scope.setContext("mutation", {
            //     mutationId: mutation.mutationId,
            //     variables: mutation.state.variables,
            //   });
            //   return scope;
            // });
          },
        }),
      });
    return (
        <WagmiProvider config={wagmiConfig()}>
             <QueryClientProvider client={client}>
             <div className="container mx-auto py-20  max-w-[600px] min-w-[500px]">
                <BridgeForm chainInfoList={chainInfoList} isLoading={false} />
            </div>
             </QueryClientProvider>
        </WagmiProvider>
    )
}
