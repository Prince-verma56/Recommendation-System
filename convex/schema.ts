import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    userId: v.string(),
    section: v.string(),       // "stats" | "analytics" | "actions" | "notifications"
    action: v.string(),        // "click" | "dwell" | "scroll" | "idle"
    dwellMs: v.number(),       // milliseconds spent on section
    scrollDepth: v.number(),   // 0-100 percent
    idleMs: v.number(),        // idle time before action
    scrollSpeed: v.number(),   // px/sec avg
    hour: v.number(),          // 0-23, hour of day
    dayOfWeek: v.number(),     // 0-6
    ts: v.number(),            // Date.now()
  }).index("by_user", ["userId"]).index("by_user_ts", ["userId", "ts"]),

  personas: defineTable({
    userId: v.string(),
    type: v.string(),          // "Power User" | "Explorer" | "Quick Scanner"
    scrollAvg: v.number(),
    idleAvg: v.number(),
    dwellAvg: v.number(),
    confusionCount: v.number(),
    sessionCount: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  timeSlots: defineTable({
    userId: v.string(),
    hour: v.number(),
    section: v.string(),
    score: v.number(),         // higher = show this section first at this hour
  }).index("by_user_hour", ["userId", "hour"]).index("by_user", ["userId"]),

  preferences: defineTable({
    userId: v.string(),
    personaOverride: v.optional(v.string()),  // null = AI decides
    aiToastsEnabled: v.boolean(),
    confusionHelpEnabled: v.boolean(),
    theme: v.string(),         // "dark" | "light"
  }).index("by_user", ["userId"]),
});
