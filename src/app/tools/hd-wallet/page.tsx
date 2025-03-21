"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Copy,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Info,
  Download,
} from "lucide-react";
import { getMnemonic, getDerivedPrivateKey } from "@/lib/hd-wallet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CoinType } from "@/types/common";

type WalletInfo = {
  path: string;
  addressHex: string;
  publicKey: string;
  privateKey: string;
};

type WalletsType = {
  mnemonic: string;
  wallets: WalletInfo[];
};

export default function HDWalletGenerator() {
  const [mnemonicLength, setMnemonicLength] = useState("128");
  const [coinType, setCoinType] = useState(CoinType.BTC);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [walletResult, setWalletResult] = useState<WalletsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accountIndex, setAccountIndex] = useState("0");
  const [addressCount, setAddressCount] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState("addresses");

  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Generating Wallet...</p>
      </div>
    </div>
  );

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    setIsGenerating(true);

    try {
      const count = Number.parseInt(addressCount);
      if (isNaN(count) || count < 1 || count > 201) {
        throw new Error("Address count must be between 1 and 200");
      }

      const accountIndexInt = Number.parseInt(accountIndex);
      const mnemonicLengthInt = Number.parseInt(mnemonicLength);
      const mnemonic = getMnemonic(mnemonicLengthInt);
      const walletsResult: WalletsType = {
        mnemonic: mnemonic,
        wallets: [],
      };

      for (let i = 0; i < count; i++) {
        const path = `m/44'/${coinType}'/${accountIndexInt}'/0/${i}`;
        const { privateKey, addressHex, publicKey } = getDerivedPrivateKey(
          {
            mnemonic: mnemonic,
            hdPath: path,
            coinType: coinType,
          },
          password
        );
        walletsResult.wallets.push({
          path,
          addressHex: addressHex || "",
          publicKey: publicKey,
          privateKey: privateKey,
        });
      }
      setWalletResult(walletsResult);
      // Show result with a slight delay for better animation
      setShowResult(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to generate wallet"
      );
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const resetGenerator = () => {
    setError("");
    setShowResult(false);
    setWalletResult(null);
    setTimeout(() => {
      setIsGenerating(false);
    }, 300);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadWalletData = () => {
    if (!walletResult) return;

    // Create CSV content
    let csvContent = "Path,Address,Public Key,Private Key\n";

    walletResult.wallets.forEach((wallet: WalletInfo) => {
      csvContent += `${wallet.path},"${wallet.addressHex}","${wallet.publicKey}","${wallet.privateKey}"\n`;
    });

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set link properties
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `wallet_coinType_${coinType}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";

    // Append to document, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-20 mt-10">
      <div
        className={cn(
          "grid grid-rows-1 grid-cols-2 gap-6 transition-all duration-500 ease-in-out",
          isGenerating ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        <Card>
          {loading && <LoadingOverlay />}
          <CardHeader>
            <CardTitle className="text-2xl">HD Wallet Generator</CardTitle>
            <CardDescription>
              Generate a hierarchical deterministic wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mnemonic-length">Mnemonic Length</Label>
              <Select value={mnemonicLength} onValueChange={setMnemonicLength}>
                <SelectTrigger id="mnemonic-length">
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">12 words (128 bits)</SelectItem>
                  <SelectItem value="160">15 words (160 bits)</SelectItem>
                  <SelectItem value="192">18 words (192 bits)</SelectItem>
                  <SelectItem value="224">21 words (224 bits)</SelectItem>
                  <SelectItem value="256">24 words (256 bits)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coin-type">Cryptocurrency</Label>
              <Select
                value={coinType}
                onValueChange={(value) => setCoinType(value as CoinType)}
              >
                <SelectTrigger id="coin-type">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CoinType.BTC}>Bitcoin (BTC)</SelectItem>
                  <SelectItem value={CoinType.ETH}>Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="account-index">Account Index</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          BIP44 account index (m/44&apos;/coin&apos;/account&apos;/0/x)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="account-index"
                  type="number"
                  min="0"
                  value={accountIndex}
                  onChange={(e) => setAccountIndex(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="address-count">Number of Addresses</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          How many addresses to generate (max 200)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="address-count"
                  type="number"
                  min="1"
                  max="20"
                  value={addressCount}
                  onChange={(e) => setAddressCount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">BIP39 Passphrase (Optional)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passphrase for extra security"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                A passphrase adds extra security but must be remembered to
                recover your wallet
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
            >
              Generate Wallet
            </Button>
          </CardFooter>
        </Card>

        {walletResult && (
          <Card
            className={cn(
              "w-full transition-all duration-500 ease-in-out transform",
              showResult
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-1/4",
              "h-fit self-center"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Wallet</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetGenerator}
                className="hidden md:flex"
              >
                Generate New
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="addresses"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mnemonic">Mnemonic</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses & Keys</TabsTrigger>
                </TabsList>
                <TabsContent value="mnemonic" className="space-y-4">
                  <div className="mt-4 relative">
                    <div className="p-4 bg-muted rounded-md break-all font-mono text-sm">
                      {walletResult.mnemonic}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(walletResult.mnemonic)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Never share your mnemonic phrase. Anyone with this phrase
                      can access all your funds.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
                <TabsContent value="addresses" className="mt-4">
                  <div className="flex justify-end mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadWalletData}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download All
                    </Button>
                  </div>
                  <div className="rounded-md border w-full max-h-[700px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[30px]">Path</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Private Key</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {walletResult.wallets.map(
                          (wallet: WalletInfo, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-xs">
                                {wallet.path}
                              </TableCell>
                              <TableCell className="font-mono text-xs truncate max-w-[200px]">
                                <div className="truncate">
                                  {wallet.addressHex}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-xs truncate max-w-[200px]">
                                <div className="truncate">
                                  {wallet.privateKey}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const detailsModal =
                                        document.getElementById(
                                          `wallet-details-${index}`
                                        );
                                      if (
                                        detailsModal instanceof
                                        HTMLDialogElement
                                      ) {
                                        detailsModal.showModal();
                                      }
                                    }}
                                  >
                                    Details
                                  </Button>
                                  <dialog
                                    id={`wallet-details-${index}`}
                                    className="modal backdrop:bg-black/50 rounded-lg"
                                  >
                                    <div className="bg-background rounded-lg w-full max-w-lg">
                                      <div className="p-6">
                                        <h3 className="text-lg items-center font-semibold mb-4">
                                          Address {index} Details
                                        </h3>
                                        <div className="space-y-4">
                                          <div>
                                            <Label className="text-sm font-medium">
                                              Path
                                            </Label>
                                            <div className="flex items-center mt-1">
                                              <div className="p-2 bg-muted rounded-md font-mono text-sm flex-1">
                                                {wallet.path}
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ml-2"
                                                onClick={() =>
                                                  copyToClipboard(wallet.path)
                                                }
                                              >
                                                <Copy className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">
                                              Address
                                            </Label>
                                            <div className="flex items-center mt-1">
                                              <div className="p-2 bg-muted rounded-md font-mono text-sm flex-1 overflow-x-auto">
                                                {wallet.addressHex}
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ml-2"
                                                onClick={() =>
                                                  copyToClipboard(
                                                    wallet.addressHex
                                                      ? wallet.addressHex
                                                      : ""
                                                  )
                                                }
                                              >
                                                <Copy className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                          <div>
                                            <Label className="text-sm font-medium">
                                              Private Key
                                            </Label>
                                            <div className="flex items-center mt-1">
                                              <div className="p-2 bg-muted rounded-md font-mono text-sm flex-1 overflow-x-auto">
                                                {wallet.privateKey}
                                              </div>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="ml-2"
                                                onClick={() =>
                                                  copyToClipboard(
                                                    wallet.privateKey
                                                      ? wallet.privateKey.toString()
                                                      : ""
                                                  )
                                                }
                                              >
                                                <Copy className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex justify-end gap-2 p-4 border-t">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            const detailsModal =
                                              document.getElementById(
                                                `wallet-details-${index}`
                                              );
                                            if (
                                              detailsModal instanceof
                                              HTMLDialogElement
                                            ) {
                                              detailsModal.close();
                                            }
                                          }}
                                        >
                                          Close
                                        </Button>
                                      </div>
                                    </div>
                                  </dialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
