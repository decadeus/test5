import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const DualLayerFadeSection = () => {
  const [activeCard, setActiveCard] = useState(0);
  const t = useTranslations("DualLayer");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
    maxWidth: "600px",
    height: "auto",
    aspectRatio: "3 / 2",
  };

  const baseCardStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    transition: "transform 1s ease, opacity 1s ease, top 1s ease",
    borderRadius: "20px",
    opacity: 0.7,
    border: "1px solid #a4a5a6",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f7f7f7",
  };

  const getCardStyle = (index) => {
    let zIndex = 1, top = "40%", transform = "scale(0.8) translateY(-90px)", opacity = 0.6;

    if (activeCard === index) {
      zIndex = 3;
      top = "50%";
      transform = "scale(1.1)";
      opacity = 1;
    } else if (activeCard === (index + 1) % 3) {
      zIndex = 2;
      top = "45%";
      transform = "scale(0.9) translateY(-60px)";
      opacity = 0.8;
    }

    return { ...baseCardStyle, top, transform, opacity, zIndex };
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <CardApartmentInfo t={t} />
      </div>
      <div style={{ ...containerStyle, marginTop: "-120px", margin: "auto" }}>
        <div style={getCardStyle(0)}><CardProjectInfo t={t} /></div>
        <div style={getCardStyle(1)}><CardSharedServices t={t} /></div>
        <div style={getCardStyle(2)}><CardPlaceholder t={t} /></div>
      </div>
    </div>
  );
};

export default DualLayerFadeSection;

// ---------------------- COMPONENTS ----------------------

const SectionHeader = ({ title }) => (
  <div className="bg-white text-gray-700 w-full p-4 text-center rounded-tl-[20px] rounded-tr-[20px]">
    {title && (
      <p className="bg-white px-3 py-2 overflow-hidden text-black rounded text-left">
        {title}
      </p>
    )}
  </div>
);

const CardProjectInfo = ({ t }) => (
  <>
    <SectionHeader title={t("projectInfo")} />
    <div className="p-4 flex gap-4">
      <div className="w-1/2 flex flex-col gap-4">
        {[
          [t("company"), t("companyValue")],
          [t("projectName"), t("projectNameValue")],
          [t("city"), t("cityValue")],
          [t("currency"), t("currencyValue")]
        ].map(([label, value], i) => (
          <div key={i}>
            <p className="text-xs sm:text-sm md:text-base">{label}</p>
            <p className="w-full bg-white h-8 border px-2 flex items-center text-xs sm:text-sm md:text-base">{value}</p>
          </div>
        ))}
      </div>
      <div className="w-1/2 flex flex-col gap-4">
        {[
          [t("latitude"), t("latitudeValue")],
          [t("longitude"), t("longitudeValue")],
          ["", ""],
          ["", ""]
        ].map(([label, value], i) => (
          <div key={i}>
            <p className="text-xs sm:text-sm md:text-base">{label}</p>
            <p className="w-full bg-white h-8 border px-2 flex items-center text-xs sm:text-sm md:text-base">{value}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);

const CardSharedServices = ({ t }) => {
  const services = [
    [t("garden"), false],
    [t("reception"), true],
    [t("bikeParking"), true],
    [t("childArea"), false],
    [t("disabledAccess"), true],
    [t("fitnessRoom"), true],
    [t("cctv"), true],
    [t("swimmingPool"), false]
  ];

  return (
    <>
      <SectionHeader title={t("sharedServices")} />
      <div className="flex justify-center items-start w-full pl-12 pt-8">
        {[0, 1, 2].map((col) => (
          <div key={col} className="flex flex-col gap-6 w-1/3">
            {services.slice(col * 3, col * 3 + 3).map(([name, enabled], i) => (
              <div key={i}>
                <p className="text-xs sm:text-sm md:text-base">{name}</p>
                <div className={`w-9 h-5 rounded-full relative ${enabled ? "bg-blue-500" : "bg-gray-300"}`}>
                  <div
                    className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 ${enabled ? "left-[18px]" : "left-0.5"} transition-all`}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

const CardPlaceholder = ({ t }) => (
  <>
    <SectionHeader title={t("collaborators")} />
    <div className="p-4 overflow-auto max-h-[340px]">
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("name")}</th>
            <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("role")}</th>
            <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("access")}</th>
          </tr>
        </thead>
        <tbody>
          {[
            [t("sophie"), t("commercial"), t("solar")],
            [t("jean"), t("chef"), t("vistula")],
            [t("anna"), t("marketing"), t("all")]
          ].map(([nom, role, acces], idx) => (
            <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50" : ""}>
              <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{nom}</td>
              <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{role}</td>
              <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{acces}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

const CardApartmentInfo = ({ t }) => {
  const apartments = [
    { type: "A45T6", surface: "45 m²", etage: "1", chambres: "1", prix: "420 000 PLN", commentaire: t("achat") },
    { type: "B46T4", surface: "62 m²", etage: "3", chambres: "2", prix: "540 000 PLN", commentaire: t("famille") },
    { type: "B32B9", surface: "78 m²", etage: "5", chambres: "3", prix: "680 000 PLN", commentaire: t("vue") },
  ];

  return (
    <>
      <SectionHeader />
      <div className="p-4 overflow-auto max-h-[340px] w-full">
        <table className="w-full table-fixed border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("reference")}</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("surface")}</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("etage")}</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("chambres")}</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("prix")}</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-xs sm:text-sm md:text-base">{t("commentaire")}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50 hover:bg-blue-100 cursor-pointer transition">
              <td colSpan={6} className="text-center py-3 text-blue-600 font-medium text-xs sm:text-sm md:text-base">
                {t("addNewApartment")}
              </td>
            </tr>
            {apartments.map((apt, idx) => (
              <tr key={idx} className={idx % 2 === 1 ? "bg-gray-50/80" : "bg-gray-200/80"}>
                <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{apt.type}</td>
                <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{apt.surface}</td>
                <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{apt.etage}</td>
                <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{apt.chambres}</td>
                <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{apt.prix}</td>
                <td className="border border-gray-300 px-4 py-2 text-xs sm:text-sm md:text-base">{apt.commentaire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
