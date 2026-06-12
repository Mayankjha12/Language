import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  let targetLang = "english";

  try {
    const { issue, issueType, priority, answers, language } = await req.json();
    targetLang = language || "english";

    // Strict System Prompt Engine targeting Sarvam 30B JSON Predictability
    const systemPrompt = `You are JanMitra AI, an expert citizen grievance processing automation system. Your absolute directive is to process a user's local civic issue report and map it into a standardized JSON container template.

STRICT EXECUTION PROTOCOLS:
1. "department": Classify and assign the most appropriate local or state government department name. If target language choice is "hindi", write the department name cleanly in pure HINDI (Devnagari Script) text.
2. "complaint": Draft a formal, highly professional legal-grade Complaint Letter of approximately 250-350 words matching constitutional submission standards. CRITICAL: This letter MUST ALWAYS be written in professional ENGLISH language, regardless of user language choice.
3. "recommendations": Provide exactly 4 sequential, clean, actionable next steps or instructions for the citizen. If target language choice is "hindi", write these 4 steps purely in shuddh HINDI (Devnagari Script).

STRICT FORMATTING DEFENSE:
- DO NOT return any markdown characters. Absolute zero asterisks (*), hashes (#), or bullet list lines (-).
- Write fluid, clean sentences. Use raw newline characters for formal letter line breaks inside the string.
- Your entire output response must be a single, valid, raw JSON object. Do not enclose it in any markdown code blocks.

EXPECTED VALID JSON OUTPUT STRUCTURAL MATRIX:
{
  "department": "Department Name String",
  "complaint": "Subject: ...\\n\\nRespected Sir/Madam,\\n\\n[Full Formal Letter Draft Text]\\n\\nSincerely,\\nConcerned Citizen",
  "recommendations": [
    "Clean actionable recommendation line one",
    "Clean actionable recommendation line two",
    "Clean actionable recommendation line three",
    "Clean actionable recommendation line four"
  ]
}`;

    console.log(`📝 Dispatching grievance router engine under target interface layer: ${targetLang}`);

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Selected Interface Language Choice: ${targetLang}
Grievance Category Context: ${issueType}
Priority Framework Level: ${priority}
Primary Citizen Statement: ${issue}
Follow-up Validation Q&A Pair Payload: ${JSON.stringify(answers)}`
        }
      ],
      temperature: 0.1
    });

    let content = completion.choices[0].message.content || "{}";
    
    // Clear markdown wrapping artifacts cleanly without breaking strings
    content = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(content);
      
      if (parsed.department) {
        parsed.department = parsed.department.replace(/[*#\-–•]/g, "").trim();
      }
      if (parsed.complaint) {
        parsed.complaint = parsed.complaint.replace(/[*#\-–•]/g, "").trim();
      }
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        parsed.recommendations = parsed.recommendations.map((r: string) => 
          r.replace(/[*#\-–•]/g, "").trim()
        );
      }
      
      return NextResponse.json(parsed);

    } catch (parseError) {
      console.warn("⚠️ JSON Extraction fallback invoked due to model syntax formatting drift:", parseError);
      
      // Fixed: Declared properly within the catch scope where the return statement is located
      let fallbackDept = issueType ? `${issueType} Department` : "Public Grievance Division";
      
      if (targetLang === "hindi") {
        if (issueType === "Water Supply") fallbackDept = "जल आपूर्ति एवं स्वच्छता विभाग";
        if (issueType === "Electricity") fallbackDept = "विद्युत शिकायत प्रभाग (Electricity Board)";
        if (issueType === "Road Damage") fallbackDept = "लोक निर्माण विभाग (PWD)";
        if (issueType === "Garbage") fallbackDept = "नगर निगम स्वच्छता नियंत्रण बोर्ड";
      }

      const fallbackComplaint = `Subject: Formal Grievance Letter Regarding ${issueType || "Public Infrastructure Degradation"}\n\nRespected Sir/Madam,\n\nI am writing to formally lodge a complaint regarding the critical public utility breakdown affecting our locality. Specifically, the issue entails: ${issue || "unresolved civic utility infrastructure issues"}.\n\nThis ongoing negligence has caused severe distress to the residents. We urge your esteemed department to evaluate this application and restore normal civil operability immediately.\n\nThank you for your prompt consideration.\n\nSincerely,\nConcerned Citizen`;

      const fallbackRecommendations = targetLang === "hindi" ? [
        "शिकायत की डिजिटल संदर्भ संख्या (Reference Token) संभाल कर रखें।",
        "क्षेत्रीय स्थल के सहायक साक्ष्य या तस्वीरें प्रमाण हेतु एकत्र करें।",
        "पीजी पोर्टल (PG Portal) पर लॉगिन करके शिकायत की वर्तमान स्थिति ट्रैक करें।",
        "यदि ७ दिनों के भीतर समाधान न हो, तो संबंधित विभाग के नोडल अधिकारी से संपर्क करें।"
      ] : [
        "Save the generated application reference token securely.",
        "Keep local supporting visual evidence or pictures ready for verifications.",
        "Track the structural grievance lifecycle status live using PG Portal dashboards.",
        "Escalate the matter to the regional nodal officer if resolution exceeds 7 working days."
      ];

      return NextResponse.json({
        department: fallbackDept,
        complaint: fallbackComplaint,
        recommendations: fallbackRecommendations
      });
    }
  } catch (error) {
    console.error("❌ Complaints Core Loop Fatal Exception Trace:", error);
    return NextResponse.json({ error: "Processing pipeline runtime failure" }, { status: 500 });
  }
}