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

    console.log(`🤖 Forcing Absolute High-Fidelity Translation Stack for: ${targetLang}`);

    const isHindi = targetLang === "hindi";

    // Strict system structure to lock keys globally so frontend mapping never breaks
    const systemPrompt = `You are JanMitra AI, an expert citizen services document analyzer and absolute real-time machine translator. Your single absolute directive is to analyze the user text and output ONLY a valid, single raw JSON object matching the exact keys below.

CRITICAL: Do not write any markdown code blocks like \`\`\`json, do not write extra text, and do not use list tokens like dashes (-), bullets, or asterisks (*).

{
  "purpose": "Data string value text",
  "dates": "Data string value text",
  "requiredDocs": "Data string value text",
  "actions": "Data string value text",
  "summary": "Data string value text"
}`;

    // Isolating instructions completely based on language selection state
    let userPrompt = "";

    if (isHindi) {
      userPrompt = `तुम्हारा काम नीचे दिए गए अंग्रेज़ी दस्तावेज़ (English text) को ध्यान से पढ़ना, उसका पूरा अर्थ समझना और उसे पूरी तरह से सरल, आम बोलचाल की हिंदी (Devnagari Script) में अनुवाद (Translate) करके नीचे दी गई JSON Keys के अंदर भरना है।

सख्त निर्देश (All values MUST be written strictly in Hindi sentences):
1. "purpose": इस दस्तावेज़ या सरकारी आदेश को जारी करने का मुख्य उद्देश्य, कारण और एजेंडा क्या है, उसे सरल हिंदी में समझाएं। (Don't copy English lines)
2. "dates": दस्तावेज़ में दी गई सभी महत्वपूर्ण तारीखें, अंतिम तिथियां (Last Dates) या समय-सीमा ढूंढकर निकालें। यदि कोई तारीख न मिले, तो स्पष्ट लिखें "कोई निश्चित समय-सीमा उल्लेखित नहीं है"।
3. "requiredDocs": नागरिकों को आवेदन या अनुपालन के लिए जो भी प्रमाण पत्र, फॉर्म, पहचान पत्र या कागजात जमा करने की आवश्यकता है, उनकी सूची सरल हिंदी में लिखें। यदि कोई दस्तावेज़ आवश्यक न हो, तो लिखें "कोई दस्तावेज़ आवश्यक नहीं है"।
4. "actions": आम नागरिक या पाठक को इस आदेश के अनुसार आगे क्या-क्या कदम उठाने हैं, उन्हें क्रमवार (step-by-step) आसान हिंदी निर्देशों में लिखें।
5. "summary": पूरे दस्तावेज़ का मुख्य निचोड़ केवल 1-2 पंक्तियों में बेहद आसान और सरल हिंदी भाषा में लिखें।

ABSULUTE CONDITION: The JSON keys MUST remain exactly as "purpose", "dates", "requiredDocs", "actions", "summary". But every single string value inside them MUST be written in pure HINDI. Do not leave any English sentence untranslated.

ENGLISH DOCUMENT TEXT TO TRANSLATE AND ANALYZE:
${documentText}`;
    } else {
      userPrompt = `Analyze the provided document text and extract structural data patterns into clean regular English sentences for each parameter.

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
    
    // Scrub markdown block boundaries instantly
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
      console.warn("⚠️ JSON Syntax variation detected during translation parse. Running regex extractor:", parseError);
      
      const extractKey = (key: string, sourceText: string): string => {
        const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
        const match = sourceText.match(regex);
        return match ? match[1].replace(/[*#\-–•]/g, "").trim() : "";
      };

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
