import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, languageCode } = await req.json();

    const response = await fetch(
      "https://api.sarvam.ai/text-to-speech",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key":
            process.env.SARVAM_API_KEY!,
        },
        body: JSON.stringify({
          text,
          target_language_code: languageCode,
          speaker: "Shubh",
          model: "bulbul:v3",
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "TTS failed",
      },
      { status: 500 }
    );
  }
}