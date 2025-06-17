import { useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { GiMagicGate } from "react-icons/gi";
import { useTranslations } from "next-intl";

// Hauteur commune pour chaque étape (barre + carte)
const BAR_HEIGHT = {
  base: 50,
  sm: 80,
  md: 120,
  lg: 180,
};

export default function Magic() {
  const t = useTranslations("Magic");
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Définir les étapes à partir des traductions
  const steps = [
    {
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      title: t("step3.title"),
      description: t("step3.description"),
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Définir les couleurs associées à chaque étape
  const stepColors = ["bg-blue-500", "bg-orange-500", "bg-green-500"];
  const iconColors = ["text-blue-500", "text-orange-500", "text-green-500"];
  const iconComponents = [GiMagicGate, MdEmail, FaCheckCircle];

  return (
    <div
      className="w-full px-4 sm:px-6 lg:px-12 py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Barres du haut alignées */}
      <div className="hidden lg:grid grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mb-2 place-items-center">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-full max-w-[320px] rounded-full transition-colors duration-500 ${
              idx <= activeStep ? stepColors[idx] : "bg-gray-200"
            }`}
            style={{ minWidth: 220 }}
          ></div>
        ))}
      </div>
      {/* Mobile: barres individuelles */}
      <div className="lg:hidden flex flex-col gap-8 mb-2">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-full max-w-[320px] rounded-full mx-auto transition-colors duration-500 ${
              idx <= activeStep ? stepColors[idx] : "bg-gray-200"
            }`}
            style={{ minWidth: 220 }}
          ></div>
        ))}
      </div>
      {/* Icônes, titres, barres du bas, descriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
        {steps.map((step, idx) => {
          const Icon = iconComponents[idx];
          return (
            <div key={idx} className="flex flex-col items-center max-w-md mx-auto">
              {/* Icône */}
              <div className="mb-2 flex items-center justify-center">
                <Icon
                  className={idx <= activeStep ? iconColors[idx] : "text-gray-300"}
                  size={32}
                  aria-hidden="true"
                />
              </div>
              {/* Titre */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-center mb-2 text-gray-900">
                {steps[idx].title}
              </h3>
              {/* Barre horizontale sous le titre */}
              <div
                className={`h-2 w-full max-w-[320px] rounded-full my-6 transition-colors duration-500 ${
                  idx <= activeStep ? stepColors[idx] : "bg-gray-200"
                }`}
                style={{ minWidth: 220 }}
              ></div>
              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 text-center">
                {steps[idx].description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
