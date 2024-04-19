"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import {
  ChevronLeft,
  Loader2Icon,
  LoaderCircle,
  LoaderIcon,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { api } from "../../../../../convex/_generated/api";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import FileUpload from "../_components/FileUpload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import revalidateUserPath from "../action";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { client } from "@/lib/convex-client";
import Link from "next/link";
interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  media: string[];
  category: string;
  subcategory: string;
  status: "draft" | "active" | "archived";
}
export default function ProductPage({
  params,
}: {
  params: { id: Id<"products"> };
}) {
  const product = useQuery(api.products.getProductById, {
    productId: params.id,
  });
  const urls = useQuery(api.files.getFileUrls, {
    media: product?.media as string[],
  });

  const update = useMutation(api.products.update);
  const { register, control, watch, reset } = useForm<Product>({
    defaultValues: {
      name: product?.name,
      description: product?.description,
      price: product?.price,
      stock: product?.stock,
      media: product?.media,
      category: product?.category,
      subcategory: product?.subcategory,
      status: product?.status as "draft" | "active" | "archived",
    },
  });

  const [loading, setLoading] = useState(false);
  if (!product) {
    return (
      <main className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        loading...
      </main>
    );
  }

  const watchAllFields = watch();
  const productValues: Product = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    media: product.media,
    category: product.category,
    //@ts-ignore
    subcategory: product.subcategory,
    status: product.status as "draft" | "active" | "archived",
  };

  const hasChanged =
    JSON.stringify(productValues) === JSON.stringify(watchAllFields);

  const updateProduct = async () => {
    setLoading(true);
    const document = update({ productId: params.id, ...watchAllFields });

    toast.promise(document, {
      loading: "Updating product",
      success: "Product updated successfully",
      error: "Failed to update product",
    });
    revalidateUserPath();
    setLoading(false);
  };

  return (
    <main className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="mx-auto grid max-w-[80rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <Link href="/dashboard/products">
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {product?.name}
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            In stock
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                reset({
                  name: product?.name,
                  description: product?.description,
                  price: product?.price,
                  stock: product?.stock,
                  media: product?.media,
                  category: product?.category,
                  subcategory: product?.subcategory,
                  status: product?.status as "draft" | "active" | "archived",
                })
              }
            >
              Discard
            </Button>
            <Button size="sm" disabled={hasChanged} onClick={updateProduct}>
              Save Product
            </Button>
          </div>
        </div>
        <div className="mx-auto grid max-w-[80rem] flex-1 auto-rows-max gap-4">
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        defaultValue={product?.name}
                        id="name"
                        {...register("name")}
                        type="text"
                        className="w-full"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        defaultValue={product.description}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Stock</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price (in $)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Label htmlFor="stock-1" className="sr-only">
                            Stock
                          </Label>

                          <Input
                            id="stock-1"
                            type="number"
                            defaultValue={product.stock}
                            {...register("stock", { valueAsNumber: true })}
                          />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="price-1" className="sr-only">
                            Price
                          </Label>
                          <Input
                            defaultValue={product.price}
                            id="price-1"
                            {...register("price", { valueAsNumber: true })}
                            type="number"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-3">
                      <Label htmlFor="category">Category</Label>
                      <Controller
                        name="category"
                        control={control}
                        defaultValue={product.category}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                            onOpenChange={field.onBlur}
                          >
                            <SelectTrigger
                              id="category"
                              aria-label="Select category"
                            >
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="electronics">
                                Electronics
                              </SelectItem>
                              <SelectItem value="accessories">
                                Accessories
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="subcategory">
                        Subcategory (optional)
                      </Label>
                      <Controller
                        name="subcategory"
                        control={control}
                        defaultValue={product.subcategory}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                            onOpenChange={field.onBlur}
                          >
                            <SelectTrigger
                              id="subcategory"
                              aria-label="Select subcategory"
                            >
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="t-shirts">T-Shirts</SelectItem>
                              <SelectItem value="hoodies">Hoodies</SelectItem>
                              <SelectItem value="sweatshirts">
                                Sweatshirts
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue={
                          product.status as "draft" | "active" | "archived"
                        }
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                            onOpenChange={field.onBlur}
                          >
                            <SelectTrigger
                              id="status"
                              aria-label="Select status"
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <ScrollArea className="h-80">
                  <CardContent className="grid gap-4  grid-cols-2">
                    {urls?.map((url) => {
                      return (
                        <div key={url.url} className="w-full h-40">
                          <img
                            src={url.url as string}
                            alt="product image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
