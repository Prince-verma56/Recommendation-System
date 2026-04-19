import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Called after every logEvent — classifies the user and updates timeSlots
export const computePersonaAndSlots = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Get last 50 events for this user
    const events = await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    if (events.length < 2) return null;

    // Compute averages from real data
    const avgScroll = Math.round(
      events.reduce((s, e) => s + (e.scrollSpeed ?? 0), 0) / events.length
    );
    const avgIdle = Math.round(
      events.reduce((s, e) => s + (e.idleMs ?? 0), 0) / events.length
    );
    const avgDwell = Math.round(
      events.reduce((s, e) => s + (e.dwellMs ?? 0), 0) / events.length
    );
    const confusionCount = events.filter(
      (e) => e.action === "idle" && (e.idleMs ?? 0) > 20000
    ).length;
    const clickCount = events.filter((e) => e.action === "click").length;

    // Persona classification — based on REAL behavioral signals
    let type = "Explorer";
    if (avgScroll > 300 && avgDwell < 30000 && clickCount > events.length * 0.6) {
      type = "Quick Scanner";
    } else if (avgDwell > 60000 && confusionCount < 2 && avgScroll < 500) {
      type = "Power User";
    } else if (confusionCount >= 2 || avgIdle > 15000) {
      type = "Explorer";
    }

    // Upsert persona
    const existing = await ctx.db
      .query("personas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const personaData = {
      userId,
      type,
      scrollAvg: avgScroll,
      idleAvg: avgIdle,
      dwellAvg: avgDwell,
      confusionCount,
      sessionCount: (existing?.sessionCount ?? 0) + 1,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, personaData);
    } else {
      await ctx.db.insert("personas", personaData);
    }

    // Update timeSlots — aggregate dwell time per section per hour
    for (const event of events) {
      if (!event.section || event.dwellMs === undefined) continue;

      const existingSlot = await ctx.db
        .query("timeSlots")
        .withIndex("by_user_hour", (q) =>
          q.eq("userId", userId).eq("hour", event.hour ?? 0)
        )
        .filter((q) => q.eq(q.field("section"), event.section))
        .first();

      if (existingSlot) {
        await ctx.db.patch(existingSlot._id, {
          score: existingSlot.score + event.dwellMs,
        });
      } else {
        await ctx.db.insert("timeSlots", {
          userId,
          hour: event.hour ?? 0,
          section: event.section,
          score: event.dwellMs,
        });
      }
    }

    return type;
  },
});

// Query: get current persona for user — used in Navbar badge
export const getPersona = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return null;
    return ctx.db
      .query("personas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Query: get sections ranked by score for current hour — drives dashboard reorder
export const getRankedSections = query({
  args: { userId: v.string(), hour: v.number() },
  handler: async (ctx, { userId, hour }) => {
    if (!userId) return [];
    const slots = await ctx.db
      .query("timeSlots")
      .withIndex("by_user_hour", (q) => q.eq("userId", userId).eq("hour", hour))
      .collect();

    const sorted = slots.sort((a, b) => b.score - a.score).map((s) => s.section);
    
    // Fill in any sections not yet in timeSlots
    const ALL_SECTIONS = ["stats", "activity", "oracle", "notifications"];
    const missing = ALL_SECTIONS.filter((s) => !sorted.includes(s));
    return [...sorted, ...missing];
  },
});

// Query: get all timeSlots for heatmap — used in Analytics page
export const getAllTimeSlots = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return [];
    return ctx.db
      .query("timeSlots")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

// Query: get real stats computed from events — used in Dashboard stats block
export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return null;
    const events = await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (events.length === 0) return null;

    const totalEvents = events.length;
    const avgDwellMs = Math.round(
      events.reduce((s, e) => s + (e.dwellMs ?? 0), 0) / events.length
    );
    const avgScrollDepth = Math.round(
      events.reduce((s, e) => s + (e.scrollDepth ?? 0), 0) / events.length
    );
    const idleEvents = events.filter((e) => e.action === "idle").length;
    const clickEvents = events.filter((e) => e.action === "click").length;
    
    // AI adaptations = number of times persona changed (approximated by session count)
    const persona = await ctx.db
      .query("personas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      totalEvents,
      avgDwellMs,
      avgScrollDepth,
      idleEvents,
      clickEvents,
      adaptations: persona?.sessionCount ?? 0,
      confusionCount: persona?.confusionCount ?? 0,
    };
  },
});

// Query: get recent events for timeline — used in Analytics session timeline
export const getRecentEvents = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit }) => {
    if (!userId) return [];
    return ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit ?? 15);
  },
});
