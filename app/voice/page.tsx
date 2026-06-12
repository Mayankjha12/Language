"use client";

import {
  Mic,
  Volume2,
  Square,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import axios from "axios";

const languages = [

  { id: 1, label: "English", value: "en-US" },
  { id: 2, label: "हिन्दी", value: "hi-IN" },
  { id: 3, label: "বাংলা", value: "bn-IN" },
  { id: 4, label: "தமிழ்", value: "ta-IN" },
  { id: 5, label: "తెలుగు", value: "te-IN" },
  { id: 6, label: "मराठी", value: "mr-IN" },
  { id: 7, label: "ગુજરાતી", value: "gu-IN" },
  { id: 8, label: "ਪੰਜਾਬੀ", value: "pa-IN" },
  { id: 9, label: "ಕನ್ನಡ", value: "kn-IN" },
  { id: 10, label: "മലയാളം", value: "ml-IN" },
  { id: 11, label: "ଓଡ଼ିଆ", value: "or-IN" },
  { id: 12, label: "اردو", value: "ur-IN" },
  { id: 13, label: "অসমীয়া", value: "as-IN" },
  { id: 14, label: "मैथिली", value: "mai-IN" },
  { id: 15, label: "भोजपुरी", value: "bho-IN" },
  { id: 16, label: "संस्कृत", value: "sa-IN" },
  { id: 17, label: "कोंकणी", value: "kok-IN" },
  { id: 18, label: "नेपाली", value: "ne-IN" },
  { id: 19, label: "মৈতৈলোন্", value: "mni-IN" },
  { id: 20, label: "डोगरी", value: "doi-IN" },
  { id: 21, label: "سنڌي", value: "sd-IN" },
  { id: 22, label: "कॉशुर", value: "ks-IN" },

];

export default function VoicePage() {

  const openServiceText: Record<string, string> = {
    "en-US": "Open Recommended Service",
    "hi-IN": "अनुशंसित सेवा खोलें",
    "bn-IN": "প্রস্তাবিত পরিষেবা খুলুন",
    "ta-IN": "பரிந்துரைக்கப்பட்ட சேவையைத் திறக்கவும்",
    "te-IN": "సిఫార్సు చేసిన సేవను తెరవండి",
    "mr-IN": "शिफारस केलेली सेवा उघडा",
    "gu-IN": "ભલામણ કરેલી સેવા ખોલો",
    "pa-IN": "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਸੇਵਾ ਖੋਲ੍ਹੋ",
    "kn-IN": "ಶಿಫಾರಸು ಮಾಡಿದ ಸೇವೆ ತೆರೆಯಿರಿ",
    "ml-IN": "ശുപാർശ ചെയ്ത സേവനം തുറക്കുക",
    "or-IN": "ପ୍ରସ୍ତାବିତ ସେବା ଖୋଲନ୍ତୁ",
    "ur-IN": "تجویز کردہ سروس کھولیں",
    "as-IN": "পৰামৰ্শ দিয়া সেৱা খোলক",
    "mai-IN": "सुझाओल सेवा खोलू",
    "bho-IN": "सुझावल सेवा खोलीं",
    "sa-IN": "अनुशंसितसेवां उद्घाटयतु",
    "kok-IN": "शिफारस केलेली सेवा उघडा",
    "ne-IN": "सिफारिस गरिएको सेवा खोल्नुहोस्",
    "mni-IN": "Recommended Service Open Tou",
    "doi-IN": "सिफारिश कित्ती सेवा खोलो",
    "sd-IN": "تجويز ڪيل سروس کوليو",
    "ks-IN": "تجویز کرمُت سروس کُلِو"
  };

  const uiText: Record<string, {
    title: string;
    subtitle: string;
    listening: string;
    thinking: string;
    ready: string;
    transcript: string;
    placeholder: string;
    response: string;
  }> = {
    "en-US": {
      title: "Maya",
      subtitle: "Your multilingual government assistant",
      listening: "Listening...",
      thinking: "AI is thinking...",
      ready: "Ready",
      transcript: "Live Transcript",
      placeholder: "Speak something...",
      response: "AI Response"
    },
  
    "hi-IN": {
      title: "माया",
      subtitle: "आपकी बहुभाषी सरकारी सहायक",
      listening: "सुन रही हूँ...",
      thinking: "सोच रही हूँ...",
      ready: "तैयार",
      transcript: "लाइव ट्रांसक्रिप्ट",
      placeholder: "कुछ बोलिए...",
      response: "उत्तर"
    },
  
    "bn-IN": {
      title: "মায়া",
      subtitle: "আপনার বহুভাষিক সরকারি সহকারী",
      listening: "শুনছি...",
      thinking: "ভাবছি...",
      ready: "প্রস্তুত",
      transcript: "লাইভ ট্রান্সক্রিপ্ট",
      placeholder: "কিছু বলুন...",
      response: "উত্তর"
    },
  
    "ta-IN": {
      title: "மாயா",
      subtitle: "உங்கள் பலமொழி அரசு உதவியாளர்",
      listening: "கேட்டுக்கொண்டு இருக்கிறேன்...",
      thinking: "யோசித்து கொண்டிருக்கிறேன்...",
      ready: "தயார்",
      transcript: "நேரடி உரை",
      placeholder: "ஏதாவது பேசுங்கள்...",
      response: "பதில்"
    },
  
    "te-IN": {
      title: "మాయా",
      subtitle: "మీ బహుభాషా ప్రభుత్వ సహాయకురాలు",
      listening: "వింటున్నాను...",
      thinking: "ఆలోచిస్తున్నాను...",
      ready: "సిద్ధంగా ఉంది",
      transcript: "ప్రత్యక్ష ట్రాన్స్క్రిప్ట్",
      placeholder: "ఏదైనా మాట్లాడండి...",
      response: "సమాధానం"
    },
  
    "mr-IN": {
      title: "माया",
      subtitle: "तुमची बहुभाषिक सरकारी सहाय्यक",
      listening: "ऐकत आहे...",
      thinking: "विचार करत आहे...",
      ready: "तयार",
      transcript: "थेट ट्रान्सक्रिप्ट",
      placeholder: "काहीतरी बोला...",
      response: "उत्तर"
    },
  
    "gu-IN": {
      title: "માયા",
      subtitle: "તમારી બહુભાષી સરકારી સહાયક",
      listening: "સાંભળી રહી છું...",
      thinking: "વિચારી રહી છું...",
      ready: "તૈયાર",
      transcript: "લાઈવ ટ્રાન્સક્રિપ્ટ",
      placeholder: "કંઈક બોલો...",
      response: "જવાબ"
    },
  
    "pa-IN": {
      title: "ਮਾਇਆ",
      subtitle: "ਤੁਹਾਡੀ ਬਹੁਭਾਸ਼ੀ ਸਰਕਾਰੀ ਸਹਾਇਕ",
      listening: "ਸੁਣ ਰਹੀ ਹਾਂ...",
      thinking: "ਸੋਚ ਰਹੀ ਹਾਂ...",
      ready: "ਤਿਆਰ",
      transcript: "ਲਾਈਵ ਟ੍ਰਾਂਸਕ੍ਰਿਪਟ",
      placeholder: "ਕੁਝ ਬੋਲੋ...",
      response: "ਜਵਾਬ"
    },
  
    "kn-IN": {
      title: "ಮಾಯಾ",
      subtitle: "ನಿಮ್ಮ ಬಹುಭಾಷಾ ಸರ್ಕಾರಿ ಸಹಾಯಕಿ",
      listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...",
      thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...",
      ready: "ಸಿದ್ಧ",
      transcript: "ಲೈವ್ ಟ್ರಾನ್ಸ್‌ಕ್ರಿಪ್ಟ್",
      placeholder: "ಏನಾದರೂ ಮಾತನಾಡಿ...",
      response: "ಉತ್ತರ"
    },
  
    "ml-IN": {
      title: "മായ",
      subtitle: "നിങ്ങളുടെ ബഹുഭാഷാ സർക്കാർ സഹായി",
      listening: "കേൾക്കുന്നു...",
      thinking: "ചിന്തിക്കുന്നു...",
      ready: "തയ്യാർ",
      transcript: "ലൈവ് ട്രാൻസ്ക്രിപ്റ്റ്",
      placeholder: "എന്തെങ്കിലും പറയൂ...",
      response: "മറുപടി"
    },
  
    "or-IN": {
      title: "ମାୟା",
      subtitle: "ଆପଣଙ୍କର ବହୁଭାଷୀ ସରକାରୀ ସହାୟିକା",
      listening: "ଶୁଣୁଛି...",
      thinking: "ଭାବୁଛି...",
      ready: "ପ୍ରସ୍ତୁତ",
      transcript: "ଲାଇଭ୍ ଟ୍ରାନ୍ସକ୍ରିପ୍ଟ",
      placeholder: "କିଛି କୁହନ୍ତୁ...",
      response: "ଉତ୍ତର"
    },
  
    "ur-IN": {
      title: "مایا",
      subtitle: "آپ کی کثیر لسانی سرکاری معاون",
      listening: "سن رہی ہوں...",
      thinking: "سوچ رہی ہوں...",
      ready: "تیار",
      transcript: "لائیو ٹرانسکرپٹ",
      placeholder: "کچھ بولیں...",
      response: "جواب"
    },
  
    "as-IN": {
      title: "মায়া",
      subtitle: "আপোনাৰ বহুভাষিক চৰকাৰী সহায়িকা",
      listening: "শুনিছোঁ...",
      thinking: "ভাবি আছোঁ...",
      ready: "প্ৰস্তুত",
      transcript: "লাইভ ট্ৰান্সক্ৰিপ্ট",
      placeholder: "কিবা কওক...",
      response: "উত্তৰ"
    },
  
    "mai-IN": {
      title: "माया",
      subtitle: "अहाँक बहुभाषी सरकारी सहायक",
      listening: "सुनि रहल छी...",
      thinking: "विचार कए रहल छी...",
      ready: "तैयार",
      transcript: "लाइव ट्रांसक्रिप्ट",
      placeholder: "किछु कहू...",
      response: "उत्तर"
    },
  
    "bho-IN": {
      title: "माया",
      subtitle: "रउआ के बहुभाषी सरकारी सहायक",
      listening: "सुनत बानी...",
      thinking: "सोचत बानी...",
      ready: "तैयार बा",
      transcript: "लाइव ट्रांसक्रिप्ट",
      placeholder: "कुछ बोलीं...",
      response: "जवाब"
    },
  
    "sa-IN": {
      title: "माया",
      subtitle: "भवतः बहुभाषिकः सरकारी सहायिका",
      listening: "शृणोमि...",
      thinking: "चिन्तयामि...",
      ready: "सज्जम्",
      transcript: "प्रत्यक्ष प्रतिलेखः",
      placeholder: "किमपि वदतु...",
      response: "उत्तरम्"
    },
  
    "kok-IN": {
      title: "माया",
      subtitle: "तुमची बहुभाषिक सरकारी सहायिका",
      listening: "आयकत आसां...",
      thinking: "विचार करता आसां...",
      ready: "तयार",
      transcript: "लाइव्ह ट्रान्सक्रिप्ट",
      placeholder: "काय तरी सांग...",
      response: "उत्तर"
    },
  
    "ne-IN": {
      title: "माया",
      subtitle: "तपाईंको बहुभाषिक सरकारी सहायक",
      listening: "सुन्दै छु...",
      thinking: "सोच्दै छु...",
      ready: "तयार",
      transcript: "लाइभ ट्रान्सक्रिप्ट",
      placeholder: "केही बोल्नुहोस्...",
      response: "उत्तर"
    },
  
    "mni-IN": {
      title: "ꯃꯥꯌꯥ",
      subtitle: "Your multilingual government assistant",
      listening: "Listening...",
      thinking: "Thinking...",
      ready: "Ready",
      transcript: "Live Transcript",
      placeholder: "Speak something...",
      response: "Response"
    },
  
    "doi-IN": {
      title: "माया",
      subtitle: "तुहाडी बहुभाषी सरकारी सहायक",
      listening: "सुणी रही आं...",
      thinking: "सोची रही आं...",
      ready: "तैयार",
      transcript: "लाइव ट्रांसक्रिप्ट",
      placeholder: "कुज बोलो...",
      response: "जवाब"
    },
  
    "sd-IN": {
      title: "مايا",
      subtitle: "توهان جي گهڻ ٻولي سرڪاري مددگار",
      listening: "ٻڌي رهي آهيان...",
      thinking: "سوچي رهي آهيان...",
      ready: "تيار",
      transcript: "لائيو ٽرانسڪرپٽ",
      placeholder: "ڪجهه ڳالهايو...",
      response: "جواب"
    },
  
    "ks-IN": {
      title: "مایا",
      subtitle: "تُہند کثیر لسانی سرکاری معاون",
      listening: "سونان چھس...",
      thinking: "سوچان چھس...",
      ready: "تیار",
      transcript: "لائیو ٹرانسکرپٹ",
      placeholder: "کُجھ ونیو...",
      response: "جواب"
    }
  };

  const [languageSelected,
    setLanguageSelected] =
    useState(false);

  const [language,
    setLanguage] =
    useState("en-US");

  const [message,
    setMessage] =
    useState("");

  const [reply,
    setReply] =
    useState("");

  const [intent,
    setIntent] =
    useState("");

  const [suggestedPage,
    setSuggestedPage] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [listening,
    setListening] =
    useState(false);

    const mediaRecorderRef =
  useRef<MediaRecorder | null>(null);

const audioChunksRef =
  useRef<Blob[]>([]);

const streamRef =
  useRef<MediaStream | null>(null);

  const WAKE_WORDS = [
    "maya",      // English
    "माया",      // Hindi
    "মায়া",      // Bengali
    "மாயா",      // Tamil
    "మాయా",      // Telugu
    "माया",      // Marathi
    "માયા",      // Gujarati
    "ਮਾਇਆ",      // Punjabi
    "ಮಾಯಾ",      // Kannada
    "മായ",       // Malayalam
    "ମାୟା",      // Odia
    "مایا",       // Urdu
    "মায়া",      // Assamese
    "माया",      // Maithili
    "माया",      // Bhojpuri
    "माया",      // Sanskrit
    "माया",      // Konkani
    "माया",      // Nepali
    "ꯃꯥꯌꯥ",     // Manipuri
    "माया",      // Dogri
    "مايا",       // Sindhi
    "مایا"        // Kashmiri
  ];


useEffect(() => {

  if (!languageSelected)
    return;

  const timer = setTimeout(() => {

    startListening();

  }, 3000);

  return () => clearTimeout(timer);

}, [languageSelected]);

useEffect(() => {

  if (languageSelected)
    return;

  const speech =
    new SpeechSynthesisUtterance(`
Welcome to JanMitra AI.

For English press or say 1.

हिन्दी के लिए 2 दबाइए।

বাংলার জন্য 3 চাপুন।

தமிழுக்கு 4 அழுத்தவும்.

తెలుగు కోసం 5 నొక్కండి.

मराठीसाठी 6 दाबा.

ગુજરાતી માટે 7 દબાવો.

ਪੰਜਾਬੀ ਲਈ 8 ਦਬਾਓ।

ಕನ್ನಡಕ್ಕಾಗಿ 9 ಒತ್ತಿರಿ.

മലയാളത്തിനായി 10 അമർത്തുക.

ଓଡ଼ିଆ ପାଇଁ 11 ଦବାନ୍ତୁ।

اردو کے لیے 12 دبائیں۔

অসমীয়াৰ বাবে 13 টিপক।

मैथिली लेल 14 दबाउ।

भोजपुरी खातिर 15 दबाईं।

संस्कृताय 16 दाबयतु।

कोंकणीसाठी 17 दाबा।

नेपालीका लागि 18 थिच्नुहोस्।

ꯃꯤꯇꯩ ꯂꯣꯟ 19.

डोगरी वास्ते 20 दबाओ।

سنڌي لاءِ 21 دٻايو۔

कॉशुर खातर 22 दबाव।
`);


  speech.lang = "en-US";

  window.speechSynthesis.cancel();

  window.speechSynthesis.speak(
    speech
  );

}, [languageSelected]);

useEffect(() => {

  if (!languageSelected)
    return;

  const greetings: Record<string, string> = {

    "en-US":
      "Hello. How can I help you today?",

    "hi-IN":
      "नमस्ते। मैं आपकी कैसे सहायता कर सकता हूँ?",

    "bn-IN":
      "নমস্কার। আমি আপনাকে কীভাবে সাহায্য করতে পারি?",

    "ta-IN":
      "வணக்கம். நான் உங்களுக்கு எப்படி உதவலாம்?",

    "te-IN":
      "నమస్కారం. నేను మీకు ఎలా సహాయం చేయగలను?",

    "mr-IN":
      "नमस्कार. मी तुमची कशी मदत करू शकतो?",

    "gu-IN":
      "નમસ્તે. હું તમારી કેવી રીતે મદદ કરી શકું?",

    "pa-IN":
      "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",

    "kn-IN":
      "ನಮಸ್ಕಾರ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",

    "ml-IN":
      "നമസ്കാരം. ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",

    "or-IN":
      "ନମସ୍କାର। ମୁଁ ଆପଣଙ୍କୁ କିପରି ସହାୟତା କରିପାରିବି?",

    "ur-IN":
      "السلام علیکم۔ میں آپ کی کیسے مدد کر سکتا ہوں؟",

    "as-IN":
      "নমস্কাৰ। মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",

    "mai-IN":
      "नमस्कार। हम अहाँक कोना सहायता क' सकैत छी?",

    "bho-IN":
      "नमस्कार। हम रउआ के कइसे मदद कर सकतानी?",

    "sa-IN":
      "नमस्ते। कथं भवतः साहाय्यं कर्तुं शक्नोमि?",

    "kok-IN":
      "नमस्कार. हांव तुमकां कसें मदत करूं शकता?",

    "ne-IN":
      "नमस्ते। म तपाईंलाई कसरी सहयोग गर्न सक्छु?",

    "mni-IN":
      "Hello",

    "doi-IN":
      "नमस्कार। में तुहाडी किस तरह मदद करी सकदा आं?",

    "sd-IN":
      "السلام عليڪم۔ مان اوهان جي ڪيئن مدد ڪري سگهان ٿو؟",

    "ks-IN":
      "آداب۔ بہٕ کٔرٕو تُہند مدد کِیازِ؟",
  };

  const speech =

    new SpeechSynthesisUtterance(

      greetings[language] || "Hello"

    );

  speech.lang = language;

  window.speechSynthesis.cancel();

  window.speechSynthesis.speak(

    speech

  );



}, [languageSelected, language]);

  
    
      
  const detectLanguageSelection =
  (transcript: string) => {

    const text =
      transcript.toLowerCase();

      if (
        text.includes("1") ||
        text.includes("one") ||
        text.includes("english")
      ) {
        setLanguage("en-US");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("2") ||
        text.includes("two") ||
        text.includes("hindi") ||
        text.includes("हिंदी") ||
        text.includes("हिन्दी")
      ) {
        setLanguage("hi-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("3") ||
        text.includes("three") ||
        text.includes("bengali") ||
        text.includes("বাংলা")
      ) {
        setLanguage("bn-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("4") ||
        text.includes("four") ||
        text.includes("tamil") ||
        text.includes("தமிழ்")
      ) {
        setLanguage("ta-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("5") ||
        text.includes("five") ||
        text.includes("telugu") ||
        text.includes("తెలుగు")
      ) {
        setLanguage("te-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("6") ||
        text.includes("six") ||
        text.includes("marathi") ||
        text.includes("मराठी")
      ) {
        setLanguage("mr-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("7") ||
        text.includes("seven") ||
        text.includes("gujarati") ||
        text.includes("ગુજરાતી")
      ) {
        setLanguage("gu-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("8") ||
        text.includes("eight") ||
        text.includes("punjabi") ||
        text.includes("ਪੰਜਾਬੀ")
      ) {
        setLanguage("pa-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("9") ||
        text.includes("nine") ||
        text.includes("kannada") ||
        text.includes("ಕನ್ನಡ")
      ) {
        setLanguage("kn-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("10") ||
        text.includes("ten") ||
        text.includes("malayalam") ||
        text.includes("മലയാളം")
      ) {
        setLanguage("ml-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("11") ||
        text.includes("eleven") ||
        text.includes("odia") ||
        text.includes("oriya") ||
        text.includes("ଓଡ଼ିଆ")
      ) {
        setLanguage("or-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("12") ||
        text.includes("twelve") ||
        text.includes("urdu") ||
        text.includes("اردو")
      ) {
        setLanguage("ur-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("13") ||
        text.includes("thirteen") ||
        text.includes("assamese") ||
        text.includes("অসমীয়া")
      ) {
        setLanguage("as-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("14") ||
        text.includes("fourteen") ||
        text.includes("maithili") ||
        text.includes("मैथिली")
      ) {
        setLanguage("mai-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("15") ||
        text.includes("fifteen") ||
        text.includes("bhojpuri") ||
        text.includes("भोजपुरी")
      ) {
        setLanguage("bho-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("16") ||
        text.includes("sixteen") ||
        text.includes("sanskrit") ||
        text.includes("संस्कृत")
      ) {
        setLanguage("sa-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("17") ||
        text.includes("seventeen") ||
        text.includes("konkani") ||
        text.includes("कोंकणी")
      ) {
        setLanguage("kok-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("18") ||
        text.includes("eighteen") ||
        text.includes("nepali") ||
        text.includes("नेपाली")
      ) {
        setLanguage("ne-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("19") ||
        text.includes("nineteen") ||
        text.includes("manipuri") ||
        text.includes("মৈতৈলোন্")
      ) {
        setLanguage("mni-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("20") ||
        text.includes("twenty") ||
        text.includes("dogri") ||
        text.includes("डोगरी")
      ) {
        setLanguage("doi-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("21") ||
        text.includes("twenty one") ||
        text.includes("sindhi") ||
        text.includes("سنڌي")
      ) {
        setLanguage("sd-IN");
        setLanguageSelected(true);
        return true;
      }
      
      if (
        text.includes("22") ||
        text.includes("twenty two") ||
        text.includes("kashmiri") ||
        text.includes("कॉशुर")
      ) {
        setLanguage("ks-IN");
        setLanguageSelected(true);
        return true;
      }

    return false;
  };

const startLanguageListening =
  () => {

    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition)
      return;

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      "en-US";

    recognition.continuous =
      false;

    recognition.interimResults =
      false;

    recognition.onresult =
      (event: any) => {

        const transcript =
          event.results[0][0]
            .transcript;

        detectLanguageSelection(
          transcript
        );
      };

    recognition.start();
  };

  const sendAudioToSTT =
  async (
    audioBlob: Blob
  ) => {

    const formData =
      new FormData();

    formData.append(
      "audio",
      new File(
        [audioBlob],
        "voice.webm",
        {
          type:"audio/webm"
        }
      )
    );

    formData.append(
      "language",
      language
    );

    const res =
      await fetch(
        "/api/stt",
        {
          method:
            "POST",
          body:
            formData,
        }
      );

    const data =
      await res.json();

    return (
      data.transcript ||
      ""
    );
  };

  const handleAskAI =
  async (
    customMessage?: string
  ) => {

    const finalMessage =
      customMessage ||
      message;

    if (!finalMessage)
      return;

    try {

      setLoading(true);

      const res =
        await axios.post(
          "/api/chat",
          {
            message:
              finalMessage,

            language:
              language,
          }
        );

      const aiReply =
        res.data.reply;

      const aiIntent =
        res.data.intent;

      setReply(
        aiReply
      );

      setIntent(
        aiIntent
      );

      if (
        aiIntent ===
        "schemes"
      ) {
        setSuggestedPage(
          "/ask-ai"
        );
      } else if (
        aiIntent ===
        "complaints"
      ) {
        setSuggestedPage(
          "/complaints"
        );
      } else if (
        aiIntent ===
        "documents"
      ) {
        setSuggestedPage(
          "/documents"
        );
      } else {
        setSuggestedPage(
          ""
        );
      }

      const ttsRes =
        await fetch(
          "/api/tts",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                text:
                  aiReply,

                languageCode:
                  language,
              }),
          }
        );

      const ttsData =
        await ttsRes.json();

      if (
        ttsData.audios &&
        ttsData.audios[0]
      ) {

        const audio =
          new Audio(
            `data:audio/wav;base64,${ttsData.audios[0]}`
          );

          audio.onended = () => {

            setTimeout(() => {
          
              startListening();
          
            }, 1000);
          
          };
          
          audio.play();
      }

    } catch (error) {

      console.log(
        error
      );

    } finally {

      setLoading(
        false
      );
    }
  };

  const startListening =
  async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current =
        stream;

      const recorder =
        new MediaRecorder(stream);

      audioChunksRef.current =
        [];

      recorder.ondataavailable =
        (event) => {

          if (
            event.data.size > 0
          ) {

            audioChunksRef.current.push(
              event.data
            );
          }
        };

      recorder.start();

      mediaRecorderRef.current =
        recorder;

      setListening(true);

    } catch (error) {

      console.log(error);
    }
  };

  const stopListening =
  async () => {

    const recorder =
      mediaRecorderRef.current;

    if (!recorder)
      return;

    recorder.onstop =
      async () => {

        try {

          setLoading(true);

          const audioBlob =
            new Blob(
              audioChunksRef.current,
              {
                type:
                  "audio/webm",
              }
            );

          const transcript =
            await sendAudioToSTT(
              audioBlob
            );

          setMessage(
            transcript
          );

          if (!transcript) {

            startListening();
          
            return;
          
          }
          
          const lowerTranscript =
            transcript.toLowerCase();
          
          const hasWakeWord =
            WAKE_WORDS.some(word =>
              lowerTranscript.includes(
                word.toLowerCase()
              )
            );

if (hasWakeWord) {

  let cleaned = transcript;

  WAKE_WORDS.forEach(word => {

    const escapedWord =
      word.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
  
    const regex =
      new RegExp(
        escapedWord,
        "gi"
      );
  
    cleaned =
      cleaned.replace(
        regex,
        ""
      );
  
  });

  cleaned =

    cleaned.trim();

  await handleAskAI(

    cleaned

  );

} else {

  startListening();

}
          

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

          streamRef.current
            ?.getTracks()
            .forEach(
              (
                track
              ) =>
                track.stop()
            );
        }
      };

    recorder.stop();

    setListening(false);
  };

  if (
    !languageSelected
  ) {

    return (

      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">

        <div className="max-w-5xl w-full rounded-3xl border border-white/10 bg-white/5 p-10">

          <h1 className="text-5xl font-bold text-center">

            🇮🇳 JanMitra AI

          </h1>

          <p className="text-center text-gray-400 mt-5 text-lg">

            Press or Say your language

          </p>

          <div className="mt-8 flex justify-center">

            <button
              onClick={
                startLanguageListening
              }
              className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center"
            >

              <Mic size={38} />

            </button>

          </div>

          <p className="text-center text-purple-300 mt-4 leading-8">

  1 for English
  <br />

  2 के लिए हिन्दी
  <br />

  3 বাংলার জন্য
  <br />

  4 தமிழுக்கு
  <br />

  5 తెలుగు కోసం
  <br />

  6 साठी मराठी
  <br />

  7 માટે ગુજરાતી
  <br />

  8 ਲਈ ਪੰਜਾਬੀ
  <br />

  9ಗಾಗಿ ಕನ್ನಡ
  <br />

  10 വേണ്ടി മലയാളം
  <br />

  11 ପାଇଁ ଓଡ଼ିଆ
  <br />

  12 کے لیے اردو
  <br />

  13 বাবে অসমীয়া
  <br />

  14 लेल मैथिली
  <br />

  15 खातिर भोजपुरी
  <br />

  16 संस्कृताय
  <br />

  17 साठी कोंकणी
  <br />

  18 लागि नेपाली
  <br />

  19 ꯃꯤꯇꯩ ꯂꯣꯟ
  <br />

  20 वास्ते डोगरी
  <br />

  21 لاءِ سنڌي
  <br />

  22 खातर कॉशुर

</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">

            {languages.map(
              (lang) => (

                <button
                  key={
                    lang.id
                  }
                  onClick={() => {

                    setLanguage(
                      lang.value
                    );

                    setLanguageSelected(
                      true
                    );
                  }}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 text-left hover:border-purple-500 transition-all"
                >

                  <div className="text-xl font-bold">

                    {lang.id}

                  </div>

                  <div className="mt-2">

                    {lang.label}

                  </div>

                </button>

              )
            )}

          </div>

        </div>

      </main>

    );
  }
  return (

    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">

      <section className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h1 className="text-5xl font-bold">

          {uiText[language]?.title}

          </h1>

          <p className="text-gray-400 mt-3 text-lg">

          {uiText[language]?.subtitle}

          </p>

        </div>

        {/* Main Voice Area */}

        <div className="mt-10 rounded-[40px] border border-white/10 bg-white/5 min-h-[750px] relative overflow-hidden flex flex-col items-center justify-center">

          {/* Glow */}

          <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[140px]" />

          {/* Orb */}

          <motion.div

            animate={{
              scale:
                listening
                  ? [1, 1.25, 1]
                  : [1, 1.08, 1],
            }}

            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}

            className={`relative z-10 w-72 h-72 rounded-full blur-2xl opacity-90 ${
              listening
                ? "bg-gradient-to-r from-red-500 to-pink-500"
                : "bg-gradient-to-r from-purple-500 to-blue-500"
            }`}
          />

          {/* Controls */}

          <div className="relative z-20 mt-12 flex gap-6 items-center">

            {!listening ? (

              <button

                onClick={startListening}

                className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center hover:scale-110 transition-all shadow-2xl shadow-purple-500/30"
              >

                <Mic size={38} />

              </button>

            ) : (

              <button

                onClick={stopListening}

                className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center hover:scale-110 transition-all shadow-2xl shadow-red-500/30"
              >

                <Square size={30} />

              </button>

            )}

            <button

              onClick={() =>
                window.speechSynthesis.cancel()
              }

              className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition"
            >

              <Volume2 />

            </button>

          </div>

          {/* Status */}

          <div className="relative z-20 mt-6">

            {listening ? (

              <p className="text-red-400 animate-pulse text-lg">

{uiText[language]?.listening}

              </p>

            ) : loading ? (

              <p className="text-purple-300 animate-pulse text-lg">

{uiText[language]?.thinking}

              </p>

            ) : (

              <p className="text-gray-400 text-lg">

{uiText[language]?.ready}

              </p>

            )}

          </div>
                    {/* Transcript */}

                    <div className="relative z-20 mt-14 max-w-3xl text-center w-full px-6">

<p className="uppercase tracking-[0.3em] text-purple-300 text-sm mb-5">

{uiText[language]?.transcript}

</p>

<textarea

  value={message}

  onChange={(e) =>
    setMessage(e.target.value)
  }

  placeholder={uiText[language]?.placeholder}

  className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-5 outline-none text-center text-xl min-h-[160px]"
/>



</div>

{/* AI Response */}

<div className="relative z-20 mt-14 max-w-4xl w-full px-6 mb-20">

<div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8">

  <p className="text-purple-300 mb-4 uppercase tracking-[0.2em] text-sm">

  {uiText[language]?.response}

  </p>

  <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">

    {reply ||
      "AI response will appear here..."}

  </p>

  {suggestedPage && (

    <div className="mt-8 text-center">

<a
  href={suggestedPage}
  className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 hover:scale-105 transition-all"
>
  {openServiceText[language] ||
    "Open Recommended Service"}
</a>
    </div>

  )}

</div>

</div>

</div>

</section>

</main>

);

}