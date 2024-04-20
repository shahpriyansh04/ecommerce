import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addToCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  async handler(ctx, args) {
    const existingCartItem = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .collect();

    if (existingCartItem.length > 0) {
      const updatedCartItem = await ctx.db.patch(existingCartItem[0]._id, {
        quantity: existingCartItem[0].quantity + args.quantity,
      });
      return updatedCartItem;
    } else {
      const newCartItem = await ctx.db.insert("cart", {
        userId: args.userId,
        productId: args.productId,
        quantity: args.quantity,
      });

      return newCartItem;
    }
  },
});
export const getCartItems = query({
  args: {
    userId: v.string(),
  },
  async handler(ctx, args) {
    const cartItems = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
    return cartItems;
  },
});
