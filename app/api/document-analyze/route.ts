import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { documentText } = body;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",

      messages: [
        {
          role: "system",
          content:
            "You are JanMitra AI. Analyze government documents and explain them simply.",
        },
        {
          role: "user",
          content: `
Analyze this document and provide:

1. Document Purpose
2. Important Dates
3. Required Documents
4. Required Actions
5. Simple Summary

Document:

${documentText}
          `,
        },
      ],
    });

    return NextResponse.json({
      summary: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: "Analysis failed",
    });
  }
}