const Reception = () => {
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
      <path
        d="M 40 45
 C 40 45, 50 25, 60 45

 "
        stroke="black"
        fill="none"
        strokeWidth="3"
      />
      <circle
        cx="50"
        cy="25"
        r="7"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
       <polygon points="20,48 80,48 80,72 20,72" fill="none" stroke="black" strokeWidth="3" />

      <text x="25" y="90" fontSize={10}>
        Reception
      </text>
    </svg>
  );
};

export default Reception;
