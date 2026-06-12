// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// const openai = new OpenAI({
//   apiKey: process.env.SARVAM_API_KEY,
//   baseURL: "https://api.sarvam.ai/v1",
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { documentText, language } = body;
//     const targetLang = (language || "english").toLowerCase();

//     console.log(`🤖 Deploying strict dual-prompt structural layout for: ${targetLang}`);

//     // Keeping System Prompt short and zero-example to prevent model from repeating prompt text
//     const systemPrompt = `You are JanMitra AI, an expert citizen services document analyzer. Your absolute directive is to analyze the user text and output ONLY a valid, single raw JSON object matching the exact keys below. 

// CRITICAL: Do not write any markdown code blocks like \`\`\`json, do not write extra text, and do not use list tokens like dashes (-), bullets, or asterisks (*).

// {
//   "purpose": "Core objective of the document",
//   "dates": "Specific deadlines or targets found",
//   "requiredDocs": "Mandatory proofs, identity certificates or forms required",
//   "actions": "Sequential step-by-step next tasks for the reader",
//   "summary": "1-2 sentence simplified layman summary wrap-up"
// }`;

//     // Moving language instructions directly into user context where LLM executes best
//     const userPrompt = `Target Language State: ${targetLang}

// INSTRUCTIONS FOR VALUE EXTRACTION:
// 1. "purpose": Extract the core reason behind this specific document text.
// 2. "dates": Look for deadlines, timelines, last dates, or targets. If none exist, explicitly output "No specific deadlines mentioned" in the target language.
// 3. "requiredDocs": Extract all specific certificates, application forms, or ID proofs requested from citizens. If none, write "No documents required" in the target language.
// 4. "actions": Break down clear, step-by-step actions required by the citizen.
// 5. "summary": Write a short 1-2 sentence layman explanation wrap-up.

// LANGUAGE LAW:
// - If Target Language State is "hindi", write the sentence values for all 5 JSON keys entirely in pure, simple, everyday conversational HINDI (Devnagari Script).
// - If Target Language State is "english", write everything in clean English.
// - The 5 JSON keys ("purpose", "dates", "requiredDocs", "actions", "summary") must stay exactly in English as specified.

// DOCUMENT TEXT SEGMENT TO ANALYZE DYNAMICALLY:
// ${documentText}`;

//     const completion = await openai.chat.completions.create({
//       model: "sarvam-30b",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt }
//       ],
//       temperature: 0.1,
//     });

//     let outputText = completion.choices[0].message.content?.trim() || "{}";
    
//     // Scrub markdown indicators instantly
//     if (outputText.includes("{")) {
//       outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
//     }
    
//     outputText = outputText.replace(/\n/g, " ").replace(/\r/g, " ").trim();

//     try {
//       // Primary verification pass
//       const parsed = JSON.parse(outputText);
      
//       Object.keys(parsed).forEach((key) => {
//         if (typeof parsed[key] === "string") {
//           parsed[key] = parsed[key].replace(/[*#\-–•]/g, "").trim();
//         }
//       });

//       return NextResponse.json(parsed);

//     } catch (parseError) {
//       console.warn("⚠️ JSON Syntax variation detected, initializing semantic layout parser:", parseError);
      
//       // Dynamic fallback regex engine to secure keys line-by-line if model slips characters
//       const extractKey = (key: string, sourceText: string): string => {
//         const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
//         const match = sourceText.match(regex);
//         return match ? match[1].replace(/[*#\-–•]/g, "").trim() : "";
//       };

//       const isHindi = targetLang === "hindi";

//       const dynamicParsed = {
//         purpose: extractKey("purpose", outputText) || (isHindi ? "दस्तावेज़ का उद्देश्य निर्दिष्ट नहीं है।" : "Objective not specified in document."),
//         dates: extractKey("dates", outputText) || (isHindi ? "कोई निश्चित तिथियां या समय-सीमा नहीं मिली।" : "No explicit deadlines found."),
//         requiredDocs: extractKey("requiredDocs", outputText) || (isHindi ? "कोई आवश्यक दस्तावेज़ निर्दिष्ट नहीं हैं।" : "No required documents specified."),
//         actions: extractKey("actions", outputText) || (isHindi ? "कोई विशिष्ट कार्रवाई आवश्यक नहीं है।" : "No immediate actions needed."),
//         summary: extractKey("summary", outputText) || (isHindi ? "संक्षिप्त सारांश निकालने में असमर्थ।" : "Layman summary extraction unavailable.")
//       };

//       return NextResponse.json(dynamicParsed);
//     }
//   } catch (error) {
//     console.error("❌ Document analyze engine loop collapse:", error);
//     return NextResponse.json({ error: "Dynamic matrix token leakage sequence hit." }, { status: 500 });
//   }
// }


import OpenAI from "openai";
import { NextResponse } from "next/server";
 
const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});
 
// ─── Helper: strip markdown fences & grab first {...} block ───────────────────
function extractJSON(raw: string): string {
  // Remove ```json ... ``` or ``` ... ``` wrappers
  let cleaned = raw.replace(/```(?:json)?[\s\S]*?```/gi, (m) =>
    m.replace(/```(?:json)?/gi, "").replace(/```/g, "")
  );
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return "{}";
  cleaned = cleaned.substring(start, end + 1);
  // Collapse newlines inside string values (common Sarvam issue)
  cleaned = cleaned.replace(/[\n\r]+/g, " ").trim();
  return cleaned;
}
 
// ─── Helper: safe JSON parse with single-quote fallback ───────────────────────
function safeParse(text: string): Record<string, string> | null {
  try {
    return JSON.parse(text);
  } catch {
    // Replace unescaped single quotes used as string delimiters — NOT standard
    // but Sarvam sometimes does this
    try {
      const fixed = text
        .replace(/:\s*'([^']*)'/g, ': "$1"') // 'value' → "value"
        .replace(/,\s*}/g, "}") // trailing commas
        .replace(/,\s*]/g, "]");
      return JSON.parse(fixed);
    } catch {
      return null;
    }
  }
}
 
// ─── Helper: regex key extractor (last-resort fallback) ───────────────────────
function extractByRegex(key: string, src: string): string {
  // Works for both ASCII and Devanagari keys
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`"${escaped}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
  const m = src.match(re);
  return m ? m[1].replace(/[*#\-–•]/g, "").trim() : "";
}
 
// ─── Sanitise a parsed object's string values ─────────────────────────────────
function sanitiseValues(obj: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === "string" ? v.replace(/[*#•]/g, "").trim() : v;
  }
  return out;
}
 
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentText, language } = body;
    const targetLang = (language || "english").toLowerCase();
    const isHindi = targetLang === "hindi";
 
    console.log(`🤖 Analyzing document in: ${targetLang}`);
 
    // ── Prompts ────────────────────────────────────────────────────────────────
    const englishSystemPrompt = `You are JanMitra AI, a government document analyzer.
Analyze the provided document and respond with ONLY a raw JSON object — no markdown, no code fences, no extra text.
 
Required JSON (keys and values must be in English):
{
  "purpose": "Core reason or objective of the document in 2-3 sentences.",
  "dates": "All deadlines, timelines, or registration targets. If none, write: No specific deadlines mentioned.",
  "requiredDocs": "All documents, certificates, or ID proofs citizens must submit. If none, write: No documents required.",
  "actions": "Step-by-step actions the citizen must take, written as numbered steps in a single string.",
  "summary": "1-2 sentence plain-language summary a common person can understand."
}
 
RULES:
- Output ONLY the JSON object. No preamble, no explanation.
- Do NOT use markdown code blocks.
- Do NOT use asterisks, bullets, or hashes inside values.
- Use double-quoted keys and values. Escape any double-quotes inside values with backslash.`;
 
    const hindiSystemPrompt = `आप JanMitra AI हैं, एक सरकारी दस्तावेज़ विश्लेषक।
नीचे दिए गए दस्तावेज़ का विश्लेषण करें और केवल एक raw JSON object के रूप में उत्तर दें — कोई markdown नहीं, कोई code block नहीं, कोई अतिरिक्त text नहीं।
 
आवश्यक JSON (सभी keys और values हिंदी में होनी चाहिए):
{
  "उद्देश्य": "दस्तावेज़ का मुख्य उद्देश्य सरल हिंदी में 2-3 वाक्यों में लिखें।",
  "महत्वपूर्ण तिथियां": "दस्तावेज़ में उल्लिखित सभी तारीखें या अंतिम तिथियां। यदि कोई न हो तो लिखें: कोई निश्चित समय-सीमा उल्लेखित नहीं है।",
  "आवश्यक दस्तावेज": "नागरिकों को जमा करने हेतु सभी प्रमाण पत्र, फॉर्म या पहचान पत्र। यदि कोई न हो तो लिखें: कोई दस्तावेज़ आवश्यक नहीं है।",
  "आवश्यक कार्रवाई": "नागरिक को क्रमवार (step-by-step) क्या करना है, एक ही string में numbered steps के रूप में लिखें।",
  "सरल सारांश": "पूरे दस्तावेज़ का सार केवल 1-2 सरल हिंदी वाक्यों में।"
}
 
नियम:
- केवल JSON object आउटपुट करें। कोई प्रस्तावना या स्पष्टीकरण नहीं।
- markdown code blocks का उपयोग न करें।
- values के अंदर asterisk, bullet या hash का उपयोग न करें।
- double-quoted keys और values का उपयोग करें। values के अंदर double-quotes को backslash से escape करें।`;
 
    // ── Call Sarvam API ────────────────────────────────────────────────────────
    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        {
          role: "system",
          content: isHindi ? hindiSystemPrompt : englishSystemPrompt,
        },
        {
          role: "user",
          content: `दस्तावेज़ / Document:\n\n${documentText}`,
        },
      ],
      // Slightly higher temp for Hindi generation quality
      temperature: isHindi ? 0.3 : 0.1,
      max_tokens: 1200,
    });
 
    const rawOutput =
      completion.choices[0].message.content?.trim() || "{}";
 
    console.log("📄 Raw Sarvam output:", rawOutput.substring(0, 300));
 
    // ── Parse pipeline ─────────────────────────────────────────────────────────
    const jsonString = extractJSON(rawOutput);
    let parsed = safeParse(jsonString);
 
    if (parsed) {
      return NextResponse.json(sanitiseValues(parsed as Record<string, string>));
    }
 
    // ── Regex last-resort fallback ─────────────────────────────────────────────
    console.warn("⚠️ JSON parse failed, using regex fallback");
 
    if (isHindi) {
      return NextResponse.json({
        उद्देश्य:
          extractByRegex("उद्देश्य", rawOutput) ||
          "विवरण दस्तावेज़ में निर्दिष्ट नहीं है।",
        "महत्वपूर्ण तिथियां":
          extractByRegex("महत्वपूर्ण तिथियां", rawOutput) ||
          "कोई निश्चित समय-सीमा उपलब्ध नहीं है।",
        "आवश्यक दस्तावेज":
          extractByRegex("आवश्यक दस्तावेज", rawOutput) ||
          "कोई दस्तावेज़ आवश्यक नहीं है।",
        "आवश्यक कार्रवाई":
          extractByRegex("आवश्यक कार्रवाई", rawOutput) ||
          "कोई विशिष्ट कार्रवाई आवश्यक नहीं है।",
        "सरल सारांश":
          extractByRegex("सरल सारांश", rawOutput) ||
          "संक्षिप्त सारांश निकालने में असमर्था।",
      });
    } else {
      return NextResponse.json({
        purpose:
          extractByRegex("purpose", rawOutput) ||
          "Objective not specified in document.",
        dates:
          extractByRegex("dates", rawOutput) ||
          "No explicit deadlines found.",
        requiredDocs:
          extractByRegex("requiredDocs", rawOutput) ||
          "No required documents specified.",
        actions:
          extractByRegex("actions", rawOutput) ||
          "No immediate actions needed.",
        summary:
          extractByRegex("summary", rawOutput) ||
          "Layman summary extraction unavailable.",
      });
    }
  } catch (error) {
    console.error("❌ Document analyze engine failure:", error);
    return NextResponse.json(
      { error: "Document analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
