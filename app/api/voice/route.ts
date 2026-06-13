import OpenAI from "openai";
import { NextResponse } from "next/server";

// Client ko function ke andar initialize karo ya ensure karo keys global hain
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, language } = body;

    if (!message) {
        return NextResponse.json({ reply: "I didn't hear anything.", intent: "none" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are Maya, an Indian government voice assistant. Reply in the same language as the user. Keep it extremely brief (max 2 sentences). Output ONLY valid JSON: {"reply": "text", "intent": "schemes" | "complaints" | "documents" | "none"}` 
        },
        { role: "user", content: `Query: ${message} | Language: ${language}` }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ 
        reply: "Sorry, I am having trouble connecting right now.", 
        intent: "none" 
    }, { status: 500 });
  }
}
