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

    // BILINGUAL SYSTEM PROMPT: Explaining the extraction context in both languages explicitly to the LLM
    const systemPrompt = `You are JanMitra AI, an expert constitutional and legal document analyzer. Your absolute directive is to analyze the provided text and strictly output a valid raw JSON object matching the exact key structure below. Do not change or translate the keys.

REQUIRED JSON SCHEMA:
{
  "purpose": "String data value",
  "dates": "String data value",
  "requiredDocs": "String data value",
  "actions": "String data value",
  "summary": "String data value"
}

EXECUTION PROTOCOLS FOR THE 5 KEYS (WITH BILINGUAL LOGIC):

1. "purpose" (दस्तावेज़ का उद्देश्य):
   - English: Explain the exact core reason, objective, or agenda behind this specific document.
   - Hindi: इस दस्तावेज़ को जारी करने का मुख्य कारण, उद्देश्य या सरकारी एजेंडा क्या है, उसे सरल शब्दों में समझाएं।

2. "dates" (महत्वपूर्ण तिथियां/समय-सीमा):
   - English: Extract all mandatory deadlines, target frames, timeline dates, or registration dates mentioned in the text. If no dates are found, specify that clearly.
   - Hindi: दस्तावेज़ में दी गई सभी महत्वपूर्ण तारीखें, अंतिम तिथियां (Last Dates), आवेदन की समय-सीमा या नियम लागू होने की तारीखों को ढूंढकर निकालें। यदि कोई तारीख न मिले, तो स्पष्ट लिखें।

3. "requiredDocs" (आवश्यक दस्तावेज/कागजी कार्रवाई):
   - English: Meticulously list any certificates, application forms, tokens, or physical proofs explicitly mentioned that citizens need to submit. If none are required, state it clearly.
   - Hindi: नागरिकों को आवेदन या अनुपालन के लिए जो भी प्रमाण पत्र, पहचान पत्र (जैसे पैन कार्ड, राशन कार्ड आदि), फॉर्म, टोकन या भौतिक सबूत जमा करने की आवश्यकता है, उनकी पूरी सूची बनाएं। यदि कोई दस्तावेज़ आवश्यक न हो, तो साफ लिखें।

4. "actions" (आवश्यक कार्रवाई/अगले कदम):
   - English: Break down clear, sequential actionable steps or compliance items that the reader/user must perform.
   - Hindi: उपयोगकर्ता या आम नागरिक को इस आदेश या दस्तावेज़ के अनुसार आगे क्या कदम उठाने हैं, उन्हें क्रमवार (step-by-step) आसान निर्देशों में तोड़कर लिखें।

5. "summary" (सरल और संक्षिप्त सारांश):
   - English: Provide a clean 1-2 sentence simplified layman translation explanation wrap-up of the document.
   - Hindi: पूरे दस्तावेज़ का निचोड़ केवल 1-2 पंक्तियों में एक आम आदमी की समझ के अनुसार बेहद आसान भाषा में लिखें।

STRICT LANGUAGE & TRANSLATION LAWS:
- If target language choice is "hindi", you MUST write the text values for all 5 keys entirely in simple, easy-to-understand everyday HINDI (Devnagari Script). Avoid heavy Sanskrit or complex legal words.
- If target language is "english", write the values in clean regular English sentences.
- ABSOLUTE CONSTRAINT: Output ONLY the raw valid JSON object. Do not include markdown code block syntax (\`\`\`json), asterisks (*), list dashes (-), or hashes (#). Use clean paragraph spacing instead.
- Internal Quotes: Avoid any raw double-quotes inside the text values. Use single quotes if necessary.`;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Target Language State: ${targetLang}\n\nDocument text content payload:\n${documentText}` }
      ],
      temperature: 0.1
    });

    let outputText = completion.choices[0].message.content?.trim() || "{}";
    
    // Clean any unexpected markdown blocks out instantly
    if (outputText.includes("{")) {
      outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
    }
    
    // Remove newlines and tabs which break string structures inside JSON
    outputText = outputText.replace(/\n/g, " ").replace(/\r/g, " ").trim();

    try {
      // Step 1: Standard direct JSON parsing
      const parsed = JSON.parse(outputText);
      
      Object.keys(parsed).forEach((key) => {
        if (typeof parsed[key] === "string") {
          parsed[key] = parsed[key].replace(/[*#\-–•]/g, "").trim();
        }
      });

      return NextResponse.json(parsed);

    } catch (parseError) {
      console.warn("⚠️ JSON Parse failed due to script characters. Executing dynamic fallback regex parser:", parseError);
      
      // Step 2: Fallback Regex Extractor to fetch dynamic content line-by-line without throwing syntax errors
      const extractKey = (key: string, sourceText: string): string => {
        const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
        const match = sourceText.match(regex);
        return match ? match[1] : "";
      };

      // 100% Dynamic Fallback container with local language state markers
      const dynamicParsed = {
        purpose: extractKey("purpose", outputText) || (targetLang === "hindi" ? "उद्देश्य दस्तावेज़ में निर्दिष्ट नहीं है" : "Objective not specified in document"),
        dates: extractKey("dates", outputText) || (targetLang === "hindi" ? "कोई महत्वपूर्ण तिथियां नहीं मिलीं" : "No specific timelines found"),
        requiredDocs: extractKey("requiredDocs", outputText) || (targetLang === "hindi" ? "कोई आवश्यक दस्तावेज़ उल्लेखित नहीं हैं" : "No required documents specified"),
        actions: extractKey("actions", outputText) || (targetLang === "hindi" ? "कोई कार्रवाई आवश्यक नहीं है" : "No immediate actions needed"),
        summary: extractKey("summary", outputText) || (targetLang === "hindi" ? "संक्षिप्त सारांश निकालने में असमर्थ" : "Layman summary extraction unavailable")
      };

      return NextResponse.json(dynamicParsed);
    }
  } catch (error) {
    console.error("❌ Document analyze loop critical failure:", error);
    return NextResponse.json({ error: "Dynamic data processing failure." }, { status: 500 });
  }
}
