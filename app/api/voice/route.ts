import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Yahan apni OpenAI API Key use karo
});

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();
    
    const systemPrompt = `You are Maya, a multilingual Indian government voice assistant. 
    Keep responses extremely brief (1-2 sentences), conversational, and polite. 
    Classify intent as 'schemes', 'complaints', 'documents', or 'none'. 
    If intent is detected, suggest the user to use the screen button to proceed.
    Output ONLY raw JSON format: {"reply": "...", "intent": "..."}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Flash Model (Fast & Smart)
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Query: ${message} | Lang: ${language}` }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(completion.choices[0].message.content!);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: "I'm having trouble connecting.", intent: "none" }, { status: 500 });
  }
}
