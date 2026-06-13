import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body; // Seamless interface: no manual language parameter forced from frontend

    console.log(`💬 JanMitra Processing Auto-Language Query: "${message}"`);

    if (!message || message.trim() === "") {
      return NextResponse.json({ reply: "कृपया अपना प्रश्न टाइप करें। / Please type your query." });
    }

    // 🌟 MULTI-LINGUAL AUTO-DETECTION ENGINE DIRECTIVE
    const systemPrompt = `You are JanMitra AI, an expert citizen services chatbot. Your absolute directive is to dynamically analyze the language of the user's input.
- If the user types in Hindi (Devnagari) or Hinglish (Hindi written in Roman script like 'yojana kya hai'), you MUST respond entirely in clean, simple, everyday conversational Hindi (Devnagari Script).
- If the user types in English, respond entirely in clear, professional English.
- For any other major Indian regional language input, detect it and respond in that specific language using its native script.

Keep your answer highly conversational, well-structured with clean line breaks, short paragraphs, and actionable bullet points. Avoid raw markdown code blocks like \`\`\`json.`;

    let replyText = "";
    try {
      const completion = await openai.chat.completions.create(
        {
          model: "sarvam-30b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.2,
        },
        { timeout: 8500 } // Guardrail to prevent infinite UI loading wheels
      );

      replyText = completion.choices[0].message.content?.trim() || "";
    } catch (apiError) {
      console.warn("⚠️ Chat API congestion detected. Launching active fallback overlay routing.", apiError);
    }

    // ─── ⚡ CHAT THREAD FAIL-SAFE RE-ENFORCEMENT MATRIX ────────────────────────
    if (!replyText || replyText.length < 3) {
      console.log("⚡ Triggering clean contextual backup response block.");
      
      const lowerMessage = message.toLowerCase();
      // Check if query matrix patterns lean towards localized terms
      const isHindiQuery = /[\u0900-\u097F]/.test(message) || lowerMessage.includes("yojana") || lowerMessage.includes("shikayat") || lowerMessage.includes("paani");
      
      if (isHindiQuery) {
        if (lowerMessage.includes("scheme") || lowerMessage.includes("योजना")) {
          replyText = `नमस्ते! मैं आपका जनमित्र एआई सहायक हूँ। आपके प्रश्न के अनुसार त्वरित निर्देश:
- आप हमारे 'Discover Eligible Schemes' टैब में जाकर अपनी प्रोफाइल (उम्र, आय, श्रेणी) भरकर सही सरकारी योजनाएं ढूंढ सकते हैं।
- आयुष्मान भारत और पीएम आवास योजना जैसी मुख्य कल्याणकारी नीतियों की विस्तृत जानकारी आपको वहां मिल जाएगी।
कृपया अपना विशिष्ट प्रश्न जारी रखें, मैं पूरी तरह तैयार हूँ!`;
        } else {
          replyText = `नमस्ते! मैं आपका जनमित्र एआई सहायक हूँ। इस समय सर्वर रिस्पॉन्स में थोड़े विलंब के कारण मैं पूर्ण विश्लेषण लोड नहीं कर पाया।
- यदि आपका प्रश्न किसी प्रशासनिक शिकायत से जुड़ा है, तो कृपया 'Draft & File Complaints' विकल्प का उपयोग करें।
- अन्य नागरिक सेवाओं (जैसे राशन कार्ड, प्रमाणपत्र पंजीकरण) के लिए कृपया अपना विवरण नीचे पुनः टाइप करें।`;
        }
      } else {
        if (lowerMessage.includes("scheme") || lowerMessage.includes("welfare")) {
          replyText = `Hello! I am JanMitra AI, your dedicated citizen services assistant. Regarding welfare configurations:
- Please navigate directly to the 'Discover Eligible Schemes' tab on the dashboard to filter central and state policies matching your profile.
- You can find step-by-step criteria for healthcare, housing, and scholarship programs there.
Please drop your exact question again, and I will assist you immediately!`;
        } else {
          replyText = `Hello! I am JanMitra AI, your governance companion. The system is experiencing a brief connection delay.
- For legal grievance submissions, please access the 'Draft & File Complaints' console.
- For document summary extraction, check out the 'Document Explainer' panel.
Please re-state your query, and I'll outline the operational steps for you!`;
        }
      }
    }

    // Strip out erratic syntax markers before dispatching data payload to the client thread
    replyText = replyText.replace(/[*#`"]/g, "").trim();

    return NextResponse.json({ reply: replyText });

  } catch (error) {
    console.error("❌ Critical breakdown inside chat route controller:", error);
    return NextResponse.json({ reply: "Connection timeout. Please try processing your message again." }, { status: 500 });
  }
}
