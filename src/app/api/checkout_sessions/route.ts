import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const { priceData, userId, productDetails } = await req.json();
  console.log(productDetails);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      ui_mode: "embedded",
      line_items: priceData,
      mode: "payment",
      metadata: {
        //pass user id and the product ids
        userId: userId,
        productDetails: JSON.stringify(productDetails),
      },
      return_url: `${headersList.get("origin")}/checkout/success`,
    });

    return NextResponse.json({
      sessionId: session.id,
      clientSecret: session.client_secret,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error creating checkout session" });
  }
}

export async function GET(req: Request, context: { session_id: string }) {
  const session = await stripe.checkout.sessions.retrieve(context.session_id);

  return NextResponse.json({ session });
}
