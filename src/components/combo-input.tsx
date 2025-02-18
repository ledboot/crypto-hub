"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import styles from "./combo-input.module.scss"
import { FC } from "react"
import clsx from "clsx";

type Props = {
  placeholder: string
  options: string[]
  className?: string;
  onChange: (value: string) => void
}

export const ComboInput: FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue)
    setOpen(false)
    props.onChange(selectedValue)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    props.onChange(event.target.value)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={clsx(styles["combo-input"], props.className)}>
          <div className={styles["container"]}>
            <Input
              value={value}
              onChange={handleInputChange}
              placeholder={props.placeholder}
              className={styles["input"]}
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
            <Button key={option} variant="ghost" className={styles["option"]} onClick={() => handleSelect(option)}>
              {option}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

