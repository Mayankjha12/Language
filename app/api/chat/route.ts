import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",

      messages: [
        {
          role: "system",
          content:
            "You are JanMitra AI, an Indian multilingual government assistant. Reply in simple and helpful language.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}