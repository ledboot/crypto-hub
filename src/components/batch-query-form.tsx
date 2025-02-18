"use client";

import Image from "next/image";
import { ComboInput } from "@/components/combo-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BatchQueryTable } from "@/components/batch-query-table";
import { BatchQueryToolbar } from "@/components/batch-query-toolbar";
import { useState } from "react";
import { ethers } from "ethers";
import {
  getERC20Balance,
  getNativeBalance,
  getERC20Metadata,
  checkIfERC20,
} from "@/lib/ethers-tools";
import { Address } from "@/types/address";
import { SupportedChains } from "@/constant";
import { ComboInputLabel } from "@/components/combo-input-label";
import { Token } from "@/types/Token";
interface BatchQueryFormProps {
  openDialog: (appendMode: boolean) => void;
  addresses: Address[];
  setAddresses: (addresses: Address[]) => void;
  totalAmount: number;
  setTotalAmount: (totalAmount: number) => void;
}


export function BatchQueryForm({
  openDialog,
  addresses,
  setAddresses,
  totalAmount,
  setTotalAmount,
}: BatchQueryFormProps) {
  const [rpcNode, setRpcNode] = useState("");
  const [selectToken, setSelectToken] = useState<Token | null>(null);
  const [rpcList, setRpcList] = useState<string[]>([]);
  const [defaultTokenList, setDefaultTokenList] = useState<Token[]>([]);
  const handleExecute = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(rpcNode);
      if (!selectToken || !selectToken.address) {
        alert("请输入正确的代币合约地址");
        return;
      }
      console.log(rpcNode);
      const isERC20 = await checkIfERC20(provider, selectToken.address);
      let symbol = selectToken.symbol;
      let decimals = selectToken.decimals;
      if (isERC20) {
        const { symbol: symbol_, decimals: decimals_ } = await getERC20Metadata(
          provider,
          selectToken.address
        );
        symbol = symbol_;
        decimals = decimals_;
      }
      console.log("Token Metadata:", { symbol, decimals });

      // Create a new array to hold updated addresses
      const updatedAddresses = [...addresses];
      for (let i = 0; i < updatedAddresses.length; i++) {
        const address = updatedAddresses[i].address;

        let balance = "0";
        if (isERC20) {
          balance = await getERC20Balance(
            provider,
            selectToken.address,
            address,
            decimals
          );
          updatedAddresses[i].amount = Number(balance);
          updatedAddresses[i].symbol = symbol;
        } else {
          balance = await getNativeBalance(provider, address);
          updatedAddresses[i].amount = Number(balance);
        }
        totalAmount += Number(balance);
        updatedAddresses[i].amount = Number(balance);
        updatedAddresses[i].symbol = symbol;
        updatedAddresses[i].executeStatus = "success";
        setTotalAmount(totalAmount);
      }

      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleDeleteSelected = () => {
    const updatedAddresses = addresses.filter((address) => !address.selected);
    console.log(updatedAddresses);
    setAddresses(updatedAddresses);
  };

  const handleAppend = () => {
    openDialog(true);
  };

  const onChainChange = (value: string) => {
    const selected = SupportedChains.find(chain => chain.name === value);
    if (selected) {
      setRpcList(selected.rpcList);
      setDefaultTokenList(selected.defaultTokenList);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold mx-auto">批量查询余额</h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground min-w-40">主网</span>
          <Select onValueChange={onChainChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="不支持此链" />
            </SelectTrigger>
            <SelectContent>
              <div className="relative">
                {SupportedChains.map((chain) => (
                  <SelectItem
                    key={chain.name}
                    value={chain.name}
                    className="flex flex-col items-start"
                  >
                    <div className="absolute">
                      <Image
                        src={chain.logo}
                        alt={chain.name}
                        width={20}
                        height={20}
                      />
                    </div>
                    <span className="ml-8 text-sm text-muted-foreground">{chain.name}</span>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground min-w-40">
            自定义RPC节点
          </span>
          <ComboInput
            placeholder="输入RPC节点地址"
            options={rpcList}
            className="w-[500px]"
            onChange={(e) => setRpcNode(e)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground min-w-40">
            代币合约地址
          </span>

          <ComboInputLabel
            placeholder="选择代币"
            options={defaultTokenList}
            className="w-[500px]"
            onChange={(e) => setSelectToken(e)}
          />
        </div>
      </div>

      <BatchQueryToolbar
        onExecute={handleExecute}
        onDeleteSelected={handleDeleteSelected}
        onAppend={handleAppend}
      />
      <BatchQueryTable
        openDialog={openDialog}
        addresses={addresses}
        setAddresses={setAddresses}
        totalAmount={totalAmount}
      />
    </div>
  );
}
