"use client";
import { useUser } from "@clerk/nextjs";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY as string
);
export default function Checkout() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const priceData = decodeURIComponent(searchParams.get("items") as string);
  const productDetails = decodeURIComponent(
    searchParams.get("productDetails") as string
  );
  console.log(JSON.parse(productDetails));

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/checkout_sessions", {
      method: "POST",
      body: JSON.stringify({
        priceData: JSON.parse(priceData),
        userId: user?.id,
        productDetails: JSON.parse(productDetails),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.clientSecret) {
          throw new Error("Client secret is missing in the response");
        }
        return data.clientSecret;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
