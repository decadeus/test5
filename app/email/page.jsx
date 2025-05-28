'use client'
import { useState } from "react";

export default function EmailProspectButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

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
            email: "prospect@email.com",
            name: "Monsieur Dupont",
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
      setStatus("❌ Erreur réseau");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
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