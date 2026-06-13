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
    const isHindi = targetLang === "hindi";

    console.log(`🤖 Enforcing Property Baseline to exact Frontend State. Hindi: ${isHindi}`);

    if (!documentText || documentText.trim() === "") {
      return NextResponse.json({ error: "No document text provided" }, { status: 400 });
    }

    const systemPrompt = `You are JanMitra AI, an expert citizen services document intelligence analyzer.
Extract and analyze the user's input document parameters into a clean, strictly valid JSON object matching the exact requested key structure. 
Do not talk, do not add introductory text, and do not wrap the response in markdown code blocks like \`\`\`json. Only output the raw JSON object.`;

    let userPrompt = `Target Language State: ${targetLang}\n\nDocument Text:\n${documentText}`;
    
    if (isHindi) {
      userPrompt += `\n\nCRITICAL REQUIRED STRUCTURE:\nReturn a JSON object with exactly these keys: "उद्देश्य", "महत्वपूर्ण_तिथियां", "आवश्यक_दस्तावेज", "आवश्यक_कार्रवाई", "संक्षिप्त_सारांश". Write all string values dynamically extracted from the document in Hindi.`;
    } else {
      userPrompt += `\n\nCRITICAL REQUIRED STRUCTURE:\nReturn a JSON object with exactly these keys: "purpose", "dates", "requiredDocs", "actions", "summary". Write all string values dynamically extracted from the document in English.`;
    }

    let outputText = "";
    try {
      const completion = await openai.chat.completions.create(
        {
          model: "sarvam-30b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.1,
        },
        { timeout: 9500 }
      );
      outputText = completion.choices[0].message.content?.trim() || "";
    } catch (apiErr) {
      console.warn("⚠️ Sarvam API timeout or congestion hit.");
    }

    // ─── 🌟 STEP 1: INITIALIZE DEFAULT BASELINE SAFETY OBJECTS 🌟 ───
    let finalPayload: any = {};
    if (isHindi) {
      finalPayload = {
        "उद्देश्य": "दस्तावेज़ का उद्देश्य लोड नहीं किया जा सका। कृपया मैन्युअल रूप से जांचें।",
        "महत्वपूर्ण_तिथियां": "तिथियां उपलब्ध नहीं हैं या विश्लेषण विफल रहा।",
        "आवश्यक_दस्तावेज": "दस्तावेज़ों की सूची प्राप्त नहीं की जा सकी।",
        "आवश्यक_कार्रवाई": "कृपया आधिकारिक अधिसूचना के मुख्य निर्देशों का पालन करें।",
        "संक्षिप्त_सारांश": "इस दस्तावेज़ का विश्लेषण सर्वर लोड के कारण पूर्ण नहीं हो पाया।"
      };
    } else {
      finalPayload = {
        "purpose": "Purpose analysis extraction defaulted. Please review manually.",
        "dates": "Important timelines could not be extracted cleanly.",
        "requiredDocs": "Required document specifications not found.",
        "actions": "Please refer to the actionable guidelines mentioned in the main copy.",
        "summary": "Document processing timed out or failed to parse dynamic fields cleanly."
      };
    }

    // ─── STEP 2: OVERRIDE WITH DYNAMIC MODEL DATA IF VALID ───
    if (outputText && outputText.includes("{")) {
      // Isolate JSON substring to strip accidental system talk prefixes
      outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
      
      try {
        const parsedModelOutput = JSON.parse(outputText);
        
        if (isHindi) {
          if (parsedModelOutput["उद्देश्य"]) finalPayload["उद्देश्य"] = parsedModelOutput["उद्देश्य"];
          if (parsedModelOutput["महत्वपूर्ण_तिथियां"]) finalPayload["महत्वपूर्ण_तिथियां"] = parsedModelOutput["महत्वपूर्ण_तिथियां"];
          if (parsedModelOutput["आवश्यक_दस्तावेज"]) finalPayload["आवश्यक_दस्तावेज"] = parsedModelOutput["आवश्यक_दस्तावेज"];
          if (parsedModelOutput["आवश्यक_कार्रवाई"]) finalPayload["आवश्यक_कार्रवाई"] = parsedModelOutput["आवश्यक_कार्रवाई"];
          if (parsedModelOutput["संक्षिप्त_सारांश"]) finalPayload["संक्षिप्त_सारांश"] = parsedModelOutput["संक्षिप्त_सारांश"];
        } else {
          if (parsedModelOutput["purpose"]) finalPayload["purpose"] = parsedModelOutput["purpose"];
          if (parsedModelOutput["dates"]) finalPayload["dates"] = parsedModelOutput["dates"];
          if (parsedModelOutput["requiredDocs"]) finalPayload["requiredDocs"] = parsedModelOutput["requiredDocs"];
          if (parsedModelOutput["actions"]) finalPayload["actions"] = parsedModelOutput["actions"];
          if (parsedModelOutput["summary"]) finalPayload["summary"] = parsedModelOutput["summary"];
        }
      } catch (e) {
        console.warn("⚠️ JSON parse crashed. Initiating regex fallback capture for both language states.");
        
        // Dynamic string extractor helper via regex arrays
        const extractStringFallback = (key: string, raw: string): string => {
          const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
          const match = raw.replace(/[\n\r]/g, " ").match(regex);
          return match ? match[1].replace(/[*#`"]/g, "").trim() : "";
        };

        if (isHindi) {
          const val1 = extractStringFallback("उद्देश्य", outputText);
          const val2 = extractStringFallback("महत्वपूर्ण_तिथियां", outputText);
          const val3 = extractStringFallback("आवश्यक_दस्तावेज", outputText);
          const val4 = extractStringFallback("आवश्यक_कार्रवाई", outputText);
          const val5 = extractStringFallback("संक्षिप्त_सारांश", outputText);

          if (val1) finalPayload["उद्देश्य"] = val1;
          if (val2) finalPayload["महत्वपूर्ण_तिथियां"] = val2;
          if (val3) finalPayload["आवश्यक_दस्तावेज"] = val3;
          if (val4) finalPayload["आवश्यक_कार्रवाई"] = val4;
          if (val5) finalPayload["संक्षिप्त_सारांश"] = val5;
        } else {
          const val1 = extractStringFallback("purpose", outputText);
          const val2 = extractStringFallback("dates", outputText);
          const val3 = extractStringFallback("requiredDocs", outputText);
          const val4 = extractStringFallback("actions", outputText);
          const val5 = extractStringFallback("summary", outputText);

          if (val1) finalPayload["purpose"] = val1;
          if (val2) finalPayload["dates"] = val2;
          if (val3) finalPayload["requiredDocs"] = val3;
          if (val4) finalPayload["actions"] = val4;
          if (val5) finalPayload["summary"] = val5;
        }
      }
    }

    // ─── STEP 3: SANITIZE ERRATIC SYNTAX HASH MARKS ───
    Object.keys(finalPayload).forEach((key) => {
      if (typeof finalPayload[key] === "string") {
        finalPayload[key] = finalPayload[key].replace(/[*#`"]/g, "").trim();
      }
    });

    return NextResponse.json(finalPayload);

  } catch (error) {
    console.error("❌ Fatal crash in analyzer master route handler:", error);
    return NextResponse.json({ error: "Fatal layer processing bypass" }, { status: 500 });
  }
}







