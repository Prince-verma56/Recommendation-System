import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logEvent = mutation({
  args: {
    userId: v.string(),
    section: v.string(),
    action: v.string(),
    dwellMs: v.number(),
    scrollDepth: v.number(),
    idleMs: v.number(),
    scrollSpeed: v.number(),
    hour: v.number(),
    dayOfWeek: v.number(),
    ts: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("events", {
      userId: args.userId,
      section: args.section,
      action: args.action,
      dwellMs: args.dwellMs,
      scrollDepth: args.scrollDepth,
      idleMs: args.idleMs,
      scrollSpeed: args.scrollSpeed,
      hour: args.hour,
      dayOfWeek: args.dayOfWeek,
      ts: args.ts,
    });
  },
});
