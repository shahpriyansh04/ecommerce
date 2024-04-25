import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";
import Stripe from "stripe";
import { client } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { revalidatePath } from "next/cache";
import revalidateUserPath from "@/app/dashboard/products/action";
const endpointSecret =
  "whsec_b7766de3f599c4b5182c9dc6c290dbde1e0743d6882762e34a75e6d74cdafc72";
// const endpointSecret = "whsec_QYweFgYfGVW10PJQThqYIADsz3qw3MKH";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.log(err);

    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntentSucceeded = event.data.object;
      const productDetails = paymentIntentSucceeded?.metadata?.productDetails;
      console.log(JSON.parse(productDetails as string));

      const order = await client.mutation(api.orders.createOrder, {
        details: JSON.parse(productDetails as string),
        totalAmount: paymentIntentSucceeded?.amount_total as number,
        userId: paymentIntentSucceeded?.metadata?.userId as string,
      });
      const deleteCart = await client.mutation(api.cart.deleteCart, {
        userId: paymentIntentSucceeded?.metadata?.userId as string,
      });
      revalidatePath("/");
      revalidatePath("/cart");

      break;
    case "payment_intent.requires_action":
      const paymentIntent = event.data.object;

    default:
  }

  return new Response("RESPONSE EXECUTE", {
    status: 200,
  });
}
