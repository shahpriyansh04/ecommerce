import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createOrder = mutation({
  args: {
    userId: v.string(),
    items: v.array(v.id("products")),
    totalAmount: v.number(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("orders", {
      userId: args.userId,
      items: args.items,
      status: "pending",
      totalAmount: args.totalAmount,
    });
  },
});
