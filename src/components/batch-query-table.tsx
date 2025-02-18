"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"
import { Address } from "@/types/address"

interface BatchQueryTableProps {
  openDialog: (appendMode: boolean) => void;
  addresses: Address[];
  totalAmount: number;
  setAddresses: (addresses: Address[]) => void;
}

export function BatchQueryTable({ openDialog, addresses, setAddresses, totalAmount }: BatchQueryTableProps) {
    const handleCheckboxChange = (index: number) => {
        const updatedAddresses = [...addresses];
        updatedAddresses[index].selected = !addresses[index].selected;
        setAddresses(updatedAddresses);
    };
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead className="w-16">
              序号
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead>
              地址
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead>
              数量
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
            <TableHead>
              执行状态
              <ChevronDown className="ml-1 inline-block h-4 w-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox 
                  checked={item.selected}
                  onCheckedChange={() => handleCheckboxChange(index)}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.amount} {item.symbol}</TableCell>
              <TableCell>{item.executeStatus}</TableCell>
            </TableRow>
          ))}
          {addresses.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <Button variant="outline" onClick={() => openDialog(false)}>导入地址</Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="h-px bg-gray-200" />
      <div className="flex justify-start m-5">
        <div className="flex items-center space-x-2 p-2">
          <span>总数据行：</span>
          <span>{addresses.length}</span>
        </div>
        <div className="flex items-center space-x-2 p-2">
          <span>余额总量：</span>
          <span>{totalAmount}</span>
        </div>
      </div>
    </div>
  )
}

