import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { User, clerkClient } from "@clerk/nextjs/server";
import React from "react";
import { Doc } from "../../../../../convex/_generated/dataModel";

export default async function OrdersTableItem({
  order,
}: {
  order: Doc<"orders">;
}) {
  const user = await clerkClient.users.getUser(order.details[0].sellerId);

  return (
    <TableRow className="bg-accent">
      <TableCell>
        <div className="font-medium">
          {user.firstName} {user.lastName}
        </div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {user.emailAddresses[0].emailAddress}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">Sale</TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge className="text-xs" variant="secondary">
          {order?.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(order?._creationTime).toDateString()}
      </TableCell>
      <TableCell className="text-right">${order?.totalAmount}</TableCell>
    </TableRow>
  );
}
