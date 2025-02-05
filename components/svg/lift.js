const Lift = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={{ width: "100%", height: "100%" }}
    >
      <rect width="100" height="100" fill="white" />
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="black" strokeWidth="1" />
      
      <polygon points="90,20 85,30 95,30" fill="black">
        <animate attributeName="fill" values="red;black;red" dur="4s" repeatCount="indefinite" />
      </polygon>

      <polygon points="90,45 85,35 95,35" fill="black" />
      <rect x="80" y="10" width="1" height="60" fill="black" />
      
      <circle cx="40" cy="30" r="7" fill="white" stroke="black" strokeWidth="3" />
      <line x1="25" y1="50" x2="38" y2="40" stroke="black" strokeWidth="3" />
      <line x1="43" y1="40" x2="58" y2="50" stroke="black" strokeWidth="3" />
      
      <polygon points="21,60 41,45 60,60" fill="none" stroke="black" strokeWidth="3" />

      <text x="40" y="90" fontSize="10" fill="black">Lift</text>
    </svg>
  );
};

export default Lift;
