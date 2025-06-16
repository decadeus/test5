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
    <div className="w-full flex flex-col justify-center items-center my-8 sm:my-12 md:my-16 lg:my-24 mt-16 sm:mt-20 md:mt-24 lg:mt-32">
      <h2 className={subtitle}>FAQ</h2>
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-7xl space-y-4 sm:space-y-6 md:space-y-8">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="bg-white border-b border-green-700 p-3 sm:p-4 md:p-6">
            <button
              className="flex items-center w-full justify-between text-left focus:outline-none gap-4"
              onClick={() => toggle(idx)}
            >
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-green-700 break-words">
                {item.title}
              </span>
              <BsPlus
                size={24}
                color="green"
                className={`transition-transform duration-200 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0 ${open[idx] ? "rotate-45" : ""}`}
              />
            </button>
            <div
              className={`${paragraphe} faq-content mt-2 sm:mt-3 ${open[idx] ? "open" : ""}`}
              style={{
                maxHeight: open[idx] ? "1000px" : 0,
                opacity: open[idx] ? 1 : 0,
                overflow: "hidden",
                transition:
                  "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out",
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