import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentText, language } = body;
    const targetLang = (language || "english").toLowerCase();

    console.log(`🤖 Deploying strict dual-prompt structural layout for: ${targetLang}`);

    // Keeping System Prompt short and zero-example to prevent model from repeating prompt text
    const systemPrompt = `You are JanMitra AI, an expert citizen services document analyzer. Your absolute directive is to analyze the user text and output ONLY a valid, single raw JSON object matching the exact keys below. 

CRITICAL: Do not write any markdown code blocks like \`\`\`json, do not write extra text, and do not use list tokens like dashes (-), bullets, or asterisks (*).

{
  "purpose": "Core objective of the document",
  "dates": "Specific deadlines or targets found",
  "requiredDocs": "Mandatory proofs, identity certificates or forms required",
  "actions": "Sequential step-by-step next tasks for the reader",
  "summary": "1-2 sentence simplified layman summary wrap-up"
}`;

    // Moving language instructions directly into user context where LLM executes best
    const userPrompt = `Target Language State: ${targetLang}

INSTRUCTIONS FOR VALUE EXTRACTION:
1. "purpose": Extract the core reason behind this specific document text.
2. "dates": Look for deadlines, timelines, last dates, or targets. If none exist, explicitly output "No specific deadlines mentioned" in the target language.
3. "requiredDocs": Extract all specific certificates, application forms, or ID proofs requested from citizens. If none, write "No documents required" in the target language.
4. "actions": Break down clear, step-by-step actions required by the citizen.
5. "summary": Write a short 1-2 sentence layman explanation wrap-up.

LANGUAGE LAW:
- If Target Language State is "hindi", write the sentence values for all 5 JSON keys entirely in pure, simple, everyday conversational HINDI (Devnagari Script).
- If Target Language State is "english", write everything in clean English.
- The 5 JSON keys ("purpose", "dates", "requiredDocs", "actions", "summary") must stay exactly in English as specified.

DOCUMENT TEXT SEGMENT TO ANALYZE DYNAMICALLY:
${documentText}`;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
    });

    let outputText = completion.choices[0].message.content?.trim() || "{}";
    
    // Scrub markdown indicators instantly
    if (outputText.includes("{")) {
      outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
    }
    
    outputText = outputText.replace(/\n/g, " ").replace(/\r/g, " ").trim();

    try {
      // Primary verification pass
      const parsed = JSON.parse(outputText);
      
      Object.keys(parsed).forEach((key) => {
        if (typeof parsed[key] === "string") {
          parsed[key] = parsed[key].replace(/[*#\-–•]/g, "").trim();
        }
      });

      return NextResponse.json(parsed);

    } catch (parseError) {
      console.warn("⚠️ JSON Syntax variation detected, initializing semantic layout parser:", parseError);
      
      // Dynamic fallback regex engine to secure keys line-by-line if model slips characters
      const extractKey = (key: string, sourceText: string): string => {
        const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
        const match = sourceText.match(regex);
        return match ? match[1].replace(/[*#\-–•]/g, "").trim() : "";
      };

      const isHindi = targetLang === "hindi";

      const dynamicParsed = {
        purpose: extractKey("purpose", outputText) || (isHindi ? "दस्तावेज़ का उद्देश्य निर्दिष्ट नहीं है।" : "Objective not specified in document."),
        dates: extractKey("dates", outputText) || (isHindi ? "कोई निश्चित तिथियां या समय-सीमा नहीं मिली।" : "No explicit deadlines found."),
        requiredDocs: extractKey("requiredDocs", outputText) || (isHindi ? "कोई आवश्यक दस्तावेज़ निर्दिष्ट नहीं हैं।" : "No required documents specified."),
        actions: extractKey("actions", outputText) || (isHindi ? "कोई विशिष्ट कार्रवाई आवश्यक नहीं है।" : "No immediate actions needed."),
        summary: extractKey("summary", outputText) || (isHindi ? "संक्षिप्त सारांश निकालने में असमर्थ।" : "Layman summary extraction unavailable.")
      };

      return NextResponse.json(dynamicParsed);
    }
  } catch (error) {
    console.error("❌ Document analyze engine loop collapse:", error);
    return NextResponse.json({ error: "Dynamic matrix token leakage sequence hit." }, { status: 500 });
  }
}
