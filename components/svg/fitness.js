const Fitness = () => {
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
          cx="50"
          cy="65"
          r="7"
          fill="white"
          stroke="black"
          strokeWidth="3"
        />
        <line
          x1="25"
          y1="40"
          x2="25"
          y2="30"
          stroke="black"
          strokeWidth="3"
        />
          <line
          x1="30"
          y1="45"
          x2="30"
          y2="25"
          stroke="black"
          strokeWidth="3"
        />
        <line
          x1="75"
          y1="40"
          x2="75"
          y2="30"
          stroke="black"
          strokeWidth="3"
        />
         <line
          x1="70"
          y1="45"
          x2="70"
          y2="25"
          stroke="black"
          strokeWidth="3"
        />
        <line
          x1="33"
          y1="35"
          x2="67"
          y2="35"
          stroke="black"
          strokeWidth="3"
        />

<line
          x1="40"
          y1="31"
          x2="45"
          y2="55"
          stroke="black"
          strokeWidth="3"
        />

<line
          x1="60"
          y1="31"
          x2="55"
          y2="55"
          stroke="black"
          strokeWidth="3"
        />
       
        <text x="20" y="90" fontSize={10}>
          Fitness room
        </text>
      </svg>
    );
  };
  
  export default Fitness;
  