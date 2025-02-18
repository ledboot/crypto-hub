"use client"

import {
  Trash2,
  Plus,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BatchQueryToolbarProps {
  onExecute: () => void; // New prop for execute handler
  onDeleteSelected: () => void;
  onAppend: () => void;
}

export function BatchQueryToolbar({
  onExecute,
  onDeleteSelected,
  onAppend,
}: BatchQueryToolbarProps) {
  const tools = [
    { icon: Trash2, label: "删除选中", onClick: onDeleteSelected },
    { icon: Plus, label: "追加", onClick: onAppend },
    { icon: Play, label: "执行", onClick: onExecute },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool) => (
        <Button
          key={tool.label}
          variant="outline"
          size="sm"
          className="h-8"
          onClick={tool.onClick} // Attach the click handler
        >
          <tool.icon className="mr-1 h-4 w-4" />
          {tool.label}
        </Button>
      ))}
    </div>
  );
}
