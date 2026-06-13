import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  // Vercel dashboard mein "OPENAI_API_KEY" variable set karna, key wahan se uth jayegi.
  apiKey: process.env.OPENAI_API_KEY || "", 
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        { 
          role: "system", 
          content: `You are Maya, an Indian government assistant. Keep responses brief (max 2 sentences). 
           Classify intent as 'schemes', 'complaints', 'documents', or 'none'. 
           Output ONLY raw JSON format: {"reply": "...", "intent": "..."}` 
        },
        { role: "user", content: `Query: ${message} | Lang: ${language}` }
      ],
      extra_headers: {
        "HTTP-Referer": "https://janmitra-ai.vercel.app", 
        "X-Title": "JanMitra AI",
      }
    });

    const content = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(content || '{"reply": "...", "intent": "none"}'));

  } catch (error) {
    console.error("OpenRouter Error:", error);
    return NextResponse.json({ reply: "Service error.", intent: "none" }, { status: 500 });
  }
}
