"use client";

import { Mic, Volume2, Square, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

interface LanguageConfig {
  id: number;
  label: string;
  value: string;
}

const languages: LanguageConfig[] = [
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
  { id: 22, label: "कॉशुर", value: "ks-IN" }
];

export default function VoicePage() {
  const openServiceText: Record<string, string> = {
    "en-US": "Open Recommended Service", "hi-IN": "अनुशंसित सेवा खोलें", "bn-IN": "প্রস্তাবিত পরিষেবা খুলুন",
    "ta-IN": "பரிந்துரைக்கப்பட்ட சேவையைத் திறக்கவும்", "te-IN": "സിఫార్సు చేసిన సేవను తెరవండి", "mr-IN": "शिफारस केलेली सेवा उघडा",
    "gu-IN": "ભલામણ કરેલી સેવા ખોલો", "pa-IN": "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਸੇਵਾ ਖੋਲ੍ਹੋ", "kn-IN": "ಶಿಫਾਰಸು ಮಾಡಿದ ಸೇವೆ ತೆರೆಯಿರಿ",
    "ml-IN": "ശുപാർശ ചെയ്ത സേവനം തുറക്കുക", "or-IN": "ପ୍ରସ୍ତାବିତ ସେବା ଖୋଲନ୍ତୁ", "ur-IN": "تجویز کردہ سروس کھولیں",
    "as-IN": "পৰামৰ্শ দিয়া সেৱা খোলক", "mai-IN": "সুझाओल सेवा खोलू", "bho-IN": "সুझावल सेवा खोलीं",
    "sa-IN": "अनुशंसितसेवां उद्घाटयतु", "kok-IN": "शिफारस केलेली सेवा उघडा", "ne-IN": "сиफारिश गरिएको सेवा खोल्नुहोस्",
    "mni-IN": "Recommended Service Open Tou", "doi-IN": "सिफारिश कित्ती सेवा खोलो", "sd-IN": "تجويز ڪيل سروس ڪوليو",
    "ks-IN": "تجویز کرمُत سروس کُلِو"
  };

  const uiText: Record<string, {
    title: string; subtitle: string; listening: string; thinking: string; ready: string;
    transcript: string; placeholder: string; response: string; defaultResponse: string;
  }> = {
    "en-US": { title: "Maya", subtitle: "Your multilingual government assistant", listening: "Listening... Speak naturally", thinking: "AI is thinking...", ready: "Ready", transcript: "Live Transcript Panel", placeholder: "Speak something...", response: "AI Response", defaultResponse: "Awaiting voice input..." },
    "hi-IN": { title: "माया", subtitle: "आपकी बहुभाषी सरकारी सहायक", listening: "सुन रही हूँ... सहजता से बोलें", thinking: "सोच रही हूँ...", ready: "तैयार", transcript: "लाइव ट्रांसक्रिप्ट", placeholder: "कुछ बोलिए...", response: "उत्तर", defaultResponse: "बोलना शुरू करें..." },
    "bn-IN": { title: "মায়া", subtitle: "আপনার বহুভাষিক সরকারি সহকারী", listening: "শুনছি...", thinking: "ভাবছি...", ready: "প্রস্তুত", transcript: "লাইভ ট্রান্সক্রিপ্ট", placeholder: "কিছু বলুন...", response: "উত্তর", defaultResponse: "কথা বলা শুরু করুন..." },
    "ta-IN": { title: "மாயா", subtitle: "உங்கள் பலமொழி அரசு உதவியாளர்", listening: "கேட்டுக்கொண்டு இருக்கிறேன்...", thinking: "யோசித்து கொண்டிருக்கிறேன்...", ready: "தயார்", transcript: "நேரடி உரை", placeholder: "ஏதாவது பேசுங்கள்...", response: "பதில்", defaultResponse: "பேசத் தொடங்குங்கள்..." },
    "te-IN": { title: "మాయా", subtitle: "మీ బహుభాషా ప్రభుత్వ సహాయకురాలు", listening: "ವಿంటున్నాను...", thinking: "ఆలోచిస్తున్నాను...", ready: "సిద్ధంగా ఉంది", transcript: "ప్రత్యక్ష ట్రాన్స్క్రిప్ట్", placeholder: "ఏదైనా మాట్లాడండి...", response: "సమాధానం", defaultResponse: "మాట్లాడటం ప్రారంభించండి..." },
    "mr-IN": { title: "माया", subtitle: "तुमची बहुभाषिक सरकारी सहाय्यक", listening: "ऐकत आहे...", thinking: "विचार करत आहे...", ready: "तयार", transcript: "थेट ट्रान्सक्रिप्ट", placeholder: "काहीतरी बोला...", response: "उत्तर", defaultResponse: "बोलणे सुरू करा..." },
    "gu-IN": { title: "માયા", subtitle: "તમારી બહુભાષી સરકારી સહાયક", listening: "સાંભળી રહી છું...", thinking: "વિચારી રહી છું...", ready: "તૈયાર", transcript: "લાઈવ ટ્રાન્સಕ್ರિપ્ટ", placeholder: "კંઈક બોલો...", response: "જવાબ", defaultResponse: "બોલવાનું શરૂ કરો..." },
    "pa-IN": { title: "ਮਾਇਆ", subtitle: "ਤੁਹਾਡੀ ਬਹੁਭਾਸ਼ੀ ਸਰਕਾਰੀ ਸਹਾਇਕ", listening: "ਸੁਣ ਰਹੀ ਹਾਂ...", thinking: "ਸੋਚ ਰਹੀ ਹਾਂ...", ready: "ਤਿਆਰ", transcript: "ਲਾਈਵ ਟ੍ਰਾਂਸਕ੍ਰਿਪਟ", placeholder: "ਕੁਝ ਬੋਲੋ...", response: "ਜਵਾਬ", defaultResponse: "ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ..." },
    "kn-IN": { title: "ಮಾಯಾ", subtitle: "ನಿಮ್ಮ ಬಹುಭಾಷಾ ಸರ್ಕಾರಿ ಸಹಾಯಕಿ", listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...", thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...", ready: "ಸಿದ್ಧ", transcript: "ಲೈವ್ ಟ್ರಾನ್ಸ್‌ಕ್ರಿಪ್ಟ್", placeholder: "ಏನಾದರೂ ಮಾತನಾಡಿ...", response: "ಉತ್ತರ", defaultResponse: "ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ..." },
    "ml-IN": { title: "മായ", subtitle: "നിങ്ങളുടെ ബਹੁഭാഷാ സർക്കാർ സഹായി", listening: "കേൾക്കുന്നു...", thinking: "ചിന്തിക്കുന്നു...", ready: "തയ്യാർ", transcript: "ലൈവ് ട്രാൻസ്ക്രിപ്റ്റ്", placeholder: "എന്തെങ്കിലും പറയൂ...", response: "മറുപടി", defaultResponse: "സംസാരിക്കാൻ ആരംഭിക്കുക..." },
    "or-IN": { title: "මାୟା", subtitle: "ଆପଣଙ୍କର ବହୁଭାଷୀ ସରକାରୀ ସହାୟିକା", listening: "ଶୁଣୁଛି...", thinking: "ଭାବୁଛି...", ready: "ପ୍ରସ୍ତୁତ", transcript: "ଲାଇଭ୍ ଟ୍ରାନ୍ସକ୍ରିପ୍ଟ", placeholder: "କିଛି କୁହନ୍ତୁ...", response: "ଉତ୍ତର", defaultResponse: "କହିବା ଆରମ୍ਭ କରନ୍ତୁ..." },
    "ur-IN": { title: "مایا", subtitle: "آپ کی کثیر لسانی سرکاری معاون", listening: "سن رہی ہوں...", thinking: "سوچ رہی ہوں...", ready: "تیار", transcript: "لائیو ٹرانسکرپٹ", placeholder: "کچھ بولیں...", response: "جواب", defaultResponse: "بولنا شروع کریں..." },
    "as-IN": { title: "মায়া", subtitle: "আপোনাৰ বহুভাষিক চৰকাৰী সহায়িকা", listening: "শুনিছোঁ...", thinking: "ভাবি আছোঁ...", ready: "প্ৰস্তুত", transcript: "লাইভ ট্ৰান্সক্ৰিপ্ট", placeholder: "কিবা কওক...", response: "উত্তৰ", defaultResponse: "কবলৈ আৰম্ভ কৰক..." },
    "mai-IN": { title: "माया", subtitle: "अहाँक बहुभाषी सरकारी सहायक", listening: "सुनि रहल छी...", thinking: "विचार कए रहल छी...", ready: "तैयार", transcript: "लाइव ट्रांसक्रिप्ट", placeholder: "किछु कहू...", response: "उत्तर", defaultResponse: "बाजव शुरू करू..." },
    "bho-IN": { title: "माया", subtitle: "रउआ के बहुभाषी सरकारी सहायक", listening: "सुनत बानी...", thinking: "सोचत बानी...", ready: "तैयार बा", transcript: "लाइव प्रतिलेखन", placeholder: "कुछ बोलीं...", response: "जवाब", defaultResponse: "बोले के शुरू करीं..." },
    "sa-IN": { title: "माया", subtitle: "भवतः बहुभाषिकः सरकारी सहायिका", listening: "शृणोमि...", thinking: "चिन्तयामि...", ready: "सज्जम्", transcript: "प्रत्यक्ष प्रतिलेखः", placeholder: "किमपि वदतु...", response: "उत्तरम्", defaultResponse: "वक्तुम् आरभत..." },
    "kok-IN": { title: "माया", subtitle: "तुमची बहुभाषिक सरकारी सहायिका", listening: "आयकत आसां...", thinking: "विचार करता आसां...", ready: "तयार", transcript: "लाइव्ह ट्रान्सक्रिप्ट", placeholder: "काय तरी सांग...", response: "उत्तर", defaultResponse: "उलोवपाक सुरू करात..." },
    "ne-IN": { title: "माया", subtitle: "तपाईंको बहुभाषिक सरकारी सहायक", listening: "सुन्दै छु...", thinking: "सोच्दै छु...", ready: "तयार", transcript: "लाइभ ट्रान्सक्रिप्ट", placeholder: "केही बोल्नुहोस्...", response: "उत्तर", defaultResponse: "बोल्न सुरु गर्नुहोस्..." },
    "mni-IN": { title: "ꯃꯥꯌꯥ", subtitle: "Your multilingual government assistant", listening: "Listening...", thinking: "Thinking...", ready: "Ready", transcript: "Live Transcript", placeholder: "Speak something...", response: "Response", defaultResponse: "Start speaking..." },
    "doi-IN": { title: "माया", subtitle: "तुहाडी बहुभाषी सरकारी सहायक", listening: "सुणी रही आं...", thinking: "सोची रही आं...", ready: "तैयार", transcript: "लाइव ट्रांसक्रिप्ट", placeholder: "कुज बोलो...", response: "जवाब", defaultResponse: "बोलना शुरू करो..." },
    "sd-IN": { title: "مايا", subtitle: "توهان جي گهڻ ٻولي سرڪاري مددگار", listening: "ٻڌي رهي آهيان...", thinking: "سوچي رهي آهيان...", ready: "تيار", transcript: "لائيو ٽرانسڪرپٽ", placeholder: "ڪجهه ڳالهايو...", response: "جواب", defaultResponse: "ڳالهائڻ सुरू ڪريو..." },
    "ks-IN": { title: "مایا", subtitle: "تُہند کثیر لسانی سرکاری معاون", listening: "سونان چھس...", thinking: "سوچان چھس...", ready: "تیار", transcript: "لائیو ٹرانسکرپٹ", placeholder: "کُجھ वनीव...", response: "جواب", defaultResponse: "شुरू करिव वनाุน..." }
  };

  const [languageSelected, setLanguageSelected] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [intent, setIntent] = useState("");
  const [suggestedPage, setSuggestedPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const silentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const isProcessing = useRef(false);

  // 1. Autoplay Enforcer Block
  const playSystemWelcomeSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    const introText = "Welcome to JanMitra AI. For English press 1. हिंदी के लिए 2 दबाएं।";
    const utterance = new SpeechSynthesisUtterance(introText);
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    const handleInitialClick = () => {
      if (!hasInteracted && !languageSelected) {
        setHasInteracted(true);
        playSystemWelcomeSpeech();
      }
      window.removeEventListener("click", handleInitialClick);
    };
    window.addEventListener("click", handleInitialClick);
    return () => window.removeEventListener("click", handleInitialClick);
  }, [hasInteracted, languageSelected, playSystemWelcomeSpeech]);

  // 2. Continuous Voice Pipeline Loop
  const startConversationalEngine = async () => {
    if (currentAudioRef.current) currentAudioRef.current.pause();
    setMessage("");
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioAnalyserRef.current = analyser;

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.start(100);
      setListening(true);

      let lastVocalActivity = Date.now();
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const inspectAudioWaves = () => {
        if (!analyser || isProcessing.current) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const currentAmplitude = sum / bufferLength;

        if (currentAmplitude > 12) {
          lastVocalActivity = Date.now();
        } else {
          const absoluteSilenceDuration = Date.now() - lastVocalActivity;
          if (absoluteSilenceDuration > 4500) {
            isProcessing.current = true;
            stopListeningAndSubmitData();
            return;
          }
        }
        if (recorder.state === "recording") {
          requestAnimationFrame(inspectAudioWaves);
        }
      };

      isProcessing.current = false;
      requestAnimationFrame(inspectAudioWaves);

    } catch (error) {
      console.error("Microphone device block access error:", error);
    }
  };

  const stopListeningAndSubmitData = async () => {
    setListening(false);
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    recorder.onstop = async () => {
      try {
        setLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        const formData = new FormData();
        formData.append("audio", new File([audioBlob], "voice.webm", { type: "audio/webm" }));
        formData.append("language", language);

        const sttResponse = await fetch("/api/stt", { method: "POST", body: formData });
        const sttData = await sttResponse.json();
        const transcriptText = sttData.transcript || "";

        if (!transcriptText.trim()) {
          setLoading(false);
          startConversationalEngine();
          return;
        }

        setMessage(transcriptText);

        const chatResponse = await axios.post("/api/chat", { message: transcriptText, language });
        const aiReply = chatResponse.data.reply;
        const aiIntent = chatResponse.data.intent;

        setReply(aiReply);
        setIntent(aiIntent);

        const routeMap: Record<string, string> = {
          schemes: "/ask-ai",
          complaints: "/complaints",
          documents: "/documents"
        };
        setSuggestedPage(routeMap[aiIntent] || "");

        const ttsResponse = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: aiReply, languageCode: language }),
        });
        const ttsData = await ttsResponse.json();

        if (ttsData.audios?.[0]) {
          const cleanedBase64 = ttsData.audios[0].replace(/\s/g, "");
          const audio = new Audio(`data:audio/wav;base64,${cleanedBase64}`);
          currentAudioRef.current = audio;
          audio.onended = () => startConversationalEngine();
          await audio.play();
        } else {
          startConversationalEngine();
        }

      } catch (err) {
        console.error("Voice matrix loop processing error:", err);
        startConversationalEngine();
      } finally {
        setLoading(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    };

    recorder.stop();
  };

  // 3. Localized Confirmation Greetings Player
  const triggerLocalizedGreetingConfirmation = async (selectedLang: string) => {
    window.speechSynthesis.cancel();
    
    const greetings: Record<string, string> = {
      "en-US": "English language activated. Maya is listening. Please ask your question now.",
      "hi-IN": "जी हाँ, आपकी हिंदी भाषा सेट हो चुकी है। माया सक्रिय है, कृपया अपना प्रश्न पूछिए।",
      "bn-IN": "বাংলা ভাষা সেট করা হয়েছে। মায়া সক্রিয় আছে, আপনার প্রশ্ন জিজ্ঞাসা করুন।"
    };

    try {
      const response = await axios.post("/api/tts", {
        text: greetings[selectedLang] || "Language activated",
        languageCode: selectedLang
      });

      if (response.data.audios?.[0]) {
        const cleanedBase64 = response.data.audios[0].replace(/\s/g, "");
        const audio = new Audio(`data:audio/wav;base64,${cleanedBase64}`);
        currentAudioRef.current = audio;
        audio.onended = () => startConversationalEngine();
        await audio.play();
      } else {
        startConversationalEngine();
      }
    } catch (err) {
      startConversationalEngine();
    }
  };

  const handleLanguageSelect = (langValue: string) => {
    setLanguage(langValue);
    setLanguageSelected(true);
    triggerLocalizedGreetingConfirmation(langValue);
  };

  const forceStopAllStreams = () => {
    setListening(false);
    
    if (silentTimerRef.current) {
      clearTimeout(silentTimerRef.current);
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setLanguageSelected(false);
    setMessage("");
    setReply("");
    setIntent("");
    setSuggestedPage("");
  };

  const activeUI = uiText[language] || uiText["en-US"];

  if (!languageSelected) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6 font-sans">
        <div className="max-w-5xl w-full rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-2xl shadow-2xl relative z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <h1 className="text-4xl md:text-5xl font-black text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            🇮🇳 JanMitra AI
          </h1>
          <p className="text-center text-gray-400 mt-4 text-sm md:text-base">
            {!hasInteracted ? "Click anywhere to activate welcome context audio loop." : "Select your regional assistant core card module below."}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageSelect(lang.value)}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-left hover:bg-purple-600/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <div className="text-sm font-mono text-white/20 group-hover:text-purple-400 font-bold transition-colors absolute top-4 right-4">
                  {String(lang.id).padStart(2, "0")}
                </div>
                <div className="text-xl font-bold text-neutral-200 group-hover:text-white transition-colors">
                  {lang.label}
                </div>
                <div className="text-xs text-neutral-500 mt-1">JanMitra Engine Core</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden font-sans">
      <section className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8 relative z-10">
        
        {/* Header Console Metrics */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl flex items-center justify-between shadow-xl">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
              {activeUI.title}
            </h1>
            <p className="text-gray-400 mt-2 text-sm">{activeUI.subtitle}</p>
          </div>
          <button
            onClick={forceStopAllStreams}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 transition-all text-xs font-semibold"
          >
            <ArrowLeft size={14} /> Reset Platform Parameters
          </button>
        </div>

        {/* Main Voice Space Area Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 rounded-[40px] border border-white/10 bg-white/5 min-h-[520px] relative overflow-hidden flex flex-col items-center justify-center shadow-2xl">
            <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

            {/* Glowing Interactive Visual Light Orb Vector */}
            <motion.div
              animate={{
                scale: listening ? [1, 1.12, 0.98, 1.04, 1] : 1,
                boxShadow: listening ? "0 0 50px rgba(244,63,94,0.2)" : "0 0 30px rgba(147,51,234,0.05)"
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`relative z-10 w-60 h-52 rounded-full flex items-center justify-center border transition-all duration-500 ${
                listening ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-purple-500/5 border-purple-500/20 text-purple-400"
              }`}
            >
              <Mic size={48} className={listening ? "animate-pulse" : ""} />
            </motion.div>

            <div className="relative z-20 mt-8 text-center">
              <p className={`text-sm font-mono tracking-widest uppercase ${listening ? "text-rose-400" : loading ? "text-purple-400" : "text-neutral-500"}`}>
                {listening ? activeUI.listening : loading ? activeUI.thinking : activeUI.ready}
              </p>
            </div>
          </div>

          {/* Right Text Feedback Console Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 flex flex-col gap-3 shadow-lg">
              <span className="text-xs uppercase tracking-widest font-mono text-purple-400 font-bold">
                {activeUI.transcript}
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={activeUI.placeholder}
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-5 outline-none text-xl min-h-[160px] custom-scrollbar text-white resize-none"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 flex flex-col gap-4 shadow-lg relative overflow-hidden">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold">
                {activeUI.response}
              </span>
              <p className="text-base text-neutral-200 leading-relaxed min-h-[140px] whitespace-pre-line font-sans">
                {reply || activeUI.defaultResponse || "Awaiting conversational triggers..."}
              </p>

              {suggestedPage && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                  <a
                    href={suggestedPage}
                    className="flex items-center justify-center w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-sm tracking-wide text-center hover:opacity-90 transition-all shadow-md shadow-purple-950/20"
                  >
                    {openServiceText[language] || "Open Platform Service Module"}
                  </a>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
