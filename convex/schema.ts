import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    price: v.number(),
    stock: v.number(),
    description: v.string(),
    media: v.array(v.string()),
    isArchived: v.boolean(),
    createdAt: v.string(),
    userId: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    status: v.string(),
  }),
  cart: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  }),
  orders: defineTable({
    userId: v.string(),
    items: v.array(v.id("products")),
    status: v.string(),
    totalAmount: v.number(),
  }),
});
