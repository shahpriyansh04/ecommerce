import { client } from "@/lib/convex-client";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default async function ProductPage({
  params,
}: {
  params: { id: Id<"products"> };
}) {
  const product = await client.query(api.products.getProductById, {
    productId: params.id,
  });
  return <div>ProductPage : {product.name}</div>;
}
