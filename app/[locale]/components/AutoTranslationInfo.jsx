import { useTranslations } from "next-intl";
import { FaGlobe } from "react-icons/fa";

export default function AutoTranslationInfo() {
  const t = useTranslations("Promoteur");
  // Classes harmonisées avec la page promoteur
  const subtitle = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold w-full lg:w-[620px] text-left leading-tight pb-8 sm:pb-12 md:pb-16 lg:pb-20";
  const paragraphe = "text-base sm:text-lg md:text-xl lg:text-2xl font-normal pb-4 sm:pb-6 md:pb-8";

  return (
    <section className="w-full flex flex-col items-center justify-center my-12 sm:my-16 md:my-20 lg:mb-24">
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-4xl bg-white border border-green-700 shadow-md rounded-2xl px-6 sm:px-10 py-8 flex flex-col gap-4">
        <div className="flex items-center gap-4 mb-2">
          <FaGlobe size={36} className="text-green-700 flex-shrink-0" />
          <h2 className={subtitle} style={{paddingBottom:0}}>
            {t("autoTranslationTitle", { defaultMessage: "Internationalisation automatique" })}
          </h2>
        </div>
        <div className={paragraphe}>
          {t("autoTranslationInfoLong", {
            defaultMessage:
              "Pour faciliter la recherche d'appartements par des utilisateurs du monde entier, tous les éléments ajoutés par les promoteurs (titres, descriptions, équipements, etc.) sont automatiquement traduits dans plusieurs langues.\nCette fonctionnalité permet à chaque projet d'être visible et compréhensible par un public international, notamment dans les moteurs de recherche, sans effort supplémentaire de la part des promoteurs.\nCela constitue également un atout pour attirer des investisseurs potentiels à l'international."
          })}
        </div>
      </div>
    </section>
  );
} 