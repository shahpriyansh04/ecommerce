"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export default function AddToCartButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className={cn(pending && "cursor-not-allowed")}
      disabled={pending}
    >
      <Loader2
        className={cn(pending ? "block animate-spin mr-3 w-4 h-4" : "hidden")}
      />
      Add to Cart
    </Button>
  );
}
