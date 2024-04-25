import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductTableItem from "../_components/ProductTableItem";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { currentUser } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

export default async function ProductTable({
  status,
}: {
  status: "all" | "active" | "archived" | "draft";
}) {
  const user = await currentUser();

  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const products = await client.query(api.products.getUserProducts, {
    userId: user?.id,
    status,
  });

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Stock
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => {
              return <ProductTableItem {...product} key={product._id} />;
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col gap-12">
        <div className="text-xs text-muted-foreground">
          Showing{" "}
          <strong>
            {products.length === 0
              ? "0 products"
              : products.length > 10
                ? "1-10"
                : `1-${products.length}`}{" "}
          </strong>{" "}
          of <strong>{products.length}</strong> products{" "}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
