import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.SARVAM_API_KEY,
  baseURL: "https://api.sarvam.ai/v1",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body; 

    if (!message || message.trim() === "") {
      return NextResponse.json({ reply: "कृपया अपना प्रश्न टाइप करें। / Please type your query." });
    }

    const systemPrompt = `You are JanMitra AI, an expert citizen services chatbot. Respond in Hindi if the user writes in Hindi/Hinglish, and English if they write in English.

STRICT LINK ROUTING INSTRUCTION:
If the user's query relates to any of our 3 core portal features, you MUST explicitly include these exact routing tags in your text response so the UI can render direct navigation buttons:
- For Schemes/Pensions/Eligibility, include exactly: [ROUTE:schemes]
- For Civic Grievances/Complaints/Water/Garbage issues, include exactly: [ROUTE:complaints]
- For Document Analysis/Summarization/Reading files, include exactly: [ROUTE:documents]

Example behavior: "You can find all government pension schemes under our dedicated tool: [ROUTE:schemes]"
If the topic is general and not in our app, do not include any ROUTE tag. Keep response brief and structured.`;

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
        { timeout: 8500 }
      );
      replyText = completion.choices[0].message.content?.trim() || "";
    } catch (apiError) {
      console.warn("⚠️ API Delay fallback bypass active.");
    }

    // Fallback Matrix with exact navigation tags embedded
    if (!replyText || replyText.length < 3) {
      const lowerMessage = message.toLowerCase();
      const isHindiQuery = /[\u0900-\u097F]/.test(message) || lowerMessage.includes("yojana") || lowerMessage.includes("shikayat");
      
      if (isHindiQuery) {
        if (lowerMessage.includes("scheme") || lowerMessage.includes("योजना") || lowerMessage.includes("pension")) {
          replyText = `नमस्ते! सरकारी योजनाओं की खोज और अपनी पात्रता जांचने के लिए आप सीधे हमारे इस टूल का उपयोग कर सकते हैं: [ROUTE:schemes]`;
        } else if (lowerMessage.includes("complaint") || lowerMessage.includes("शिकायत")) {
          replyText = `नमस्ते! नगर निगम या पानी/कचरे की शिकायत के लिए एआई ड्राफ्ट तैयार करने हेतु यहां क्लिक करें: [ROUTE:complaints]`;
        } else {
          replyText = `नमस्ते! दस्तावेज़ों को सरल भाषा में समझने के लिए आप इस सेवा का उपयोग करें: [ROUTE:documents]`;
        }
      } else {
        if (lowerMessage.includes("scheme") || lowerMessage.includes("pension")) {
          replyText = `Hello! You can easily check your eligibility for welfare policies directly using our service: [ROUTE:schemes]`;
        } else if (lowerMessage.includes("complaint") || lowerMessage.includes("grievance")) {
          replyText = `Hello! To generate an official grievance draft file, access our platform terminal: [ROUTE:complaints]`;
        } else {
          replyText = `Hello! For analyzing complex official papers, head over to: [ROUTE:documents]`;
        }
      }
    }

    replyText = replyText.replace(/[*#`"]/g, "").trim();
    return NextResponse.json({ reply: replyText });

  } catch (error) {
    return NextResponse.json({ reply: "Connection timeout. Please try again." }, { status: 500 });
  }
}
