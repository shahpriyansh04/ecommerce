import { client } from "@/lib/convex-client";
import { ShoppingBag } from "lucide-react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

export default async function Cart() {
  const user = await currentUser();
  const cartItems = await client.query(api.cart.getCartItems, {
    userId: user?.id as string,
  });

  return (
    <div className="relative mr-6">
      <Link href="/cart">
        <ShoppingBag className=" text-gray-600 w-6 h-6 " />
        <span className="ml-1 text-gray-900 font-semibold absolute -bottom-2 text-sm right-0 bg-white rounded-full">
          {cartItems.length}
        </span>
      </Link>
    </div>
  );
}
