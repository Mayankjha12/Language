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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentText, language } = body;
    const targetLang = (language || "english").toLowerCase();

    console.log(`🤖 Forcing Absolute Dynamic Key-Matching Stack for: ${targetLang}`);

    const isHindi = targetLang === "hindi";

    // 🌟 EXACT KEY LOCK: Standardizing JSON schemas to strictly match your UI page tags
    const systemPrompt = `You are JanMitra AI, an expert citizen services document analyzer and professional real-time machine translator. Your absolute directive is to analyze the user text and output ONLY a valid, single raw JSON object matching the exact keys and specifications below.

CRITICAL: Do not write any markdown code blocks like \`\`\`json, do not write extra text, and do not use list tokens like dashes (-), bullets, or asterisks (*).

${isHindi ? `
REQUIRED HINDI JSON SCHEMA (Keys must match exactly):
{
  "उद्देश्य": "दस्तावेज़ का मुख्य उद्देश्य और सरकारी एजेंडा क्या है, उसे सरल हिंदी वाक्यों में समझाएं।",
  "महत्वपूर्ण तिथियां": "दस्तावेज़ में दी गई सभी तारीखें, अंतिम तिथियां (Last Dates) या समय-सीमा। यदि कोई तारीख न मिले, तो लिखें 'कोई निश्चित समय-सीमा उल्लेखित नहीं है'।",
  "आवश्यक दस्तावेज": "नागरिकों को आवेदन या अनुपालन के लिए जो भी प्रमाण पत्र, फॉर्म, पहचान पत्र या कागजात जमा करने की आवश्यकता है, उनकी सूची। यदि कोई दस्तावेज़ आवश्यक न हो, तो लिखें 'कोई दस्तावेज़ आवश्यक नहीं है'।",
  "आवश्यक कार्रवाई": "उपयोगकर्ता या आम नागरिक को इस आदेश के अनुसार आगे क्या-क्या कदम उठाने हैं, उन्हें क्रमवार (step-by-step) आसान निर्देशों में लिखें।",
  "सरल सारांश": "पूरे दस्तावेज़ का मुख्य निचोड़ केवल 1-2 पंक्तियों में बेहद आसान और सरल हिंदी भाषा में लिखें।"
}
CRITICAL TRANSLATION LAW: You MUST write both the JSON keys and all values entirely in pure, simple, everyday conversational HINDI (Devnagari Script). Do not use English words or sentences in values.
` : `
REQUIRED ENGLISH JSON SCHEMA (Keys must match exactly):
{
  "purpose": "Extract the core reason or objective behind this specific document text.",
  "dates": "Look for deadlines, timelines, last dates, or registration targets. If none exist, output 'No specific deadlines mentioned'.",
  "requiredDocs": "Extract all specific certificates, application forms, or ID proofs requested from citizens. If none, write 'No documents required'.",
  "actions": "Break down clear, sequential step-by-step actions required by the citizen.",
  "summary": "Write a short 1-2 sentence layman explanation wrap-up."
}
CRITICAL LAW: Write both the JSON keys and values entirely in clean ENGLISH sentences.
`}

STRICT CONSTRAINTS:
1. Output ONLY the valid raw JSON object. Do not include markdown code block syntax (\`\`\`json), asterisks (*), list dashes (-), or hashes (#).
2. Avoid any raw double-quotes inside the text values. Use single quotes if necessary.`;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the input document text context to process:\n\n${documentText}` }
      ],
      temperature: 0.1
    });

    let outputText = completion.choices[0].message.content?.trim() || "{}";
    
    // Clean any unexpected markdown block wrappers instantly
    if (outputText.includes("{")) {
      outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
    }
    
    outputText = outputText.replace(/\n/g, " ").replace(/\r/g, " ").trim();

    try {
      // Pass 1: Try direct structured JSON parsing
      const parsed = JSON.parse(outputText);
      
      Object.keys(parsed).forEach((key) => {
        if (typeof parsed[key] === "string") {
          parsed[key] = parsed[key].replace(/[*#\-–•]/g, "").trim();
        }
      });

      return NextResponse.json(parsed);

    } catch (parseError) {
      console.warn("⚠️ JSON Parse variation encountered. Booting dynamic regex line extractor:", parseError);
      
      const extractKey = (key: string, sourceText: string): string => {
        const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
        const match = sourceText.match(regex);
        return match ? match[1].replace(/[*#\-–•]/g, "").trim() : "";
      };

      // Full dynamic string fallback array mapping matching UI components seamlessly
      if (isHindi) {
        return NextResponse.json({
          "उद्देश्य": extractKey("उद्देश्य", outputText) || "विवरण दस्तावेज़ में निर्दिष्ट नहीं है।",
          "महत्वपूर्ण तिथियां": extractKey("महत्वपूर्ण तिथियां", outputText) || "कोई निश्चित समय-सीमा उपलब्ध नहीं है।",
          "आवश्यक दस्तावेज": extractKey("आवश्यक दस्तावेज", outputText) || "कोई दस्तावेज़ आवश्यक नहीं है।",
          "आवश्यक कार्रवाई": extractKey("आवश्यक कार्रवाई", outputText) || "कोई विशिष्ट कार्रवाई आवश्यक नहीं है।",
          "सरल सारांश": extractKey("सरल सारांश", outputText) || "संक्षिप्त सारांश निकालने में असमर्थ।"
        });
      } else {
        return NextResponse.json({
          purpose: extractKey("purpose", outputText) || "Objective not specified in document.",
          dates: extractKey("dates", outputText) || "No explicit deadlines found.",
          requiredDocs: extractKey("requiredDocs", outputText) || "No required documents specified.",
          actions: extractKey("actions", outputText) || "No immediate actions needed.",
          summary: extractKey("summary", outputText) || "Layman summary extraction unavailable."
        });
      }
    }
  } catch (error) {
    console.error("❌ Document analyze engine critical loop failure:", error);
    return NextResponse.json({ error: "Dynamic blueprint validation fault." }, { status: 500 });
  }
}
