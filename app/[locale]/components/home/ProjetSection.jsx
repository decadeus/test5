import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function ProjetSection({ subtitle, paragraphe }) {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const t = useTranslations();

  useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const parent = sectionRef.current.parentElement;
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

  const translateY = 0 - smoothProgress * -200;
  const translateX = 0 + smoothProgress * -250;

  return (
    <div
      ref={sectionRef}
      className="sticky top-8 w-full flex items-center justify-center z-10 overflow-hidden border-1 border-gray-400 rounded-2xl"
      style={{
        background: "#ffffff",
        height: "90vh",
      }}
    >
      <div className="text-black absolute top-[50px] sm:top-[80px] md:top-[100px] lg:top-[150px] left-1/2 w-full -translate-x-1/2 transition-opacity duration-500 flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 px-4 sm:px-6 md:px-8">
        <div>
          <h3 className={subtitle}>{t('ProjectSection.Title')}</h3>
        </div>
        <div className={paragraphe}>
          <p className="w-full md:w-3/4 whitespace-pre-line text-base sm:text-lg md:text-xl lg:text-xl">{t('ProjectSection.Description')}</p>
        </div>
      </div>
      <div
        className="w-full h-full rounded-2xl flex pt-6 sm:pt-8 md:pt-10 lg:pt-12 justify-center transition-all duration-500 border-1 border-gray-400 hidden md:flex"
        style={{
          background: "#e6eeff",
          transform: `translateY(${translateY}%) translateX(${translateX}%)`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        }}
      >
        <form className="w-full max-w-5xl bg-white rounded-2xl p-4 sm:p-6 md:p-10 border border-gray-200 flex flex-col gap-4 sm:gap-6 pointer-events-none select-none opacity-90">
          <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 text-center">
            {t('ProjectSection.FormTitle')}
          </h4>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
            <div className="w-full">
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <label className="text-base sm:text-lg font-medium text-gray-700">
                    {t('ProjectSection.Company')}
                  </label>
                  <input
                    type="text"
                    value="Hoomge"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-500"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <label className="text-base sm:text-lg font-medium text-gray-700">
                    {t('ProjectSection.ProjectName')}
                  </label>
                  <input
                    type="text"
                    value="Hoomge"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <label className="text-base sm:text-lg font-medium text-gray-700">
                    {t('ProjectSection.Country')}
                  </label>
                  <input
                    type="text"
                    value="Pologne"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-500"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <label className="text-base sm:text-lg font-medium text-gray-700">
                    {t('ProjectSection.City')}
                  </label>
                  <input
                    type="text"
                    value="Piaseczno"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <label className="text-base sm:text-lg font-medium text-gray-700">
                    {t('ProjectSection.Latitude')}
                  </label>
                  <input
                    type="text"
                    value="52.06667"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-500"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <label className="text-base sm:text-lg font-medium text-gray-700">
                    {t('ProjectSection.Longitude')}
                  </label>
                  <input
                    type="text"
                    value="20.62924"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-500"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <label className="text-base sm:text-lg font-medium text-gray-700">
                    {t('ProjectSection.Currency')}
                  </label>
                  <input
                    type="text"
                    value="PLN"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-500"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <label className="text-base sm:text-lg font-medium text-gray-700">
                    {t('ProjectSection.Link')}
                  </label>
                  <input
                    type="text"
                    value="www.hoomge.com"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-base sm:text-lg text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-base sm:text-lg font-medium text-gray-700 mb-4">{t('ProjectSection.Facilities')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-1">
              {[
                t('ProjectSection.SwimmingPool'),
                t('ProjectSection.CCTV'),
                t('ProjectSection.Reception'),
                t('ProjectSection.BikeParking'),
                t('ProjectSection.DisabledAccess'),
                t('ProjectSection.ChildArea'),
                t('ProjectSection.FitnessRoom'),
                t('ProjectSection.Elevator'),
              ].map((label) => (
                <label key={label} className="flex items-center gap-3 select-none cursor-not-allowed">
                  <span className="relative inline-block w-10 sm:w-12 h-5 sm:h-6 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={false}
                      disabled
                      className="absolute block w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-white border-2 border-blue-500 appearance-none cursor-not-allowed shadow-sm left-0 top-0 transition"
                    />
                    <span
                      className="block w-10 sm:w-12 h-5 sm:h-6 rounded-full bg-blue-500"
                      style={{ zIndex: 1 }}
                    ></span>
                  </span>
                  <span className="text-base sm:text-lg">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 