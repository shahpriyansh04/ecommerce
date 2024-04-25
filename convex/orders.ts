import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrder = mutation({
  args: {
    userId: v.string(),
    details: v.array(
      v.object({
        itemId: v.id("products"),
        sellerId: v.string(),
      })
    ),
    totalAmount: v.number(),
  },
  async handler(ctx, args) {
    const details = args.details.map((detail) => ({
      itemId: detail.itemId,
      sellerId: detail.sellerId,
    }));

    await ctx.db.insert("orders", {
      userId: args.userId,
      details: details,
      status: "pending",
      totalAmount: args.totalAmount,
    });
  },
});

export const getOrders = query({
  args: {
    userId: v.string(),
  },
  async handler(ctx, args) {
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return orders;
  },
});

export const getSellerOrders = query({
  args: {
    sellerId: v.string(),
  },
  async handler(ctx, args) {
    const orders = await ctx.db.query("orders").collect();

    //filter out the array of orders to only include orders that have a sellerId that matches the sellerId passed in
    const sellerOrders = orders
      .map((order) => {
        const details = order.details.filter(
          (detail) => detail.sellerId === args.sellerId
        );
        return { ...order, details };
      })
      .filter((order) => order.details.length > 0);
    return sellerOrders;
  },
});
