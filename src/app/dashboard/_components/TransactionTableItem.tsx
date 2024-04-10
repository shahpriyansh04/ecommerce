import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";

interface TransactionTableItemProps {
  customer: string;
  type: string;
  status: string;
  date: string;
  amount: string;
}

export default function TransactionTableItem() {
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">Liam Johnson</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          liam@example.com
        </div>
      </TableCell>
      <TableCell className="hidden xl:table-column">Sale</TableCell>
      <TableCell className="hidden xl:table-column">
        <Badge className="text-xs" variant="outline">
          Approved
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
        2023-06-23
      </TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  );
}
