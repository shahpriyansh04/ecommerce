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
    status: v.string(),
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

export const getUserProducts = query({
  args: {
    userId: v.optional(v.string()),
    status: v.string(),
  },
  async handler(ctx, args) {
    let productsQuery = ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("userId"), args.userId));

    if (args.status !== "all") {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("status"), args.status)
      );
    }

    const products = await productsQuery.order("desc").collect();

    return products;
  },
});

export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
  },
  async handler(ctx, args) {
    const document = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("_id"), args.productId))
      .collect();

    if (!document) {
      throw new Error("Product not found");
    }

    await Promise.all(
      document[0].media.map((fileId: string) => ctx.storage.delete(fileId))
    );
    await ctx.db.delete(args.productId);

    return document;
  },
});

export const getProductById = query({
  args: {
    productId: v.id("products"),
  },
  async handler(ctx, args) {
    const product = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("_id"), args.productId))
      .collect();
    if (product.length === 0) {
      throw new Error("Product not found");
    }
    return product[0];
  },
});

export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
    description: v.optional(v.string()),
    media: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const { productId, ...product } = args;
    const document = await ctx.db.patch(args.productId, product);
    return document;
  },
});
