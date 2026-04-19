import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { persona, topSection, previousTop, reason } = await req.json();

  const systemPrompt = `You are explaining why a smart dashboard rearranged itself.
Write ONE casual sentence in second person, like a helpful AI talking to the user.
Be specific. Mention the section name and a real behavioral reason.
Never start with "I". Never use quotes. Max 20 words.`;

  const userPrompt = `Persona: ${persona}. Section "${topSection}" is now first. 
Previously "${previousTop}" was first. Reason: ${reason}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://personaui.vercel.app",
        "X-Title": "PersonaUI",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 60,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const narration =
      data.choices?.[0]?.message?.content?.trim() ??
      `${topSection} moved up based on your recent activity pattern.`;

    return NextResponse.json({ narration });
  } catch {
    return NextResponse.json({
      narration: `${topSection} is now first — you spend the most time here at this hour.`,
    });
  }
}
