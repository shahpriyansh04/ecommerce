import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    // use `args` and/or `ctx.auth` to authorize the user
    // ...
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    // Return an upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrls = query({
  args: {
    media: v.array(v.string()),
  },
  async handler(ctx, args) {
    const filesWithUrl = await Promise.all(
      args.media.map(async (file) => ({
        url: await ctx.storage.getUrl(file),
      }))
    );
    console.log(filesWithUrl);

    return filesWithUrl;
  },
});
