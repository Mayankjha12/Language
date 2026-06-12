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

    console.log(`🤖 Hard-wiring absolute bilingual separation loop for language: ${targetLang}`);

    const systemPrompt = `You are JanMitra AI, an expert citizen services document analyzer and high-fidelity real-time translator. Your absolute directive is to analyze the user text and output ONLY a valid, single raw JSON object matching the exact keys below.

CRITICAL: Do not write any markdown code blocks like \`\`\`json, do not write extra text, and do not use list tokens like dashes (-), bullets, or asterisks (*).

{
  "purpose": "Data string value text",
  "dates": "Data string value text",
  "requiredDocs": "Data string value text",
  "actions": "Data string value text",
  "summary": "Data string value text"
}`;

    // Dynamic Blueprint Generation based strictly on the language selection state
    let userPrompt = "";

    if (targetLang === "hindi") {
      userPrompt = `तुम एक कुशल सरकारी दस्तावेज़ विश्लेषक और अनुवादक हो। तुम्हारा काम नीचे दिए गए अंग्रेज़ी या किसी भी दस्तावेज़ को गहराई से समझना है और उसकी जानकारी को पूरी तरह से सरल और आम बोलचाल की हिंदी (Devnagari Script) में निकालकर इस JSON स्ट्रक्चर के अंदर भरना है।

प्रत्येक Key के लिए निर्देश (Values MUST be in pure simple Hindi sentences):
1. "purpose": इस दस्तावेज़ या सरकारी आदेश को जारी करने का मुख्य उद्देश्य और एजेंडा क्या है, उसे सरल शब्दों में लिखें।
2. "dates": दस्तावेज़ में दी गई सभी महत्वपूर्ण तारीखें, समय-सीमाएं (deadlines) या अंतिम तिथियां (Last Dates) निकालें। यदि कोई तारीख न हो, तो लिखें "कोई निश्चित समय-सीमा उल्लेखित नहीं है"।
3. "requiredDocs": नागरिकों को आवेदन या अनुपालन के लिए जो भी प्रमाण पत्र, फॉर्म, पहचान पत्र या कागजात जमा करने की आवश्यकता है, उनकी पूरी सूची लिखें। यदि कोई दस्तावेज़ आवश्यक न हो, तो लिखें "कोई दस्तावेज़ आवश्यक नहीं है"।
4. "actions": उपयोगकर्ता या आम नागरिक को इस आदेश के अनुसार आगे क्या कदम उठाने हैं, उन्हें क्रमवार (step-by-step) आसान निर्देशों में लिखें।
5. "summary": पूरे दस्तावेज़ का मुख्य निचोड़ केवल 1-2 पंक्तियों में एक आम आदमी की समझ के अनुसार बेहद आसान भाषा में लिखें।

CRITICAL: Keep the JSON keys ("purpose", "dates", "requiredDocs", "actions", "summary") exactly in English lowercase as requested, but write all their values strictly in HINDI.

DOCUMENT TEXT SEGMENT TO ANALYZE DYNAMICALLY:
${documentText}`;
    } else {
      userPrompt = `Analyze the document text and extract structural data patterns into clean regular English sentences for each parameter.

INSTRUCTIONS FOR VALUE EXTRACTION:
1. "purpose": Extract the core reason or objective behind this specific document text.
2. "dates": Look for deadlines, timelines, last dates, or registration targets. If none exist, output "No specific deadlines mentioned".
3. "requiredDocs": Extract all specific certificates, application forms, or ID proofs requested from citizens. If none, write "No documents required".
4. "actions": Break down clear, sequential step-by-step actions required by the citizen.
5. "summary": Write a short 1-2 sentence layman explanation wrap-up.

DOCUMENT TEXT SEGMENT TO ANALYZE DYNAMICALLY:
${documentText}`;
    }

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
      const parsed = JSON.parse(outputText);
      
      Object.keys(parsed).forEach((key) => {
        if (typeof parsed[key] === "string") {
          parsed[key] = parsed[key].replace(/[*#\-–•]/g, "").trim();
        }
      });

      return NextResponse.json(parsed);

    } catch (parseError) {
      console.warn("⚠️ JSON Syntax variation detected during parsing. Running regex extractor:", parseError);
      
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
    console.error("❌ Document analyze engine fatal collapse:", error);
    return NextResponse.json({ error: "Dynamic data processing failure." }, { status: 500 });
  }
}
