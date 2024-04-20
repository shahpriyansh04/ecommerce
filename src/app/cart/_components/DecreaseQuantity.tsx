"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, MinusIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function DecreaseQuantity() {
  const { pending } = useFormStatus();

  return (
    <Button size="icon" variant="outline">
      <Loader2
        className={cn(pending ? "animate-spin block" : "hidden", "w-4 h-4")}
      />
      <MinusIcon className={cn(!pending ? "block" : "hidden", "w-4 h-4")} />{" "}
    </Button>
  );
}
