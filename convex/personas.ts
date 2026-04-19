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

// Query: composite behavioral scoring — the "real" ranking engine
// score = (0.5 × totalDwellMs) + (0.3 × avgScrollDepth × 1000) + (0.2 × clickCount × 5000)
// multiplied by a recency factor:  1.0 if last hour, 0.6 if last 24h, 0.2 otherwise
export const getRankedSectionsByScore = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return [];

    const ALL_SECTIONS = ["stats", "activity", "oracle", "notifications"];
    const now = Date.now();
    const oneHourAgo = now - 3_600_000;
    const oneDayAgo  = now - 86_400_000;

    // Fetch last 100 events ordered by ts desc
    const events = await ctx.db
      .query("events")
      .withIndex("by_user_ts", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);

    // Aggregate per section
    const sectionData: Record<
      string,
      { totalDwell: number; scrollSum: number; scrollCount: number; clicks: number; lastTs: number }
    > = {};

    for (const e of events) {
      if (!sectionData[e.section]) {
        sectionData[e.section] = { totalDwell: 0, scrollSum: 0, scrollCount: 0, clicks: 0, lastTs: 0 };
      }
      const d = sectionData[e.section];
      d.totalDwell += e.dwellMs ?? 0;
      d.scrollSum  += e.scrollDepth ?? 0;
      d.scrollCount++;
      if (e.action === "click") d.clicks++;
      if (e.ts > d.lastTs) d.lastTs = e.ts;
    }

    const scored = ALL_SECTIONS.map((section) => {
      const d = sectionData[section];
      if (!d) return { section, score: 0 };

      const avgScroll    = d.scrollCount > 0 ? d.scrollSum / d.scrollCount : 0;
      const recencyFactor =
        d.lastTs >= oneHourAgo ? 1.0 :
        d.lastTs >= oneDayAgo  ? 0.6 : 0.2;

      const rawScore =
        (0.5 * d.totalDwell) +
        (0.3 * avgScroll * 1000) +
        (0.2 * d.clicks * 5000);

      return { section, score: Math.round(rawScore * recencyFactor) };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .map((s) => s.section);
  },
});

// Query: dynamic AI insight sentence — used in AIInsightCard and AI ORACLE panel
export const getAIInsight = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return null;

    const persona = await ctx.db
      .query("personas")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const slots = await ctx.db
      .query("timeSlots")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (!persona || slots.length === 0) {
      return "Observing your workflow. Sections will adapt after a few interactions.";
    }

    // Find the peak hour
    const hourTotals: Record<number, number> = {};
    for (const s of slots) {
      hourTotals[s.hour] = (hourTotals[s.hour] ?? 0) + s.score;
    }
    const peakHour = Object.entries(hourTotals)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    const peakHourNum = peakHour ? parseInt(peakHour) : null;
    const peakStr = peakHourNum !== null
      ? (peakHourNum < 12 ? `${peakHourNum}am` : `${peakHourNum === 12 ? "12pm" : `${peakHourNum - 12}pm`}`)
      : null;

    // Top section from slots
    const sectionTotals: Record<string, number> = {};
    for (const s of slots) {
      sectionTotals[s.section] = (sectionTotals[s.section] ?? 0) + s.score;
    }
    const topSection = Object.entries(sectionTotals)
      .sort(([, a], [, b]) => b - a)[0]?.[0] ?? "Stats";

    const sectionLabels: Record<string, string> = {
      stats: "Your Metrics",
      activity: "Activity Chart",
      oracle: "AI Oracle",
      notifications: "Notifications",
    };

    const label = sectionLabels[topSection] ?? topSection;
    const personaCtx =
      persona.type === "Power User" ? "deep focus detected" :
      persona.type === "Quick Scanner" ? "fast-scan pattern active" :
      "exploratory browsing detected";

    if (peakStr) {
      return `${label} is your peak section around ${peakStr}. ${personaCtx.charAt(0).toUpperCase() + personaCtx.slice(1)} — "${label}" is prioritized now.`;
    }
    return `${label} receives your highest engagement. ${personaCtx.charAt(0).toUpperCase() + personaCtx.slice(1)}.`;
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

// Query: events per day for last 7 days — drives the mini bar chart
export const getWeeklyEngagement = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return [];
    const events = await ctx.db
      .query("events")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    for (const e of events) {
      const dow = e.dayOfWeek ?? new Date(e.ts).getDay();
      counts[dow] = (counts[dow] ?? 0) + 1;
    }

    // Return Mon → Sun order (starting index 1)
    return [1, 2, 3, 4, 5, 6, 0].map((dow) => ({
      day: DAY_LABELS[dow],
      count: counts[dow] ?? 0,
    }));
  },
});

// Query: dwell time per hour for today — drives the 24-hour heatmap strip
export const getTodaysHourlyActivity = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return new Array(24).fill(0) as number[];

    const todayHour = new Date();
    const slots = await ctx.db
      .query("timeSlots")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const hourTotals = new Array(24).fill(0) as number[];
    for (const slot of slots) {
      if (slot.hour >= 0 && slot.hour < 24) {
        hourTotals[slot.hour] += slot.score;
      }
    }
    return hourTotals;
  },
});
