import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY || "",
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentText, language } = body;
    const targetLang = (language || "english").toLowerCase();

    // System prompt ko aur precise banaya hai taaki output hamesha valid JSON ho
    const systemPrompt = `You are JanMitra AI, a professional government document analyzer.
    Extract key information into a JSON object.
    IF language is 'hindi', use these keys: "उद्देश्य", "महत्वपूर्ण_तिथियां", "आवश्यक_दस्तावेज", "आवश्यक_कार्रवाई", "संक्षिप्त_सारांश"
    IF language is 'english', use these keys: "purpose", "dates", "requiredDocs", "actions", "summary"
    RETURN ONLY RAW JSON. NO MARKDOWN. NO BACKTICKS.`;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please provide analysis in ${targetLang} language for this document: ${documentText}` }
      ],
      temperature: 0.1,
    });

    let outputText = completion.choices[0].message.content?.trim() || "{}";
    
    // Clean markdown blocks
    outputText = outputText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Extract JSON part if model adds extra text
    if (outputText.includes("{")) {
      outputText = outputText.substring(outputText.indexOf("{"), outputText.lastIndexOf("}") + 1);
    }

    return NextResponse.json(JSON.parse(outputText));
  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
