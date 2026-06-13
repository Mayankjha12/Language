import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, language } = body;
    const clientLang = (language || "english").toLowerCase();
    const isHindi = clientLang === "hindi";

    console.log(`💬 JanMitra Chat Engine active. Language Mode: ${clientLang}`);

    if (!message || message.trim() === "") {
      return NextResponse.json({ 
        reply: isHindi ? "कृपया अपना प्रश्न टाइप करें।" : "Please type your query." 
      });
    }

    // High-Fidelity System Directive for the Chat Assistant
    const systemPrompt = `You are JanMitra AI, an empathetic, highly efficient, and supportive citizen services AI assistant. 
Your purpose is to guide Indian citizens regarding government schemes, civic grievances, documentation processes, and public welfare utilities.

STRICT LAWS:
1. Respond strictly in the requested target language mode. If the mode is Hindi, use clear, easy-to-understand conversational Hindi (Devnagari Script). If English, use professional English.
2. Keep your answer concise, structural, actionable, and formatted nicely with clean line breaks. Avoid raw markdown code blocks.`;

    let replyText = "";
    try {
      const completion = await openai.chat.completions.create(
        {
          model: "sarvam-30b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `User query: ${message}\nRespond in language: ${clientLang}` }
          ],
          temperature: 0.3,
        },
        { timeout: 8500 } // Dynamic timeout to prevent UI infinite loading wheels
      );

      replyText = completion.choices[0].message.content?.trim() || "";
    } catch (apiError) {
      console.warn("⚠️ Chat API bottleneck detected. Initiating immediate localized smart fallback handler.", apiError);
    }

    // ─── ⚡ CHAT FALLBACK MATRIX: GUARANTEES RESPONSE DELIVERY NO MATTER WHAT ───
    if (!replyText || replyText.length < 3) {
      console.log("⚡ Injecting clean adaptive assistant text to prevent empty UI blocks.");
      
      const lowerMessage = message.toLowerCase();

      if (isHindi) {
        // Smart keyword checking to provide context-aware text even during fallbacks!
        if (lowerMessage.includes("scheme") || lowerMessage.includes("योजना") || lowerMessage.includes("pension")) {
          replyText = `नमस्ते! मैं जनमित्र एआई हूँ। आपके प्रश्न के अनुसार योजनाओं की जानकारी निम्नलिखित है:
1. आप हमारे 'Discover Eligible Schemes' टैब में जाकर अपनी उम्र और आय के अनुसार सही सरकारी योजनाएं ढूंढ सकते हैं।
2. मुख्य कल्याणकारी योजनाएं जैसे आयुष्मान भारत योजना (मुफ्त स्वास्थ्य देखभाल) और पीएम आवास योजना के लिए आप सीधे आधिकारिक पोर्टल या नजदीकी जन सेवा केंद्र (CSC) पर जा सकते हैं।
क्या आप किसी विशिष्ट योजना के पात्रता नियमों के बारे में जानना चाहते हैं? मुझे विस्तार से बताएं।`;
        } else if (lowerMessage.includes("complaint") || lowerMessage.includes("शिकायत") || lowerMessage.includes("पानी") || lowerMessage.includes("कचरा")) {
          replyText = `नमस्ते! नागरिक सेवा सहायक पोर्टल पर आपका स्वागत है। आपकी शिकायत के संदर्भ में त्वरित निर्देश:
1. आप हमारे 'Draft & File Complaints' टैब का उपयोग करके सीधे संबंधित सरकारी विभाग के लिए एक औपचारिक कानूनी पत्र (Legal Draft) तैयार कर सकते हैं।
2. इस पत्र को डाउनलोड या कॉपी करके आप भारत सरकार के केंद्रीय पीजी पोर्टल (pgportal.gov.in) पर ऑनलाइन दर्ज करा सकते हैं।
कृपया अपनी समस्या का स्थान या वार्ड नंबर साझा करें ताकि मैं आपको और सटीक कदम बता सकूं।`;
        } else {
          replyText = `नमस्ते! मैं आपका नागरिक सेवा सहायक जनमित्र एआई हूँ। 
मैं आपके सभी प्रशासनिक प्रश्नों, जैसे कि विभिन्न सरकारी प्रमाणपत्र (आय, जाति, निवास प्रमाण पत्र), सार्वजनिक कल्याणकारी योजनाएं, और स्थानीय नगर निगम से जुड़ी शिकायतों के समाधान में आपकी सहायता कर सकता हूँ।

कृपया मुझे अपनी समस्या या प्रश्न के बारे में थोड़ा और विस्तार से बताएं, ताकि मैं आपको सही और सटीक जानकारी दे सकूं!`;
        }
      } else {
        // Professional English Fallback Grid
        if (lowerMessage.includes("scheme") || lowerMessage.includes("pension") || lowerMessage.includes("welfare")) {
          replyText = `Hello! I am JanMitra AI, your governance companion. Regarding government welfare frameworks:
1. Navigate directly to our 'Discover Eligible Schemes' panel to match your profile parameters against running central and state policies.
2. Major operational initiatives like PM-JAY (Healthcare support up to ₹5 Lakh) or PMAY (Housing) can be validated using specialized digital forms.
Please share your category or industry setup so I can fetch precise guidelines for you.`;
        } else {
          replyText = `Hello! I am JanMitra AI, your dedicated citizen services assistant. 
I can help you understand complex government regulations, verify step-by-step document workflows (Ration cards, voter IDs, certificates), and draft professional department-specific civic complaints.

Please describe your query in detail, and I will outline the exact actionable operations for you immediately!`;
        }
      }
    }

    // Clean any unescaped anomalous character hashes before dispatching
    replyText = replyText.replace(/[*#`"]/g, "").trim();

    return NextResponse.json({ reply: replyText });

  } catch (error) {
    console.error("❌ Fatal crash inside chat API terminal loop:", error);
    return NextResponse.json({ 
      reply: "Our context lines are currently busy. Please try processing your message parameter once again." 
    }, { status: 500 });
  }
}
