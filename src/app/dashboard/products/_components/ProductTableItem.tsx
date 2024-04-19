import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { WithoutSystemFields } from "convex/server";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import revalidateUserPath from "../action";
import ProductTableItemDropdown from "./ProductTableItemDropdown";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default async function ProductTableItem(product: Doc<"products">) {
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const url = await client.query(api.files.getFileUrls, {
    media: product.media,
  });

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <img
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={url[0]?.url as string}
          width="64"
        />
      </TableCell>

      <TableCell className="font-medium hover:underline hover:cursor-pointer">
        <Link href={`/dashboard/products/${product._id}`}>{product.name}</Link>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{product.status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">${product.price}</TableCell>
      <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(product.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <ProductTableItemDropdown id={product._id as Id<"products">} />
      </TableCell>
    </TableRow>
  );
}
