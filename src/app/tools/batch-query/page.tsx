"use client";
import { useState } from "react";
import { BatchQueryForm } from "@/components/batch-query-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Address } from "@/types/common";
import { isValidAddress } from "@/lib/ethers-tools";

export default function BatchQueryPage() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAppendMode, setIsAppendMode] = useState(false);

  const openDialog = (appendMode: boolean) => {
    setIsAppendMode(appendMode);
    setDialogOpen(true);
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(event.target.value);
  };

  const handleConfirm = () => {
    const newAddresses = textareaValue.split("\n").map((addr) => ({
      address: addr.trim(),
      executeStatus: "pending",
      amount: BigInt(0),
      flag: "New",
      symbol: "",
      selected: false,
    }));

    if (newAddresses.length > 0) {
      // 循环判断地址是否合法
      for (const addr of newAddresses) {
        if (!isValidAddress(addr.address)) {
          alert("地址不合法");
          return;
        }
      }
      if (isAppendMode) {
        setAddresses((prevAddresses) => [
          ...prevAddresses,
          ...(newAddresses as unknown as Address[]),
        ]);
      } else {
        setAddresses(newAddresses as unknown as Address[]);
      }
      setDialogOpen(false);
      setTextareaValue("");
    }
  };

  const onDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setTextareaValue("");
    }
  };

  return (
    <div className="container mx-auto py-20 mt-10">
      <main className="mx-40 ">
        <BatchQueryForm
          openDialog={openDialog}
          addresses={addresses}
          setAddresses={setAddresses}
          setTotalAmount={setTotalAmount}
          totalAmount={totalAmount}
        />
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogContent className="min-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {isAppendMode ? "追加地址" : "导入地址"}
              </DialogTitle>
              <DialogDescription>
                请在下方输入需要查询的地址，每行一个
              </DialogDescription>
            </DialogHeader>
            <div>
              <Textarea
                placeholder="请输入地址"
                className="min-h-[300px]"
                value={textareaValue}
                onChange={handleTextareaChange}
              />
            </div>
            <DialogFooter className="relative flex flex-col items-center">
              <Button
                variant="link"
                className="absolute left-0 underline pl-0 pr-0"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                删除无效地址
              </Button>
              <div className="flex space-x-5">
                <Button
                  variant="outline"
                  onClick={() => onDialogOpenChange(false)}
                >
                  取消
                </Button>
                <Button onClick={handleConfirm}>确认</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
