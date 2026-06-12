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

    console.log(`🤖 Dynamic Bilingual Analyzer Engine Active. Target Language Mode: ${targetLang}`);

    // STRICT INSTRUCTION: Keys must ALWAYS remain standard English parameters, only values change language dynamically
    const systemPrompt = `You are JanMitra AI, an expert conversational document analyzer and core translator. Your absolute directive is to analyze the provided source document text and format the extracted points into a strict, valid JSON object matching these exact schema keys:

{
  "purpose": "Value data sentence here",
  "dates": "Value data sentence here",
  "requiredDocs": "Value data sentence here",
  "actions": "Value data sentence here",
  "summary": "Value data sentence here"
}

STRICT LANGUAGE & TRANSLATION LAWS:
1. IF TARGET LANGUAGE IS "HINDI": You MUST read the input text context and dynamically translate, extract, and write the values for all 5 JSON object keys ("purpose", "dates", "requiredDocs", "actions", "summary") natively in very simple, conversational everyday HINDI (Devnagari Script) text sentences so an ordinary local citizen can understand it instantly. Avoid heavy legal or complex words.
2. IF TARGET LANGUAGE IS "ENGLISH": Extract and write the values in clean regular English sentences.
3. ABSOLUTE CONSTRAINT: Output ONLY a single valid raw JSON object. Do not include markdown code block syntax (\`\`\`json), asterisks (*), list dashes (-), or hashes (#). 
4. Avoid any raw double-quotes inside the text values. Use single quotes if quoting anything inside a string value.`;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Target Output Translation Language: ${targetLang}\n\nDocument Content to Process and Translate:\n${documentText}` }
      ],
      temperature: 0.1
    });

    let outputText = completion.choices[0].message.content?.trim() || "{}";
    
    // Clean any unexpected markdown blocks out instantly
    if (outputText.includes("{")) {
      outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
    }
    
    // Remove newlines and tabs which break string structures
    outputText = outputText.replace(/\n/g, " ").replace(/\r/g, " ").trim();

    try {
      // Step 1: Attempt standard direct JSON parsing
      const parsed = JSON.parse(outputText);
      
      Object.keys(parsed).forEach((key) => {
        if (typeof parsed[key] === "string") {
          parsed[key] = parsed[key].replace(/[*#\-–•]/g, "").trim();
        }
      });

      return NextResponse.json(parsed);

    } catch (parseError) {
      console.warn("⚠️ JSON Parse failed due to translation character escaping. Initiating dynamic regex parsing engine:", parseError);
      
      // Step 2: Fallback Regex Extractor to fetch dynamic content line-by-line without throwing errors
      const extractKey = (key: string, sourceText: string): string => {
        const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
        const match = sourceText.match(regex);
        return match ? match[1] : "";
      };

      // Full dynamic data mapping with local fallback strings matching the targeted language state
      const dynamicParsed = {
        purpose: extractKey("purpose", outputText) || (targetLang === "hindi" ? "दस्तावेज़ में उद्देश्य निर्दिष्ट नहीं है" : "Objective not specified in document"),
        dates: extractKey("dates", outputText) || (targetLang === "hindi" ? "कोई महत्वपूर्ण तिथियां नहीं मिलीं" : "No specific timelines found"),
        requiredDocs: extractKey("requiredDocs", outputText) || (targetLang === "hindi" ? "कोई आवश्यक दस्तावेज़ उल्लेखित नहीं हैं" : "No required documents specified"),
        actions: extractKey("actions", outputText) || (targetLang === "hindi" ? "कोई विशिष्ट कार्रवाई आवश्यक नहीं है" : "No immediate actions needed"),
        summary: extractKey("summary", outputText) || (targetLang === "hindi" ? "संक्षिप्त सारांश निकालने में असमर्थ" : "Layman summary extraction unavailable")
      };

      return NextResponse.json(dynamicParsed);
    }
  } catch (error) {
    console.error("❌ Document analyze loop critical failure:", error);
    return NextResponse.json({ error: "Dynamic translation engine failure." }, { status: 500 });
  }
}
