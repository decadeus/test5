"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { IoSearch, IoIosArrowDown } from "react-icons/io5";
import Loading from "./loading";
import Lp1Component from "@/app/[locale]/component/lp1";
import SubscribeButton from "@/app/[locale]/components/SubscribeButton";
import Image from "next/image";
import {
  SiSafari,
  SiGooglechrome,
  SiFirefoxbrowser,
  SiOpera,
} from "react-icons/si";
import {
  FaEdge,
  FaLongArrowAltDown,
  FaAndroid,
  FaApple,
  FaRegHandPointer,
  FaRegEnvelope,
  FaLock,
  FaUser,
  FaRegFileAlt,
  FaWaveSquare,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdSmartphone } from "react-icons/md";
import { LuHand } from "react-icons/lu";
import { BsHandIndexFill, BsPlus } from "react-icons/bs";

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [fetchProjectsA, setFetchProjectsA] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("Polska");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDownloadIOS, setShowDownloadIOS] = useState(false);
  const [showDownloadAndroid, setShowDownloadAndroid] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname ? pathname.split("/")[1] : "en";
  const t = useTranslations("Homepage");

  const subtitle = "text-5xl font-bold w-[620px] text-left leading-tight pb-20";
  const paragraphe = "text-2xl font-normal pb-8";
  const MIN_LOADING_TIME = 1000;

  const fetchProjects = async () => {
    const startTime = Date.now();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .select("*, compagny, ide, projectlist(ide, id)")
      .eq("country", selectedCountry);
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(MIN_LOADING_TIME - elapsedTime, 0);
    setTimeout(() => {
      if (!error) setProjects(data);
      setLoading(false);
    }, remainingTime);
  };

  const fetchSearchProjects = async () => {
    setLoading(true);
    const supabase = createClient(
      "https://your-supabase-url",
      "your-supabase-key"
    );
    try {
      const { data, error } = await supabase
        .from("project")
        .select("id, name, city, country");
      if (!error) setFetchProjectsA(data || []);
    } catch (err) {
      console.error("Erreur inattendue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchProjects();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedCountry]);

  const totalApartments = projects.reduce((acc, project) => {
    if (Array.isArray(project.projectlist)) {
      return acc + project.projectlist.length;
    }
    return acc;
  }, 0);

  const uniqueCompanies = new Set(projects.map((project) => project.compagny));
  const uniqueIdeas = new Set(projects.map((project) => project.ide));

  if (loading) return <Loading />;

  return (
    <>
      {/* Bloc fixe à gauche avec IOS, flèche et Android */}
      <div
        className="fixed left-0 top-1/2 z-50 flex flex-col items-center gap-6 "
        style={{
          transform: "translateY(-50%)",
          paddingLeft: "8px",
        }}
      >
        <DownloadCircle
          icon={<FaAndroid size={32} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=random.android.app"
          color="#3DDC84"
          label="Android"
        />
        <DownloadCircle
          icon={<FaApple size={32} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com/app/id1234567890"
          color="#222"
          label="iOS"
        />
      </div>

      <IntroSection
        t={t}
        uniqueCompanies={uniqueCompanies}
        uniqueIdeas={uniqueIdeas}
        totalApartments={totalApartments}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        fetchProjectsA={fetchProjectsA}
        loading={loading}
        router={router}
        locale={locale}
      />
      <div className="max-w-7xl mx-auto">
        <style jsx>{`
          .letter {
            display: inline-block;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
        `}</style>
        <SEO subtitle={subtitle} paragraphe={paragraphe} />
        <div className="relative h-[2000px]">
          <ProjetSection subtitle={subtitle} paragraphe={paragraphe} />
          <div className="h-[2000px]"></div>
        </div>
        <Appartement subtitle={subtitle} paragraphe={paragraphe} />
        <ManageSection subtitle={subtitle} paragraphe={paragraphe} />
        <Magic />

        <FAQ subtitle={subtitle} paragraphe={paragraphe} />
  
      
          <SubscribeButton subtitle={subtitle} paragraphe={paragraphe} />
      
      </div>
    </>
  );
}

function IntroSection({
  t,
  uniqueCompanies,
  uniqueIdeas,
  totalApartments,
  searchTerm,
  setSearchTerm,
  fetchProjectsA,
  loading,
  router,
  locale,
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <link rel="preload" href="/buildwhite.jpg" as="image" />
      <div className="relative overflow-hidden w-full pb-10">
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollPosition * 0.4}px)`,
            transition: "none",
            backgroundImage: "url(/home.png)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute inset-0 bg-white/70 z-10" />
        <div className="relative z-20 flex flex-col justify-between px-4 text-black">
          <div className="flex flex-col items-center gap-6 mt-16 sm:mt-24 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold max-w-3xl leading-tight">
              {t("title")}
            </h1>
            <p className="text-xl sm:text-2xl">{t("subtitle")}</p>
          </div>

          <div className="w-full flex justify-center pt-24">
            <div className="w-fit border-black border-2 rounded-3xl relative z-40 p-2 bg-white ">
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="Piaseczno, Warsaw, ..."
                  className="w-full h-12 px-6 rounded-full border border-black text-lg font-semibold pr-10 text-black placeholder:text-black outline-none"
                  style={{ background: 'yellow' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearch
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
                />
                {searchTerm.length > 0 && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => setSearchTerm("")}
                  >
                    ✖
                  </button>
                )}
              </div>
              {!loading && searchTerm.length >= 2 && (
                <ul className="bg-white">
                  {Array.from(
                    new Map(
                      fetchProjectsA
                        .filter((project) =>
                          project.city
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((project) => [
                          project.city.toLowerCase(),
                          {
                            city: project.city,
                            country: project.country || "N/A",
                          },
                        ])
                    ).values()
                  ).map(({ city, country }, index) => {
                    const regex = new RegExp(`(${searchTerm})`, "gi");
                    const highlightedText = city.split(regex).map((part, i) =>
                      part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <strong key={i} className="text-red-500">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    );
                    return (
                      <li
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                        onClick={() => {
                          setSearchTerm(city);
                          localStorage.setItem("selectedCity", city);
                          localStorage.setItem("selectedCountry", country);
                          setTimeout(() => {
                            router.push(`/${locale}/projects`);
                          }, 500);
                        }}
                      >
                        <span>{highlightedText}</span>
                        <span className="text-gray-500 ml-2">{country}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Appartement({ subtitle, paragraphe }) {
  const columns = [
    { key: "ref", label: "Ref", className: "min-w-[80px] w-[90px]" },
    { key: "chambres", label: "Chambres", className: "min-w-[90px] w-[100px]" },
    { key: "prix", label: "Prix", className: "min-w-[120px] w-[130px]" },
    {
      key: "surface",
      label: "Surface",
      className: "min-w-[90px] w-[100px] ml-4",
    },
    { key: "etage", label: "Étage", className: "min-w-[80px] w-[90px] ml-4" },
    {
      key: "jardin",
      label: "Jardin",
      className: "min-w-[30px] w-[100px] ml-4",
    },
    {
      key: "commentaire",
      label: "Commentaire",
      className: "min-w-[120px] w-[130px] ml-4",
    },
  ];

  const appartements = [
    {
      ref: "APT-001",
      chambres: 3,
      prix: "350 000 €",
      surface: "78 m²",
      etage: 2,
      jardin: true,
      commentaire: "",
    },
    {
      ref: "APT-002",
      chambres: 2,
      prix: "250 000 €",
      surface: "54 m²",
      etage: "RDC",
      jardin: false,
      commentaire: "Balcon",
    },
    {
      ref: "APT-003",
      chambres: 4,
      prix: "420 000 €",
      surface: "95 m²",
      etage: 3,
      jardin: true,
      commentaire: "Terrasse",
    },
    {
      ref: "APT-004",
      chambres: 1,
      prix: "180 000 €",
      surface: "32 m²",
      etage: 1,
      jardin: false,
      commentaire: "RDC",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center px-4 py-32 max-w-7xl mx-auto text-black">
      <h2 className={subtitle}>Mettez a jour la liste de vos appartements</h2>
      <div className="flex flex-row gap-10 w-full">
        <div className="flex flex-col bg-blue-500 rounded-3xl p-10 text-white w-3/4">
          <p className={paragraphe}>Gestionnaire d'appartements</p>
          <h3 className="text-4xl font-bold pb-20 w-2/3">
            Utilisez un tableau clair pour ajouter vos appartements
          </h3>
          <div className="bg-white text-black w-full max-w-4xl mx-auto shadow-lg rounded-xl p-6 pr-14 transition-transform duration-300 hover:scale-105 overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 font-bold border-b pb-2 mb-2">
              {columns.map((col) => (
                <p
                  key={col.key}
                  className={`text-center flex items-center justify-center ${col.className}`}
                >
                  {col.label}
                </p>
              ))}
            </div>
            {appartements.map((appart, idx) => (
              <div
                key={appart.ref}
                className="grid grid-cols-7 gap-2 items-center border-b py-2 hover:bg-gray-50 transition"
              >
                {columns.map((col) => (
                  <p
                    key={col.key}
                    className={`text-center flex items-center justify-center ${col.className}`}
                  >
                    {col.key === "jardin"
                      ? appart.jardin
                        ? "🌸"
                        : ""
                      : appart[col.key]}
                  </p>
                ))}
              </div>
            ))}
            <form>
              <div className="grid grid-cols-7 gap-2 items-center py-2 mt-2">
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`flex items-center justify-center ${col.className}`}
                  >
                    <input
                      className="border rounded px-2 py-1 text-center bg-gray-50 focus:bg-white focus:border-blue-400 transition w-full"
                      placeholder={col.label}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition opacity-50 cursor-not-allowed"
                  disabled
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-10 p-10 bg-blue-100 rounded-3xl text-black w-1/4 h-fit">
          <p className={paragraphe}>En temps réel</p>
          <h3 className="text-4xl font-bold leading-tight">
            Maitrissez les informations de vos appartements en temps réel
          </h3>
        </div>
      </div>
    </div>
  );
}

function SEO({ subtitle, paragraphe }) {
  const iconsRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      if (!iconsRef.current) return;
      const rect = iconsRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const parent = iconsRef.current.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const stickyStart = windowH / 2; // sticky commence à 50vh
      const stickyEnd = parentRect.bottom - 300; // sticky s'arrête quand parent sort (300 = moitié du bloc)
      let p = 0;
      if (rect.top > stickyStart) {
        p = 0;
      } else if (parentRect.bottom < stickyStart + 300) {
        p = 1;
      } else {
        // phase sticky
        const stickyHeight = parentRect.height - windowH + 600;
        const scrolled = stickyStart - rect.top;
        p = Math.min(1, Math.max(0, scrolled / stickyHeight));
      }
      setProgress(p);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fonction d'interpolation ease-in-out
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  const smoothProgress = easeInOutQuad(progress);

  // Calcul dynamique pour chaque icône
  const getStyle = (from, to) => {
    // Clamp progress pour que l'animation s'arrête à 0.5
    const localProgress = Math.min(smoothProgress * 2, 1);
    return {
      opacity: localProgress,
      transform: `translate(${from.x + (to.x - from.x) * localProgress}px, ${from.y + (to.y - from.y) * localProgress}px) scale(${0.7 + 0.3 * localProgress})`,
      transition: "opacity 0.3s, transform 0.3s",
    };
  };

  // Positions de départ (extérieur) et d'arrivée (autour de l'image)
  const positions = {
    safari: { from: { x: -180, y: 0 }, to: { x: 0, y: 0 } },
    opera: { from: { x: 180, y: 0 }, to: { x: 0, y: 0 } },
    chrome: { from: { x: -60, y: -120 }, to: { x: 80, y: -32 } },
    firefox: { from: { x: 60, y: -120 }, to: { x: 40, y: 92 } },
    edge: { from: { x: -120, y: -10 }, to: { x: 80, y: 90 } },
  };

  return (
    <div className="flex gap-10 px-4 max-w-7xl mx-auto text-black w-full py-32">
      <div className="text-black w-1/2">
        <h2 className={subtitle}>Le SEO est une priorité</h2>
        <p className={paragraphe}>
          Nous mettons l'accent sur le SEO pour que votre site soit bien
          positionné sur les moteurs de recherche
        </p>
        <p className={paragraphe}>
          Un outils IA pour vous aider a ecrire la description de votre projet,
          gerer la metadescription et title
        </p>
      </div>
      <div
        className="text-black w-1/2 flex flex-col items-center justify-center relative"
        ref={iconsRef}
        style={{ minHeight: 400 }}
      >
        <div
          className="relative w-full h-96 flex items-center justify-center text-black border-1 border-black rounded-2xl shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, #f3f4f6 0%, #fffbfb 50%, #fffbfb 100%)",
          }}
        >
          <div className="border-2 border-black rounded-2xl p-4 flex justify-center items-center gap-2">
            <p>
              <CiSearch size={28} color="gray" />
            </p>
            <p className="text-2xl font-thin text-gray-400 ">
              Recherche un appartement neuf á...
            </p>
          </div>
        </div>
        {/* Icônes animées dynamiquement */}
        <div
          className="absolute top-0 left-0 bg-[#0078D7] rounded-full shadow-lg flex items-center justify-center w-16 h-16"
          style={getStyle(positions.edge.from, positions.edge.to)}
        >
          <FaEdge title="Edge" className="text-3xl text-white" />
        </div>
        <div
          className="absolute top-1/2 left-0 bg-[#1B9AF7] rounded-full shadow-lg flex items-center justify-center w-20 h-20"
          style={getStyle(positions.safari.from, positions.safari.to)}
        >
          <SiSafari title="Safari" className="text-5xl text-white" />
        </div>
        <div
          className="absolute top-1/2 right-0 bg-[#FF1B2D] rounded-full shadow-lg flex items-center justify-center w-20 h-20"
          style={getStyle(positions.opera.from, positions.opera.to)}
        >
          <SiOpera title="Opera" className="text-4xl text-white" />
        </div>
        <div
          className="absolute left-1/4 top-0 rounded-full shadow-lg flex items-center justify-center w-24 h-24 "
          style={{
            background:
              "conic-gradient(#EA4335 0% 25%, #FBBC05 25% 50%, #34A853 50% 75%, #4285F4 75% 100%)",
            borderColor: "#EA4335",
          }}
          {...{
            style: {
              ...getStyle(positions.chrome.from, positions.chrome.to),
              background:
                "conic-gradient(#EA4335 0% 25%, #FBBC05 25% 50%, #34A853 50% 75%, #4285F4 75% 100%)",
              borderColor: "#EA4335",
            },
          }}
        >
          <SiGooglechrome title="Chrome" className="text-6xl text-white" />
        </div>
        <div
          className="absolute right-1/4 top-0 bg-[#FF7139] rounded-full shadow-lg flex items-center justify-center w-16 h-16"
          style={getStyle(positions.firefox.from, positions.firefox.to)}
        >
          <SiFirefoxbrowser title="Firefox" className="text-4xl text-white" />
        </div>
      </div>
    </div>
  );
}

function DownloadCircle({ icon, qrImg, color, label }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="focus:outline-none"
        style={{
          transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
          width: open ? 120 : 40,
          height: open ? 120 : 40,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          position: "relative",
          zIndex: 10,
          padding: 0,
        }}
        aria-label={label}
      >
        {!open ? (
          icon
        ) : (
          <div className="flex flex-col items-center p-2">
            <img
              src={qrImg}
              alt="QR code"
              style={{
                width: 70,
                height: 70,
                borderRadius: 8,
                background: "#fff",
              }}
            />
            <span className="text-xs text-white mt-2">Scannez-moi</span>
          </div>
        )}
      </button>
      <span className="mt-2 text-xs text-gray-700 font-semibold">{label}</span>
    </div>
  );
}

function Magic() {
  const [barStates, setBarStates] = useState([false, false, false]);
  const [showButton, setShowButton] = useState(true);
  const [showEmailFly, setShowEmailFly] = useState(false);
  const [handStep, setHandStep] = useState("move");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let timers = [];
    function startSequence() {
      setBarStates([false, false, false]);
      setShowButton(true);
      setShowEmailFly(false);
      setHandStep("move");
      setCycle((c) => c + 1);
      timers = [
        setTimeout(() => {
          setBarStates([true, false, false]);
          setShowButton(true);
          setShowEmailFly(false);
          setHandStep("move");
          setTimeout(() => setHandStep("click"), 2000);
          setTimeout(() => {
            setHandStep("done");
            setShowButton(false);
            setShowEmailFly(true);
            setTimeout(() => setShowEmailFly("fly"), 700);
            setTimeout(() => setShowEmailFly(false), 1700);
          }, 2300);
        }, 0),
        setTimeout(() => {
          setBarStates([false, true, false]);
          setShowButton(true);
          setShowEmailFly(false);
          setHandStep("move");
        }, 5000),
        setTimeout(() => {
          setBarStates([false, false, true]);
          setShowButton(true);
          setShowEmailFly(false);
          setHandStep("move");
        }, 10000),
        setTimeout(() => startSequence(), 15000),
      ];
    }
    startSequence();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <div
        className="flex flex-row items-stretch justify-center w-full gap-12 mb-24"
        style={{ minHeight: "550px" }}
      >
        <div className="flex items-center justify-center w-2/3 h-full">
          <div
            className="w-full h-[500px] rounded-xl text-white text-lg font-bold transition-colors duration-500 flex flex-col items-center justify-center relative"
            style={{
              background: barStates[0]
                ? "#2563eb"
                : barStates[1]
                  ? "#f59e42"
                  : barStates[2]
                    ? "#22c55e"
                    : "#d1d5db",
            }}
          >
            <span className="text-2xl mb-4 text-center">
              {barStates[0] && showButton && handStep !== "done" && (
                <div className="bg-gray-200 p-12 rounded-lg flex flex-col gap-8">
                  <p className="text-2xl font-bold text-black">Se connecter</p>
                  <p className="text-gray-300 bg-white rounded-lg px-4 py-2 border-1 border-gray-300 ">
                    exemple@email.com
                  </p>
                  <button
                    className="bg-blue-400 text-white font-bold px-6 py-2 rounded-lg cursor-not-allowed transition-all duration-300 flex items-center justify-center relative text-xl"
                    style={{ minWidth: 260, minHeight: 48 }}
                  >
                    Magic Link
                  </button>
                </div>
              )}
              {barStates[0] &&
                !showButton &&
                (showEmailFly === true || showEmailFly === "fly") && (
                  <span
                    key={cycle}
                    className={`flex items-center justify-center absolute left-1/2 top-1/2 ${showEmailFly === "fly" ? "animate-email-fly" : ""}`}
                    style={{
                      minWidth: 164,
                      minHeight: 164,
                      transform: "translate(-50%, -50%)",
                      zIndex: 20,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                        width: 156,
                        height: 156,
                      }}
                    >
                      <FaRegEnvelope size={96} className="text-blue-500" />
                    </span>
                  </span>
                )}
            </span>
            {/* Main animée, positionnée par rapport au div coloré */}
            {barStates[0] && showButton && handStep !== "done" && (
              <span
                className={`absolute ${handStep === "move" ? "animate-hand-move" : "animate-hand-click"}`}
                style={{
                  left: 0,
                  bottom: 0,
                  width: 48,
                  height: 48,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    padding: 4,
                  }}
                >
                  <BsHandIndexFill size={32} style={{ color: "white" }} />
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start mr-4 gap-4 w-1/3">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="flex flex-row items-center gap-4">
              <div
                style={{
                  width: "10px",
                  height: barStates[idx] ? "300px" : "50px",
                  borderRadius: "10px",
                  background: "#d1d5db",
                  overflow: "hidden",
                  position: "relative",
                  transition: "height 0.5s cubic-bezier(.4,2,.6,1)",
                }}
              >
                {barStates[idx] && (
                  <div
                    className="absolute left-0 top-0 w-full"
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(to bottom, #2f855a 100%, transparent 0%)",
                      animation: "fillBar 5s linear forwards",
                      zIndex: 2,
                    }}
                  ></div>
                )}
              </div>
              <div className="flex flex-col items-start min-w-[120px]">
                <h2 className="text-2xl font-bold whitespace-nowrap text-left">
                  {idx === 0 && "Se connecter avec Magic link"}
                  {idx === 1 &&
                    "Vous recevez un email avec un lien unique securisé"}
                  {idx === 2 && "Vous etes connectez sur votre compte"}
                </h2>
                {barStates[idx] && (
                  <span className="text-xl text-gray-700 mt-1">
                    {idx === 0 &&
                      "Entrez votre adresse email ci-dessous et cliquez sur 'Envoyer'. Nous générons un lien sécurisé pour vous permettre de vous connecter sans mot de passe."}
                    {idx === 1 &&
                      "Consultez votre boîte de réception. Cliquez sur le lien unique reçu pour accéder à votre espace personnel en toute sécurité, sans mot de passe à retenir."}
                    {idx === 2 &&
                      "Vous êtes maintenant connecté à votre compte. Profitez de toutes les fonctionnalités de la plateforme en toute simplicité et sécurité !"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes fillBar {
          0% {
            height: 0%;
            opacity: 1;
          }
          100% {
            height: 100%;
            opacity: 1;
          }
        }
        @keyframes hand-move {
          0% {
            left: 0;
            bottom: 0;
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 190%) scale(1);
            opacity: 1;
          }
        }
        .animate-hand-move {
          animation: hand-move 1.2s forwards;
        }
        @keyframes email-fly {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(400px, -330px) scale(0.2);
          }
        }
        .animate-email-fly {
          animation: email-fly 4s forwards;
        }
        @keyframes hand-click {
          0% {
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 190%) scale(1);
          }
          30% {
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 190%) scale(1);
          }
          100% {
            left: 50%;
            bottom: 50%;
            transform: translate(-50%, 190%) scale(1);
          }
        }
        .animate-hand-click {
          animation: hand-click 0.8s forwards;
        }
      `}</style>
    </>
  );
}

function FAQ({ subtitle, paragraphe }) {
  const items = [
    {
      title: "Comment fonctionne le Magic Link ?",
      content:
        "Le Magic Link vous permet de vous connecter sans mot de passe. Il suffit de cliquer sur le lien reçu par email pour accéder à votre compte en toute sécurité.",
    },
    {
      title: "Est-ce sécurisé ?",
      content:
        "Oui, chaque lien est à usage unique et expire rapidement pour garantir la sécurité de votre compte.",
    },
    {
      title: "Puis-je utiliser le Magic Link plusieurs fois ?",
      content:
        "Non, chaque Magic Link ne peut être utilisé qu'une seule fois. Vous pouvez en demander un nouveau à tout moment.",
    },
    {
      title: "Que faire si je ne reçois pas l'email ?",
      content:
        "Vérifiez votre dossier spam ou demandez un nouveau lien. Si le problème persiste, contactez le support.",
    },
    {
      title: "Puis-je me connecter sur plusieurs appareils ?",
      content:
        "Oui, il suffit de demander un Magic Link sur chaque appareil où vous souhaitez vous connecter.",
    },
  ];
  const [open, setOpen] = useState(Array(items.length).fill(false));
  const toggle = (idx) => setOpen((o) => o.map((v, i) => (i === idx ? !v : v)));
  return (
    <div className="max-w-7xl mx-auto my-12 mt-24 flex flex-col justify-center items-center">
      <h2 className={subtitle}>FAQ</h2>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white border-b border-green-700 p-4">
            <button
              className="flex items-center w-full justify-between text-left focus:outline-none"
              onClick={() => toggle(idx)}
            >
              <span className="text-3xl font-semibold text-green-700">
                {item.title}
              </span>
              <BsPlus
                size={35}
                color="green"
                className={`transition-transform duration-200 ${open[idx] ? "rotate-45" : ""}`}
              />
            </button>
            <div
              className={`${paragraphe} faq-content mt-3 ${open[idx] ? "open" : ""}`}
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

function ProjetSection({ subtitle, paragraphe }) {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const parent = sectionRef.current.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const stickyStart = windowH / 2; // sticky commence à 50vh
      const stickyEnd = parentRect.bottom - 300; // sticky s'arrête quand parent sort (300 = moitié du bloc)
      let p = 0;
      if (rect.top > stickyStart) {
        p = 0;
      } else if (parentRect.bottom < stickyStart + 300) {
        p = 1;
      } else {
        // phase sticky
        const stickyHeight = parentRect.height - windowH + 600;
        const scrolled = stickyStart - rect.top;
        p = Math.min(1, Math.max(0, scrolled / stickyHeight));
      }
      setProgress(p);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fonction d'interpolation ease-in-out
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  const smoothProgress = easeInOutQuad(progress);

  // Calcul de la translation du bloc blanc

  const translateY = 0 - smoothProgress * -200; // de 0% à -80%
  const translateX = 0 + smoothProgress * -250; // de 0% à -80%

  return (
    <div
      ref={sectionRef}
      className="sticky top-8 w-full flex items-center justify-center z-10 overflow-hidden border-1 border-gray-400 rounded-2xl"
      style={{
        background: "#ffffff",
        height: "90vh",
      }}
    >
      <div className="text-black absolute top-[150px] left-[700px] w-full -translate-x-1/2 transition-opacity duration-500 flex gap-32">
        <div>
          {" "}
          <h3 className={subtitle}>Informations du projet</h3>
        </div>
        <div className={paragraphe}>
          <p className="w-3/4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Praesentium eligendi quasi voluptates ducimus consequatur hic
            numquam pariatur vero doloremque laudantium, deleniti quo possimus,
            minus sit voluptatem quaerat ipsa illum provident.
          </p>
        </div>
      </div>
      {/* Bloc blanc qui descend */}
      <div
        className="w-full h-full rounded-2xl flex pt-10 justify-center transition-all duration-500 border-1 border-gray-400"
        style={{
          background: "#e6eeff",
          transform: `translateY(${translateY}%) translateX(${translateX}%)`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        }}
      >
        <form className="w-full max-w-xl bg-white rounded-2xl p-10 border border-gray-200 flex flex-col gap-6 pointer-events-none select-none opacity-90">
          <h4 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Détails du projet
          </h4>

          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-lg font-medium text-gray-700">
                Promoteur
              </label>
              <input
                type="text"
                value="Hoomge Développement"
                disabled
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-lg text-gray-500"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-lg font-medium text-gray-700">
                Nombre de lots
              </label>
              <input
                type="text"
                value="42"
                disabled
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-lg text-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              value="Programme neuf au cœur de Paris, prestations haut de gamme, espaces verts, parking en sous-sol."
              disabled
              readOnly
              rows={3}
              className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-lg text-gray-500 resize-none"
            />
          </div>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-lg font-medium text-gray-700">
                Livraison
              </label>
              <input
                type="text"
                value="T4 2025"
                disabled
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-lg text-gray-500"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label className="text-lg font-medium text-gray-700">
                Statut
              </label>
              <input
                type="text"
                value="En commercialisation"
                disabled
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-lg text-gray-500"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ManageSection({ subtitle, paragraphe }) {
  // Définir les icônes à placer autour du cercle avec leur angle (en degrés)
  const icons = [
    // Cercle extérieur (purple)
    {
      icon: <FaUser size={32} color="purple" />,
      label: "User",
      angle: 0,
      radius: 36,
      color: "purple",
    }, // droite
    {
      icon: <FaRegFileAlt size={32} color="purple" />,
      label: "Projet A",
      angle: 180,
      radius: 36,
      color: "purple",
    }, // gauche
    // Cercle intermédiaire (blue)
    {
      icon: <FaUser size={32} color="blue" />,
      label: "User",
      angle: 100,
      radius: 29,
      color: "blue",
    }, // bas
    {
      icon: <FaRegFileAlt size={32} color="blue" />,
      label: "Projet B",
      angle: 270,
      radius: 29,
      color: "blue",
    }, // haut
    // Cercle intérieur (red)
    {
      icon: <FaUser size={32} color="red" />,
      label: "User",
      angle: 45,
      radius: 19,
      color: "red",
    }, // bas droite
    {
      icon: <FaRegFileAlt size={32} color="red" />,
      label: "Projet C",
      angle: 225,
      radius: 19,
      color: "red",
    }, // haut gauche
  ];

  const [orbitAngle, setOrbitAngle] = useState(0);

  useEffect(() => {
    let frame;
    const animate = () => {
      setOrbitAngle((a) => (a + 0.1) % 360); // 0.01° par frame, rotation très lente
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex flex-row max-w-7xl mx-auto h-fit mt-12 mb-32 gap-4 ">
      <div className="text-black text-xl w-1/2 bg-transparent z-30 backdrop-blur-sm">
        <h3 className={subtitle}>
          Ajouter des projets/Collaborateurs
        </h3>
        <p className={paragraphe}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quisquam, quos
        </p>
      </div>
      <div className="relative w-1/2 aspect-square -mt-32">
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
          className="absolute left-1/2 top-1/2 z-10 bg-green-700 text-white rounded-full p-6"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <FaLock size={48} />
        </div>

        {/* Animation orbitale des icônes autour du centre */}
        <div className="absolute inset-0">
          {icons.map(({ icon, label, angle, radius, color }, idx) => {
            // Définir les rayons adaptés aux nouveaux cercles (120, 90, 60)
            let adjustedRadius = radius;
            if (radius === 36) adjustedRadius = 36; // cercle extérieur (purple)
            if (radius === 29) adjustedRadius = 29; // cercle intermédiaire (blue)
            if (radius === 19) adjustedRadius = 19; // cercle intérieur (red)
            // Ajoute l'angle d'animation à l'angle de base
            const animatedAngle = angle + orbitAngle;
            const rad = (animatedAngle * Math.PI) / 180;
            const x = 50 + adjustedRadius * Math.cos(rad);
            const y = 50 + adjustedRadius * Math.sin(rad);
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
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                    marginBottom: 4,
                  }}
                >
                  {icon}
                </span>
                <p
                  className="text-xs"
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

/* Ajoute l'animation de rotation globale */
<style jsx>{`
  @keyframes rotate-circles {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`}</style>;
