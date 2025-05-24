import { useEffect, useState } from "react";

export default function Statistics({ uniqueCompanies, uniqueIdeas, totalApartments }) {
  const [displayedCompanies, setDisplayedCompanies] = useState(0);
  const [displayedIdeas, setDisplayedIdeas] = useState(0);
  const [displayedApartments, setDisplayedApartments] = useState(0);

  const animateCount = (target, setDisplayed) =>
    new Promise((resolve) => {
      let count = 0;
      const increment = Math.ceil(target / 100);
      const interval = setInterval(() => {
        if (count < target) {
          count += increment;
          setDisplayed(count > target ? target : count);
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

  useEffect(() => {
    const animateAll = async () => {
      await Promise.all([
        animateCount(uniqueCompanies.size, setDisplayedCompanies),
        animateCount(uniqueIdeas.size, setDisplayedIdeas),
        animateCount(totalApartments, setDisplayedApartments),
      ]);
    };
    animateAll();
  }, [uniqueCompanies.size, uniqueIdeas.size, totalApartments]);

  const boxStyle = "mt-2 text-center rounded-xl p-4 sm:w-[150px] w-[120px]";
  const numberStyle = "font-semibold text-gray-700 font-macondo text-5xl";
  const labelStyle = "text-gray-600 sm:text-lg text-sm";

  return (
    <div className="flex gap-4 xl:gap-8 items-center my-8 transition-shadow duration-300 transform hover:-translate-y-1 animate-fadeIn">
      <div className={boxStyle}>
        <span className={numberStyle}>{displayedCompanies}</span>
        <p className={labelStyle}>Companies</p>
      </div>
      <div className={boxStyle}>
        <span className={numberStyle}>{displayedIdeas}</span>
        <p className={labelStyle}>Projets</p>
      </div>
      <div className={boxStyle}>
        <span className={numberStyle}>{displayedApartments}</span>
        <p className={labelStyle}>Appartements</p>
      </div>
    </div>
  );
}
