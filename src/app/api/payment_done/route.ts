import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";
import Stripe from "stripe";
const endpointSecret = "whsec_QYweFgYfGVW10PJQThqYIADsz3qw3MKH";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log(event.type);
  } catch (err) {
    console.log(err);

    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log("PaymentIntent was successful!");

      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    case "payment_intent.requires_action":
      console.log("PaymentIntent requires action");

    default:
      console.log(event.type);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response("RESPONSE EXECUTE", {
    status: 200,
  });
}
