"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export default function IncreaseQuantity() {
  const { pending } = useFormStatus();

  return (
    <Button size="icon" variant="outline">
      <Loader2
        className={cn(pending ? "animate-spin block" : "hidden", "w-4 h-4")}
      />
      <PlusIcon className={cn(!pending ? "block" : "hidden", "w-4 h-4")} />{" "}
    </Button>
  );
}
