const Sauna = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="none"
        stroke="black"
        strokeWidth="1"
      />
      <circle
        cx="20"
        cy="25"
        r="7"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
      <polyline
        points="20,35 20,50 35,50 45,70"
        stroke="black"
        fill="none"
        strokeWidth="3"
      />

      <line x1="74" y1="70" x2="71" y2="55" stroke="black" strokeWidth="3" />
      <line x1="76" y1="70" x2="79" y2="55" stroke="black" strokeWidth="3" />

      <polygon
        points="65,55 85,55 80,70 70,70"
        stroke="black"
        fill="none"
        strokeWidth="3"
      />

      <g transform="translate(-5, 0)">
        <path
          d="M 70 10
 C 70 10, 60 20, 70 30
 C 70 30, 80 40, 70 50
 "
          stroke="black"
          fill="none"
          strokeWidth="3"
        />
        <path
          d="M 75 10
 C 75 10, 65 20, 75 30
 C 75 30, 85 40, 75 50
 "
          stroke="black"
          fill="none"
          strokeWidth="3"
        />

        <path
          d="M 80 10
 C 80 10, 70 20, 80 30
 C 80 30, 90 40, 80 50
 "
          stroke="black"
          fill="none"
          strokeWidth="3"
        />

        <path
          d="M 85 10
 C 85 10, 75 20, 85 30
 C 85 30, 95 40, 85 50
 "
          stroke="black"
          fill="none"
          strokeWidth="3"
        />
      </g>
      <text x="36" y="90" fontSize={10}>
        Sauna
      </text>
    </svg>
  );
};

export default Sauna;
