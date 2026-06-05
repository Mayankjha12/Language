import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {

    const {
      issue,
      issueType,
      priority,
      answers,
      language,
    } = await req.json();

    const completion =
      await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content: `
You are JanMitra AI, an intelligent citizen grievance assistant.

Your responsibilities:

1. Analyze the citizen's complaint.
2. Identify the MOST APPROPRIATE government department.
3. Generate a detailed formal complaint letter.
4. Provide practical recommendations.

IMPORTANT:

- User may write in Hindi or English.
- ALWAYS generate the final complaint in PROFESSIONAL ENGLISH.
- Generate a complete formal complaint letter of 250–350 words.
- Include:
  - Subject line
  - Respected Sir/Madam
  - Detailed issue description
  - Impact on citizens
  - Duration of issue
  - Previous complaint attempts (if available)
  - Request for immediate action
  - Professional closing

Format:

Subject: ...

Respected Sir/Madam,

...

Sincerely,
Concerned Citizen

DEPARTMENT CLASSIFICATION RULES:

Determine the department primarily from the ISSUE DESCRIPTION and ADDITIONAL INFORMATION.

Treat the selected Issue Type only as a hint.

If the issue description conflicts with the selected issue type, prioritize the issue description.

Examples:

- Water shortage → Water Supply Department
- Road damage / potholes → Public Works Department (PWD)
- Garbage collection → Sanitation Department
- Street lights → Electricity Department
- Consumer fraud → Consumer Affairs Department
- Cyber fraud → Cyber Crime Cell
- Women's safety → Police Department
- Corruption → Vigilance Department
- Property tax issues → Municipal Corporation
- Sewage overflow → Sewerage Department

DO NOT always return Water Supply Department.

RECOMMENDATIONS:

Provide exactly 4 practical recommendations specific to the issue.

Return ONLY valid JSON.

{
  "department": "",
  "complaint": "",
  "recommendations": [
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
User Selected Issue Type:
${issueType}

Priority:
${priority}

Input Language:
${language}

Actual Issue Description:
${issue}

Additional Answers:
${JSON.stringify(answers, null, 2)}
`,
          },
        ],

        temperature: 0.7,
      });

    const content =
      completion.choices[0].message.content || "{}";

    return NextResponse.json(
      JSON.parse(content)
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        department:
          "Public Grievance Department",

        complaint: `Subject: Complaint Regarding Public Service Issue

Respected Sir/Madam,

I would like to bring to your attention a matter of public concern that requires immediate intervention. The issue described has caused inconvenience to citizens and is affecting daily life in the locality.

Despite continued difficulties faced by residents, the matter remains unresolved. Such issues can significantly impact public welfare, safety, and access to essential services. Immediate investigation and corrective measures are therefore necessary.

I respectfully request the concerned department to review this complaint, conduct an inspection if required, and take appropriate action at the earliest possible opportunity. Timely resolution of the issue will greatly benefit the affected citizens and help restore normal conditions.

I would appreciate receiving an update regarding the actions taken in response to this complaint.

Thank you for your attention and cooperation.

Sincerely,
Concerned Citizen`,

        recommendations: [
          "Add exact location details",
          "Keep supporting evidence ready",
          "Mention issue duration clearly",
          "Save the complaint reference number",
        ],
      },
      {
        status: 500,
      }
    );

  }
}