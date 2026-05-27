import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { message } = body;

    const completion = await openai.chat.completions.create({

        model: "openai/gpt-3.5-turbo",

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