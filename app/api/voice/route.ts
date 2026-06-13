import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, language } = body;
    const clientLang = (language || "en-US").toLowerCase();

    console.log(` Anton Voice Engine Active. Processing query: "${message}" | Context: ${clientLang}`);

    if (!message || message.trim() === "") {
      return NextResponse.json({ reply: "Awaiting valid vocal parameter streams.", intent: "none" });
    }

    // High-Fidelity System prompt engineered for concise audio text conversions
    const systemPrompt = `You are Maya, a multilingual Indian government voice assistant.
Your response will be spoken out loud via TTS, so keep it extremely brief (strictly 1-2 short conversational sentences), clear, and direct.

LANGUAGE POLICY:
- If the user talks in Hindi or mixed Hinglish, you MUST reply instantly in clear conversational Hindi using the Devnagari Script.
- If the user uses English, reply in plain English.

INTENT EXTRACTION MATRICES:
Analyze the input text and classify it into exactly one of these targets:
- For central/state schemes, pensions, or monetary eligibility limits: "schemes"
- For municipal grievances, infrastructure complaints (roads, water leakage, garbage disposal): "complaints"
- For legal paper summarization, extracting records from notices: "documents"
- For general talk or anything else outside our features: "none"

Return a strictly valid JSON block. Do not include markdown code block syntax.
Example Template:
{
  "reply": "Your clear conversational audio sentence goes here.",
  "intent": "schemes"
}`;

    let replyText = "";
    try {
      const completion = await openai.chat.completions.create({
        model: "sarvam-30b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.2,
      });
      replyText = completion.choices[0].message.content?.trim() || "";
    } catch (apiErr) {
      console.warn("⚠️ Voice route API bottleneck controlled.");
    }

    let parsed = { reply: "", intent: "none" };
    try {
      if (replyText.includes("{")) {
        replyText = replyText.substring(replyText.indexOf("{"), replyText.lastIndexOf("}") + 1);
      }
      parsed = JSON.parse(replyText);
    } catch (e) {
      // Inline substring token parser if JSON model structure outputs broken
      parsed.reply = replyText.replace(/[*#`"]/g, "").trim();
      const lower = message.toLowerCase();
      if (lower.includes("scheme") || lower.includes("योजना")) parsed.intent = "schemes";
      if (lower.includes("complaint") || lower.includes("शिकायत")) parsed.intent = "complaints";
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("❌ Critical exit from voice pipeline router:", error);
    return NextResponse.json({ reply: "Connection refresh active. Speak again.", intent: "none" }, { status: 500 });
  }
}
