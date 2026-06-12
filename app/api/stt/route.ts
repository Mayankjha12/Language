import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const formData =
      await req.formData();

    const audio =
      formData.get("audio") as File;

    const language =
      formData.get("language") as string;

    if (!audio) {
      return NextResponse.json(
        {
          error:
            "Audio file missing",
        },
        {
          status: 400,
        }
      );
    }

    const sarvamForm =
      new FormData();

    sarvamForm.append(
      "file",
      audio
    );

    sarvamForm.append(
      "model",
      "saaras:v3"
    );

    sarvamForm.append(
      "mode",
      "transcribe"
    );

    if (language) {

      sarvamForm.append(
        "language_code",
        language
      );
    }

    const response =
      await fetch(
        "https://api.sarvam.ai/speech-to-text",
        {
          method: "POST",

          headers: {
            "api-subscription-key":
              process.env
                .SARVAM_API_KEY!,
          },

          body:
            sarvamForm,
        }
      );

    const data =
      await response.json();

    console.log(
      "SARVAM STT RESPONSE:",
      data
    );

    return NextResponse.json({
      transcript:
        data.transcript || "",

      language:
        data.language_code ||
        language ||
        "hi-IN",
    });

  } catch (error) {

    console.error(
      "STT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "STT failed",
      },
      {
        status: 500,
      }
    );
  }
}