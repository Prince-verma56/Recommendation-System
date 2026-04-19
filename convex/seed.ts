import { mutation } from "./_generated/server";
import { v } from "convex/values";

const SECTIONS = ["stats", "activity", "oracle", "notifications"];
const ACTIONS = ["click", "dwell", "scroll", "idle"];

// ── Seed realistic demo data for a user ───────────────────────────────────
// Inserts 50 events + timeSlots + a default persona so that getRankedSections
// returns a meaningful ranked list immediately on first login.
export const seedDemoData = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const now = Date.now();
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();

    // --- 50 synthetic events spread across the last 7 days ----------------
    const sectionWeights = { stats: 0.45, activity: 0.25, oracle: 0.15, notifications: 0.15 };

    for (let i = 0; i < 50; i++) {
      // Distribute over past 7 days, weighted toward today
      const daysAgo = Math.floor(Math.random() * 7);
      const hourBias =
        daysAgo === 0
          ? currentHour + Math.floor(Math.random() * 3) - 1 // near current hour today
          : Math.floor(Math.random() * 12) + 8; // 8am–8pm distribution

      const hour = Math.min(23, Math.max(0, hourBias));
      const ts = now - daysAgo * 86_400_000 - (currentHour - hour) * 3_600_000;

      // Pick section using weights
      const rand = Math.random();
      let section = "stats";
      let acc = 0;
      for (const [s, w] of Object.entries(sectionWeights)) {
        acc += w;
        if (rand < acc) { section = s; break; }
      }

      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const dwellMs = section === "stats"
        ? 5000 + Math.random() * 25000   // stats: longer dwell
        : 1000 + Math.random() * 8000;

      await ctx.db.insert("events", {
        userId,
        section,
        action,
        dwellMs: Math.round(dwellMs),
        scrollDepth: Math.round(Math.random() * 80 + 10),
        idleMs: Math.round(Math.random() * 5000),
        scrollSpeed: Math.round(Math.random() * 600),
        hour,
        dayOfWeek: (currentDay - daysAgo + 7) % 7,
        ts,
      });
    }

    // --- timeSlots: pre-compute scores for the current hour ----------------
    // gives getRankedSections an instant, meaningful result
    const slotData: Record<string, number> = {
      stats: 85000,
      activity: 42000,
      oracle: 18000,
      notifications: 12000,
    };

    for (const [section, score] of Object.entries(slotData)) {
      const existing = await ctx.db
        .query("timeSlots")
        .withIndex("by_user_hour", (q) =>
          q.eq("userId", userId).eq("hour", currentHour)
        )
        .filter((q) => q.eq(q.field("section"), section))
        .first();

      if (!existing) {
        await ctx.db.insert("timeSlots", {
          userId,
          hour: currentHour,
          section,
          score,
        });
      }
    }

    // --- Seed adjacent hours so the heatmap looks populated ----------------
    for (let h = 0; h < 24; h++) {
      for (const section of SECTIONS) {
        const existing = await ctx.db
          .query("timeSlots")
          .withIndex("by_user_hour", (q) =>
            q.eq("userId", userId).eq("hour", h)
          )
          .filter((q) => q.eq(q.field("section"), section))
          .first();

        if (!existing) {
          // Simulate a morning peak around 9–11
          const hourScore = section === "stats"
            ? Math.max(0, 80000 - Math.abs(h - 10) * 8000)
            : Math.max(0, 40000 - Math.abs(h - 14) * 5000);

          if (hourScore > 0) {
            await ctx.db.insert("timeSlots", {
              userId,
              hour: h,
              section,
              score: hourScore + Math.round(Math.random() * 5000),
            });
          }
        }
      }
    }

    // --- Default persona --------------------------------------------------
    const existingPersona = await ctx.db
      .query("personas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!existingPersona) {
      await ctx.db.insert("personas", {
        userId,
        type: "Explorer",
        scrollAvg: 120,
        idleAvg: 4000,
        dwellAvg: 12000,
        confusionCount: 0,
        sessionCount: 1,
        updatedAt: now,
      });
    }
  },
});

// ── Reset all user data (for Demo Reset button) ────────────────────────────
export const resetUserData = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    // Delete events
    const events = await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const e of events) await ctx.db.delete(e._id);

    // Delete timeSlots
    const slots = await ctx.db
      .query("timeSlots")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const s of slots) await ctx.db.delete(s._id);

    // Delete persona
    const persona = await ctx.db
      .query("personas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (persona) await ctx.db.delete(persona._id);

    // Delete preferences
    const prefs = await ctx.db
      .query("preferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (prefs) await ctx.db.delete(prefs._id);
  },
});
