import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const { priceData } = await req.json();
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      ui_mode: "embedded",
      line_items: priceData,
      mode: "payment",
      return_url: `${headersList.get("origin")}/checkout/success`,
    });
    console.log(session);

    return NextResponse.json({
      sessionId: session.id,
      clientSecret: session.client_secret,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error creating checkout session" });
  }
}

export async function GET(context: { session_id: string }) {
  const session = await stripe.checkout.sessions.retrieve(context.session_id);

  return NextResponse.json({ session });
}
