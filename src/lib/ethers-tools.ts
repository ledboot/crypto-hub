import { erc20Abi } from "@/abis/erc20Abi";
import { ethers } from "ethers";

export const getERC20Metadata = async (
  provider: ethers.JsonRpcProvider,
  contractAddress: string
) => {
  const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  return { symbol, decimals };
};

export const getERC20Balance = async (
  provider: ethers.JsonRpcProvider,
  contractAddress: string,
  address: string,
  decimal: number
) => {
  const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance.toString(), decimal);
};

export const getNativeBalance = async (
  provider: ethers.JsonRpcProvider,
  address: string
) => {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance.toString());
};

export const checkIfERC20 = async (
  provider: ethers.JsonRpcProvider,
  address: string
) => {
  if (address === "ETH" || address === "BERA") {
    return false;
  } else {
    const code = await provider.getCode(address);
    return code !== "0x";
  }
};

export const isValidAddress = (address: string) => {
  return ethers.isAddress(address);
};
