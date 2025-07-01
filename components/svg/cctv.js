const Cctv = () => {
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
      {/* <rect x="0" y="0" width="100" height="100" fill="none" stroke="black" strokeWidth="1" /> */}
      <g transform="translate(15, 10) scale(0.7, 0.5) rotate(-70, 50, 50)">
        <ellipse cx="50" cy="20" rx="20" ry="8" fill="white" stroke="black" strokeWidth="4"/>
        <path d="M 30 20 L 30 80 A 20 8 0 0 0 70 80 L 70 20" fill="white" stroke="black" strokeWidth="4"/>
        <ellipse cx="50" cy="80" rx="20" ry="8" fill="white" stroke="black" strokeWidth="4"/>
      </g>
      <line x1="40" y1="43" x2="40" y2="60" stroke="black" strokeWidth="3" />
      <line x1="20" y1="60" x2="41" y2="60" stroke="black" strokeWidth="3" />
      <line x1="20" y1="50" x2="20" y2="70" stroke="black" strokeWidth="3" />
      {/* <text x="36" y="90" fontSize={10}>CCTV</text> */}
    </svg>
  );
};

export default Cctv;
