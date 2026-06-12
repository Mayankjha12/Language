import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || "";

    console.log("📥 Chat Request received with message:", message);

    if (!message) {
      return NextResponse.json(
        { intent: "general", reply: "Please provide a valid message." },
        { status: 400 }
      );
    }

    // 🚀 STRICT 22 LANGUAGES AUTO-DETECTION SYSTEM PROMPT
    const masterSystemPrompt = `You are Maya, an expert conversational multilingual assistant for the JanMitra Indian Government Services Platform.

YOUR MANDATORY MASTER DIRECTIVES:
1. AUTO-LANGUAGE DETECTION: Dynamically analyze the user's input text to instantly detect which of the 22 official Indian languages or scripts they are using (Hindi, Bengali, Tamil, Telugu, Marathi, Punjabi, etc.).
2. SCRIPT RECONSTRUCTION LAW:
   - If the user writes in Hindi or uses Romanized/Hinglish script (e.g., "mujhe scholarship chahiye", "mera ration card pending hai"), you MUST respond entirely in native pure HINDI script (Devnagari Script - e.g., "जी बिल्कुल, मैं आपकी सहायता कर सकती हूँ...").
   - If the user writes in English, respond in clean English.
   - For all other regional Indian languages, detect it and respond strictly using that specific language's official authentic script characters.
3. CONVERSATIONAL STYLE & VOICE AI COMPLIANCE: Speak naturally like a warm human agent. Keep responses exceptionally short, crisp, and fluid (strictly 1 to 2 sentences max). No markdown formats, no asterisks, no hashes, no bullet points.

DYNAMIC INTENT MAPPING:
Categorize the user request into exactly one of these tokens: "schemes", "complaints", "documents", or "general".

STRICT RAW JSON INTERFACE STRUCTURE:
Output ONLY a valid, tightly compiled JSON object. Do not wrap inside markdown code indicators (\`\`\`json), do not include trailing commentaries. Follow this layout exactly:
{"intent": "schemes" | "complaints" | "documents" | "general", "reply": "Your localized, script-accurate conversational response string goes here"}`;

    console.log("🤖 Querying Sarvam Core Engine array...");

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: masterSystemPrompt },
        { role: "user", content: `User Text Stream: ${message}` }
      ],
      temperature: 0.1,
      max_tokens: 250,
    });

    let content = completion.choices[0].message.content?.trim() || "{}";
    
    // Immediate sanitization of unwanted code blocks
    content = content.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed: any = { intent: "general", reply: content };

    if (content.includes("{") && content.includes("}")) {
      try {
        const startIdx = content.indexOf("{");
        const endIdx = content.lastIndexOf("}") + 1;
        parsed = JSON.parse(content.substring(startIdx, endIdx));
      } catch (e) {
        console.warn("⚠️ JSON Parse bypass, manual mapping required:", e);
      }
    }

    // Strip any lingering formatting tokens (*, #) that ruin screen/voice outputs
    if (parsed.reply && typeof parsed.reply === "string") {
      parsed.reply = parsed.reply.replace(/[*#\-–•]/g, "").trim();
    }

    // Dynamic fallback structure
    if (!parsed.reply || parsed.reply.trim() === "") {
      parsed.reply = "जी, मैं आपकी सहायता के लिए तैयार हूँ। कृपया अपना प्रश्न पूछें।";
    }
    if (!parsed.intent) parsed.intent = "general";

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("❌ CRITICAL RECOVERY EXCEPTION:", error);
    return NextResponse.json(
      { intent: "general", reply: "क्षमा चाहती हूँ, सर्ver से संपर्क स्थापित करने में कठिनाई हो रही है।" },
      { status: 500 }
    );
  }
}