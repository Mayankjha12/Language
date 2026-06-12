import OpenAI from "openai";
import { NextResponse } from "next/server";
import { allSchemes } from "@/data/allSchemes";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  let targetLang = "english";

  try {
    const body = await req.json();
    const { age, income, occupation, gender, category, state, language } = body;

    targetLang = language || "english";

    // 1. Core Profile Filter Matching Logic
    const matchedSchemes = allSchemes.filter((scheme) => {
      if (income > scheme.maxIncome) return false;
      if (age < scheme.minAge) return false;
      if (!scheme.occupation.includes("all") && !scheme.occupation.includes(occupation)) return false;
      if (!scheme.gender.includes("all") && !scheme.gender.includes(gender)) return false;
      return true;
    });

    // Take only top 3 matched records to prevent system content payload explosion or truncations
    const topMatchedSchemes = matchedSchemes.slice(0, 3);

    // 2. Strict Dynamic Localized Multi-lingual Structural Prompter
    const multiLingualPrompt = `You are JanMitra AI, an intelligent government welfare expert assistant.
Your absolute responsibility is to analyze user profile metadata and build a tailored evaluation response layout block.

STRICT PROTOCOLS:
1. Recommend exactly 3 highly relevant schemes from the matched array context data provided.
2. If target language choice is "hindi", you MUST write the entire text response natively and purely in shuddh HINDI (Devnagari Script) text only. Absolute zero English or Roman alphabets allowed inside sentences.
3. For each recommended scheme, ensure you extract and state clearly:
   - Scheme Name
   - Clear explanation of eligibility match context.
   - Key core benefits provided.
   - Exact physical or digital documents required (क्या क्या चाहिए).
   - Practical step-by-step next direct actions to register (यहाँ से रजिस्टर करें) including official link hints like www.myscheme.gov.in or actual applyLink strings.

STRICT FORMATTING DEFENSE LAYER:
- DO NOT use any markdown characters. Absolute zero asterisks (*), hashes (#), or bullet points (-).
- Structure each scheme layout with plain numeric headings (1, 2, 3) and standard clean newline character line spacing only.
- Output your explanation directly without any backticks, tags, or system code wrappers.`;

    console.log(`🤖 Dispatched Sarvam AI schemes orchestration under context framework: ${targetLang}`);

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        {
          role: "system",
          content: multiLingualPrompt
        },
        {
          role: "user",
          content: `Target Language Choice Selection: ${targetLang}
User Metadata Context: Age ${age}, Income ₹${income}, Occupation ${occupation}, Category ${category}, State Location ${state}

Top Matched Schemes Data Scope to process:
${JSON.stringify(topMatchedSchemes, null, 2)}`
        }
      ],
      temperature: 0.1
    });

    let explanationText = completion.choices[0].message.content || "";
    
    // 3. Complete Structural Token Scrubbing (Red-line Safe & Build-Friendly)
    const singleBacktick = String.fromCharCode(96);
    const tripleBacktick = singleBacktick + singleBacktick + singleBacktick;
    
    explanationText = explanationText
      .split(tripleBacktick).join("")
      .split("json").join("")
      .replace(/[*#\-–•]/g, "")
      .trim();

    return NextResponse.json({
      success: true,
      schemes: topMatchedSchemes, // Dynamically hands over the top 3 localized objects cleanly
      aiExplanation: explanationText
    });

  } catch (error) {
    console.error("❌ Schemes optimization error trace caught:", error);
    return NextResponse.json(
      { 
        success: false, 
        schemes: [], 
        aiExplanation: targetLang === "hindi" 
          ? "क्षमा करें, वर्तमान में योजना अनुशंसा उत्पन्न करने में समस्या आ रही है। कृपया पुनः प्रयास करें।" 
          : "Unable to generate personalized recommendations at the moment. Please try again." 
      }, 
      { status: 500 }
    );
  }
}