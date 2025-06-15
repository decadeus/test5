import { useState, useEffect } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { FaKey } from "react-icons/fa";

export default function Magic() {
  const [barStates, setBarStates] = useState([false, false, false]);
  const [showButton, setShowButton] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [phase1State, setPhase1State] = useState("initial");
  const [phase2State, setPhase2State] = useState("initial");

  useEffect(() => {
    let timers = [];
    function startSequence() {
      setBarStates([false, false, false]);
      setShowButton(true);
      setPhase1State("initial");
      setPhase2State("initial");
      setCycle((c) => c + 1);
      timers = [
        setTimeout(() => {
          setBarStates([true, false, false]);
          setShowButton(true);
          setTimeout(() => {
            setShowButton(false);
          }, 2300);
        }, 0),
        setTimeout(() => {
          setBarStates([false, true, false]);
          setShowButton(true);
          setPhase1State("show");
          setTimeout(() => {
            setPhase1State("done");
          }, 2300);
        }, 5000),
        setTimeout(() => {
          setBarStates([false, false, true]);
          setShowButton(true);
          setPhase2State("show");
          setTimeout(() => setPhase2State("success"), 2000);
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
        className="flex flex-col lg:flex-row items-stretch justify-center w-full gap-8 lg:gap-12 mb-16 lg:mb-24 px-4 sm:px-6 lg:px-8"
        style={{ minHeight: "550px" }}
      >
        <div className="flex items-center justify-center w-full lg:w-2/3 h-full">
          <div
            className="w-full h-[400px] sm:h-[500px] rounded-xl text-white text-base sm:text-lg font-bold transition-colors duration-500 flex flex-col items-center justify-center relative"
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
            <span className="text-xl sm:text-2xl mb-4 text-center">
              {barStates[0] && showButton && (
                <div className="bg-gray-200 p-6 sm:p-12 rounded-lg flex flex-col gap-4 sm:gap-8">
                  <p className="text-xl sm:text-2xl font-bold text-black">Se connecter</p>
                  <p className="text-gray-300 bg-white rounded-lg px-3 sm:px-4 py-2 border-1 border-gray-300 text-sm sm:text-base">
                    exemple@email.com
                  </p>
                  <button
                    className="bg-blue-400 text-white font-bold px-4 sm:px-6 py-2 rounded-lg cursor-not-allowed transition-all duration-300 flex items-center justify-center relative text-base sm:text-xl"
                    style={{ minWidth: 200, minHeight: 40 }}
                  >
                    Magic Link
                  </button>
                </div>
              )}
              {barStates[1] && phase1State !== "initial" && (
                <div className="bg-gray-200 p-6 sm:p-12 rounded-lg flex flex-col gap-4 sm:gap-8">
                  <p className="text-xl sm:text-2xl font-bold text-black">Email reçu</p>
                  <div className="flex items-center gap-3 sm:gap-4 bg-white rounded-lg px-3 sm:px-4 py-2 border-1 border-gray-300">
                    <MdEmail size={20} className="text-orange-500 sm:w-6 sm:h-6" />
                    <p className="text-gray-700 text-sm sm:text-base">Lien de connexion sécurisé</p>
                  </div>
                  {phase1State === "show" && (
                    <button
                      className="bg-orange-400 text-white font-bold px-4 sm:px-6 py-2 rounded-lg cursor-not-allowed transition-all duration-300 flex items-center justify-center relative text-base sm:text-xl"
                      style={{ minWidth: 200, minHeight: 40 }}
                    >
                      Cliquer sur le lien
                    </button>
                  )}
                </div>
              )}
              {barStates[2] && phase2State !== "initial" && (
                <div className="bg-gray-200 p-6 sm:p-12 rounded-lg flex flex-col gap-4 sm:gap-8">
                  <p className="text-xl sm:text-2xl font-bold text-black">wwww.hoomge.com</p>
                  <div className="flex items-center gap-3 sm:gap-4 bg-white rounded-lg px-3 sm:px-4 py-2 border-1 border-gray-300">
                    <FaCheckCircle size={20} className="text-green-500 sm:w-6 sm:h-6" />
                    <p className="text-gray-700 text-sm sm:text-base">Vous êtes connecté</p>
                  </div>
                  {phase2State === "success" && (
                    <div className="flex items-center justify-center">
                      <FaKey size={48} className="text-green-500 animate-key-fly sm:w-16 sm:h-16" />
                    </div>
                  )}
                </div>
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 w-full lg:w-1/3">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="flex flex-row items-center gap-3 sm:gap-4">
              <div
                style={{
                  width: "8px",
                  height: barStates[idx] ? "200px" : "40px",
                  borderRadius: "8px",
                  background: "#d1d5db",
                  overflow: "hidden",
                  position: "relative",
                  transition: "height 0.5s cubic-bezier(.4,2,.6,1)",
                }}
                className="sm:w-[10px] sm:h-[300px]"
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
              <div className="flex flex-col items-start min-w-[100px] sm:min-w-[120px]">
                <h2 className="text-lg sm:text-2xl font-bold whitespace-nowrap text-left">
                  {idx === 0 && "Se connecter avec Magic link"}
                  {idx === 1 &&
                    "Vous recevez un email avec un lien unique securisé"}
                  {idx === 2 && "Vous etes connectez sur votre compte"}
                </h2>
                {barStates[idx] && (
                  <span className="text-base sm:text-xl text-gray-700 mt-1">
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
        @keyframes key-fly {
          0% {
            opacity: 1;
            transform: translate(-400px, 0) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(0, 0) scale(1.2);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-key-fly {
          animation: key-fly 1s forwards;
        }
      `}</style>
    </>
  );
} 