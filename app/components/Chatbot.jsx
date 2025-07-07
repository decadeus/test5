"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from 'next-intl';
const Loader3D = dynamic(() => import("./Loader3D"), { ssr: false });

const SYSTEM_PROMPT = {
  role: "system",
  content:
    "Tu es un assistant virtuel dédié à cette webapp. Tu ne dois répondre qu'aux questions concernant le fonctionnement, l'utilisation, les bugs, les suggestions ou l'amélioration de cette webapp. Si la question n'est pas liée à la webapp, tu dois répondre poliment : 'Je suis désolé, je ne peux répondre qu'aux questions concernant ce site.'"
};

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Bonjour ! 👋 Je suis l'assistant IA de ce site. Posez-moi vos questions sur le fonctionnement, les bugs, les suggestions ou l'amélioration de cette webapp. Je ne réponds qu'aux questions concernant ce site."
};

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("utilisation");
  const t = useTranslations('chatbot');

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return
    const newMessages = [...messages, { role: "user", content: input, category }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Ajoute le message système en début de conversation
    const messagesToSend = [SYSTEM_PROMPT, ...newMessages.filter(m => m.role !== "assistant" || m === WELCOME_MESSAGE)];

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messagesToSend, email, category }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
    if (newMessages.length > 1) {
      logBotAnswer(newMessages.length - 1);
    }
  }

  // Enregistre chaque réponse du bot dans chatbot_feedback
  async function logBotAnswer(messageIndex) {
    const message = messages[messageIndex];
    if (!message) return;
    const userMessage = messages.slice(0, messageIndex).reverse().find(m => m.role === 'user');
    await fetch('/api/chatbot/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: userMessage ? userMessage.content : '',
        answer: message.content,
        email,
        category
      })
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-[1000] text-white border-none rounded-full w-18  shadow-lg text-3xl cursor-pointer flex flex-col items-center justify-center p-3"
        aria-label="Ouvrir le chat"
      >
        <img src="/chatbotImage.png" alt="Chatbot" className="w-12 h-12 object-cover rounded-full" />
        <span className="text-xs font-semibold mt-1 text-black">Chatbot</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-0 inset-x-0 w-[300px] sm:w-[380px] sm:max-w-[95vw] max-w-screen-sm mx-auto overflow-x-hidden sm:bottom-10 sm:right-10 sm:left-auto sm:inset-x-auto bg-slate-50 rounded-t-2xl sm:rounded-[32px] shadow-2xl z-[1000] flex flex-col overflow-hidden font-sans"
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        boxSizing: 'border-box',
      }}
    >
      {/* Header arrondi avec dégradé */}
      <div className="bg-gradient-to-br from-lime-300 to-green-700 px-4 pt-5 pb-3 rounded-t-2xl sm:px-8 sm:pt-7 sm:pb-4 sm:rounded-t-[32px] flex items-center justify-between min-h-[64px] sm:min-h-[80px]">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-green-100 overflow-hidden">
            <img src="/chatbotImage.png" alt="Chatbot" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-2xl text-white tracking-tight">{t('title')}</div>
            <div className="text-xs sm:text-sm text-white font-medium">{t('subtitle')}</div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="bg-white/80 border-none rounded-full w-8 h-8 sm:w-9 sm:h-9 text-black text-lg sm:text-xl cursor-pointer flex items-center justify-center shadow-sm transition"
          aria-label="Fermer le chat"
        >
          &minus;
        </button>
      </div>

      {/* Carte message bot */}
      <div className="bg-white rounded-[18px] shadow-md mt-4 mx-2 p-3 flex items-start gap-2 sm:mt-6 sm:mx-6 sm:p-5 sm:gap-3">
        <div className="w-24 sm:w-44 rounded-full flex items-center justify-center shadow-md overflow-hidden">
          <img src="/chatbotImage.png" alt="Chatbot" className="w-10 h-10 object-cover" />
        </div>
        <div>
          <div className="font-semibold text-slate-600 text-[13px] sm:text-[15px] mb-0.5">ChatBot</div>
          <div className="text-slate-900 text-[13px] sm:text-[15px]">
            {t('welcome')}
          </div>
        </div>
      </div>

      {/* Carte explication email */}
    
      {/* Zone de chat scrollable */}
      <div className="flex-1 min-h-[100px] max-h-[40vh] sm:min-h-[120px] sm:max-h-[320px] overflow-y-auto px-2 pt-3 pb-0 bg-slate-50 flex flex-col gap-2 sm:px-5 sm:pt-5 sm:gap-3 ">
        {messages && messages.map((m, i) => (
          <div
            key={i}
            className={
              (m.role === "user"
                ? "self-end bg-white  text-slate-900 rounded-[18px] rounded-br-[4px]"
                : "self-start bg-gradient-to-br from-lime-100 to-green-200 text-slate-900 rounded-[18px] rounded-bl-[4px]") +
              " px-3 py-2 text-[13px] sm:px-4 sm:py-2.5 sm:text-[15px] shadow max-w-[95%] sm:max-w-[75%] mb-0.5 break-words"
            }
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* Zone de saisie utilisateur */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage(e);
        }}
        className="flex flex-col gap-2 p-3 border-t border-gray-200 bg-white mt-2 sm:gap-2.5 sm:p-5 sm:mt-4"
      >
        {/* Sélecteur de catégorie moderne */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            onClick={() => setCategory("bug")}
            className={
              `flex items-center gap-1 px-3 py-1.5 rounded-full border transition text-sm font-medium ` +
              (category === "bug"
                ? "bg-red-100 border-red-400 text-red-700 shadow"
                : "bg-white border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300")
            }
            aria-pressed={category === "bug"}
          >
            <span className="text-base">🐞</span> Bug
          </button>
          <button
            type="button"
            onClick={() => setCategory("design")}
            className={
              `flex items-center gap-1 px-3 py-1.5 rounded-full border transition text-sm font-medium ` +
              (category === "design"
                ? "bg-blue-100 border-blue-400 text-blue-700 shadow"
                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300")
            }
            aria-pressed={category === "design"}
          >
            <span className="text-base">🎨</span> Design
          </button>
          <button
            type="button"
            onClick={() => setCategory("utilisation")}
            className={
              `flex items-center gap-1 px-3 py-1.5 rounded-full border transition text-sm font-medium ` +
              (category === "utilisation"
                ? "bg-green-100 border-green-400 text-green-700 shadow"
                : "bg-white border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300")
            }
            aria-pressed={category === "utilisation"}
          >
            <span className="text-base">🧑‍💻</span> Utilisation
          </button>
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-[13px] sm:px-3 sm:py-2.5 sm:text-[15px] outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={
              "bg-green-400 text-slate-900 border-none rounded-lg px-4 font-semibold text-[13px] shadow " +
              (!input.trim() ? "opacity-70 cursor-not-allowed" : "hover:bg-green-500 transition") +
              " sm:px-6 sm:text-[15px]"
            }
          >
            {t('send')}
          </button>
        </div>
      </form>
    </div>
  );
} 