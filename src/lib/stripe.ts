import Stripe from "stripe";

// if (!process.env.STRIPE_TEST_SECRET_KEY) {
//   throw new Error(
//     "STRIPE_TEST_SECRET_KEY is missing. Please set the environment variable."
//   );
// }

const stripe = new Stripe(
  "sk_test_51P7w4VSFeTgUDkbXyxYuyFQKBcOaqMK1GC8DH3XPpvDJiJgNMciUoEpU5QWbZ52hfEElmXRCb3tPu2KzI2X3FN1000omZyRV2B",
  {
    apiVersion: "2024-04-10",
  }
);

export default stripe;
