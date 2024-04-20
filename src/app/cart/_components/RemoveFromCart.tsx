"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, XIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function RemoveFromCart() {
  const { pending } = useFormStatus();

  return (
    <Button className="ml-4" size="icon" variant="outline">
      <Loader2
        className={cn(pending ? "animate-spin block" : "hidden", "w-4 h-4")}
      />
      <XIcon className={cn(!pending ? "block" : "hidden", "w-4 h-4")} />
    </Button>
  );
}
