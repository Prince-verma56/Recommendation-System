import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPreferences = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return null;
    return ctx.db
      .query("preferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const setPersonaOverride = mutation({
  args: {
    userId: v.string(),
    personaOverride: v.optional(v.string()), // null = AI decides
  },
  handler: async (ctx, { userId, personaOverride }) => {
    const existing = await ctx.db
      .query("preferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { personaOverride });
    } else {
      await ctx.db.insert("preferences", {
        userId,
        personaOverride,
        aiToastsEnabled: true,
        confusionHelpEnabled: true,
        theme: "dark",
      });
    }
  },
});
