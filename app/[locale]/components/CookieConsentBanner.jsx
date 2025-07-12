"use client";
import { useEffect, useState } from "react";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Vérifie si le consentement a déjà été donné
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
      // Par défaut, refuser le consentement tant que l'utilisateur n'a pas choisi
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag('consent', 'default', { analytics_storage: 'denied' });
      }
    }
  }, []);

  const handleConsent = (granted) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    }
    localStorage.setItem("cookie_consent", granted ? "granted" : "denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 flex flex-col md:flex-row items-center justify-between px-4 py-3 text-sm">
      <span className="mb-2 md:mb-0 text-gray-700">
        Ce site utilise des cookies pour la mesure d'audience (Google Analytics). Vous pouvez accepter ou refuser.
      </span>
      <div className="flex gap-2">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => handleConsent(true)}
        >
          Accepter
        </button>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          onClick={() => handleConsent(false)}
        >
          Refuser
        </button>
      </div>
    </div>
  );
} 