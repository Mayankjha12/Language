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

    console.log(`🤖 Dynamic Bilingual Analyzer active. Target Language Mode: ${targetLang}`);

    // Configured strict structural prompt blueprints depending on language state
    const systemPrompt = `You are JanMitra AI, an expert conversational document analyzer and core translator. Your absolute directive is to analyze the provided source document text and format the extracted points into a strict, valid JSON object matching the requested schema keys exactly.

STRICT SCHEMA SCHEMATICS REQUIRED BASED ON LANGUAGE:

If target language is "hindi", you MUST return this exact JSON structure with Hindi keys and simple Devnagari sentences as values:
{
  "उद्देश्य": "दस्तावेज़ का मुख्य उद्देश्य या एजेंडा क्या है",
  "महत्वपूर्ण_तिथियां": "सभी समय-सीमाएं, समय सीमा फ़्रेम, या लागू होने की तारीखें",
  "आवश्यक_दस्तावेज": "नागरिकों को जमा करने के लिए आवश्यक प्रमाण पत्र या दस्तावेज",
  "आवश्यक_कार्रवाई": "उपयोगकर्ता को क्या कदम उठाने की आवश्यकता है",
  "संक्षिप्त_सारांश": "पूरे दस्तावेज़ का 1-2 पंक्तियों में आसान और सरल सारांश"
}

If target language is "english", you MUST return this exact JSON structure with English keys and values:
{
  "purpose": "Core objective or reason behind this specific document",
  "dates": "All critical deadlines, timelines, or release dates mentioned",
  "requiredDocs": "Specific certificates, forms, or identity cards needed from the user",
  "actions": "Clear step-by-step actions that the reader must perform",
  "summary": "A clean 1-2 sentence simplified layman summary wrap-up of the text"
}

STRICT CONSTRAINTS:
1. Output ONLY the single raw valid JSON object. Do not include markdown code block syntax (\`\`\`json), asterisks (*), list dashes (-), or hashes (#). 
2. Avoid any raw double-quotes inside the text values. Use single quotes if quoting anything inside a string value.`;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Target Output Language Code: ${targetLang}\n\nDocument text context payload:\n${documentText}` }
      ],
      temperature: 0.1
    });

    let outputText = completion.choices[0].message.content?.trim() || "{}";
    
    if (outputText.includes("{")) {
      outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
    }
    
    outputText = outputText.replace(/\n/g, " ").replace(/\r/g, " ").trim();

    try {
      const parsed = JSON.parse(outputText);
      
      Object.keys(parsed).forEach((key) => {
        if (typeof parsed[key] === "string") {
          parsed[key] = parsed[key].replace(/[*#\-–•]/g, "").trim();
        }
      });

      return NextResponse.json(parsed);

    } catch (parseError) {
      console.warn("⚠️ JSON Parse failed due to script tracking variations. Booting regex recovery:", parseError);
      
      const extractKey = (key: string, sourceText: string): string => {
        const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
        const match = sourceText.match(regex);
        return match ? match[1] : "";
      };

      if (targetLang === "hindi") {
        return NextResponse.json({
          "उद्देश्य": extractKey("उद्देश्य", outputText) || "विवरण उपलब्ध नहीं है",
          "महत्वपूर्ण_तिथियां": extractKey("महत्वपूर्ण_तिथियां", outputText) || "कोई विशिष्ट समय-सीमा नहीं मिली",
          "आवश्यक_दस्तावेज": extractKey("आवश्यक_दस्तावेज", outputText) || "कोई दस्तावेज़ निर्दिष्ट नहीं है",
          "आवश्यक_कार्रवाई": extractKey("आवश्यक_कार्रवाई", outputText) || "कोई कार्रवाई आवश्यक नहीं है",
          "संक्षिप्त_सारांश": extractKey("संक्षिप्त_सारांश", outputText) || "संक्षिप्त सारांश निकालने में असमर्थ"
        });
      } else {
        return NextResponse.json({
          purpose: extractKey("purpose", outputText) || "Objective not specified in document",
          dates: extractKey("dates", outputText) || "No specific timelines found",
          requiredDocs: extractKey("requiredDocs", outputText) || "No required documents specified",
          actions: extractKey("actions", outputText) || "No immediate actions needed",
          summary: extractKey("summary", outputText) || "Layman summary extraction unavailable"
        });
      }
    }
  } catch (error) {
    console.error("❌ Critical fault in dynamic bilingual parsing node:", error);
    return NextResponse.json({ error: "Dynamic parser execution fault." }, { status: 500 });
  }
}
