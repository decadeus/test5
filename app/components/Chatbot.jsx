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
  const t = useTranslations('chatbot');

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Ajoute le message système en début de conversation
    const messagesToSend = [SYSTEM_PROMPT, ...newMessages.filter(m => m.role !== "assistant" || m === WELCOME_MESSAGE)];

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messagesToSend, email }),
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
        email
      })
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-[1000] bg-green-600 text-white border-none rounded-full w-14 h-14 shadow-lg text-3xl cursor-pointer flex items-center justify-center"
        aria-label="Ouvrir le chat"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full max-w-full sm:bottom-10 sm:right-10 sm:w-[380px] sm:max-w-[95vw] bg-slate-50 rounded-t-2xl sm:rounded-[32px] shadow-2xl z-[1000] flex flex-col overflow-hidden font-sans">
      {/* Header arrondi avec dégradé */}
      <div className="bg-gradient-to-br from-lime-300 to-green-700 px-4 pt-5 pb-3 rounded-t-2xl sm:px-8 sm:pt-7 sm:pb-4 sm:rounded-t-[32px] flex items-center justify-between min-h-[64px] sm:min-h-[80px]">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-green-100">
            <span className="text-lg sm:text-2xl">💬</span>
          </div>
          <div>
            <div className="font-extrabold text-lg sm:text-2xl text-white tracking-tight">{t('title')}</div>
            <div className="text-xs sm:text-sm text-white font-medium">{t('subtitle')}</div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="bg-white/80 border-none rounded-full w-8 h-8 sm:w-9 sm:h-9 text-green-400 text-lg sm:text-xl cursor-pointer flex items-center justify-center shadow-sm transition"
          aria-label="Fermer le chat"
        >
          &minus;
        </button>
      </div>

      {/* Carte message bot */}
      <div className="bg-white rounded-[18px] shadow-md mt-4 mx-2 p-3 flex items-start gap-2 sm:mt-6 sm:mx-6 sm:p-5 sm:gap-3">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-lime-300 flex items-center justify-center shadow-md overflow-hidden">
          <span role="img" aria-label="bot" className="text-lg sm:text-2xl leading-none">🤖</span>
        </div>
        <div>
          <div className="font-semibold text-slate-600 text-[13px] sm:text-[15px] mb-0.5">ChatBot</div>
          <div className="text-slate-900 text-[13px] sm:text-[15px]">
            {t('welcome')}
          </div>
        </div>
      </div>

      {/* Carte explication email */}
      <div className="bg-white rounded-[18px] shadow-md mt-4 mx-2 p-3 flex items-start gap-2 sm:mt-6 sm:mx-6 sm:p-5 sm:gap-3">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-green-700 flex items-center justify-center shadow-md overflow-hidden">
          <span role="img" aria-label="bot" className="text-lg sm:text-2xl leading-none">✉️</span>
        </div>
        <div>
          <div className="font-semibold text-gray-700 text-[13px] sm:text-[15px] mb-0.5">{t('emailWhy')}</div>
          <div className="text-slate-900 text-[13px] sm:text-[15px]">
            {t('emailExplain')}
          </div>
        </div>
      </div>

      {/* Champ email au-dessus de la zone de saisie */}
      <div className="px-2 pt-2 pb-0 mt-2 sm:px-5">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="w-full border border-gray-500 rounded-lg px-2 py-2 text-[13px] sm:px-3 sm:py-2 sm:text-[15px] outline-none bg-slate-50"
        />
      </div>

      {/* Zone de chat scrollable */}
      <div className="flex-1 min-h-[100px] max-h-[40vh] sm:min-h-[120px] sm:max-h-[320px] overflow-y-auto px-2 pt-3 pb-0 bg-slate-50 flex flex-col gap-2 sm:px-5 sm:pt-5 sm:gap-3">
        {messages && messages.map((m, i) => (
          <div
            key={i}
            className={
              (m.role === "user"
                ? "self-end bg-gradient-to-br from-lime-100 to-green-200 text-slate-900 rounded-[18px] rounded-br-[4px]"
                : "self-start bg-white text-slate-900 rounded-[18px] rounded-bl-[4px]") +
              " px-3 py-2 text-[13px] sm:px-4 sm:py-2.5 sm:text-[15px] shadow max-w-[85%] sm:max-w-[75%] mb-0.5 break-words"
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
        className="flex gap-2 p-3 border-t border-gray-200 bg-white mt-2 sm:gap-2.5 sm:p-5 sm:mt-4"
      >
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
      </form>
    </div>
  );
} 