import React, { useState, useEffect } from "react";

const DualLayerFadeSection = () => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3); // Change la carte toutes les 3 secondes
    }, 3000);
    return () => clearInterval(interval); // Nettoyage du timer
  }, []);

  // Définition de la constante pour les styles Tailwind du header
  const headerStyle =
    "bg-white text-gray-700 w-full p-4 text-center rounded-tl-20 rounded-tr-20";

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "600px",
    height: "400px",
  };

  const baseCardStyle = {
    position: "absolute",
    width: "600px",
    height: "400px",
    transition: "transform 1s ease, opacity 1s ease, top 1s ease",
    borderRadius: "20px", // Bordure arrondie de 20px
    opacity: 0.7,
    border: "1px solid #a4a5a6", // Bordure gris
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Ombre légère
  };

  // Styles dynamiques pour chaque carte
  const getCardStyle = (index) => {
    let zIndex, top, transform, opacity;

    if (activeCard === index) {
      // Carte active
      zIndex = 3;
      top = "50%";
      transform = "scale(1.1)";
      opacity = 1;
    } else if (activeCard === (index + 1) % 3) {
      // Carte du milieu
      zIndex = 2;
      top = "45%";
      transform = "scale(0.9) translateY(-60px)"; // Déplacement vers le haut
      opacity = 0.8;
    } else {
      // Carte derrière
      zIndex = 1;
      top = "40%";
      transform = "scale(0.8) translateY(-90px)"; // Déplacement encore plus vers le haut
      opacity = 0.6;
    }

    return {
      ...baseCardStyle,
      top,
      transform,
      opacity,
      zIndex,
      backgroundColor:"#f7f7f7" // Couleur uniforme pour chaque carte
    };
  };

  return (
    <div style={containerStyle}>
      {/* Première carte */}
      <div style={getCardStyle(0)}>
        <div
          className={headerStyle}
          style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }} // Assurer que le header a aussi des coins arrondis
        >
          <p className="bg-white px-3 py-2 overflow-hidden text-black rounded">
            Text for Card 1
          </p>
        </div>
      </div>

      {/* Deuxième carte */}
      <div style={getCardStyle(1)}>
        <div
          className={headerStyle}
          style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }} // Assurer que le header a aussi des coins arrondis
        >
          <p className="bg-white px-3 py-2 overflow-hidden text-black rounded">
            Text for Card 2
          </p>
        </div>
      </div>

      {/* Troisième carte */}
      <div style={getCardStyle(2)}>
        <div
          className={headerStyle}
          style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }} // Assurer que le header a aussi des coins arrondis
        >
          <p className="bg-white px-3 py-2 overflow-hidden text-black rounded">
            Text for Card 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default DualLayerFadeSection;
