import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProduct = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    stock: v.number(),
    description: v.string(),
    media: v.array(v.string()),
    category: v.string(),
    subcategory: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("products", {
      createdAt: new Date().toISOString(),
      isArchived: false,
      userId: userId,
      ...args,
    });

    return document;
  },
});

export const getProducts = query({
  args: {
    userId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    return products;
  },
});