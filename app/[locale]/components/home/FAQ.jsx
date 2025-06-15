import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { useTranslations } from "next-intl";

export default function FAQ({ subtitle, paragraphe }) {
  const t = useTranslations("FAQ");
  const FAQ_ITEMS = [
 
    {
      title: t("FAQ_MagicLink"),
      content: t("FAQ_MagicLink_Answer"),
    },
    {
      title: t("FAQ_Collaborateurs"),
      content: t("FAQ_Collaborateurs_Answer"),
    },
    {
      title: t("FAQ_Abonnement"),
      content: t("FAQ_Abonnement_Answer"),
    },
    {
      title: t("FAQ_Pourcentage"),
      content: t("FAQ_Pourcentage_Answer"),
    }
  ];

  const [open, setOpen] = useState(Array(FAQ_ITEMS.length).fill(false));
  const toggle = (idx) => setOpen((o) => o.map((v, i) => (i === idx ? !v : v)));

  return (
    <div className="max-w-7xl mx-auto my-8 sm:my-12 mt-16 sm:mt-24 flex flex-col justify-center items-center px-4 sm:px-6">
      <h2 className={subtitle}>FAQ</h2>
      <div className="w-full space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="bg-white border-b border-green-700 p-3 sm:p-4">
            <button
              className="flex items-center w-full justify-between text-left focus:outline-none"
              onClick={() => toggle(idx)}
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-green-700">
                {item.title}
              </span>
              <BsPlus
                size={30}
                color="green"
                className={`transition-transform duration-200 ${open[idx] ? "rotate-45" : ""}`}
              />
            </button>
            <div
              className={`${paragraphe} faq-content mt-2 sm:mt-3 ${open[idx] ? "open" : ""}`}
              style={{
                maxHeight: open[idx] ? 200 : 0,
                opacity: open[idx] ? 1 : 0,
                overflow: "hidden",
                transition:
                  "max-height 0.8s cubic-bezier(.4,2,.6,1), opacity 0.4s",
              }}
            >
              {item.content}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .faq-content {
          will-change: max-height, opacity;
        }
      `}</style>
    </div>
  );
} 