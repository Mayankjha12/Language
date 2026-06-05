import OpenAI from "openai";
import { NextResponse } from "next/server";
import { allSchemes } from "@/data/allSchemes";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      age,
      income,
      occupation,
      gender,
      category,
      state,
    } = body;

    const matchedSchemes = allSchemes.filter((scheme) => {

      if (income > scheme.maxIncome) {
        return false;
      }

      if (age < scheme.minAge) {
        return false;
      }

      if (
        !scheme.occupation.includes("all") &&
        !scheme.occupation.includes(occupation)
      ) {
        return false;
      }

      if (
        !scheme.gender.includes("all") &&
        !scheme.gender.includes(gender)
      ) {
        return false;
      }

      return true;
    });

    const completion =
      await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content: `
You are JanMitra AI.

Explain scheme recommendations in simple language.

Your response should contain:
1. Why these schemes match
2. Key benefits
3. Important eligibility notes
4. Next steps for applying

Keep the explanation concise and citizen-friendly.
`,
          },

          {
            role: "user",
            content: `
User Profile:

Age: ${age}
Income: ${income}
Occupation: ${occupation}
Gender: ${gender}
Category: ${category}
State: ${state}

Matched Schemes:

${JSON.stringify(matchedSchemes)}
`,
          },
        ],
      });

    return NextResponse.json({
      success: true,
      schemes: matchedSchemes,
      aiExplanation:
        completion.choices[0].message.content || "",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        schemes: [],
        aiExplanation:
          "Unable to generate recommendations at the moment.",
      },
      {
        status: 500,
      }
    );
  }
}