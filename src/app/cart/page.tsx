import { Button } from "@/components/ui/button";
import { client } from "@/lib/convex-client";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { currentUser } from "@clerk/nextjs";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import RemoveFromCart from "./_components/RemoveFromCart";
import { revalidatePath } from "next/cache";
import IncreaseQuantity from "./_components/IncreaseQuantity";
import DecreaseQuantity from "./_components/DecreaseQuantity";

type CartPageItem = Doc<"products"> & {
  quantity?: number;
  cartId?: Id<"cart">;
};

export default async function CartPage() {
  const user = await currentUser();
  const cartItemsId = await client.query(api.cart.getCartItems, {
    userId: user?.id as string,
  });
  const cartItems: CartPageItem[] = await Promise.all(
    cartItemsId.map(async (item) => {
      let product: CartPageItem = await client.query(
        api.products.getProductById,
        {
          productId: item.productId,
        }
      );
      const url = await client.query(api.files.getFileUrls, {
        media: [product.media[0]],
      });
      product.media = [url[0].url as string];
      product.quantity = item.quantity;

      return {
        ...product,
        cartId: item._id,
      };
    })
  );

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity as number),
    0
  );

  async function removeFromCart(id: Id<"cart">) {
    "use server";
    console.log("hello");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1  gap-8">
        {cartItems.map((item) => (
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            key={item._id}
          >
            <div className="flex items-center p-4">
              <img
                alt="Product Image"
                className="rounded-md mr-4"
                height={80}
                src={item.media[0]}
                style={{
                  aspectRatio: "80/80",
                  objectFit: "cover",
                }}
                width={80}
              />
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-500">${item.price}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <form
                  action={async function decreaseQuantity() {
                    "use server";
                    await client.mutation(api.cart.decreaseQuantity, {
                      cartId: item.cartId as Id<"cart">,
                    });
                    revalidatePath("/");
                  }}
                >
                  <DecreaseQuantity />
                </form>
                <span className="text-gray-700">{item.quantity}</span>

                <form
                  action={async function increaseQuantity() {
                    "use server";
                    await client.mutation(api.cart.increaseQuantity, {
                      cartId: item.cartId as Id<"cart">,
                    });
                    revalidatePath("/");
                  }}
                >
                  <IncreaseQuantity />
                </form>
              </div>
              <form
                action={async function remove() {
                  "use server";
                  await client.mutation(api.cart.deleteFromCart, {
                    cartId: item.cartId as Id<"cart">,
                  });
                  revalidatePath("/");
                }}
              >
                <RemoveFromCart />
              </form>
            </div>
          </div>
        ))}
      </div>
      {cartItems.length > 0 ? (
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between items-center mb-2">
            <p>Subtotal</p>
            <p className="font-medium">${totalAmount}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p>Shipping</p>
            <div className="flex gap-4">
              <p className="font-medium text-muted-foreground line-through">
                $5.00
              </p>
              <p className="font-extrabold">FREE</p>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p>Total</p>
            <p className="text-2xl font-bold">${totalAmount}</p>
          </div>
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      ) : (
        <p>Your Cart is empty</p>
      )}
    </div>
  );
}
