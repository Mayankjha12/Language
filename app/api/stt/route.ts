import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const language = (formData.get("language") as string) || "hi-IN";

    console.log("🎤 STT Pipeline Triggered");
    console.log("📍 Locale from frontend context:", language);

    if (!audio) {
      console.error("❌ Audio chunk payload missing");
      return NextResponse.json(
        { error: "Audio file missing" },
        { status: 400 }
      );
    }

    // Comprehensive Language Mapping for Sarvam Speech-To-Text Engine
    const languageMap: Record<string, string> = {
      "en-US": "en-IN",
      "hi-IN": "hi-IN",
      "bn-IN": "bn-IN",
      "ta-IN": "ta-IN",
      "te-IN": "te-IN",
      "mr-IN": "mr-IN",
      "gu-IN": "gu-IN",
      "pa-IN": "pa-IN",
      "kn-IN": "kn-IN",
      "ml-IN": "ml-IN",
      "or-IN": "od-IN",      // Fixes Odia interface parameter mapping
      "ur-IN": "ur-IN",
      "as-IN": "as-IN",
      "mai-IN": "mai-IN",
      "bho-IN": "hi-IN",     // Fallback Bhojpuri parameters routed through Hindi engine
      "sa-IN": "sa-IN",
      "kok-IN": "kok-IN",
      "ne-IN": "ne-IN",
      "mni-IN": "mni-IN",
      "doi-IN": "doi-IN",
      "sd-IN": "sd-IN",
      "ks-IN": "ks-IN",
    };

    const sarvamLanguageCode = languageMap[language] || "hi-IN";
    console.log("🔄 Executing mapping switch logic:", language, "→", sarvamLanguageCode);

    const sarvamForm = new FormData();
    // Providing explicit filename parameter to guarantee boundary serialization compatibility
    sarvamForm.append("file", audio, "voice.webm");
    sarvamForm.append("model", "saaras:v3");
    sarvamForm.append("mode", "transcribe");
    sarvamForm.append("language_code", sarvamLanguageCode);

    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": process.env.SARVAM_API_KEY!,
      },
      body: sarvamForm,
    });

    const data = await response.json();
    console.log("SARVAM STT RESPONSE OBJECT:", data);

    if (!response.ok || data.error) {
      console.error("❌ Sarvam STT pipeline process broken:", data.error || data);
      return NextResponse.json(
        { error: data.error?.message || "Speech synthesis failed." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      transcript: data.transcript || "",
      language: data.language_code || sarvamLanguageCode,
    });

  } catch (error) {
    console.error("STT RUNTIME EXCEPTION CAUGHT:", error);
    return NextResponse.json(
      { error: "STT internal parsing loop failed." },
      { status: 500 }
    );
  }
}
