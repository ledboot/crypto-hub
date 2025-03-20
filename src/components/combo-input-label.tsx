"use client"

import * as React from "react"
import { Token } from "@/types/token";
import { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import styles from "./combo-input-label.module.scss"

type Props = {
  placeholder: string;
  options: Token[];
  className?: string;
  onChange: (value: Token) => void;
}

export const ComboInputLabel: FC<Props> = (props) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const handleSelect = (selectedValue: Token) => {
        setValue(selectedValue.address)
        setOpen(false)
        props.onChange(selectedValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        const token = {
          address: e.target.value,
          type: "ERC20",
          symbol: "ETH",
          decimals: 18,
          logo: ""
        }
        props.onChange(token)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={clsx(styles["combo-input"], props.className)}>
            <div className={styles["container"]}>
              <Input
                value={value}
                placeholder={props.placeholder}
                className={styles["input"]}
                onChange={handleInputChange}
              />
            </div>
            <Button variant="ghost" size="sm" className={styles["dropdown-button"]}>
                <ChevronDown />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <div className={styles["options"]}>
            {props.options.map((option) => (
                <div key={option.address} className={styles["option"]} onClick={() => handleSelect(option)}>
                  <Badge variant="outline" color="orange">{option.type}</Badge>
                  <Badge variant="outline" color="orange">{option.symbol}</Badge>
                  <Label>{option.address}</Label>
                  {/* <Image src={option.logo} alt={option.symbol} width={20} height={20} /> */}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    )
};