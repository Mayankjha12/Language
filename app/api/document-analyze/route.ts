import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentText, language } = body;
    const targetLang = (language || "english").toLowerCase();

    console.log(`🤖 Triggering Master XML-Regex Core Engine for stack: ${targetLang}`);

    const systemPrompt = `You are JanMitra AI, an expert constitutional and legal document analyzer. Your absolute directive is to extract metadata from the text data dynamically and wrap your structural output tightly inside the exact XML tags specified below.

Do not output any JSON syntax, do not include markdown code ticks (\`\`\`), and do not use lists, asterisks (*), or hashes (#). Use pure regular paragraphs inside the tags.

FOLLOW THIS XML LAYOUT STRUCTURE EXACTLY:
<purpose>
Analyze the document text and explain the exact core reason, objective, or agenda behind this specific document.
(यदि भाषा हिंदी है: इस दस्तावेज़ को जारी करने का मुख्य उद्देश्य या सरकारी एजेंडा क्या है, उसे सरल हिंदी शब्दों में समझाएं।)
</purpose>

<dates>
Meticulously extract all mandatory deadlines, timeline frames, implementation targets, last dates, or release dates mentioned in the text. If no dates are found, write that explicitly.
(यदि भाषा हिंदी है: दस्तावेज़ में दी गई सभी महत्वपूर्ण तारीखें, अंतिम तिथियां (Last Dates), आवेदन की समय-सीमा या नियम लागू होने की तारीखों को ढूंढकर निकालें। यदि कोई तारीख न मिले, तो स्पष्ट लिखें।)
</dates>

<requiredDocs>
Meticulously list any certificates, identity proofs, forms, tokens, or physical proofs explicitly mentioned that citizens need to submit for compliance or application. If none, write that explicitly.
(यदि भाषा हिंदी है: नागरिकों को आवेदन या अनुपालन के लिए जो भी प्रमाण पत्र, पहचान पत्र, फॉर्म, या भौतिक सबूत जमा करने की आवश्यकता है, उनकी पूरी सूची बनाएं। यदि कोई दस्तावेज़ आवश्यक न हो, तो साफ लिखें।)
</requiredDocs>

<actions>
Break down clear, sequential step-by-step actionable items or compliance checklist tasks that the reader/user must perform based on the document.
(यदि भाषा हिंदी है: उपयोगकर्ता या आम नागरिक को इस आदेश या दस्तावेज़ के अनुसार आगे क्या कदम उठाने हैं, उन्हें क्रमवार step-by-step आसान निर्देशों में लिखें।)
</actions>

<summary>
Provide a clean 1-2 sentence simplified layman translation explanation wrap-up of the entire text data.
(यदि भाषा हिंदी है: पूरे दस्तावेज़ का निचोड़ केवल 1-2 पंक्तियों में एक आम आदमी की समझ के अनुसार बेहद आसान भाषा में लिखें।)
</summary>

STRICT TRANSLATION LAWS:
- If target language selection parameter is "hindi", you MUST write the explanations/contents inside all 5 XML tags natively in simple, conversational everyday HINDI (Devnagari Script). Avoid dense Sanskrit or overly complex legal terms.
- If target language is "english", write the contents in clear standard English sentences.
- CRITICAL CONSTRAINT: The XML tag markers (<purpose>, <dates>, <requiredDocs>, <actions>, <summary>) must ALWAYS remain exactly in English lowercase as shown. Never translate or modify the tag names.`;

    const completion = await openai.chat.completions.create({
      model: "sarvam-30b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Target Language Code: ${targetLang}\n\nDocument text content payload:\n${documentText}` }
      ],
      temperature: 0.1,
    });

    const responseText = completion.choices[0].message.content || "";
    console.log("📥 Raw XML Stream segments fetched from model core array.");

    // Master Regex Extraction Engine: Grabs string intervals inside tags safely even if format shifts
    const extractXmlBlock = (tagName: string, sourceText: string): string => {
      const regex = new RegExp(`<${tagName}>\\s*([\\s\\S]*?)\\s*</${tagName}>`, "i");
      const match = sourceText.match(regex);
      if (match && match[1]) {
        return match[1].replace(/[*#\-–•`"]/g, "").trim();
      }
      return "";
    };

    const isHindi = targetLang === "hindi";

    // Strictly mapping to the exact standard keys your frontend page schema expects
    const finalPayloadContainer = {
      purpose: extractXmlBlock("purpose", responseText) || (isHindi ? "विवरण दस्तावेज़ में निर्दिष्ट नहीं है।" : "Objective description not specified in document."),
      dates: extractXmlBlock("dates", responseText) || (isHindi ? "कोई महत्वपूर्ण तिथियां या समय-सीमा नहीं मिली।" : "No explicit deadlines or timelines found."),
      requiredDocs: extractXmlBlock("requiredDocs", responseText) || (isHindi ? "कोई आवश्यक दस्तावेज़ उल्लेखित नहीं हैं।" : "No required documents specified."),
      actions: extractXmlBlock("actions", responseText) || (isHindi ? "कोई विशिष्ट कार्रवाई आवश्यक नहीं है।" : "No immediate actionable compliance items found."),
      summary: extractXmlBlock("summary", responseText) || (isHindi ? "संक्षिप्त सारांश निकालने में असमर्थ।" : "Layman summary extraction unavailable.")
    };

    return NextResponse.json(finalPayloadContainer);

  } catch (error) {
    console.error("❌ Document analyze loop engine critical breakdown:", error);
    return NextResponse.json({ error: "Bilingual matrix parsing exception route hit." }, { status: 500 });
  }
}
