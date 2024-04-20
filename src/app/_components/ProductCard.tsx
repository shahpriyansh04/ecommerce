import React from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { client } from "@/lib/convex-client";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function ProductCard(product: Doc<"products">) {
  const urls = await client.query(api.files.getFileUrls, {
    media: product.media,
  });
  return (
    <div>
      <Card>
        <CardHeader className="bg-gray-100 flex items-center justify-center">
          <div className="h-56 w-48">
            <img
              src={urls[0]?.url as string}
              alt="Image url"
              className="object-cover h-full"
            />
          </div>
        </CardHeader>
        <CardContent className="mt-2 py-4 px-3">
          <Link href={`/product/${product._id}`}>
            <p className="text-lg font-semibold hover:underline transition duration-200 cursor-pointer">
              {product.name}
            </p>
          </Link>
          <p className="text-sm">${product.price}</p>
        </CardContent>
      </Card>
    </div>
  );
}
