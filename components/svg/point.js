const Point = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="100"
        height="100"
        className="point-icon"
      >
        {/* Base de l'icône (pointe du pin) */}
        <polygon points="9,22 24,52 39,22" fill="#764510" />
        {/* Cercle blanc avec bordure */}
        <circle cx="24" cy="18" r="16" fill="white" />
        <circle cx="24" cy="18" r="14" fill="white" stroke="#764510" strokeWidth="3" />
        {/* Cercle intérieur */}
        <circle cx="24" cy="18" r="7" className="inner-circle" />
      </svg>
    );
  };
  
  export default Point;
  