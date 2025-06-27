const Swim = () => {
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
        <path
          d="M 20 60
 C 20 60, 30 50, 50 60
 C 50 60, 70 70, 80 60
 "
          stroke="black"
          fill="none"
          strokeWidth="3"
        />
        <circle
          cx="65"
          cy="50"
          r="7"
          fill="white"
          stroke="black"
          strokeWidth="3"
        />
        <line
          x1="25"
          y1="50"
          x2="38"
          y2="40"
          stroke="black"
          strokeWidth="3"
        />
        <line
          x1="37"
          y1="40"
          x2="52"
          y2="50"
          stroke="black"
          strokeWidth="3"
        />
      </svg>
    );
  };
  
  export default Swim;
  