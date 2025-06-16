import { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaEdge } from "react-icons/fa";
import { SiSafari, SiOpera, SiGooglechrome, SiFirefoxbrowser } from "react-icons/si";
import { useTranslations } from "next-intl";

const POSITIONS = {
  safari: { from: { x: -180, y: 0 }, to: { x: 0, y: 0 } },
  opera: { from: { x: 180, y: 0 }, to: { x: 0, y: 0 } },
  chrome: { from: { x: -60, y: -120 }, to: { x: 80, y: -32 } },
  firefox: { from: { x: 60, y: -120 }, to: { x: 40, y: 92 } },
  edge: { from: { x: -120, y: -10 }, to: { x: 80, y: 90 } },
};

export default function SEO({ subtitle, paragraphe }) {
  const [progress, setProgress] = useState(0);
  const iconsRef = useRef(null);
  const t = useTranslations("SEO");

  useEffect(() => {
    function onScroll() {
      if (!iconsRef.current) return;
      const rect = iconsRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const parent = iconsRef.current.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const stickyStart = windowH / 2;
      const stickyEnd = parentRect.bottom - 300;
      let p = 0;
      if (rect.top > stickyStart) {
        p = 0;
      } else if (parentRect.bottom < stickyStart + 300) {
        p = 1;
      } else {
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

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  const smoothProgress = easeInOutQuad(progress);

  const getStyle = (from, to) => {
    const localProgress = Math.min(smoothProgress * 2, 1);
    return {
      opacity: localProgress,
      transform: `translate(${from.x + (to.x - from.x) * localProgress}px, ${from.y + (to.y - from.y) * localProgress}px) scale(${0.7 + 0.3 * localProgress})`,
      transition: "opacity 0.3s, transform 0.3s",
    };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-black w-full py-16 sm:py-24 lg:py-32">
      <div className="text-black w-full lg:w-1/2">
        <h2 className={subtitle}>{t("Priority")}</h2>
        <p className={paragraphe}>
          {t("Description1")}
        </p>
        <p className={paragraphe}>
          {t("Description2")}
        </p>
      </div>
      <div
        className="text-black w-full lg:w-1/2 flex flex-col items-center justify-center relative"
        ref={iconsRef}
        style={{ minHeight: 300 }}
      >
        <div
          className="relative w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center text-black border-1 border-black rounded-2xl shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, #f3f4f6 0%, #fffbfb 50%, #fffbfb 100%)",
          }}
        >
          <div className="border-2 border-black rounded-2xl p-3 sm:p-4 flex justify-center items-center gap-2">
            <p>
              <CiSearch size={24} className="sm:w-7 sm:h-7" color="gray" />
            </p>
            <p className="text-sm sm:text-xl lg:text-2xl font-thin text-gray-400">
              {t("SearchPlaceholder")}
            </p>
          </div>
        </div>
        <div
          className="absolute top-0 left-0 bg-[#0078D7] rounded-full shadow-lg flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
          style={getStyle(POSITIONS.edge.from, POSITIONS.edge.to)}
        >
          <FaEdge title="Edge" className="text-2xl sm:text-3xl text-white" />
        </div>
        <div
          className="absolute top-1/2 left-0 bg-[#1B9AF7] rounded-full shadow-lg flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20"
          style={getStyle(POSITIONS.safari.from, POSITIONS.safari.to)}
        >
          <SiSafari title="Safari" className="text-4xl sm:text-5xl text-white" />
        </div>
        <div
          className="absolute top-1/2 right-0 bg-[#FF1B2D] rounded-full shadow-lg flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20"
          style={getStyle(POSITIONS.opera.from, POSITIONS.opera.to)}
        >
          <SiOpera title="Opera" className="text-3xl sm:text-4xl text-white" />
        </div>
        <div
          className="absolute left-1/4 top-0 rounded-full shadow-lg flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24"
          style={{
            ...getStyle(POSITIONS.chrome.from, POSITIONS.chrome.to),
            background:
              "conic-gradient(#EA4335 0% 25%, #FBBC05 25% 50%, #34A853 50% 75%, #4285F4 75% 100%)",
            borderColor: "#EA4335",
          }}
        >
          <SiGooglechrome title="Chrome" className="text-5xl sm:text-6xl text-white" />
        </div>
        <div
          className="absolute right-1/4 top-0 bg-[#FF7139] rounded-full shadow-lg flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
          style={getStyle(POSITIONS.firefox.from, POSITIONS.firefox.to)}
        >
          <SiFirefoxbrowser title="Firefox" className="text-3xl sm:text-4xl text-white" />
        </div>
      </div>
    </div>
  );
} 