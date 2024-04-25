import { client } from "@/lib/convex-client";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export default async function SuccessPage() {
  const user = await currentUser();
  const orders = await client.query(api.orders.getOrders, {
    userId: user?.id as string,
  });

  return <div className="text-7xl font-bold">SuccessPage</div>;
}
