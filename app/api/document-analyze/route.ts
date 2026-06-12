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

    console.log(`🤖 Hard-wiring master analysis structural grid for stack: ${targetLang}`);

    const systemPrompt = `You are JanMitra AI, an expert constitutional and legal document analyzer. Your absolute directive is to extract metadata from the text data and natively serialize the key-value structures into a strict, valid JSON container matching this configuration exactly.

REQUIRED JSON STRUCTURAL bluePRINT:
{
  "purpose": "Value string data text here",
  "dates": "Value string data text here",
  "requiredDocs": "Value string data text here",
  "actions": "Value string data text here",
  "summary": "Value string data text here"
}

EXECUTION PROTOCOLS FOR THE 5 KEYS:
1. "purpose" (दस्तावेज़ का उद्देश्य): Explain the exact core reason, objective, or target governance agenda behind this specific document.
2. "dates" (महत्वपूर्ण तिथियां): Extract all mandatory deadlines, timeline windows, target implementation intervals, or submission dates mentioned.
3. "requiredDocs" (आवश्यक दस्तावेज): Meticulously extract all paperwork certificates, identity proofs, cards, or specific forms requested from citizens.
4. "actions" (आवश्यक कार्रवाई): Break down clear, sequential actionable operational checklist items that the user/citizen must execute.
5. "summary" (सरल सारांश): Provide a clean 1-2 sentence simplified layman translation explanation wrap-up.

STRICT TRANSLATION RULES:
- If target language selection state is "hindi", you MUST write the plain text string values for all 5 schema keys completely in simple, everyday conversational HINDI (Devnagari Script). Avoid dense Sanskrit or overly complex legal terms.
- If target language is "english", write everything in clear standard English text.
- KEY CONSTRAINT: Keep the 5 JSON schema keys ("purpose", "dates", "requiredDocs", "actions", "summary") exactly in English lowercase as specified above. Do not translate the keys.
- FORMAT LOCK: Output ONLY the valid raw JSON container. No markdown tags (\`\`\`json), no nested array loops, no text prefixes, and no terminal explanations. Remove any double quotes inside text values.`;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Target Output Interface Script: ${targetLang}\n\nDocument Stream Segment to Parse dynamically:\n${documentText}` }
      ],
      temperature: 0.1,
    });

    let outputText = completion.choices[0].message.content?.trim() || "{}";
    
    // Step 1: Strip unwanted markdown boundaries or trailing markers
    if (outputText.includes("{")) {
      outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
    }
    
    // Step 2: Clear carriage breaks, trailing tokens, and escape indicators before JSON verification
    outputText = outputText.replace(/\n/g, " ").replace(/\r/g, " ").trim();

    try {
      // Primary parsing verification pass
      const parsed = JSON.parse(outputText);
      
      Object.keys(parsed).forEach((key) => {
        if (typeof parsed[key] === "string") {
          parsed[key] = parsed[key].replace(/[*#\-–•]/g, "").trim();
        }
      });

      return NextResponse.json(parsed);

    } catch (parseError) {
      console.warn("⚠️ Complex matrix format detected, activating semantic string recovery stream:", parseError);
      
      // Step 3: Advanced Semantic Lookup Extraction mapping to safeguard data strings if tokens leak
      const parseValueForKey = (key: string, rawText: string): string => {
        // Safe regex matching sequence targeting character intervals inside complex layout maps
        const targetRegex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, "i");
        const matchResult = rawText.match(targetRegex);
        if (matchResult && matchResult[1]) {
          return matchResult[1].replace(/[*#\-–•]/g, "").trim();
        }
        
        // Multi-stage secondary string slice selector loop fallback
        const keyToken = `"${key}"`;
        if (rawText.includes(keyToken)) {
          const splitStart = rawText.split(keyToken)[1];
          if (splitStart && splitStart.includes('"')) {
            const innerTokens = splitStart.split('"');
            // If text stream separates correctly, return the targeted inner data block
            if (innerTokens[1] && innerTokens[1].trim().length > 3) {
              return innerTokens[1].replace(/[*#\-–•]/g, "").trim();
            }
          }
        }
        return "";
      };

      // Fully customized dynamic tracking matrix fallback
      const crossMappedData = {
        purpose: parseValueForKey("purpose", outputText) || (targetLang === "hindi" ? "विवरण दस्तावेज़ से निकालना संभव नहीं हो सका।" : "Dynamic document description not parsed."),
        dates: parseValueForKey("dates", outputText) || (targetLang === "hindi" ? "कोई निश्चित समय-सीमा उपलब्ध नहीं है।" : "No explicit timeline dates captured."),
        requiredDocs: parseValueForKey("requiredDocs", outputText) || (targetLang === "hindi" ? "विशिष्ट कागजी कार्रवाई का विवरण नहीं मिला।" : "No baseline paperwork items detected."),
        actions: parseValueForKey("actions", outputText) || (targetLang === "hindi" ? "कोई तुरंत कदम उठाने की आवश्यकता नहीं बताई गई है।" : "No structural compliance operations found."),
        summary: parseValueForKey("summary", outputText) || (targetLang === "hindi" ? "संक्षिप्त विश्लेषण तैयार नहीं किया जा सका।" : "Layman translation text extraction incomplete.")
      };

      return NextResponse.json(crossMappedData);
    }
  } catch (error) {
    console.error("❌ Critical execution breakdown on backend layer:", error);
    return NextResponse.json({ error: "Dynamic parser execution engine exception loop hit." }, { status: 500 });
  }
}
