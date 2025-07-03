"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
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

const BOT_AVATAR = (
  <div style={{
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2563eb 60%, #6366f1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
    boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
  }}>
    <span role="img" aria-label="bot">🤖</span>
  </div>
);

const USER_AVATAR = (
  <img
    src="https://randomuser.me/api/portraits/men/32.jpg"
    alt="user avatar"
    style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
  />
);

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
  }

  return (
    <>
      {/* Bouton flottant pour ouvrir/fermer le chat */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: 28,
          cursor: "pointer",
        }}
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {open ? "×" : "💬"}
      </button>

      {/* Fenêtre de chat flottante */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 32,
            width: 370,
            maxWidth: "95vw",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(37,99,235,0.18)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          {/* Header stylé */}
          <div style={{
            background: "linear-gradient(90deg, #2563eb 60%, #6366f1 100%)",
            color: "white",
            padding: "16px 20px 14px 20px",
            fontWeight: 700,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderBottom: "1px solid #e5e7eb"
          }}>
            <span style={{ fontSize: 22, background: "#fff", borderRadius: "50%", padding: 4, color: "#2563eb" }}>💬</span>
            AI ChatBot
          </div>
          <div
            style={{
              minHeight: 120,
              maxHeight: 340,
              overflowY: "auto",
              padding: 18,
              background: "#f6f8fa",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Champ email optionnel affiché en haut */}
            <form
              onSubmit={e => e.preventDefault()}
              style={{ marginBottom: 8, display: "flex", flexDirection: "column", gap: 4 }}
            >
              <div style={{
                background: "#eef2ff",
                color: "#3730a3",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 13,
                marginBottom: 4,
              }}>
                <strong>Pourquoi indiquer votre email&nbsp;?</strong><br />
                Pour améliorer le service, nous enregistrons les questions et réponses du chatbot <strong>uniquement si vous indiquez votre email</strong>.<br />
                Cela nous permet de prendre en compte vos suggestions, de vous recontacter si besoin, et d'assurer un meilleur suivi de vos demandes.<br />
                <em>Votre email ne sera jamais utilisé à des fins commerciales et restera confidentiel.</em>
              </div>
             
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Votre email (obligatoire pour l'enregistrement)"
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </form>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: m.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 10,
                }}
              >
                {/* Avatar */}
                {m.role === "user" ? USER_AVATAR : BOT_AVATAR}
                {/* Bulle de message */}
                <div style={{
                  background: m.role === "user"
                    ? "#fff"
                    : "linear-gradient(90deg, #2563eb 60%, #6366f1 100%)",
                  color: m.role === "user" ? "#222" : "#fff",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "12px 18px",
                  fontSize: 15,
                  boxShadow: m.role === "user"
                    ? "0 1px 4px rgba(0,0,0,0.06)"
                    : "0 2px 8px rgba(99,102,241,0.10)",
                  maxWidth: "70%",
                  position: "relative",
                  marginBottom: 2,
                  wordBreak: "break-word",
                }}>
                  {m.content}
                  {/* Badge "Answered by AI" pour le bot */}
                  {m.role === "assistant" && i !== 0 && (
                    <div style={{
                      marginTop: 8,
                      fontSize: 11,
                      color: "#e0e7ff",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}>
                      <span style={{ fontSize: 13 }}>✨</span> Answered by AI
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 10 }}>
                <Loader3D />
                <div style={{
                  background: "linear-gradient(90deg, #2563eb 60%, #6366f1 100%)",
                  color: "#fff",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 18px",
                  fontSize: 15,
                  boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
                  maxWidth: "70%",
                }}>
                  Le bot réfléchit…
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={sendMessage}
            style={{ display: "flex", gap: 8, padding: 14, borderTop: "1px solid #e5e7eb", background: "#fff" }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Posez une question ou donnez un feedback"
              style={{
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 15,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: "linear-gradient(90deg, #2563eb 60%, #6366f1 100%)",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "0 22px",
                fontWeight: 600,
                fontSize: 15,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.7 : 1,
                boxShadow: "0 1px 4px rgba(99,102,241,0.10)",
              }}
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
    </>
  );
} 