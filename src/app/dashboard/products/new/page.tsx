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
import { useMutation } from "convex/react";
import { Loader2Icon, LoaderCircle, LoaderIcon, Upload } from "lucide-react";
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

export default function NewProduct() {
  const { register, control, watch, reset } = useForm<Product>();
  const createProduct = useMutation(api.products.createProduct);
  const watchAllFields = watch();
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<string[]>([]);
  const router = useRouter();
  const handleCreateProduct = async () => {
    setLoading(true);
    const product = createProduct({ ...watchAllFields, media });
    reset();
    setLoading(false);
    toast.promise(product, {
      loading: "Creating product...",
      success: "Product created successfully",
      error: "Failed to create product",
    });

    revalidateUserPath().then(() => {
      router.push("/dashboard/products");
    });
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                      id="name"
                      {...register("name")}
                      type="text"
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} />
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
                          {...register("stock", { valueAsNumber: true })}
                        />
                      </TableCell>
                      <TableCell>
                        <Label htmlFor="price-1" className="sr-only">
                          Price
                        </Label>
                        <Input
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
                      defaultValue=""
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
                    <Label htmlFor="subcategory">Subcategory (optional)</Label>
                    <Controller
                      name="subcategory"
                      control={control}
                      defaultValue=""
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
                      defaultValue="draft"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value: string) =>
                            field.onChange(value)
                          }
                          onOpenChange={field.onBlur}
                        >
                          <SelectTrigger id="status" aria-label="Select status">
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
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="w-80 whitespace-nowrap">
                  <FileUpload setMedia={setMedia} />
                </div>
              </CardContent>
            </Card>
            <Button
              className={cn("w-full", loading && "opacity-50")}
              onClick={handleCreateProduct}
            >
              {loading && (
                <LoaderCircle className="w-5 h-5 animate-spin mr-4" />
              )}
              Create Product
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
