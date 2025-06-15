import { useState, useEffect } from "react";
import { FaUser, FaRegFileAlt, FaLock } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function ManageSection({ subtitle, paragraphe }) {
  const t = useTranslations("ManageSection");
  const [orbitAngle, setOrbitAngle] = useState(0);

  const ICONS = [
    // Cercle extérieur (purple)
    {
      icon: <FaUser size={32} color="purple" />,
      label: t("collaboratorA"),
      angle: 0,
      radius: 36,
      color: "purple",
    },
    {
      icon: <FaRegFileAlt size={32} color="purple" />,
      label: t("projectA"),
      angle: 180,
      radius: 36,
      color: "purple",
    },
    // Cercle intermédiaire (blue)
    {
      icon: <FaUser size={32} color="blue" />,
      label: t("collaboratorB"),
      angle: 100,
      radius: 29,
      color: "blue",
    },
    {
      icon: <FaRegFileAlt size={32} color="blue" />,
      label: t("projectB"),
      angle: 270,
      radius: 29,
      color: "blue",
    },
    // Cercle intérieur (red)
    {
      icon: <FaUser size={32} color="red" />,
      label: t("collaboratorC"),
      angle: 45,
      radius: 19,
      color: "red",
    },
    {
      icon: <FaRegFileAlt size={32} color="red" />,
      label: t("projectC"),
      angle: 225,
      radius: 19,
      color: "red",
    },
  ];

  useEffect(() => {
    let frame;
    const animate = () => {
      setOrbitAngle((a) => (a + 0.1) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto h-fit mt-8 sm:mt-12 mb-16 sm:mb-32 gap-8 px-4 sm:px-6 md:px-8">
      <div className="text-black text-lg sm:text-xl w-full md:w-1/2 bg-transparent z-30 backdrop-blur-sm">
        <h3 className={subtitle}>{t("title")}</h3>
        <p className={paragraphe}>
          {t("description")}
        </p>
      </div>
      <div className="relative w-full md:w-1/2 aspect-square -mt-16 sm:-mt-24 md:-mt-32">
        {/* Cercles concentriques */}
        {[75, 58, 40].map((percent, idx) => (
          <div
            key={idx}
            className="absolute border border-blue-200/30 rounded-full"
            style={{
              width: `${percent}%`,
              height: `${percent}%`,
              top: `${(100 - percent) / 2}%`,
              left: `${(100 - percent) / 2}%`,
            }}
          />
        ))}

        {/* Icône centrale */}
        <div
          className="absolute left-1/2 top-1/2 z-10 bg-green-700 text-white rounded-full p-4 sm:p-6"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <FaLock size={32} className="sm:w-12 sm:h-12" />
        </div>

        {/* Animation orbitale des icônes autour du centre */}
        <div className="absolute inset-0">
          {ICONS.map(({ icon, label, angle, radius, color }, idx) => {
            const animatedAngle = angle + orbitAngle;
            const rad = (animatedAngle * Math.PI) / 180;
            const x = 50 + radius * Math.cos(rad);
            const y = 50 + radius * Math.sin(rad);
            let labelColor = undefined;
            if (color === "purple") labelColor = "#663399";
            else if (color === "blue") labelColor = "#3b82f6";
            else if (color === "red") labelColor = "#dc2626";
            return (
              <div
                key={idx}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                    marginBottom: 4,
                  }}
                  className="sm:w-12 sm:h-12"
                >
                  {icon}
                </span>
                <p
                  className="text-[10px] sm:text-xs"
                  style={labelColor ? { color: labelColor } : {}}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 