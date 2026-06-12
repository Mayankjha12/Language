import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  let message = "";
  let language = "en-US";

  try {
    const body = await req.json();
    message = body.message || "";
    language = body.language || "en-US";

    console.log("📥 Chat Request received with payload:", { message, language });

    if (!message || !language) {
      return NextResponse.json(
        { intent: "general", reply: "Please provide both message and language parameters." },
        { status: 400 }
      );
    }

    // Advanced Localized Multi-Intent Instruction Prompt Engineering Matrix
    const masterSystemPrompt = `You are Maya, the expert, highly empathetic, and natural conversational multilingual voice assistant for the JanMitra Indian Government Services Platform.

YOUR MANDATORY VOCAL LIFE-CYCLE DIRECTIVES:
1. Speak exactly like a warm, supportive, polite, and highly professional human agent. Never give robotic, structured, or dry analytical responses.
2. SCRIPT COMPLIANCE LOCK: You MUST respond strictly using the authentic native script characters of the target language requested.
   - If target language is 'hi-IN', write ONLY in pure Devnagari script characters (e.g., "जी बिल्कुल, मैं आपको बताती हूँ..."). Absolute zero Roman characters or Hinglish translucent expressions are allowed.
   - If target language is 'en-US', write ONLY in clean, corporate English text.
   - For any other selected regional language parameter (like bn-IN, ta-IN, te-IN, mr-IN, etc.), apply this exact same strict rule: use ONLY that specific language's official native character alphabet.
3. Keep answers exceptionally short, warm, and focused (maximum 1 to 2 sentences). Long analytical paragraphs cause the Text-to-Speech playback loop to glitch.

DYNAMIC PLATFORM INTENT MAPPING PORTALS:
Evaluate the user input context and categorize it into exactly one of these 4 tracking tokens:
- "schemes": Questions about scholarships, pensions, PM Kisan, subsidies, eligibility, or welfare grants.
- "complaints": Civic tracking, electricity cuts, water leakages, waste management, or public grievances.
- "documents": Identity certificates, forms processing, passports, registration requirements, or document explanations.
- "general": Basic greetings, small talk, pleasantries, or questions unrelated to specific civic platform actions.

Current Target User Language Mode Parameter: ${language}

STRICT OUTPUT COMPLIANCE FORMAT:
Return ONLY a valid, single unquoted JSON object structure matching the format layout directly below. Do not wrap inside markdown code indicators, do not include trailing explanations, commentaries, or structural prefixes.

{"intent": "schemes" | "complaints" | "documents" | "general", "reply": "Your completely localized, script-accurate conversational response sentence goes here"}`;

    console.log("🤖 Calling Sarvam AI Core Engine Array with strict compliance configuration...");

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: masterSystemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.0, // Strict lock to maximize parsing predictability and block character bleeding
      max_tokens: 350,
    });

    let content = completion.choices[0].message.content?.trim() || "";
    
    // Direct string manipulation cleanup to eliminate accidental markdown enclosures instantly
    content = content.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed: any = { intent: "general", reply: content };

    if (content.includes("{") && content.includes("}")) {
      try {
        const startIdx = content.indexOf("{");
        const endIdx = content.lastIndexOf("}") + 1;
        parsed = JSON.parse(content.substring(startIdx, endIdx));
        console.log("✨ Response JSON successfully verified and parsed:", parsed);
      } catch (e) {
        console.warn("Manual fallback parsing sequence executed:", e);
      }
    }

    // Secure fallback statements if structural keys are missing
    if (!parsed.reply || parsed.reply.trim() === "") {
      parsed.reply = language === "hi-IN" 
        ? "जी, मैं आपकी सहायता के लिए तैयार हूँ। कृपया अपना प्रश्न पूछें।" 
        : "Yes, I am here to assist you. Please ask your question.";
    }

    if (!parsed.intent) {
      parsed.intent = "general";
    }

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("❌ CRITICAL RECOVERY LAYER EXCEPTION ENCOUNTERED:", error);
    return NextResponse.json(
      {
        intent: "general",
        reply: language === "hi-IN" 
          ? "क्षमा चाहती हूँ, सर्वर से संपर्क स्थापित करने में कठिनाई हो रही है।" 
          : "I apologize, there was an issue processing your request. Please try again."
      },
      { status: 500 }
    );
  }
}
