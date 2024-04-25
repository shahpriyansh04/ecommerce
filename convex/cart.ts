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

export const deleteFromCart = mutation({
  args: {
    cartId: v.id("cart"),
  },
  async handler(ctx, args) {
    await ctx.db.delete(args.cartId);
  },
});

export const increaseQuantity = mutation({
  args: {
    cartId: v.id("cart"),
  },
  async handler(ctx, args) {
    const cartItem = await ctx.db.get(args.cartId);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    await ctx.db.patch(args.cartId, {
      quantity: cartItem.quantity + 1,
    });
  },
});

export const decreaseQuantity = mutation({
  args: {
    cartId: v.id("cart"),
  },
  async handler(ctx, args) {
    const cartItem = await ctx.db.get(args.cartId);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    if (cartItem.quantity === 1) {
      await ctx.db.delete(args.cartId);
    } else {
      await ctx.db.patch(args.cartId, {
        quantity: cartItem.quantity - 1,
      });
    }
  },
});

export const deleteCart = mutation({
  args: {
    userId: v.string(),
  },
  async handler(ctx, args) {
    const cartItems = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    await Promise.all(cartItems.map((item) => ctx.db.delete(item._id)));
  },
});
