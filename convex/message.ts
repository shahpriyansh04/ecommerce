import { query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getTaskList = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    console.log(user);

    const tasks = await ctx.db.query("messages").order("desc").take(100);
    return tasks;
  },
});
