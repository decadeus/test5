'use client'
import { useState } from "react";

export default function EmailProspectButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("hoomge@decadeus.com");
  const [name, setName] = useState("Monsieur Dupont");

  const handleSendEmail = async () => {
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(
        "https://igoqwthxpjrnflhpkil.supabase.co/functions/v1/resend-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            name: name,
          }),
        }
      );

      if (response.ok) {
        setStatus("✅ Email envoyé !");
      } else {
        const errorText = await response.text();
        setStatus(`❌ Erreur : ${errorText}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus(`❌ Erreur réseau: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Entrez votre email"
        className="px-4 py-2 border rounded-lg"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Entrez votre nom"
        className="px-4 py-2 border rounded-lg"
      />
      <button
        onClick={handleSendEmail}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-white font-semibold ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Envoi..." : "Envoyer l'email de test"}
      </button>
      {status && <p className="text-sm text-gray-800">{status}</p>}
    </div>
  );
}