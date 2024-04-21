import { client } from "@/lib/convex-client";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { currentUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import { redirect, useRouter } from "next/navigation";
import Router from "next/router";
import AddToCartButton from "@/app/_components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: { id: Id<"products"> };
}) {
  const user = await currentUser();
  const product = await client.query(api.products.getProductById, {
    productId: params.id,
  });
  const urls = await client.query(api.files.getFileUrls, {
    media: product.media,
  });
  const handleAddToCart = async () => {
    "use server";
    const addToCart = await client.mutation(api.cart.addToCart, {
      productId: product._id,
      userId: user?.id as string,
      quantity: 1,
    });
    console.log(addToCart);
    revalidatePath("/cart");
    redirect("/cart");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Carousel
            className="rounded-lg"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="">
              {urls.map((image) => (
                <CarouselItem key={image.url}>
                  <img
                    alt="Product Image"
                    className="aspect-square object-cover"
                    height={600}
                    src={image.url as string}
                    width={600}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="space-y-6 ml-12">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {product.category}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-primary" />
              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
              <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              (12 reviews)
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">${product.price}</h2>
          </div>
          <div className="text-gray-500 dark:text-gray-400 leading-relaxed">
            <p>{product.description}</p>
            <p className="mt-4">
              The design of the Acme Prism T-Shirt is as striking as it is
              comfortable. The shirt features a unique prism-inspired pattern
              that adds a modern and eye-catching touch to your ensemble.
            </p>
          </div>
          <form action={handleAddToCart}>
            <AddToCartButton />
          </form>
        </div>
      </div>
      <Separator className="my-12" />
      <div>
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">John Doe</div>
                <div className="flex items-center gap-0.5">
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                  <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                I really love this t-shirt! The quality is amazing and the
                design is so unique. Definitely worth the price.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">Jane Smith</div>
                <div className="flex items-center gap-0.5">
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-primary" />
                  <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                I was hesitant at first, but this t-shirt has exceeded my
                expectations. The fit is perfect, and the fabric is so
                comfortable. Highly recommend!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
