import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, languageCode } = await req.json();

    console.log("🔊 TTS API Route Triggered");
    console.log("📍 Input text length:", text?.length, "| Frontend locale:", languageCode);

    if (!text) {
      return NextResponse.json({ error: "Text field is required for generation" }, { status: 400 });
    }

    // CRITICAL: Mapping JanMitra frontend locales to strict Sarvam AI TTS language codes
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
      "or-IN": "od-IN",      // Fixes Odia interface parameter mapping (or-IN -> od-IN)
      "ur-IN": "ur-IN",
      "as-IN": "as-IN",
      "mai-IN": "mai-IN",
      "bho-IN": "hi-IN",     // Fallback: Routes Bhojpuri cleanly to high-fidelity Hindi engine
      "sa-IN": "sa-IN",
      "kok-IN": "kok-IN",
      "ne-IN": "ne-IN",
      "mni-IN": "mni-IN",
      "doi-IN": "doi-IN",
      "sd-IN": "sd-IN",
      "ks-IN": "ks-IN",
    };

    const targetSarvamLanguage = languageMap[languageCode] || "hi-IN";
    console.log("🔄 Executing mapping switch logic:", languageCode, "→", targetSarvamLanguage);

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY!,
      },
      body: JSON.stringify({
        text: text,
        target_language_code: targetSarvamLanguage,
        speaker: "Shubh",
        model: "bulbul:v3",
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("❌ Sarvam TTS Core Error:", data.error || data);
      return NextResponse.json(
        { error: data.error?.message || "Text-to-speech generation failed over Sarvam API" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ TTS CRITICAL ROUTE EXCEPTION:", error);
    return NextResponse.json(
      { error: "Internal TTS request engine failed" },
      { status: 500 }
    );
  }
}
