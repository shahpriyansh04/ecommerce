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
  }),
});
