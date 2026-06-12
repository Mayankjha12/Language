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
    const { issue, issueType } = body;
    language = body.language || "english";

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        {
          role: "system",
          content: `Generate exactly 5 highly analytical conversational follow-up questions to gather deep context about a citizen's civic issue.

STRICT SCRIPT LOCKS:
- If language parameter is "hindi", you MUST return all 5 questions in pure Hindi (Devnagari script).
- If language parameter is "english", return all 5 questions in professional English text.
- Do not use any serial numbering digits (1., 2.), bullet signs, or asterisks (*) inside the strings.
- Output must match this exact JSON scheme format:

{
  "questions": [
    "Question sentence string entry",
    "Question sentence string entry",
    "Question sentence string entry",
    "Question sentence string entry",
    "Question sentence string entry"
  ]
}`
        },
        {
          role: "user",
          content: `Target Language Layout Mode: ${language}\nIssue Category Portal: ${issueType}\nInitial Issue Text: ${issue}`
        }
      ],
      temperature: 0.3
    });

    let content = completion.choices[0].message.content || "{}";
    content = content.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(content);
      if (parsed.questions) {
        parsed.questions = parsed.questions.map((q: string) => q.replace(/[*#\-]/g, "").trim());
      }
      return NextResponse.json(parsed);
    } catch {
      throw new Error("JSON Token extraction fallback mapping executed.");
    }

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      questions: language === "hindi" ? [
        "प्रभावित विशिष्ट क्षेत्र या कॉलोनी का नाम क्या है?",
        "यह समस्या कितने दिनों या हफ्तों से बनी हुई है?",
        "इस समस्या से अनुमानित रूप से कितने नागरिक प्रभावित हैं?",
        "क्या आपके पास स्थिति को साबित करने के लिए तस्वीरें या सबूत हैं?",
        "क्या इस संबंध में पहले भी कोई शिकायत दर्ज कराई गई है?"
      ] : [
        "What is the exact name of the affected locality or area?",
        "For how many days or weeks has this issue been ongoing?",
        "Approximately how many residents are being inconvenienced by this?",
        "Do you have photographs or supporting evidence of the situation?",
        "Has any prior complaint been submitted regarding this matter?"
      ]
    });
  }
}