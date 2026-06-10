import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {

  let language = "english";

  try {

    const body = await req.json();

    const issue =
      body.issue;

    const issueType =
      body.issueType;

    language =
      body.language || "english";

    const completion =
      await openai.chat.completions.create({
        model: "sarvam-30b",

        messages: [
          {
            role: "system",
            content: `
Generate exactly 5 follow-up questions.

Language: ${language}

If language is "hindi", return all questions in Hindi.

If language is "english", return all questions in English.

Return ONLY valid JSON.

{
  "questions": [
    "",
    "",
    "",
    "",
    ""
  ]
}
`,
          },

          {
            role: "user",
            content: `
Issue Type: ${issueType}

Issue:
${issue}
`,
          },
        ],
      });

    const content =
      completion.choices[0].message.content || "{}";

    return NextResponse.json(
      JSON.parse(content)
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      questions:
        language === "hindi"
          ? [
              "कौन सा क्षेत्र प्रभावित है?",
              "यह समस्या कब से है?",
              "कितने लोग प्रभावित हैं?",
              "क्या आपके पास कोई प्रमाण है?",
              "क्या आपने पहले शिकायत की है?"
            ]
          : [
              "Which area is affected?",
              "Since when has the issue existed?",
              "How many people are affected?",
              "Do you have supporting evidence?",
              "Have you reported it before?"
            ],
    });

  }

}