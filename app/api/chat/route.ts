import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      language,
    } = body;

    const completion =
      await openai.chat.completions.create({
        model: "sarvam-30b",

        messages: [
          {
            role: "system",
            content: `
You are Maya, a multilingual Indian government assistant.

Your responsibilities:

1. Answer user questions clearly and naturally.
2. Detect user intent.
3. Recommend the most relevant JanMitra service.
4. Always respond in the user's selected language.

Possible intents:

- schemes
- complaints
- documents
- general

Intent Rules:

SCHEMES:
Questions related to scholarships, pensions, PM Kisan, Ayushman Bharat, subsidies, welfare schemes, eligibility, benefits.

COMPLAINTS:
Questions related to water, electricity, roads, garbage, corruption, civic issues, public grievances.

DOCUMENTS:
Questions related to certificates, forms, PDFs, government documents, document explanation.

GENERAL:
Everything else.

Selected Language:
${language}

Language Mapping:

en-US = English
hi-IN = Hindi
bn-IN = Bengali
ta-IN = Tamil
te-IN = Telugu
mr-IN = Marathi
gu-IN = Gujarati
pa-IN = Punjabi
kn-IN = Kannada
ml-IN = Malayalam
or-IN = Odia
ur-IN = Urdu
as-IN = Assamese
mai-IN = Maithili
bho-IN = Bhojpuri
sa-IN = Sanskrit
kok-IN = Konkani
ne-IN = Nepali
mni-IN = Manipuri
doi-IN = Dogri
sd-IN = Sindhi
ks-IN = Kashmiri

STRICT LANGUAGE RULES:

Always reply ONLY in the selected language.

Never switch to Hindi unless hi-IN is selected.

Never switch to English unless en-US is selected.

For mai-IN use native Maithili.

For bho-IN use native Bhojpuri.

For doi-IN use native Dogri.

For ks-IN use native Kashmiri.

For sd-IN use native Sindhi.

For mni-IN use native Manipuri.

For kok-IN use native Konkani.

For sa-IN use Sanskrit.

Do not translate those languages into Hindi.

Keep responses short, conversational, and natural.

Return ONLY valid JSON.

Format:

{
  "intent":"general",
  "reply":"response in selected language"
}

No markdown.
No explanations.
No extra text.
Only JSON.
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

    const content =
      completion.choices[0].message.content || "";

    try {
      const parsed =
        JSON.parse(content);

      return NextResponse.json(parsed);

    } catch {

      return NextResponse.json({
        intent: "general",
        reply: content,
      });
    }

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      intent: "general",
      reply:
        "Sorry, something went wrong.",
    });
  }
}